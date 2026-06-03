import json
import time
from supabase import create_client, Client
from groq import Groq

# --- 1. TWOJE KLUCZE ---
SUPABASE_URL = ""
SUPABASE_KEY = ""
GROQ_API_KEY = ""

# --- 2. INICJALIZACJA ---
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
groq_client = Groq(api_key=GROQ_API_KEY)

# Używamy potężnego modelu Llama 3.3 (70 miliardów parametrów), zoptymalizowanego pod logikę i JSON
MODEL_NAME = "llama-3.3-70b-versatile"

def uruchom_kalkulacje():
    print("📥 Pobieram wszystkie przedmioty z bazy...")
    response = supabase.table("przedmioty").select("*").execute()
    wszystkie = response.data

    uek_przedmioty = [p for p in wszystkie if p['uczelnia_nazwa'] == 'UEK']
    zagranica_przedmioty = [p for p in wszystkie if p['uczelnia_nazwa'] != 'UEK']
    uczelnie_zagr = set([p['uczelnia_nazwa'] for p in zagranica_przedmioty])

    # Pobieramy to, co już wyliczyliśmy (żeby nie robić tego dwa razy!)
    print("🔍 Sprawdzam, co już zostało wyliczone (omijanie duplikatów)...")
    dopasowania_resp = supabase.table("dopasowania").select("przedmiot_pl_id").execute()
    wyliczone_id = set([d['przedmiot_pl_id'] for d in dopasowania_resp.data])

    przedmioty_do_zrobienia = [p for p in uek_przedmioty if p['id'] not in wyliczone_id]
    
    print(f"📊 Stan bazy: {len(wyliczone_id)} gotowych. Zostało do wyliczenia: {len(przedmioty_do_zrobienia)} przedmiotów.\n")

    if not przedmioty_do_zrobienia:
        print("🎉 Wszystkie przedmioty zostały już wyliczone! Baza jest pełna.")
        return

    ROZMIAR_PACZKI = 10

    for uczelnia in uczelnie_zagr:
        print(f"==============\n🏫 ROZPOCZYNAM ANALIZĘ: {uczelnia}\n==============")
        oferta_zagraniczna = [p for p in zagranica_przedmioty if p['uczelnia_nazwa'] == uczelnia]
        zagr_paczka = [{"id": p['id'], "nazwa": p['przedmiot_en'], "ects": p['ects']} for p in oferta_zagraniczna]

        # Pętla dzieli TYLKO te przedmioty, których jeszcze nie ma w bazie
        for i in range(0, len(przedmioty_do_zrobienia), ROZMIAR_PACZKI):
            chunk_uek = przedmioty_do_zrobienia[i:i + ROZMIAR_PACZKI]
            uek_paczka = [{"id": p['id'], "nazwa": p['przedmiot_pl'], "ects": p['ects']} for p in chunk_uek]

            print(f"📦 Przetwarzam paczkę od {i+1} do {min(i+ROZMIAR_PACZKI, len(przedmioty_do_zrobienia))}...")

            prompt = f"""
            Jesteś koordynatorem programu Erasmus. 
            Dopasuj polskie przedmioty do ich najlepszych odpowiedników z uczelni: {uczelnia}.
            
            Przedmioty z Polski: {json.dumps(uek_paczka)}
            Przedmioty z zagranicy (DOSTĘPNA OFERTA): {json.dumps(zagr_paczka)}
            
            Dla każdego przedmiotu z Polski znajdź JEDEN najlepszy odpowiednik z zagranicy.
            Zwróć odpowiedź WYŁĄCZNIE jako czysty kod JSON (tablica obiektów). 
            Żadnego wstępu, żadnego formatowania markdown, tylko czysta tablica JSON.
            
            Format:
            [
              {{
                "przedmiot_pl_id": 1,
                "przedmiot_zagr_id": 15,
                "zgodnosc": 90,
                "uzasadnienie": "Napisz jedno unikalne, merytoryczne zdanie (max 15 słów), dlaczego te sylabusy pasują. Skup się na konkretnych kompetencjach. KATEGORYCZNIE ZABRANIAM używania powtarzalnych fraz typu 'jest ściśle związany', 'może być powiązany'. Używaj różnorodnego, akademickiego słownictwa (np. 'Oba przedmioty uczą analizy...', 'Program obejmuje zagadnienia z zakresu...')."
              }}
            ]
            """
            
            sukces = False
            
            while not sukces:
                try:
                    # Zapytanie do Groq (Llama 3)
                    chat_completion = groq_client.chat.completions.create(
                        messages=[{"role": "user", "content": prompt}],
                        model=MODEL_NAME,
                        temperature=0.1 # Niska temperatura = mniej halucynacji, więcej precyzji
                    )
                    
                    wynik_tekst = chat_completion.choices[0].message.content
                    
                    # Czyszczenie z ewentualnych znaczników markdown
                    tekst_json = wynik_tekst.replace('```json', '').replace('```', '').strip()
                    gotowe_dopasowania = json.loads(tekst_json)
                    
                    if gotowe_dopasowania:
                        supabase.table("dopasowania").insert(gotowe_dopasowania).execute()
                        print(f"✅ Zapisano {len(gotowe_dopasowania)} nowych wyników!")
                    
                    sukces = True 
                    
                    # Krótki oddech dla serwerów Groq
                    print("⏳ Czekam 4 sekundy przed kolejną paczką...\n")
                    time.sleep(4)
                    
                except json.JSONDecodeError:
                    print(f"⚠️ Model zwrócił zły format. Ponawiam próbę dla tej samej paczki w tle...")
                    time.sleep(2)
                except Exception as e:
                    error_msg = str(e)
                    if "429" in error_msg or "rate limit" in error_msg.lower():
                        print("\n🛑 Limit zapytań Groq. Usypiam na 65 sekund...")
                        time.sleep(65)
                    else:
                        print(f"❌ Niespodziewany błąd: {e}")
                        sukces = True # Zabezpieczenie przed nieskończoną pętlą błędu krytycznego

if __name__ == "__main__":
    uruchom_kalkulacje()
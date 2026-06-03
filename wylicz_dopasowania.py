import json
import time
from supabase import create_client, Client
import google.generativeai as genai

# --- 1. TWOJE KLUCZE (Wklej tutaj swoje dane z .env) ---
SUPABASE_URL = ""
SUPABASE_KEY = ""
GEMINI_API_KEY = ""

# --- 2. INICJALIZACJA ---
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
genai.configure(api_key=GEMINI_API_KEY)

# Ustawiamy najpotężniejszy dostępny obecnie model Google
model = genai.GenerativeModel('gemini-2.5-flash') 

def uruchom_kalkulacje():
    print("📥 Pobieram przedmioty z Supabase...")
    response = supabase.table("przedmioty").select("*").execute()
    wszystkie = response.data

    # Dzielimy listę
    uek_przedmioty = [p for p in wszystkie if p['uczelnia_nazwa'] == 'UEK']
    zagranica_przedmioty = [p for p in wszystkie if p['uczelnia_nazwa'] != 'UEK']
    uczelnie_zagr = set([p['uczelnia_nazwa'] for p in zagranica_przedmioty])

    print(f"📊 Znaleziono {len(uek_przedmioty)} przedmiotów z UEK oraz ofertę z {len(uczelnie_zagr)} uczelni zagranicznych.\n")

    # USTALAMY ROZMIAR PACZKI (Zmniejszone do 10, by chronić ucinanie długich JSONów)
    ROZMIAR_PACZKI = 10

    for uczelnia in uczelnie_zagr:
        print(f"==============\n🏫 ROZPOCZYNAM ANALIZĘ: {uczelnia}\n==============")
        oferta_zagraniczna = [p for p in zagranica_przedmioty if p['uczelnia_nazwa'] == uczelnia]
        zagr_paczka = [{"id": p['id'], "nazwa": p['przedmiot_en'], "ects": p['ects']} for p in oferta_zagraniczna]

        # PĘTLA DZIELĄCA UEK NA MNIEJSZE PACZKI
        for i in range(0, len(uek_przedmioty), ROZMIAR_PACZKI):
            chunk_uek = uek_przedmioty[i:i + ROZMIAR_PACZKI]
            uek_paczka = [{"id": p['id'], "nazwa": p['przedmiot_pl'], "ects": p['ects']} for p in chunk_uek]

            print(f"📦 Przetwarzam przedmioty UEK od {i+1} do {min(i+ROZMIAR_PACZKI, len(uek_przedmioty))}...")

            prompt = f"""
            Jesteś koordynatorem programu Erasmus. 
            Dopasuj polskie przedmioty do ich najlepszych odpowiedników z uczelni: {uczelnia}.
            
            Przedmioty z Polski: {json.dumps(uek_paczka)}
            Przedmioty z zagranicy (DOSTĘPNA OFERTA): {json.dumps(zagr_paczka)}
            
            Dla każdego przedmiotu z Polski znajdź JEDEN najlepszy odpowiednik z zagranicy.
            Zwróć odpowiedź WYŁĄCZNIE jako czysty kod JSON (tablica obiektów). 
            Format:
            [
              {{
                "przedmiot_pl_id": 1,
                "przedmiot_zagr_id": 15,
                "zgodnosc": 90,
                "uzasadnienie": "Krótkie zdanie."
              }}
            ]
            """
            
            # --- KULOODPORNY SYSTEM WYSYŁANIA (RETRY MECHANISM) ---
            sukces = False
            
            # Pętla będzie kręcić się tak długo, aż Google przyjmie paczkę
            while not sukces:
                try:
                    wynik = model.generate_content(prompt)
                    
                    # Czyszczenie i parsowanie JSON
                    tekst_json = wynik.text.replace('```json', '').replace('```', '').strip()
                    gotowe_dopasowania = json.loads(tekst_json)
                    
                    # Zapis w bazie
                    if gotowe_dopasowania:
                        supabase.table("dopasowania").insert(gotowe_dopasowania).execute()
                        print(f"✅ Zapisano {len(gotowe_dopasowania)} wyników do bazy.")
                    
                    # Skoro dotarliśmy tutaj, paczka przeszła pomyślnie!
                    sukces = True 
                    
                    print("⏳ Czekam 15 sekund przed kolejną paczką...\n")
                    time.sleep(15)
                    
                except json.JSONDecodeError:
                    print(f"⚠️ Model AI zwrócił dziwny format (to nie JSON). Ignoruję i idę dalej.")
                    sukces = True # Odpuszczamy tę paczkę, bo to błąd formatu
                    
                except Exception as e:
                    error_msg = str(e)
                    # Detekcja błędu 429 lub Quota (Przekroczenie limitu darmowego konta)
                    if "429" in error_msg or "Quota" in error_msg:
                        print("\n🛑 Google krzyczy: 'Zwolnij!'. Wyczerpano limit zapytań.")
                        print("☕ Usypiam skrypt na 65 sekund, żeby zresetować liczniki Google...\n")
                        time.sleep(65)
                        # UWAGA: Celowo NIE zmieniamy 'sukces = False', 
                        # więc pętla while automatycznie wyśle tę samą, odrzuconą paczkę ponownie!
                    else:
                        print(f"❌ Wystąpił niespodziewany błąd: {e}")
                        sukces = True # Wychodzimy z pętli, żeby skrypt nie zawiesił się na wieczność

if __name__ == "__main__":
    uruchom_kalkulacje()
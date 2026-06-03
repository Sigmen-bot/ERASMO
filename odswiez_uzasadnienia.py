import json
import time
from supabase import create_client, Client
from groq import Groq

# --- 1. TWOJE KLUCZE ---
SUPABASE_URL = ""
SUPABASE_KEY = ""
GROQ_API_KEY = ""

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
groq_client = Groq(api_key=GROQ_API_KEY)
MODEL_NAME = "llama-3.3-70b-versatile"

def odswiez_baze():
    print("📥 Pobieram dane z bazy do weryfikacji...")
    
    przedmioty_resp = supabase.table("przedmioty").select("id, przedmiot_pl, przedmiot_en").execute()
    slownik_przedmiotow = {p['id']: p for p in przedmioty_resp.data}

    dopasowania_resp = supabase.table("dopasowania").select("id, przedmiot_pl_id, przedmiot_zagr_id, uzasadnienie").execute()
    wszystkie_dopasowania = dopasowania_resp.data

    # ---------------------------------------------------------
    # NOWA LOGIKA: FILTROWANIE TYLKO "LENIWYCH" UZASADNIEŃ
    # ---------------------------------------------------------
    dopasowania_do_poprawy = []
    
    for d in wszystkie_dopasowania:
        tekst = d['uzasadnienie'].lower()
        # Wyłapujemy wszystkie odmiany: "związany", "powiązane", "związana", itd.
        if "związan" in tekst or "powiązan" in tekst:
            dopasowania_do_poprawy.append(d)

    print(f"📊 Stan bazy: {len(wszystkie_dopasowania)} łącznie.")
    print(f"🎯 Znaleziono {len(dopasowania_do_poprawy)} nudnych uzasadnień wymagających poprawy.\n")

    if not dopasowania_do_poprawy:
        print("🎉 Wszystkie uzasadnienia są już poprawione i unikalne! Nie ma nic do zrobienia.")
        return

    ROZMIAR_PACZKI = 15

    for i in range(0, len(dopasowania_do_poprawy), ROZMIAR_PACZKI):
        paczka = dopasowania_do_poprawy[i:i + ROZMIAR_PACZKI]
        
        dane_dla_ai = []
        for d in paczka:
            pl_nazwa = slownik_przedmiotow[d['przedmiot_pl_id']]['przedmiot_pl']
            zagr_nazwa = slownik_przedmiotow[d['przedmiot_zagr_id']]['przedmiot_en']
            
            if pl_nazwa and zagr_nazwa:
                dane_dla_ai.append({
                    "dopasowanie_id": d['id'],
                    "przedmiot_pl": pl_nazwa,
                    "przedmiot_zagr": zagr_nazwa
                })

        print(f"📦 Redaguję paczkę od {i+1} do {min(i+ROZMIAR_PACZKI, len(dopasowania_do_poprawy))}...")

        prompt = f"""
        Jesteś wykładowcą akademickim recenzującym programy studiów.
        Twoim zadaniem jest napisać NOWE uzasadnienia (max 15 słów), dlaczego polski przedmiot pasuje do zagranicznego.
        
        ZASADY KRYTYCZNE (Złamanie ich oznacza błąd krytyczny):
        1. KATEGORYCZNIE ZABRANIAM używania słów: "ściśle", "związany", "związana", "powiązany", "powiązana".
        2. KATEGORYCZNIE ZABRANIAM używania struktury "X jest związane z Y".
        3. Używaj różnorodnego słownictwa, np.:
           - "Programy obu kursów obejmują zagadnienia..."
           - "Studenci zdobywają tu kompetencje z zakresu..."
           - "Zajęcia koncentrują się na analizie..."
           - "Obie pozycje w sylabusie eksplorują tematykę..."
           
        Oto lista par do zredagowania: {json.dumps(dane_dla_ai)}
        
        Zwróć odpowiedź WYŁĄCZNIE jako czysty JSON w formacie:
        [
          {{"dopasowanie_id": 123, "uzasadnienie": "Merytoryczne i unikalne zdanie analityczne."}}
        ]
        """
        
        sukces = False
        while not sukces:
            try:
                chat_completion = groq_client.chat.completions.create(
                    messages=[{"role": "user", "content": prompt}],
                    model=MODEL_NAME,
                    temperature=0.4 
                )
                
                wynik_tekst = chat_completion.choices[0].message.content
                tekst_json = wynik_tekst.replace('```json', '').replace('```', '').strip()
                nowe_uzasadnienia = json.loads(tekst_json)
                
                for u in nowe_uzasadnienia:
                    supabase.table("dopasowania").update({"uzasadnienie": u['uzasadnienie']}).eq("id", u['dopasowanie_id']).execute()
                
                print(f"✅ Zaktualizowano {len(nowe_uzasadnienia)} uzasadnień w Supabase!")
                sukces = True 
                
                time.sleep(4)
                
            except json.JSONDecodeError:
                print("⚠️ Błąd formatu JSON z Groq. Ponawiam dla tej samej paczki...")
                time.sleep(2)
            except Exception as e:
                error_msg = str(e)
                if "429" in error_msg or "rate limit" in error_msg.lower():
                    print("\n🛑 Limit API Groq. Czekam 65 sekund...")
                    time.sleep(65)
                else:
                    print(f"❌ Inny błąd: {e}")
                    sukces = True

if __name__ == "__main__":
    odswiez_baze()
from supabase import create_client, Client

# --- 1. TWOJE KLUCZE ---
SUPABASE_URL = ""
SUPABASE_KEY = ""

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

def przeprowadz_audyt():
    print("🔍 Analizuję zawartość bazy danych...\n")

    # 1. Pobieramy wszystkie przedmioty
    przedmioty_resp = supabase.table("przedmioty").select("id, kierunek_nazwa, uczelnia_nazwa").execute()
    wszystkie = przedmioty_resp.data

    uek_przedmioty = [p for p in wszystkie if p['uczelnia_nazwa'] == 'UEK']
    zagranica_przedmioty = [p for p in wszystkie if p['uczelnia_nazwa'] != 'UEK']
    
    uczelnie_zagr = set([p['uczelnia_nazwa'] for p in zagranica_przedmioty])
    liczba_polskich = len(uek_przedmioty)

    # 2. Mapujemy ID zagraniczne na nazwę uczelni
    id_do_uczelni = {p['id']: p['uczelnia_nazwa'] for p in zagranica_przedmioty}

    # 3. Pobieramy dopasowania
    dopasowania_resp = supabase.table("dopasowania").select("przedmiot_pl_id, przedmiot_zagr_id").execute()
    
    # 4. Liczymy zrobione pary dla poszczególnych uczelni
    statystyki_uczelni = {uczelnia: 0 for uczelnia in uczelnie_zagr}
    
    for d in dopasowania_resp.data:
        zagr_id = d.get('przedmiot_zagr_id')
        if zagr_id in id_do_uczelni:
            nazwa_uczelni = id_do_uczelni[zagr_id]
            statystyki_uczelni[nazwa_uczelni] += 1

    # 5. Wyświetlamy piękny raport
    print("==================================================")
    print(" 📊 RAPORT POKRYCIA (STAN GOTOWOŚCI AI) 📊 ")
    print("==================================================\n")
    
    for uczelnia, zrobione in sorted(statystyki_uczelni.items()):
        # Oczekiwana liczba dopasowań to dokładnie tyle, ile mamy polskich przedmiotów
        oczekiwane = liczba_polskich
        procent = (zrobione / oczekiwane) * 100 if oczekiwane > 0 else 0
        
        # Formatowanie paska postępu (każdy █ to 10%)
        pasek_wypelnienia = int(procent / 10)
        pasek = "█" * pasek_wypelnienia + "░" * (10 - pasek_wypelnienia)
        
        print(f"🌍 {uczelnia.upper()}")
        print(f"   Postęp: [{pasek}] {procent:.1f}%")
        print(f"   Przedmioty: {zrobione} gotowych z {oczekiwane} wymaganych.\n")

    print("==================================================")
    print(f"Łącznie w bazie znajduje się {len(dopasowania_resp.data)} wyliczonych relacji.")

if __name__ == "__main__":
    przeprowadz_audyt()
from supabase import create_client, Client

# --- 1. TWOJE KLUCZE ---
SUPABASE_URL = ""
SUPABASE_KEY = ""

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

def przeprowadz_audyt():
    print("🔍 Analizuję zawartość bazy danych...\n")

    # 1. Pobieramy wszystkie polskie przedmioty z informacją o ich kierunku
    przedmioty_resp = supabase.table("przedmioty").select("id, kierunek_nazwa").eq("uczelnia_nazwa", "UEK").execute()
    wszystkie_polskie = przedmioty_resp.data

    # 2. Pobieramy wszystkie stworzone dopasowania (tylko ich polskie ID, żeby było szybko)
    dopasowania_resp = supabase.table("dopasowania").select("przedmiot_pl_id").execute()
    id_z_dopasowaniami = set([d['przedmiot_pl_id'] for d in dopasowania_resp.data])

    # 3. Zliczamy statystyki dla każdego kierunku
    raport = {}
    
    for p in wszystkie_polskie:
        kierunek = p['kierunek_nazwa']
        # Jeśli nie ma przypisanego kierunku, wrzucamy do "Inne/Brak danych"
        if not kierunek:
            kierunek = "Brak przypisanego kierunku"
            
        if kierunek not in raport:
            raport[kierunek] = {"wszystkich": 0, "z_dopasowaniem": 0}
            
        raport[kierunek]["wszystkich"] += 1
        
        # Jeśli to ID jest w tabeli dopasowań, to znaczy że sztuczna inteligencja go przerobiła
        if p['id'] in id_z_dopasowaniami:
            raport[kierunek]["z_dopasowaniem"] += 1

    # 4. Wyświetlamy piękny raport
    print("==================================================")
    print(" 📊 RAPORT POKRYCIA KIERUNKÓW (STAN GOTOWOŚCI) 📊 ")
    print("==================================================\n")
    
    for kierunek, staty in sorted(raport.items()):
        wszystkich = staty["wszystkich"]
        z_dopasowaniem = staty["z_dopasowaniem"]
        procent = (z_dopasowaniem / wszystkich) * 100 if wszystkich > 0 else 0
        
        # Formatowanie paska postępu (każdy █ to 10%)
        pasek_wypelnienia = int(procent / 10)
        pasek = "█" * pasek_wypelnienia + "░" * (10 - pasek_wypelnienia)
        
        print(f"🎓 {kierunek.upper()}")
        print(f"   Postęp: [{pasek}] {procent:.1f}%")
        print(f"   Przedmioty: {z_dopasowaniem} gotowych z {wszystkich} wymaganych.\n")

    print("==================================================")
    print(f"Łącznie w bazie znajduje się {len(dopasowania_resp.data)} wyliczonych relacji.")

if __name__ == "__main__":
    przeprowadz_audyt()
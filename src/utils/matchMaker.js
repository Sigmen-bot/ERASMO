// src/utils/matchMaker.js

export function calculateOptimalMatches(uekSubjects, zagrSubjects, dopasowaniaZBD) {
  // 1. Oczyszczanie i mapowanie danych (bierzemy tylko dopasowania >= 50%)
  const mozliweDopasowania = {};
  
  uekSubjects.forEach(uek => {
    // Szukamy wszystkich potencjalnych opcji dla tego polskiego przedmiotu
    const opcje = (dopasowaniaZBD || [])
      .filter(d => d.przedmiot_pl_id === uek.id && d.zgodnosc >= 50)
      .sort((a, b) => b.zgodnosc - a.zgodnosc);
    mozliweDopasowania[uek.id] = opcje;
  });

  let najlepszyWynikGlowny = -1;
  let najlepszaKombinacja = {};

  // 2. ALGORYTM Z NAWROTAMI (BACKTRACKING)
  // Przeszukujemy drzewo decyzyjne, aby znaleźć globalne maksimum sumy procentów.
  function szukaj(index, obecnaSuma, obecnaKombinacja, uzyteZagr) {
    // Warunek stopu: rozpatrzyliśmy wszystkie polskie przedmioty z tego semestru
    if (index === uekSubjects.length) {
      if (obecnaSuma > najlepszyWynikGlowny) {
        najlepszyWynikGlowny = obecnaSuma;
        // Klonujemy obiekt, by zapamiętać ten najlepszy układ
        najlepszaKombinacja = { ...obecnaKombinacja };
      }
      return;
    }

    const aktualnyUek = uekSubjects[index];
    const dostepneOpcje = mozliweDopasowania[aktualnyUek.id];

    // Rozgałęzienie 1: Próbujemy przypisać każdy wolny przedmiot zagraniczny
    for (const opcja of dostepneOpcje) {
      if (!uzyteZagr.has(opcja.przedmiot_zagr_id)) {
        
        // Zrób ruch (Zarezerwuj przedmiot i dodaj jego wynik)
        uzyteZagr.add(opcja.przedmiot_zagr_id);
        obecnaKombinacja[aktualnyUek.id] = opcja;
        
        // Przejdź głębiej do kolejnego przedmiotu (Rekurencja)
        szukaj(index + 1, obecnaSuma + opcja.zgodnosc, obecnaKombinacja, uzyteZagr);
        
        // Cofnij ruch (Backtracking), aby sprawdzić inne ścieżki
        uzyteZagr.delete(opcja.przedmiot_zagr_id);
        delete obecnaKombinacja[aktualnyUek.id];
      }
    }

    // Rozgałęzienie 2: Sprawdzamy scenariusz, w którym ten polski przedmiot ZOSTANIE BEZ DOPASOWANIA.
    // Jest to kluczowe, bo czasem opłaca się pominąć słabe dopasowanie (np. 50%), 
    // aby zwolnić ten zagraniczny przedmiot dla kogoś, kto dobije z nim na 95%.
    szukaj(index + 1, obecnaSuma, obecnaKombinacja, uzyteZagr);
  }

  // Uruchamiamy przeszukiwanie od indeksu 0
  szukaj(0, 0, {}, new Set());

  // 3. Budowanie ostatecznej tablicy wyników do wyświetlenia na stronie
  const ostateczneWyniki = uekSubjects.map(uek => {
    const wybraneDopasowanie = najlepszaKombinacja[uek.id];
    
    if (wybraneDopasowanie) {
      const zagr = zagrSubjects.find(p => p.id === wybraneDopasowanie.przedmiot_zagr_id);
      return {
        znaleziono: true,
        przedmiot_pl: uek.przedmiot_pl,
        przedmiot_zagr: zagr ? zagr.przedmiot_en : "Nieznany przedmiot",
        zgodnosc: wybraneDopasowanie.zgodnosc,
        uzasadnienie: wybraneDopasowanie.uzasadnienie
      };
    } else {
      return {
        znaleziono: false,
        przedmiot_pl: uek.przedmiot_pl,
        przedmiot_zagr: "BRAK WOLNEGO ODPOWIEDNIKA",
        zgodnosc: 0,
        uzasadnienie: "Po przeprowadzeniu globalnej optymalizacji (Backtracking), algorytm zmuszony był odrzucić ten przedmiot na rzecz zmaksymalizowania wyników całego semestru."
      };
    }
  });

  // Sortowanie widoku: sukcesy na górze, braki na dole
  ostateczneWyniki.sort((a, b) => {
    if (a.znaleziono && !b.znaleziono) return -1;
    if (!a.znaleziono && b.znaleziono) return 1;
    return b.zgodnosc - a.zgodnosc;
  });

  return ostateczneWyniki;
}
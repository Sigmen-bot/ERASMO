export default function AboutSection() {
  return (
    // Delikatna linia na górze: border-gray-200
    <section id="o-nas" className="w-full py-24 px-4 md:px-8 flex flex-col items-center border-t border-gray-200 bg-white">
      <div className="w-full max-w-6xl flex flex-col gap-16">
        
        {/* TYTUŁ I OPIS */}
        <div className="flex flex-col md:flex-row gap-8 md:gap-16 items-start">
          <h2 className="text-4xl md:text-5xl font-black text-erasmo-purple uppercase tracking-tighter leading-tight md:w-1/2">
            Zaplanuj swoją <br />
            mobilność
          </h2>
          <div className="md:w-1/2 flex flex-col gap-6 text-gray-600 font-medium leading-relaxed">
            <p>
              Stworzyliśmy narzędzie dla studentów i każdej społeczności związanej z programem Erasmus+.
            </p>
            <p>
              Naszym celem jest uproszczenie procesu tworzenia Learning Agreement poprzez automatyzację najważniejszych etapów i ograniczenie problemów związanych z wyszukiwaniem sylabusów, doborem przedmiotów i niejasnymi informacjami.
            </p>
          </div>
        </div>

        {/* STATYSTYKI - Delikatna linia nad cyframi: border-gray-200 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-12 border-t border-gray-200">
          <div className="flex flex-col gap-2">
            <span className="text-5xl font-black text-erasmo-pink">100+</span>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Zaktualizowanych<br/>Sylabusów</span>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-5xl font-black text-erasmo-pink">1000+</span>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Dopasowań</span>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-5xl font-black text-erasmo-pink">10+</span>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Kierunków Studiów</span>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-5xl font-black text-erasmo-pink">50+</span>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Krajów</span>
          </div>
        </div>

      </div>
    </section>
  )
}
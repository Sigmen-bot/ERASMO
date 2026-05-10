export default function InputField({ label, placeholder }) {
  return (
    <div className="flex flex-col gap-1 w-full">
      <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">
        {label}
      </label>
      <input 
        type="text" 
        placeholder={placeholder}
        // Zmieniliśmy border na ciemniejszy (border-gray-300) i dodaliśmy hover:border-black
        className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-black focus:border-black hover:border-gray-400 transition-all placeholder:text-gray-300 text-sm"
      />
    </div>
  )
}
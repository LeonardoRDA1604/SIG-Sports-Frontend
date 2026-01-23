export function Card({ title, value }) {
  return (
    <div
      className="w-13/13 relative border border-none p-4 sm:p-5 md:p-2 rounded-xl text-center shadow-lg shadow-black/30transition-all duration-200"
      style={{ minHeight: 90, background: "linear-gradient(to top, #8ab7db, #00000000)" }}
    >
      {/* Ícone ilustrativo opcional pode ser adicionado aqui futuramente */}
      <p className="text-primary-50 text-xs sm:text-sm  font-semibold tracking-wide truncate mb-1 group-hover:text-primary-900 transition-colors">
        {title}
      </p>
      <p className="text-2xl sm:text-3xl md:text-3xl font-extrabold text-primary-50 mt-1 drop-shadow-sm group-hover:text-primary-800 transition-colors">
        {value}
      </p>
    </div>
  );
}

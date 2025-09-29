export default function HeroBanner() {
  return (
    <div className="relative w-full h-[75vh] flex items-center justify-center">
      {/* Background Image */}
      <img
        src="/images/moha-office.jpg"
        alt="Hero Banner"
        className="absolute inset-0 w-full h-full object-cover brightness-125"
      />

      {/* Optional overlay for extra light / soft effect */}
      <div className="absolute inset-0 bg-white/20 mix-blend-lighten"></div>

      {/* Content */}
      <div className="relative z-10 text-center">
        <h1 className="text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text animate-gradient bg-gradient-to-r from-blue-500 via-yellow-400 to-green-500 bg-[length:200%_200%] drop-shadow-lg">
          Welcome to Ministry of Home Affairs
        </h1>
      </div>
    </div>
  );
}

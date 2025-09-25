export default function HeroBanner() {
  return (
    <div className="relative w-full h-[75vh] bg-gray-900 text-cyan-500 flex items-center justify-center">
      {/* Background Image */}
      <img
        src="/images/moha-office.jpg"
        alt="Hero Banner"
        className="absolute inset-0 w-full h-full object-cover opacity-70"
      />

      {/* Overlay Text */}
      {/* <div className="relative z-10 text-center max-w-3xl">
        <h1 className="text-4xl md:text-6xl font-bold">
          Ministry of Home Affairs
        </h1>
        <p className="mt-4 text-lg md:text-xl">
          Working Together to Keep Our Nation Safe
        </p>
        <button className="mt-6 px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg shadow text-white font-medium transition">
          Learn More
        </button>
      </div> */}
    </div>
  );
}

export default function CityTooltip({ cityName }: { cityName: string }) {
  const scrollToCity = () => {
    const element = document.getElementById(`city-${cityName.replace(/\s+/g, '-')}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      element.classList.add('city-card-focused');

      // Add click listener to document to remove focus when clicking outside
      const handleClickOutside = (e: MouseEvent) => {
        if (!element.contains(e.target as Node)) {
          element.classList.remove('city-card-focused');
          document.removeEventListener('click', handleClickOutside);
        }
      };

      // Add the listener after a small delay to avoid immediate trigger
      setTimeout(() => {
        document.addEventListener('click', handleClickOutside);
      }, 100);
    }
  };

  return (
    <div className="flex flex-col items-center gap-2 p-2">
      <h3 className="text-sm font-semibold">{cityName}</h3>
      <button
        onClick={scrollToCity}
        className="text-xs px-3 py-1 bg-[#186000] text-white rounded-full hover:bg-opacity-80 transition-all"
      >
        View Details
      </button>
    </div>
  );
}

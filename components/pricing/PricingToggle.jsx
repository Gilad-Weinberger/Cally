'use client';

const PricingToggle = ({ isAnnual, setIsAnnual }) => {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="flex items-center space-x-3 bg-gray-100 p-1 rounded-lg">
        <button
          onClick={() => setIsAnnual(false)}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${!isAnnual ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Monthly
        </button>
        <button
          onClick={() => setIsAnnual(true)}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${isAnnual ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Annual
        </button>
      </div>
    </div>
  );
};

export default PricingToggle;
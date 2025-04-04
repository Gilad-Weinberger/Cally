'use client';

import { useState } from 'react';
import PricingToggle from './PricingToggle';
import PricingCard from './PricingCard';
// import PricingFAQ from './PeicingFAQ';
import { pricingPlans } from '@/lib/data';

const PricingSection = () => {
  const [isAnnual, setIsAnnual] = useState(true);

  // Calculate savings for annual plans
  const calculateSavings = (monthly, annual) => {
    if (monthly === 0) return null;
    const monthlyCost = monthly * 12;
    const savings = ((monthlyCost - annual) / monthlyCost * 100).toFixed(0);
    return savings;
  };

  return (
    <section className="py-16 md:py-24 bg-white" id="pricing">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center mb-7">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Pricing Plans
          </h2>
        </div>

        {/* Pricing Toggle */}
        <PricingToggle isAnnual={isAnnual} setIsAnnual={setIsAnnual} />

        {/* Pricing Cards */}
        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {pricingPlans.map((plan, index) => (
            <PricingCard
              key={index}
              plan={plan}
              isAnnual={isAnnual}
              savings={calculateSavings(plan.monthlyPrice, plan.annualPrice)}
            />
          ))}
        </div>

        {/* FAQ Section */}
        {/* <div className="mt-20">
          <PricingFAQ />
        </div> */}
      </div>
    </section>
  );
};

export default PricingSection;
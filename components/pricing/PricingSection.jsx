'use client';

import { useState } from 'react';
import PricingToggle from './PricingToggle';
import PricingCard from './PricingCard';
// import PricingFAQ from './PeicingFAQ';

const PricingSection = () => {
  const [isAnnual, setIsAnnual] = useState(true);

  // Define pricing plans with monthly and annual options
  const pricingPlans = [
    {
      name: 'Free',
      description: 'Basic calendar features to get you started',
      monthlyPrice: 0,
      annualPrice: 0,
      features: [
        'Basic calendar management',
        'Limited AI suggestions',
        'Up to 5 events per day',
        'Email notifications'
      ],
      cta: 'Get Started',
      ctaLink: '/auth/signup',
      highlighted: false,
      aiFeatures: 'Limited'
    },
    {
      name: 'Pro',
      description: 'Advanced AI features for individuals',
      monthlyPrice: 9.99,
      annualPrice: 99.99,
      features: [
        'Everything in Free',
        'Unlimited AI scheduling',
        'Task prioritization',
        'Smart reminders',
        'Calendar analytics'
      ],
      cta: 'Start Free Trial',
      ctaLink: '/auth/signup?plan=pro',
      highlighted: true,
      badge: 'Most Popular',
      aiFeatures: 'Advanced'
    },
    {
      name: 'Teams',
      description: 'Powerful tools for teams and businesses',
      monthlyPrice: 19.99,
      annualPrice: 199.99,
      features: [
        'Everything in Pro',
        'Team scheduling',
        'Shared calendars',
        'Admin controls',
        'API access',
        'Priority support'
      ],
      cta: 'Contact Sales',
      ctaLink: '/contact',
      highlighted: false,
      aiFeatures: 'Enterprise-grade'
    }
  ];

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
        <div className="mx-auto max-w-3xl text-center mb-12">
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Simple, Transparent Pricing
          </h2>
          <p className="text-xl text-gray-600">
            Choose the plan that's right for you and start optimizing your schedule with AI
          </p>
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
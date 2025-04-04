'use client';

import PrimaryButton from '../PrimaryButton';
import SecondaryButton from '../SecondaryButton';
import { CheckIcon } from '@heroicons/react/24/outline';

const PricingCard = ({ plan, isAnnual, savings }) => {
  const price = isAnnual ? plan.annualPrice : plan.monthlyPrice;
  const period = isAnnual ? '/year' : '/month';
  
  return (
    <div className={`rounded-xl p-6 ${plan.highlighted ? 'bg-gradient-to-b from-indigo-50 to-blue-50 border border-indigo-100 shadow-lg transform scale-105 relative z-10' : 'bg-white border border-gray-200 shadow-md'} transition-all hover:shadow-xl`}>
      {plan.badge && (
        <div className="absolute -top-4 right-0 left-0 flex justify-center">
          <span className="bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
            {plan.badge}
          </span>
        </div>
      )}
      
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
        <p className="text-gray-600 h-12">{plan.description}</p>
      </div>
      
      <div className="text-center mb-6">
        <div className="flex items-end justify-center">
          <span className="text-4xl font-extrabold text-gray-900">
            {price === 0 ? 'Free' : `$${price}`}
          </span>
          {price !== 0 && <span className="text-gray-600 ml-1">{period}</span>}
        </div>
        
        {isAnnual && savings && (
          <div className="mt-2 text-sm text-green-600 font-medium">
            Save {savings}% with annual billing
          </div>
        )}
      </div>
      
      <div className="mb-6">
        <div className="flex items-center mb-2">
          <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center mr-2">
            <span className="text-indigo-600 text-xs font-bold">AI</span>
          </div>
          <span className="text-sm font-medium text-gray-700">{plan.aiFeatures} AI Features</span>
        </div>
        
        <ul className="space-y-3 mt-4">
          {plan.features.map((feature, index) => (
            <li key={index} className="flex items-start">
              <CheckIcon className="h-5 w-5 text-green-500 flex-shrink-0 mr-2" />
              <span className="text-sm text-gray-600">{feature}</span>
            </li>
          ))}
        </ul>
      </div>
      
      <div className="mt-auto">
        {plan.highlighted ? (
          <PrimaryButton href={plan.ctaLink}>
            {plan.cta}
          </PrimaryButton>
        ) : (
          <SecondaryButton href={plan.ctaLink}>
            {plan.cta}
          </SecondaryButton>
        )}
      </div>
    </div>
  );
};

export default PricingCard;
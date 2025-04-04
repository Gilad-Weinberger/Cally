'use client';

import { useState } from 'react';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';

const PricingFAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: 'Can I switch between plans?',
      answer: 'Yes, you can upgrade or downgrade your plan at any time. If you upgrade, the new features will be available immediately. If you downgrade, the changes will take effect at the end of your current billing cycle.'
    },
    {
      question: 'Is there a free trial for paid plans?',
      answer: 'Yes, we offer a 14-day free trial for our Pro plan. You can explore all the features without any commitment. No credit card is required to start your trial.'
    },
    {
      question: 'How does the AI scheduling work?',
      answer: 'Our AI analyzes your calendar, past scheduling patterns, and preferences to suggest optimal times for meetings and tasks. It learns from your behavior over time to provide increasingly personalized recommendations.'
    },
    {
      question: 'Can I get a refund if I'm not satisfied?',
      answer: 'We offer a 30-day money-back guarantee for annual subscriptions. If you're not completely satisfied with our service, contact our support team within 30 days of your purchase for a full refund.'
    },
    {
      question: 'What happens to my data if I cancel my subscription?',
      answer: 'Your data will be retained for 30 days after cancellation, giving you time to export it if needed. After this period, it will be permanently deleted from our systems.'
    },
    {
      question: 'Do you offer discounts for non-profits or educational institutions?',
      answer: 'Yes, we offer special pricing for non-profit organizations, educational institutions, and students. Please contact our sales team for more information.'
    },
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div>
      <h3 className="text-2xl font-bold text-center mb-8">Frequently Asked Questions</h3>
      
      <div className="max-w-3xl mx-auto">
        {faqs.map((faq, index) => (
          <div key={index} className="mb-4">
            <button
              onClick={() => toggleFAQ(index)}
              className="flex w-full items-center justify-between rounded-lg bg-gray-50 px-4 py-3 text-left text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <span className="font-medium">{faq.question}</span>
              {openIndex === index ? (
                <ChevronUpIcon className="h-5 w-5 text-indigo-600" />
              ) : (
                <ChevronDownIcon className="h-5 w-5 text-gray-500" />
              )}
            </button>
            
            {openIndex === index && (
              <div className="mt-2 px-4 py-3">
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PricingFAQ;
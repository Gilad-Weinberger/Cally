"use client";

import { useState } from "react";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";
import { pricingFAQs } from "@/lib/data";

const PricingFAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div>
      <h3 className="text-2xl font-bold text-center mb-8">
        Frequently Asked Questions
      </h3>

      <div className="max-w-3xl mx-auto">
        {pricingFAQs.map((faq, index) => (
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

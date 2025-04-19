"use client";

import { useState } from "react";
import PricingToggle from "./PricingToggle";
import PricingCard from "./PricingCard";
import PricingFAQ from "./PricingFAQ";
import config from "@/lib/config";

const PricingSection = () => {
  const [isAnnual, setIsAnnual] = useState(true);

  // Filter plans based on billing interval
  const getFilteredPlans = () => {
    // Create a unique set of plan names to group monthly/yearly variants
    const planNames = [
      ...new Set(config.lemonsqueezy.plans.map((plan) => plan.name)),
    ];

    // For each unique plan name, find the correct plan based on billing interval
    return planNames.map((name) => {
      const plans = config.lemonsqueezy.plans.filter((p) => p.name === name);

      // If there's only one plan (like Free), return it
      if (plans.length === 1) {
        return {
          name: plans[0].name,
          description: plans[0].description,
          monthlyPrice: plans[0].price,
          annualPrice: plans[0].price,
          features: plans[0].features.map((f) => f.name),
          highlighted: plans[0].isFeatured || false,
          aiFeatures:
            name === "Free"
              ? "Basic"
              : name === "Plus"
              ? "Enhanced"
              : "Advanced",
          // For single plans, use the variantId directly from config
          monthlyVariantId: plans[0].variantId,
          yearlyVariantId: plans[0].variantId,
        };
      }

      // Find the monthly and yearly variants directly from config.js
      const monthlyPlan = plans.find((p) => p.isMonthly) || plans[0];
      const yearlyPlan = plans.find((p) => p.isYearly) || plans[0];

      // Ensure we have the variant IDs directly from config
      const monthlyVariantId = monthlyPlan.variantId;
      const yearlyVariantId = yearlyPlan.variantId;

      return {
        name: monthlyPlan.name,
        description: monthlyPlan.description,
        monthlyPrice: monthlyPlan.price,
        annualPrice: yearlyPlan.price,
        features: monthlyPlan.features.map((f) => f.name),
        highlighted: monthlyPlan.isFeatured || false,
        aiFeatures:
          name === "Free" ? "Basic" : name === "Plus" ? "Enhanced" : "Advanced",
        // Set the variant IDs directly from the corresponding plans
        monthlyVariantId: monthlyVariantId,
        yearlyVariantId: yearlyVariantId,
      };
    });
  };

  // Calculate savings for annual plans
  const calculateSavings = (monthly, annual) => {
    if (monthly === 0) return null;
    const monthlyCost = monthly * 12;
    const savings = (((monthlyCost - annual) / monthlyCost) * 100).toFixed(0);
    return savings;
  };

  const pricingPlans = getFilteredPlans();

  // Find the maximum savings percentage among all plans
  const maxSavingsPercentage = pricingPlans.reduce((max, plan) => {
    if (plan.monthlyPrice === 0) return max;
    const savings = calculateSavings(plan.monthlyPrice, plan.annualPrice);
    return savings > max ? parseInt(savings) : max;
  }, 0);

  // Round up to the next 5%
  const roundedSavingsPercentage = Math.ceil(maxSavingsPercentage / 5) * 5;

  console.log(pricingPlans);

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

        {/* Savings Text */}
        {isAnnual && maxSavingsPercentage > 0 && (
          <div className="text-center mt-4">
            <span className="text-md font-medium px-3 py-1 rounded-full bg-green-50 text-green-600">
              Save up to {roundedSavingsPercentage}% with annual billing
            </span>
          </div>
        )}

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
        <div className="mt-20">
          <PricingFAQ />
        </div>
      </div>
    </section>
  );
};

export default PricingSection;

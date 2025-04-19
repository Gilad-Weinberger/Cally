"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import PrimaryButton from "@/components/shared/ui/ButtonPrimary";

const Hero = () => {
  const { user } = useAuth();
  const currentUserCount = 34863;
  const inputRef = useRef(null);
  const [placeholder, setPlaceholder] = useState("");
  const staticPrefix = "Ask Cally to Schedule ";

  const placeholderExamples = [
    "a meeting with Lucy tomorrow at 10 AM",
    "a reminder to call John every Monday at 2 PM",
    "a 30-minute workout on Wednesday evening",
    "grocery shopping on Saturday morning",
    "a project deadline for next Friday at 5 PM",
    "1 hour of focused work on Tuesday afternoon",
    "a doctor's visit next Sunday at 11 AM",
    "lunch with the team on Thursday at 1 PM",
  ];

  // Efficient placeholder text typing animation
  useEffect(() => {
    let currentPlaceholderIndex = 0;
    let currentCharIndex = 0;
    let isDeleting = false;
    let typingSpeed = 20; // ms between typing characters
    let deletingSpeed = 20; // ms between deleting characters
    let pauseBeforeDelete = 2200; // 3s pause when fully typed
    let pauseBeforeNextExample = 100; // ms pause before next example
    let timeoutId = null;

    const typeNextCharacter = () => {
      const currentExample = placeholderExamples[currentPlaceholderIndex];

      if (isDeleting) {
        // Deleting characters one by one
        setPlaceholder(
          staticPrefix + currentExample.substring(0, currentCharIndex - 1)
        );
        currentCharIndex--;

        if (currentCharIndex <= 0) {
          // Finished deleting, prepare for next example
          isDeleting = false;
          currentPlaceholderIndex =
            (currentPlaceholderIndex + 1) % placeholderExamples.length;
          timeoutId = setTimeout(
            () => requestAnimationFrame(typeNextCharacter),
            pauseBeforeNextExample
          );
          return;
        }
      } else {
        // Typing characters one by one
        setPlaceholder(
          staticPrefix + currentExample.substring(0, currentCharIndex + 1)
        );
        currentCharIndex++;

        if (currentCharIndex >= currentExample.length) {
          // Finished typing, pause before deleting
          isDeleting = true;
          timeoutId = setTimeout(
            () => requestAnimationFrame(typeNextCharacter),
            pauseBeforeDelete
          );
          return;
        }
      }

      // Schedule next character animation
      timeoutId = setTimeout(
        () => requestAnimationFrame(typeNextCharacter),
        isDeleting ? deletingSpeed : typingSpeed
      );
    };

    // Start with just the prefix
    setPlaceholder(staticPrefix);
    requestAnimationFrame(typeNextCharacter);

    // Clean up timeouts on unmount
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);

  const formatUserCount = (count) => {
    if (count >= 1000000) {
      return Math.floor(count / 1000000) / 10 + "M";
    } else if (count >= 100000) {
      return Math.floor(count / 10000) * 10 + "K";
    } else if (count >= 10000) {
      return Math.floor(count / 10000) * 10 + "K";
    } else if (count >= 1000) {
      return Math.floor(count / 1000) * 10 + "K";
    } else {
      return Math.floor(count / 10) * 10;
    }
  };

  return (
    <section className="relative min-h-[90vh] xs:min-h-[95vh] flex items-center justify-center overflow-hidden py-6 xs:py-8 sm:py-12 md:py-16 lg:py-20">
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 overflow-hidden">
        {/* Animated floating blobs - adjusted for better mobile appearance */}
        <div className="absolute top-1/4 left-1/4 w-48 h-48 xs:w-56 xs:h-56 sm:w-64 sm:h-64 rounded-full bg-blue-200 opacity-20 blur-3xl animate-float-slow"></div>
        <div className="absolute bottom-1/3 right-1/4 w-56 h-56 xs:w-64 xs:h-64 sm:w-80 sm:h-80 rounded-full bg-purple-200 opacity-20 blur-3xl animate-float-medium"></div>
        <div className="absolute top-2/3 left-1/3 w-52 h-52 xs:w-60 xs:h-60 sm:w-72 sm:h-72 rounded-full bg-indigo-200 opacity-20 blur-3xl animate-float-fast"></div>
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] pointer-events-none"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 -mt-6 xs:-mt-8 sm:-mt-10">
        <div className="flex flex-col items-center justify-center text-center max-w-6xl mx-auto">
          <h1 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight text-gray-900 mb-3 xs:mb-4 sm:mb-5 md:mb-6">
            You <span className="text-blue-500">Type</span> It,{" "}
            <br className="hidden xs:block" />
            It's <span className="text-blue-500">Scheduled.</span>
          </h1>

          <p className="text-base xs:text-lg sm:text-xl md:text-2xl lg:text-3xl text-gray-600 mb-4 xs:mb-5 sm:mb-6 md:mb-8 max-w-4xl px-2">
            Your <span className="font-semibold">words</span> become calendar{" "}
            <span className="font-semibold">events</span>, no clicks needed.
          </p>

          {/* Input field - improved responsive sizing and positions */}
          <div className="w-full max-w-xs xs:max-w-sm sm:max-w-xl md:max-w-2xl lg:max-w-3xl mx-auto relative mb-5 xs:mb-6 sm:mb-8 md:mb-10">
            <div className="relative rounded-xl shadow-xl overflow-hidden">
              <input
                ref={inputRef}
                type="text"
                className="w-full px-3 xs:px-4 sm:px-5 md:px-6 py-2.5 xs:py-3 sm:py-4 md:py-5 text-xs xs:text-sm sm:text-base md:text-lg outline-none border-0"
                placeholder={placeholder}
              />
              <div className="absolute right-1.5 xs:right-2 sm:right-3 top-1 xs:top-1.5 sm:top-2">
                <PrimaryButton href={user ? "/calendar" : "/auth/signup"}>
                  Schedule It
                </PrimaryButton>
              </div>
            </div>
          </div>

          {/* User testimonial avatars - improved spacing and alignment */}
          <div className="mt-2 xs:mt-3 flex flex-col xs:flex-row items-center justify-center gap-1.5 xs:gap-2 sm:gap-0">
            <div className="flex -space-x-1.5 xs:-space-x-2 mr-0 xs:mr-2 sm:mr-4 mb-1.5 xs:mb-2 sm:mb-0">
              <div className="h-6 w-6 xs:h-8 xs:w-8 sm:h-10 sm:w-10 rounded-full border-2 border-white overflow-hidden">
                <Image
                  src="https://randomuser.me/api/portraits/men/32.jpg"
                  alt="User"
                  className="h-full w-full object-cover"
                  width={40}
                  height={40}
                />
              </div>
              <div className="h-6 w-6 xs:h-8 xs:w-8 sm:h-10 sm:w-10 rounded-full border-2 border-white overflow-hidden">
                <Image
                  src="https://randomuser.me/api/portraits/men/61.jpg"
                  alt="User"
                  className="h-full w-full object-cover"
                  width={40}
                  height={40}
                />
              </div>
              <div className="h-6 w-6 xs:h-8 xs:w-8 sm:h-10 sm:w-10 rounded-full border-2 border-white overflow-hidden">
                <Image
                  src="https://randomuser.me/api/portraits/men/76.jpg"
                  alt="User"
                  className="h-full w-full object-cover"
                  width={40}
                  height={40}
                />
              </div>
            </div>
            <span className="text-xs xs:text-sm sm:text-base text-gray-600 text-center xs:text-left">
              Loved by over {formatUserCount(currentUserCount)} people worldwide
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

'use client';

import { useEffect, useRef } from 'react';
import { FaStar } from 'react-icons/fa';
import { testimonials } from '@/lib/data';

const TestimonialCarousel = () => {
  const carouselRef = useRef(null);

  useEffect(() => {
    const scrollContainer = carouselRef.current;
    if (!scrollContainer) return;

    // Clone the testimonials for infinite scrolling effect
    const cloneItems = () => {
      const items = scrollContainer.querySelectorAll('.testimonial-item');
      items.forEach(item => {
        const clone = item.cloneNode(true);
        scrollContainer.appendChild(clone);
      });
    };

    cloneItems();

    // Animation for continuous scrolling
    let scrollAmount = 0;
    const distance = 0.5;
    let isPaused = false;
    
    const scroll = () => {
      if (!scrollContainer || isPaused) return;
      
      scrollAmount += distance;
      scrollContainer.scrollLeft = scrollAmount;
      
      // Reset scroll position when we reach half of the content to create infinite loop
      if (scrollAmount >= (scrollContainer.scrollWidth / 2)) {
        scrollAmount = 0;
        scrollContainer.scrollLeft = 0;
      }
      
      requestAnimationFrame(scroll);
    };

    // Add event listeners for hover
    const testimonialItems = scrollContainer.querySelectorAll('.testimonial-item');
    
    const handleMouseEnter = () => {
      isPaused = true;
    };
    
    const handleMouseLeave = () => {
      isPaused = false;
      requestAnimationFrame(scroll);
    };
    
    testimonialItems.forEach(item => {
      item.addEventListener('mouseenter', handleMouseEnter);
      item.addEventListener('mouseleave', handleMouseLeave);
    });

    const animationId = requestAnimationFrame(scroll);

    return () => {
      cancelAnimationFrame(animationId);
      // Clean up event listeners
      testimonialItems.forEach(item => {
        item.removeEventListener('mouseenter', handleMouseEnter);
        item.removeEventListener('mouseleave', handleMouseLeave);
      });
    };
  }, []);

  // Render 5 stars for each testimonial
  const renderStars = (rating) => {
    return Array(5).fill(0).map((_, i) => (
      <FaStar key={i} className="text-yellow-400 text-md" />
    ));
  };

  return (
    <div className="w-full overflow-hidden bg-to-blue-50 py-10">
      <div className="container mx-auto px-4">
        <h2 className="mb-8 text-center text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          What Our Users Say
        </h2>
        <div className="relative">
          <div 
            ref={carouselRef}
            className="flex gap-10 overflow-x-hidden whitespace-nowrap py-6"
          >
            {testimonials.map((testimonial) => (
              <div 
                key={testimonial.id} 
                className="testimonial-item flex-shrink-0 rounded-xl bg-white p-8 shadow-lg transition-all hover:shadow-xl w-96"
              >
                <div className="flex items-center flex-col gap-2">
                  <div className="mr-4 h-12 w-12 overflow-hidden rounded-full bg-gray-200 flex items-center justify-center">
                    <svg className="h-8 w-8 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                  <div className="mt-0.5">
                    <h4 className="font-semibold text-gray-900 text-center">{testimonial.name}</h4>
                    <p className="text-sm text-gray-600 text-center">{testimonial.role}, {testimonial.company}</p>
                  </div>
                </div>   
                <p className="mt-4 mb-6 text-gray-600 text-wrap text-center">
                  {testimonial.text}
                </p>
                <div className="my-4 flex justify-center">
                  {renderStars(testimonial.rating)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestimonialCarousel;
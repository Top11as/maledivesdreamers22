import React from 'react';
import { ChevronDown } from 'lucide-react';

const Hero = () => {
  const scrollToContact = () => {
    const element = document.getElementById('contact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToAbout = () => {
    const element = document.getElementById('about');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToStore = () => {
    const element = document.getElementById('store');
    if (element) {
      // Find the step 1 element within the store section
      const step1Element = element.querySelector('[data-step="1"]');
      if (step1Element) {
        const rect = step1Element.getBoundingClientRect();
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const targetPosition = scrollTop + rect.top - 100; // Offset for header
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth',
        });
      } else {
        // Fallback to original behavior with adjusted offset
        const rect = element.getBoundingClientRect();
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const targetPosition = scrollTop + rect.top + 200; // Increased offset to skip video
      
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth',
        });
      }
    }
  };

  const scrollToNextSection = () => {
    const element = document.getElementById('package');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };
  return (
    <section 
      id="home" 
      className="relative h-screen flex items-center justify-center text-center overflow-hidden px-4"
    >
      {/* Content - Positioned in the middle-lower area */}
      <div className="relative z-10 text-white max-w-4xl mx-auto w-full flex flex-col items-center justify-center mt-20 sm:mt-24 md:mt-28 lg:mt-32">
        {/* Logo */}
        <div className="mb-6 sm:mb-8 md:mb-10">
          <img 
            src="/maleLOGO.png" 
            alt="Maldive Dreamers Logo"
            className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 lg:w-56 lg:h-56 mx-auto object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-300"
          />
        </div>
        
        {/* Main Heading */}
        <h1 className="font-luxury-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl mb-3 sm:mb-4 md:mb-6 leading-tight text-shadow-2xl drop-shadow-2xl text-center">
          Dive into Your Dreams!
        </h1>
        
        {/* Adventure text */}
        <p className="font-luxury-body text-base sm:text-lg md:text-xl lg:text-2xl text-gray-200 mb-6 sm:mb-8 md:mb-10 leading-relaxed font-light drop-shadow-lg max-w-3xl mx-auto text-center px-2">
          Embark on the adventure of a lifetime with us!
        </p>
        
        {/* Buttons - Narrower width */}
        <div className="flex flex-col gap-3 sm:gap-4 justify-center items-center w-full max-w-xs mx-auto">
          <button 
            onClick={scrollToStore}
            className="group breathe bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-luxury-accent font-bold py-3 px-6 sm:py-4 sm:px-8 rounded-full text-lg sm:text-xl md:text-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl tracking-wide w-full text-center"
          >
            Book Your Dive!
          </button>
          
          <button 
            onClick={scrollToAbout}
            className="group bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-luxury-accent font-bold py-3 px-6 sm:py-4 sm:px-8 rounded-full text-lg sm:text-xl md:text-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl tracking-wide w-full text-center"
          >
            About Us
          </button>
          
          {/* Bouncy Arrow Below Buttons */}
          <div className="mt-2 sm:mt-4 md:mt-2 lg:mt-1">
            <button 
              onClick={scrollToNextSection}
              className="group focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-opacity-50 rounded-full p-2 transition-all duration-200 hover:bg-white/10"
              aria-label="Scroll to next section"
            >
              <ChevronDown className="w-6 h-6 sm:w-8 sm:h-8 text-white/80 bounce-arrow group-hover:text-cyan-400 transition-colors duration-200" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
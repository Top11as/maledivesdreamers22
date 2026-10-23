import React, { useState, useEffect } from 'react';
import { Instagram, Facebook, Mail } from 'lucide-react';
import WhatsAppIcon from './WhatsAppIcon';
import TikTokIcon from './TikTokIcon';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsScrolled(currentScrollY > 50);
      
      // Mobile-only hide/show logic
      const isMobile = window.innerWidth < 768;
      
      if (currentScrollY < 100) {
        // Always show when near top
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 200) {
        // Hide when scrolling down and past 200px
        setIsVisible(false);
      } else if (currentScrollY < lastScrollY) {
        // Show when scrolling up
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll); // Handle resize events
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [lastScrollY]);

  const scrollToFooter = () => {
    const element = document.getElementById('contact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToGallery = () => {
    const element = document.getElementById('gallery');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className={`fixed w-full top-0 left-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'backdrop-blur-md shadow-lg border-b border-white/10' 
        : 'backdrop-blur-sm'
    } ${
      isVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4 min-h-[60px]">
          {/* Text Logo */}
          <button 
            onClick={scrollToTop}
            className="font-luxury-heading text-2xl sm:text-3xl md:text-4xl font-bold text-white tracking-wide flex-shrink-0 hover:text-cyan-400 transition-colors duration-200 cursor-pointer focus:outline-none rounded-lg px-2 py-1"
          >
            Maldive Dreamers
          </button>

          {/* Desktop Navigation - Hidden on mobile */}
          <div className="hidden md:flex items-center space-x-6">
            {/* Social Media Icons */}
            <div className="flex items-center space-x-3">
              <a 
                href="mailto:bookingmaldivedreamers@gmail.com"
                className="bg-slate-600 p-2 rounded-lg hover:bg-slate-700 hover:scale-110 transition-all duration-200 shadow-lg"
              >
                <Mail className="w-4 h-4 text-white" />
              </a>
              <a 
                href="https://wa.me/9607653270" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-green-500 p-2 rounded-lg hover:bg-green-600 hover:scale-110 transition-all duration-200 shadow-lg"
              >
                <WhatsAppIcon size={16} className="text-white" />
              </a>
              <a 
                href="https://www.tiktok.com/@maldive.dreamers" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-black p-2 rounded-lg hover:bg-gray-800 hover:scale-110 transition-all duration-200 shadow-lg"
              >
                <TikTokIcon size={16} className="text-white" />
              </a>
              <a href="https://www.instagram.com/maldive.dreamers/?hl=en" target="_blank" rel="noopener noreferrer" 
                 className="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 p-2 rounded-lg hover:scale-110 transition-all duration-200 shadow-lg">
                <Instagram size={16} className="text-white" />
              </a>
              <a href="https://www.facebook.com/profile.php?id=61566536557690" target="_blank" rel="noopener noreferrer"
                 className="bg-blue-600 p-2 rounded-lg hover:bg-blue-700 hover:scale-110 transition-all duration-200 shadow-lg">
                <Facebook size={16} className="text-white" />
              </a>
            </div>
            
            {/* Gallery Button */}
            <button 
              onClick={scrollToGallery}
              className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-luxury-accent font-bold py-2 px-6 rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-xl tracking-wide text-base whitespace-nowrap"
            >
              Gallery
            </button>
            
            {/* Contact Us Button */}
            <button 
              onClick={scrollToFooter}
              className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-luxury-accent font-bold py-2 px-6 rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-xl tracking-wide text-base whitespace-nowrap"
            >
              Contact Us
            </button>
          </div>

          {/* Mobile - Social Media Icons */}
          <div className="md:hidden flex items-center space-x-3">
            <a href="https://www.instagram.com/maldive.dreamers/?hl=en" target="_blank" rel="noopener noreferrer" 
               className="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 p-2 rounded-lg hover:scale-110 transition-all duration-200 shadow-lg">
              <Instagram size={16} className="text-white" />
            </a>
            <a href="https://www.facebook.com/profile.php?id=61566536557690" target="_blank" rel="noopener noreferrer"
               className="bg-blue-600 p-2 rounded-lg hover:bg-blue-700 hover:scale-110 transition-all duration-200 shadow-lg">
              <Facebook size={16} className="text-white" />
            </a>
            <a href="https://wa.me/9607653270" target="_blank" rel="noopener noreferrer"
               className="bg-green-500 p-2 rounded-lg hover:bg-green-600 hover:scale-110 transition-all duration-200 shadow-lg">
              <WhatsAppIcon size={16} className="text-white" />
            </a>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
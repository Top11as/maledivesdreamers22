import React, { useState, useEffect, useRef } from 'react';
import { Instagram, Facebook, Mail } from 'lucide-react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import WhatsAppIcon from './WhatsAppIcon';
import TikTokIcon from './TikTokIcon';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [showDataNotice, setShowDataNotice] = useState(false);
  const [isFlashing, setIsFlashing] = useState(false);
  const noticeRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Listen for flash contact section event
  useEffect(() => {
    const handleFlashContact = () => {
      setIsFlashing(true);
      setTimeout(() => {
        setIsFlashing(false);
      }, 1000);
    };

    window.addEventListener('flashContactSection', handleFlashContact);
    return () => window.removeEventListener('flashContactSection', handleFlashContact);
  }, []);

  // Handle click outside to close (mobile and desktop)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showDataNotice && 
          noticeRef.current && 
          buttonRef.current &&
          !noticeRef.current.contains(event.target as Node) &&
          !buttonRef.current.contains(event.target as Node)) {
        setShowDataNotice(false);
      }
    };

    if (showDataNotice) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showDataNotice]);

  // Handle scroll to close on mobile
  useEffect(() => {
    const handleScroll = () => {
      // Removed scroll-to-close functionality to prevent immediate closing
    };

    // No longer adding scroll listener
    return () => {};
  }, []);

  return (
    <footer id="contact" className="relative text-white py-12 sm:py-16">
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-6 sm:mb-8">
          {/* Contact Us Header */}
          <h4 className={`font-luxury-heading text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 tracking-wide text-white transition-all duration-500 ${
            isFlashing ? 'bg-cyan-400/20 rounded-lg p-2' : ''
          }`}>
            Contact Us
          </h4>
          
          {/* Social Links and Email centered */}
          <div className="flex justify-center items-center space-x-3 sm:space-x-4 mb-6 sm:mb-8">
            <a 
              href="mailto:bookingmaldivedreamers@gmail.com"
              className="bg-slate-600 p-2 sm:p-3 rounded-lg hover:bg-slate-700 hover:scale-110 transition-all duration-200 shadow-lg"
            >
              <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </a>
            <a 
              href="https://wa.me/9607653270" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-green-500 p-2 sm:p-3 rounded-lg hover:bg-green-600 hover:scale-110 transition-all duration-200 shadow-lg"
            >
              <WhatsAppIcon size={16} className="text-white sm:w-5 sm:h-5" />
            </a>
            <a 
              href="https://www.tiktok.com/@maldive.dreamers" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-black p-2 sm:p-3 rounded-lg hover:bg-gray-800 hover:scale-110 transition-all duration-200 shadow-lg"
            >
              <TikTokIcon size={16} className="text-white sm:w-5 sm:h-5" />
            </a>
            <a 
              href="https://www.instagram.com/maldive.dreamers/?hl=en" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 p-2 sm:p-3 rounded-lg hover:scale-110 transition-all duration-200 shadow-lg"
            >
              <Instagram className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </a>
            <a 
              href="https://www.facebook.com/profile.php?id=61566536557690" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-blue-600 p-2 sm:p-3 rounded-lg hover:bg-blue-700 hover:scale-110 transition-all duration-200 shadow-lg"
            >
              <Facebook className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </a>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-600/30 pt-6 sm:pt-8 text-center text-gray-300 space-y-4">
          {/* Data Collection Notice Button */}
          <div className="max-w-4xl mx-auto mb-4">
            <button
              ref={buttonRef}
              onClick={() => setShowDataNotice(!showDataNotice)}
              className="inline-flex items-center space-x-2 text-gray-400 hover:text-gray-300 transition-colors duration-200 text-xs sm:text-sm font-luxury-body"
            >
              <span>Data Collection & Privacy Notice</span>
              {showDataNotice ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>
            
            {/* Collapsible Notice */}
            <div 
              ref={noticeRef}
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                showDataNotice 
                  ? 'max-h-96 opacity-100 mt-4' 
                  : 'max-h-0 opacity-0'
              }`}
            >
              <p className="font-luxury-body text-xs sm:text-sm text-gray-300 leading-relaxed text-left p-4">
                <strong className="text-white">Data Collection Notice:</strong> By submitting your information through our contact forms, 
                you consent to the collection and processing of your personal data for the purpose of responding to your inquiry and 
                providing diving services. We respect your privacy and will not share your information with third parties without your consent. 
                Your data is securely stored and used solely for business communication purposes.
              </p>
            </div>
          </div>
          
          <p className="font-luxury-body text-sm sm:text-base">&copy; 2025 Maldive Dreamers - All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
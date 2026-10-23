import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

const Gallery = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImageIndex, setModalImageIndex] = useState(0);

  const images = [
    {
      src: '/carousel1.jpg',
      alt: 'Diving boat in crystal clear waters'
    },
    {
      src: '/boat-indoor.jpg',
      alt: 'Comfortable boat interior'
    },
    {
      src: '/whale-shark.jpg',
      alt: 'Swimming with whale sharks'
    },
    {
      src: '/maldfood.jpg',
      alt: 'Delicious meals on board'
    },
    {
      src: '/hammerhead-shark.jpg',
      alt: 'Hammerhead shark sighting'
    },
    {
      src: '/tiger-shark.jpg',
      alt: 'Tiger shark in the deep'
    },
    {
      src: '/spinner-shark.jpg',
      alt: 'Spinner shark in action'
    }
  ];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  // Auto-advance slideshow every 5 seconds
  useEffect(() => {
    const interval = !isModalOpen ? setInterval(nextImage, 5000) : null;
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isModalOpen]);

  const openModal = (index: number) => {
    setModalImageIndex(index);
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
  };

  const closeModal = () => {
    setIsModalOpen(false);
    document.body.style.overflow = 'unset'; // Restore scrolling
  };

  const nextModalImage = () => {
    setModalImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevModalImage = () => {
    setModalImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  // Close modal on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isModalOpen) {
        closeModal();
      }
    };

    if (isModalOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isModalOpen]);

  return (
    <section id="gallery" className="py-12 sm:py-16 md:py-20 relative">
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="font-luxury-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl text-white mb-6 sm:mb-8 leading-tight px-2">
            Gallery
          </h2>
          <p className="font-luxury-body text-base sm:text-lg md:text-xl lg:text-2xl text-gray-200 max-w-4xl mx-auto leading-relaxed font-light px-2">
            Curious how the life on our trips looks like? Have a look here!
          </p>
        </div>

        {/* Slideshow Container */}
        <div className="relative max-w-4xl mx-auto">
          <div className="relative aspect-[16/10] overflow-hidden rounded-xl shadow-2xl">
            {/* Main Image */}
            <img
              onClick={() => openModal(currentImageIndex)}
              src={images[currentImageIndex].src}
              alt={images[currentImageIndex].alt}
              className="w-full h-full object-cover object-center transition-opacity duration-500 cursor-pointer hover:scale-105 transition-transform"
              style={{
                transform: 'scale(1.3) translateY(-8%)'
              }}
            />
            
            {/* Dark overlay for better button visibility */}
            <div className="absolute inset-0 bg-black/20"></div>

            {/* Navigation Buttons */}
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 p-3 bg-black/50 hover:bg-black/70 rounded-full text-white transition-all duration-200 hover:scale-110"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 p-3 bg-black/50 hover:bg-black/70 rounded-full text-white transition-all duration-200 hover:scale-110"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Image Counter */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-full text-sm">
              {currentImageIndex + 1} / {images.length}
            </div>
          </div>

          {/* Thumbnail Navigation */}
          <div className="flex justify-center mt-6 space-x-2 overflow-x-auto pb-2">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => {
                  setCurrentImageIndex(index);
                }}
                className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                  index === currentImageIndex 
                    ? 'border-cyan-400 scale-110' 
                    : 'border-transparent hover:border-white/50'
                }`}
              >
                <img
                  onClick={(e) => {
                    e.stopPropagation();
                    openModal(index);
                  }}
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-full object-cover cursor-pointer hover:scale-110 transition-transform duration-200"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm">
            {/* Close button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 z-60 p-3 bg-black/50 hover:bg-black/70 rounded-full text-white transition-all duration-200 hover:scale-110"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Modal content */}
            <div className="relative max-w-7xl max-h-[90vh] mx-4">
              <img
                src={images[modalImageIndex].src}
                alt={images[modalImageIndex].alt}
                className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
              />

              {/* Navigation buttons */}
              <button
                onClick={prevModalImage}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 p-3 bg-black/50 hover:bg-black/70 rounded-full text-white transition-all duration-200 hover:scale-110"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              <button
                onClick={nextModalImage}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 p-3 bg-black/50 hover:bg-black/70 rounded-full text-white transition-all duration-200 hover:scale-110"
              >
                <ChevronRight className="w-6 h-6" />
              </button>

              {/* Image counter */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-full text-sm">
                {modalImageIndex + 1} / {images.length}
              </div>
            </div>

            {/* Click outside to close */}
            <div
              className="absolute inset-0 -z-10"
              onClick={closeModal}
            ></div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Gallery;
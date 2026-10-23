import React, { useState, useEffect } from 'react';

const BackgroundCarousel = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  const images = [
    '/hammerhead-shark.jpg',
    '/carousel1.jpg',
    '/sunset.jpg',
    '/tiger-shark.jpg'
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 7000); // Change image every 7 seconds

    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="fixed inset-0 z-0">
      {images.map((image, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentImageIndex ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <img
            src={image}
            alt={`Background ${index + 1}`}
            className="w-full h-full object-cover"
          />
          {/* Dark overlay for better text readability */}
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
      ))}
    </div>
  );
};

export default BackgroundCarousel;
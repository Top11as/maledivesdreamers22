import React from 'react';
import { Ship, Utensils, Waves, Fish, User, MapPin, Heart } from 'lucide-react';

const Package = () => {
  const features = [
    {
      icon: <Ship className="w-6 h-6 sm:w-8 sm:h-8 text-cyan-400" />,
      text: "A trip on our ship for eight days and seven nights"
    },
    {
      icon: <Utensils className="w-6 h-6 sm:w-8 sm:h-8 text-green-400" />,
      text: "Three meals per day\nCoffee, tea, water, juice\nCrackers, biscuits"
    },
    {
      icon: <Waves className="w-6 h-6 sm:w-8 sm:h-8 text-blue-400" />,
      text: "15-17 dives (Experienced or inexperienced, we provide a fitting trip for all divers)"
    },
    {
      icon: <Fish className="w-6 h-6 sm:w-8 sm:h-8 text-orange-400" />,
      text: "A fishing trip"
    },
    {
      icon: <User className="w-6 h-6 sm:w-8 sm:h-8 text-red-400" />,
      text: "A qualified diving instructor (Speaks: French, English, and Spanish)"
    },
    {
      icon: <MapPin className="w-6 h-6 sm:w-8 sm:h-8 text-pink-400" />,
      text: "Island hopping"
    },
    {
      icon: <Heart className="w-6 h-6 sm:w-8 sm:h-8 text-red-500" />,
      text: "New friends and unforgettable experiences!"
    }
  ];

  return (
    <section id="package" className="py-12 sm:py-16 md:py-20 relative">
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="font-luxury-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl text-white mb-6 sm:mb-8 leading-tight px-2">
            What Do You Get?
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="p-4 sm:p-6 rounded-xl hover:scale-105 transition-all duration-300 flex flex-col sm:flex-row items-center sm:items-start space-y-3 sm:space-y-0 sm:space-x-4 text-center sm:text-left"
            >
              <div className="flex-shrink-0">
                {feature.icon}
              </div>
              <p className="font-luxury-body text-white leading-relaxed text-base sm:text-lg drop-shadow-lg">
                {feature.text.split('\n').map((line, lineIndex) => (
                  <span key={lineIndex}>
                    {line}
                    {lineIndex < feature.text.split('\n').length - 1 && <br />}
                  </span>
                ))}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Package;
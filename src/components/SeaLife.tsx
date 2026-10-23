import React, { useState, useEffect } from 'react';

const SeaLife = () => {
  const [currentStep, setCurrentStep] = useState(1);

  useEffect(() => {
    const handleStepChange = (event: CustomEvent) => {
      setCurrentStep(event.detail.step);
    };

    window.addEventListener('stepChanged', handleStepChange as EventListener);
    return () => window.removeEventListener('stepChanged', handleStepChange as EventListener);
  }, []);

  const marineLife = [
    {
      name: "Sea Turtles",
      image: "/sea-turtle.webp",
      description: "Ancient mariners of the sea, these peaceful creatures have been swimming our oceans for millions of years. Each encounter feels like a blessing."
    },
    {
      name: "Whale Sharks",
      image: "/whale-shark.jpg",
      description: "Gentle giants of the ocean, these magnificent creatures can grow up to 12 meters long. Swimming alongside them is a truly humbling experience."
    },
    {
      name: "Manta Rays",
      image: "/manta-ray.jpeg",
      description: "Graceful and intelligent, manta rays glide through the water with wingspans reaching up to 7 meters. Their curious nature often brings them close to divers."
    },
    {
      name: "Hammerhead Sharks",
      image: "/hammerhead-shark.jpg",
      description: "With their distinctive head shape, hammerheads are among the most recognizable sharks. They often school in large groups around seamounts."
    },
    {
      name: "Bull Sharks",
      image: "/bull-shark.jpeg",
      description: "Powerful and robust, bull sharks are known for their strength and adaptability. Encounters with these apex predators are thrilling and memorable."
    },
    {
      name: "Tiger Sharks",
      image: "/tiger-shark.jpg",
      description: "Named for their distinctive stripes, tiger sharks are skilled hunters and one of the ocean's most impressive predators."
    },
    {
      name: "Spinner Sharks",
      image: "/spinner-shark.jpg",
      description: "Known for their spectacular spinning leaps out of the water, spinner sharks are agile hunters that create breathtaking displays above the surface."
    }
  ];

  return (
    <section id="sea-life" className="py-6 sm:py-8 md:py-10 relative transition-all duration-200 ease-out">
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-6 sm:mb-8">
          <h2 className="font-luxury-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl text-white mb-6 sm:mb-8 leading-tight px-2">
            Marine Life You'll Encounter
          </h2>
          <p className="font-luxury-body text-base sm:text-lg md:text-xl lg:text-2xl text-gray-200 max-w-4xl mx-auto leading-relaxed font-light px-2">
            The Maldives is home to some of the most incredible marine life on Earth. 
            Here are just a few of the amazing creatures you might encounter on your diving adventure with us.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {marineLife.map((creature, index) => (
            <div 
              key={index}
              className="group relative overflow-hidden rounded-xl hover:scale-105 transition-all duration-300 transform hover:shadow-2xl"
            >
              {/* Image */}
              <div className="aspect-[4/3] overflow-hidden">
                <img 
                  src={creature.image}
                  alt={creature.name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  style={{
                    transform: 'scale(1.5)',
                    transformOrigin: 'center center'
                  }}
                />
              </div>
              
              {/* Content Overlay */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/60 flex flex-col justify-between p-4 sm:p-6">
                {/* Header at top-left */}
                <div>
                  <h3 className="font-luxury-heading text-xl sm:text-2xl font-bold text-white mb-0 tracking-wide drop-shadow-lg text-shadow-lg">
                    {creature.name}
                  </h3>
                </div>
                {/* Description at bottom */}
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <p className="font-luxury-body text-sm sm:text-base text-gray-200 leading-relaxed drop-shadow-lg mb-0">
                    {creature.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SeaLife;
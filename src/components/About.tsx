import React from 'react';
import { Shield, Leaf, Heart } from 'lucide-react';

const About = () => {
  const features = [
    {
      icon: <Shield className="w-6 h-6 sm:w-8 sm:h-8 text-cyan-400" />,
      title: "Safety",
      description: "Certified and professional guides and well-maintained equipment ensure your safety on every dive"
    },
    {
      icon: <Leaf className="w-6 h-6 sm:w-8 sm:h-8 text-green-400" />,
      title: "Sustainability",
      description: "We care deeply about our oceans and practice responsible diving"
    },
    {
      icon: <Heart className="w-6 h-6 sm:w-8 sm:h-8 text-red-400" />,
      title: "Passion",
      description: "Every dive is a dream shared with fellow ocean enthusiasts. You wont have a boring moment on this trip!"
    }
  ];

  return (
    <section id="about" className="py-12 sm:py-16 md:py-20 relative">
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="font-luxury-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl text-white mb-6 sm:mb-8 leading-tight px-2">
            About Maldive Dreamers
          </h2>
          <p className="font-luxury-body text-base sm:text-lg md:text-xl lg:text-2xl text-gray-200 max-w-4xl mx-auto leading-relaxed font-light px-2">
            Maldive Dreamers is a tourism and diving agency run by French-Canadian Pierre. 
            Here you get to cruise between beautiful sunny atolls in the heart of Maldives and dive in crystal clear waters! 
            No matter if you are experienced or a new diver, with us you will experience an unforgettable trip!
          </p>
          
          {/* Your Instructor Section */}
          <div className="mt-12 sm:mt-16 mb-12 sm:mb-16">
            <h2 className="font-luxury-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl text-white mb-8 sm:mb-12 leading-tight px-2 text-center">
              Your Instructor
            </h2>
            
            <div className="max-w-4xl mx-auto">
              {/* Pierre's Photo */}
              <div className="flex justify-center mb-6 mt-4">
                <div className="relative">
                  <div className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 rounded-full overflow-hidden border-4 border-cyan-400/50 shadow-2xl hover:scale-105 transition-all duration-300">
                    <img 
                      src="/MaldPIERRE.jpg" 
                      alt="Pierre - PADI Dive Instructor"
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                  {/* Decorative ring */}
                  <div className="absolute inset-0 rounded-full border-2 border-white/20 animate-pulse"></div>
                </div>
              </div>
              
              {/* Pierre's Introduction */}
              <div className="text-center">
                <p className="font-luxury-body text-base sm:text-lg md:text-xl lg:text-2xl text-gray-200 leading-relaxed font-light px-2 space-y-2">
                  <span className="block">Hey! I'm Pierre, certified PADI dive instructor and founder of Maldive Dreamers.</span>
                  <span className="block">I am a passionate diver with years of experience exploring the world's most beautiful waters.</span>
                  <span className="block">For long I had a dream to dive in Maldives, and now I want to offer the same experience to you!</span>
                  <span className="block mt-4 font-semibold">Welcome to Maldives!</span>
                </p>
              </div>
            </div>
          </div>
          
          <h2 className="font-luxury-display text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl text-white mb-6 sm:mb-8 leading-tight px-2 mt-12 sm:mt-16">
            Why Choose Us?
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="p-6 sm:p-8 rounded-xl hover:scale-105 transition-all duration-300 transform hover:shadow-2xl text-center"
            >
              <div className="flex justify-center mb-4">
                {feature.icon}
              </div>
              <h3 className="font-luxury-heading text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4 tracking-wide drop-shadow-lg">{feature.title}</h3>
              <p className="font-luxury-body text-sm sm:text-base text-gray-200 leading-relaxed drop-shadow-lg px-2">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;
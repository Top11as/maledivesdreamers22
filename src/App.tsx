import React, { useState } from 'react';
import BackgroundCarousel from './components/BackgroundCarousel';
import Header from './components/Header';
import Hero from './components/Hero';
import Package from './components/Package';
import Courses from './components/Courses.tsx';
import TripAddons, { PersonData } from './components/TripAddons';
import SeaLife from './components/SeaLife';
import About from './components/About';
import Gallery from './components/Gallery';
import Footer from './components/Footer';

function App() {
  // Maldives Dreamers - live sync check
  const [allPeopleData, setAllPeopleData] = useState<PersonData[]>([]);

  const handleTripAddonsDataChange = (data: PersonData[]) => {
    setAllPeopleData(data);
  };

  return (
    <div className="min-h-screen relative">
      {/* Background Carousel */}
      <BackgroundCarousel />
      
      {/* Content with relative positioning */}
      <div className="relative z-10 transition-all duration-200 ease-out">
        <Header />
        <Hero />
        <Package />
        <Courses />
        <TripAddons onDataChange={handleTripAddonsDataChange} />
        <About />
        <Gallery />
        <Footer />
      </div>
    </div>
  );
}

export default App;
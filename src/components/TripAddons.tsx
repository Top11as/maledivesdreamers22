import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Send, CheckCircle, Users, Plus, Minus, ChevronDown, ChevronUp, X, GraduationCap, Award, Shield, Anchor, Waves, Ship, User, Mail, Phone, Tag, MessageSquare, ChevronLeft, ChevronRight } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { diveCourses as courseData } from "../data/coursesData.tsx";

const cruiseDates: { id: string; dateRange: string; price: number }[] = [
  { id: 'december-3-13', dateRange: 'December 3-13', price: 2650 },
  { id: 'december-13-23', dateRange: 'December 13-23', price: 2650 },
  { id: 'january-10-17', dateRange: 'January 10-17', price: 1860 },
  { id: 'february-7-17', dateRange: 'February 7-17', price: 2650 },
];



// Define PersonData interface for individual person details
export interface PersonData {
  name: string;
  email: string;
  phone_number: string;
  certification_level: string;
  message: string;
  promoCode: string;
  promoDiscount: number;
  selectedCourses: string[];
  selectedGear: string[];
  selectedSpecificGear: { [key: string]: boolean };
  gearRentalType: string;
  course_price: number;
  gear_total_price: number;
  total_booking_price: number;
  needs_gear: boolean;
  gear_quantity: number;
  gear_type: string;
}

interface TripAddonsProps {
  onDataChange?: (data: PersonData[]) => void;
}

const TripAddons: React.FC<TripAddonsProps> = ({ onDataChange }) => {
  // State variables
  const [currentStep, setCurrentStep] = useState(1);
  const [showCruiseDetails, setShowCruiseDetails] = useState(false);
  const [numberOfPeople, setNumberOfPeople] = useState(1);
  const [selectedDate, setSelectedDate] = useState('');
  const [bookedDatesCount, setBookedDatesCount] = useState<Record<string, number>>({});
  const [showDateDropdown, setShowDateDropdown] = useState(false);
  const [numberOfDays, setNumberOfDays] = useState(7);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [promoError, setPromoError] = useState('');
  const [showSummary, setShowSummary] = useState(false);

  // Multi-person booking states
  const [showSinglePersonPrivacyNotice, setShowSinglePersonPrivacyNotice] = useState(false);
  const [showMultiPersonPrivacyNotice, setShowMultiPersonPrivacyNotice] = useState(false);
  const [peopleData, setPeopleData] = useState<PersonData[]>([]);
  const [currentPersonIndex, setCurrentPersonIndex] = useState(0);

  const detailsRef = useRef<HTMLDivElement>(null);
  const step2Ref = useRef<HTMLDivElement>(null);

  // Define gear prices
  const gearDealPrice = 245;
  const basePrice = 2150;
  const cruiseDays = 7;

  const gearOptions = [
    {
      id: 'bcd',
      name: 'BCD',
      price: 10,
      description: 'Buoyancy control device for safe diving'
    },
    {
      id: 'regulator',
      name: 'Regulator',
      price: 10,
      description: 'Breathing apparatus for underwater use'
    },
    {
      id: 'diveComputer',
      name: 'Dive Computer',
      price: 10,
      description: 'Essential safety and dive planning tool'
    },
    {
      id: 'wetsuit',
      name: 'Wetsuit',
      price: 5,
      description: 'Thermal protection and comfort underwater'
    },
    {
      id: 'mask',
      name: 'Mask',
      price: 5,
      description: 'Clear vision underwater'
    },
    {
      id: 'fins',
      name: 'Fins',
      price: 5,
      description: 'Efficient underwater propulsion'
    }
  ];

  const certificationLevels = [
    'Beginner (No certification)',
    'Open Water Diver',
    'Advanced Open Water Diver',
    'Rescue Diver',
    'Divemaster',
    'Instructor'
  ];

  const validPromoCodes = {
    'LISATRAVELS': 100,
    'dreamers471': 100,
    'Marie123': 100,
    'oceanwithadam': 100,
    'divingandthriving': 100,
    'YUSRATRAVELS': 100,
    'IRISEVE': 100,
    'MARS': 100,
    'Danielledives1': 100,
    'Maartje103': 100,
    'ANOUK': 100,
    'SCUBAROSE': 100,
    'DEEPERTRAVELER': 100,
    'CALUMTRAVEL': 100,
    'ELIZA123': 100,
    'Nurse000': 100,
    'Elladivesafari123': 100,
    'lostlikeliv': 100,
    'Julia444': 100,
    'Rose420': 100,
    'Ella100': 100,
    'MARISSA333': 100,
    'divingandthriving222': 100,
    'Jules715': 100,
    'MandyZ829': 100,
    'IRISEVE001': 100,
    'Alejo060': 100,
    'LOST123': 100,
    'LIVELIKEJULIA808': 100,
    'mitch960': 100,
    'Yusra911': 100,
    'Sij': 100,
    'Ella123': 100,
    'REDESIGNBEAUTY': 100,
    'Influencerpack': 'FULL_DISCOUNT',
    'maldivedreamerskidz': 585,
    'GLO4DIVE': 100,
    'ba': 100,
    'backpacker': 100,
    'DEBORARANIA': 100,
    'dreamers75$OFF': 75,

  };

  // Use centralized course data
  const availableCourses = courseData;

  // Calculate cruise price based on selected date
  const cruisePrice = cruiseDates.find(d => d.dateRange === selectedDate)?.price ?? 2150;

  // Fetch booking counts from Supabase
  useEffect(() => {
    const fetchBookedDates = async () => {
      try {
        const { data, error } = await supabase
          .from('contact_submissions')
          .select('preferred_date, number_of_people')
          .not('preferred_date', 'is', null);

        if (error) {
          console.error('Error fetching booked dates:', error);
          return;
        }

        // Count total people for each date
        const counts: Record<string, number> = {};
        data.forEach((submission) => {
          const date = submission.preferred_date;
          const people = submission.number_of_people || 1;
          counts[date] = (counts[date] || 0) + people;
        });

        setBookedDatesCount(counts);
      } catch (error) {
        console.error('Error fetching booked dates:', error);
      }
    };

    fetchBookedDates();
  }, []);

  // Initialize peopleData when component mounts
  useEffect(() => {
    const initialPerson: PersonData = {
      name: '',
      email: '',
      phone_number: '',
      certification_level: '',
      message: '',
      promoCode: '',
      promoDiscount: 0,
      selectedCourses: [],
      selectedGear: ['no_gear'],
      selectedSpecificGear: {},
      gearRentalType: 'no_gear',
      course_price: 0,
      gear_total_price: 0,
      total_booking_price: basePrice,
      needs_gear: false,
      gear_quantity: 0,
      gear_type: 'No Gear'
    };
    setPeopleData([initialPerson]);
  }, []);

  // Handle numberOfPeople changes
  useEffect(() => {
    setPeopleData(prevPeopleData => {
      const newPeopleData = [...prevPeopleData];
      
      if (numberOfPeople > newPeopleData.length) {
        // Add new people
        for (let i = newPeopleData.length; i < numberOfPeople; i++) {
          const newPerson: PersonData = {
            name: '',
            email: '',
            phone_number: '',
            certification_level: '',
            message: '',
            promoCode: '',
            promoDiscount: 0,
            selectedCourses: [],
            selectedGear: ['no_gear'],
            selectedSpecificGear: {},
            gearRentalType: 'no_gear',
            course_price: 0,
            gear_total_price: 0,
            total_booking_price: basePrice,
            needs_gear: false,
            gear_quantity: 0,
            gear_type: 'No Gear'
          };
          newPeopleData.push(newPerson);
        }
      } else if (numberOfPeople < newPeopleData.length) {
        // Remove excess people
        newPeopleData.splice(numberOfPeople);
      }
      
      // Reset current person index if needed
      if (currentPersonIndex >= numberOfPeople) {
        setCurrentPersonIndex(0);
      }
      
      return newPeopleData;
    });
  }, [numberOfPeople, currentPersonIndex]);

  // Call onDataChange when peopleData changes
  useEffect(() => {
    if (onDataChange && peopleData.length > 0) {
      onDataChange(peopleData);
    }
  }, [peopleData, onDataChange]);

  // Lock background scroll when popup is open
  useEffect(() => {
    if (showCruiseDetails) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showCruiseDetails]);

  // Emit step change event for other components
  useEffect(() => {
    const event = new CustomEvent('stepChanged', { detail: { step: currentStep } });
    window.dispatchEvent(event);
  }, [currentStep]);

  // Get current person data
  const currentPerson = peopleData[currentPersonIndex] || peopleData[0];

  // Calculate person-specific prices
  const calculatePersonPrices = (person: PersonData) => {
    const coursesTotal = person.selectedCourses.reduce((total, courseId) => {
      const course = availableCourses.find(c => c.id === courseId);
      return total + (course ? course.price : 0);
    }, 0);
    
    let gearTotal = 0;
    if (person.selectedGear.includes('gear_deal')) {
      gearTotal = gearDealPrice;
    } else if (person.gearRentalType === 'select_gear') {
      gearTotal = Object.keys(person.selectedSpecificGear)
        .filter(key => person.selectedSpecificGear[key])
        .reduce((total, gearId) => {
          const gear = gearOptions.find(g => g.id === gearId);
          return total + (gear ? gear.price * cruiseDays : 0);
        }, 0);
    }
    
    const subtotal = cruisePrice + coursesTotal + gearTotal;
    
    // Handle influencerpack special case
    let finalTotal;
    if (person.promoCode === 'influencerpack') {
      finalTotal = 0; // Full discount - total becomes zero
    } else {
      finalTotal = Math.max(0, subtotal - person.promoDiscount);
    }
    
    return {
      course_price: coursesTotal,
      gear_total_price: gearTotal,
      total_booking_price: finalTotal
    };
  };

  // Calculate total price for all people
  const calculateTotalPrice = () => {
    return peopleData.reduce((total, person) => {
      const prices = calculatePersonPrices(person);
      return total + prices.total_booking_price;
    }, 0);
  };

  // Handle person input changes
  const handlePersonInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setPeopleData(prevPeopleData => {
      const newPeopleData = [...prevPeopleData];
      newPeopleData[currentPersonIndex] = {
        ...newPeopleData[currentPersonIndex],
        [name]: value
      };
      return newPeopleData;
    });
  };

  // Handle course selection for current person
  const toggleCourse = (courseId: string) => {
    setPeopleData(prevPeopleData => {
      const newPeopleData = [...prevPeopleData];
      const currentPerson = newPeopleData[currentPersonIndex];
      
      if (currentPerson.selectedCourses.includes(courseId)) {
        currentPerson.selectedCourses = currentPerson.selectedCourses.filter(id => id !== courseId);
      } else {
        currentPerson.selectedCourses = [...currentPerson.selectedCourses, courseId];
      }
      
      const prices = calculatePersonPrices(currentPerson);
      currentPerson.course_price = prices.course_price;
      currentPerson.gear_total_price = prices.gear_total_price;
      currentPerson.total_booking_price = prices.total_booking_price;
      
      return newPeopleData;
    });
  };

  // Handle gear selection for current person
  const handleGearSelection = (gearType: string) => {
    setPeopleData(prevPeopleData => {
      const newPeopleData = [...prevPeopleData];
      const currentPerson = newPeopleData[currentPersonIndex];
      
      if (gearType === 'no_gear') {
        currentPerson.selectedGear = ['no_gear'];
        currentPerson.selectedSpecificGear = {};
        currentPerson.gearRentalType = 'no_gear';
        currentPerson.needs_gear = false;
        currentPerson.gear_quantity = 0;
        currentPerson.gear_type = 'No Gear';
      } else if (gearType === 'gear_deal') {
        currentPerson.selectedGear = ['gear_deal'];
        currentPerson.selectedSpecificGear = {};
        currentPerson.gearRentalType = 'gear_deal';
        currentPerson.needs_gear = true;
        currentPerson.gear_quantity = 1;
        currentPerson.gear_type = 'Gear Deal Package (BCD, Regulator, Mask, Fins, Dive Computer)';
      } else if (gearType === 'select_gear') {
        currentPerson.selectedGear = ['select_gear'];
        currentPerson.gearRentalType = 'select_gear';
        currentPerson.needs_gear = true;
        // gear_quantity and gear_type will be updated when specific gear is selected
      }
      
      const prices = calculatePersonPrices(currentPerson);
      currentPerson.course_price = prices.course_price;
      currentPerson.gear_total_price = prices.gear_total_price;
      currentPerson.total_booking_price = prices.total_booking_price;
      
      return newPeopleData;
    });
  };

  // Handle specific gear selection for current person
  const handleSpecificGearChange = (gearId: string) => {
    setPeopleData(prevPeopleData => {
      const newPeopleData = [...prevPeopleData];
      const currentPerson = newPeopleData[currentPersonIndex];
      
      const newSelection = {
        ...currentPerson.selectedSpecificGear,
        [gearId]: !currentPerson.selectedSpecificGear[gearId]
      };
      
      currentPerson.selectedSpecificGear = newSelection;
      
      // Update gear type description and quantity
      const selectedGearNames = Object.keys(newSelection)
        .filter(key => newSelection[key])
        .map(gearId => {
          const gearNameMap: {[key: string]: string} = {
            'bcd': 'BCD',
            'regulator': 'Regulator', 
            'diveComputer': 'Dive Computer',
            'wetsuit': 'Wetsuit',
            'mask': 'Mask',
            'fins': 'Fins'
          };
          return gearNameMap[gearId] || 'Unknown';
        });
      
      currentPerson.gear_quantity = selectedGearNames.length;
      currentPerson.gear_type = selectedGearNames.length > 0 
        ? `Selected Gear: ${selectedGearNames.join(', ')}`
        : 'No Gear Selected';
      
      const prices = calculatePersonPrices(currentPerson);
      currentPerson.course_price = prices.course_price;
      currentPerson.gear_total_price = prices.gear_total_price;
      currentPerson.total_booking_price = prices.total_booking_price;
      
      return newPeopleData;
    });
  };

  // Calculate specific gear price for current person
  const calculateSpecificGearPrice = () => {
    if (!currentPerson) return 0;
    
    return Object.keys(currentPerson.selectedSpecificGear)
      .filter(key => currentPerson.selectedSpecificGear[key])
      .reduce((total, gearId) => {
        const gear = gearOptions.find(g => g.id === gearId);
        return total + (gear ? gear.price * cruiseDays : 0);
      }, 0);
  };

  // Promo code functions for current person
  const handleApplyPromo = () => {
    if (!currentPerson) return;
    
    const code = currentPerson.promoCode.trim();
    const promoValue = validPromoCodes[code as keyof typeof validPromoCodes];
    
    if (promoValue) {
      let discount = 0;

      if (promoValue === 'FULL_DISCOUNT') {
        discount = 0;
      } else {
        discount = promoValue as number;
      }
      
      setPeopleData(prevPeopleData => {
        const newPeopleData = [...prevPeopleData];
        newPeopleData[currentPersonIndex] = {
          ...newPeopleData[currentPersonIndex],
          promoDiscount: discount
        };
        
        const prices = calculatePersonPrices(newPeopleData[currentPersonIndex]);
        newPeopleData[currentPersonIndex].total_booking_price = prices.total_booking_price;
        
        return newPeopleData;
      });
      
      setPromoError('');
    } else {
      setPromoError('Invalid promo code');
      setPeopleData(prevPeopleData => {
        const newPeopleData = [...prevPeopleData];
        newPeopleData[currentPersonIndex] = {
          ...newPeopleData[currentPersonIndex],
          promoDiscount: 0
        };
        
        const prices = calculatePersonPrices(newPeopleData[currentPersonIndex]);
        newPeopleData[currentPersonIndex].total_booking_price = prices.total_booking_price;
        
        return newPeopleData;
      });
    }
  };

  const handleRemovePromo = () => {
    setPeopleData(prevPeopleData => {
      const newPeopleData = [...prevPeopleData];
      newPeopleData[currentPersonIndex] = {
        ...newPeopleData[currentPersonIndex],
        promoCode: '',
        promoDiscount: 0
      };
      
      const prices = calculatePersonPrices(newPeopleData[currentPersonIndex]);
      newPeopleData[currentPersonIndex].total_booking_price = prices.total_booking_price;
      
      return newPeopleData;
    });
    setPromoError('');
  };

  // Navigation functions
  const handleSelectCruise = () => {
    setCurrentStep(2);
    
    setTimeout(() => {
      if (step2Ref.current) {
        const headerHeight = 20;
        const elementTop = step2Ref.current.getBoundingClientRect().top + window.pageYOffset;
        const offsetPosition = elementTop - headerHeight;
        
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    }, 100);
  };

  const handleContinueToCourses = () => {
    setCurrentStep(3);
    
    setTimeout(() => {
      const element = document.querySelector('[data-step="3"]');
      if (element) {
        const rect = element.getBoundingClientRect();
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const isMobile = window.innerWidth < 768;
        
        const offset = isMobile ? 20 : 18;
        const targetPosition = scrollTop + rect.top + (isMobile ? 19 : -20);
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    }, 100);
  };

  const handleContinueToGear = () => {
    setCurrentStep(4);
    
    setTimeout(() => {
      const element = document.querySelector('[data-step="4"]');
      if (element) {
        const rect = element.getBoundingClientRect();
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const isMobile = window.innerWidth < 768;
        
        const offset = isMobile ? 2 : 10;
        const targetScrollY = scrollTop + rect.top - offset;
        
        window.scrollTo({
          top: targetScrollY,
          behavior: 'smooth'
        });
      }
    }, 100);
  };

  const handleContinueToSummary = () => {
    setShowSummary(true);

    setTimeout(() => {
      const element = document.querySelector('[data-section="summary"]');
      if (element) {
        const rect = element.getBoundingClientRect();
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const isMobile = window.innerWidth < 768;
        const offset = isMobile ? 25 : 10;
        const targetScrollY = scrollTop + rect.top - offset;

        window.scrollTo({
          top: targetScrollY,
          behavior: 'smooth',
        });
      }
    }, 150);
  };

  const handleContinueToDetails = () => {
    setCurrentStep(5);
    
    setTimeout(() => {
      const element = document.querySelector('[data-step="5"]');
      if (element) {
        const rect = element.getBoundingClientRect();
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const isMobile = window.innerWidth < 768;
        
        const offset = isMobile ? 25 : 10;
        const targetScrollY = scrollTop + rect.top - offset;
        
        window.scrollTo({
          top: targetScrollY,
          behavior: 'smooth'
        });
      }
    }, 100);
  };

  const handleChooseDate = () => {
    setShowDateDropdown(!showDateDropdown);
  };

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    setTimeout(() => {
      const bookBtn = document.getElementById('book-now-btn');
      if (bookBtn) {
        const rect = bookBtn.getBoundingClientRect();
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const targetY = scrollTop + rect.bottom - window.innerHeight + 32;
        window.scrollTo({ top: targetY, behavior: 'smooth' });
      }
    }, 50);
  };

  // Handle scroll locking when popup reaches bottom
  const handleDetailsScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const element = e.currentTarget;
    const { scrollTop, scrollHeight, clientHeight } = element;
    const isAtBottom = scrollTop + clientHeight >= scrollHeight - 1;
    
    if (isAtBottom) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  // Person navigation functions
  const goToPreviousPerson = () => {
    if (currentPersonIndex > 0) {
      setCurrentPersonIndex(currentPersonIndex - 1);
    }
  };

  const goToNextPerson = () => {
    if (currentPersonIndex < numberOfPeople - 1) {
      const wasInContactDetails = currentStep === 5;
      setCurrentPersonIndex(currentPersonIndex + 1);
      
      // If we were in contact details (step 5), reset to courses and scroll
      if (wasInContactDetails) {
        setCurrentStep(3);
        
        // Scroll to courses section after a brief delay to ensure state updates
        setTimeout(() => {
          const coursesElement = document.querySelector('[data-step="3"]');
          if (coursesElement) {
            const rect = coursesElement.getBoundingClientRect();
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const targetPosition = scrollTop + rect.top - 100; // 100px offset from top
            
            window.scrollTo({
              top: targetPosition,
              behavior: 'smooth',
            });
          }
        }, 100);
      }
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Submit each person's data separately
      for (const person of peopleData) {
        // Debug: Log the gear rental type value being sent
        console.log('Person gear rental type:', person.gearRentalType);
        
        let promoDiscountValue = null;
        if (person.promoCode) {
          promoDiscountValue = person.promoDiscount;
        }
        
        // Validate phone number
        if (!person.phone_number.startsWith('+')) {
          alert(`Please include the country code for ${person.name || 'one of the people'}'s WhatsApp number, e.g. +960 for Maldives.`);
          setIsSubmitting(false);
          return;
        }
        
        // Calculate final prices for this person
        const prices = calculatePersonPrices(person);
        
        const submissionData = {
          name: person.name || null,
          email: person.email || null,
          phone_number: person.phone_number || null,
          certification_level: person.certification_level || null,
          number_of_people: 1, // Each submission represents one person
          needs_gear: person.needs_gear,
          preferred_date: selectedDate || null,
          promo_code: person.promoCode || null,
          message: person.message || null,
          form_type: 'Booking Form',
          course_type: person.selectedCourses.length > 0
            ? person.selectedCourses.join(', ')
            : null,
          gear_type: person.gear_type,
          gear_quantity: person.gear_quantity || 0,
          gear_rental_type: person.gearRentalType || null,
          cruise_price: cruisePrice,
          course_price: prices.course_price,
          gear_total_price: prices.gear_total_price,
          total_booking_price: prices.total_booking_price,
          promo_discount: person.promoDiscount > 0 ? Math.min(person.promoDiscount, cruisePrice + prices.course_price + prices.gear_total_price) : null,
          course_amount: person.selectedCourses.length
        };

        console.log(`Submitting booking data for person:`, submissionData);

        const { error } = await supabase
          .from('contact_submissions')
          .insert([submissionData]);
        
        if (error) {
          console.error('Supabase error:', error);
          throw error;
        }
      }
      
      setIsSubmitted(true);
      setIsSubmitting(false);
      
      // Scroll to the success message after a short delay
      setTimeout(() => {
        const element = document.querySelector('[data-step="5"]');
        if (element) {
          const rect = element.getBoundingClientRect();
          const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
          const isMobile = window.innerWidth < 768;
          
          const offset = isMobile ? 100 : 120;
          const scrollAdjustment = isMobile ? 19 : -50;
          const targetScrollY = scrollTop + rect.top - offset;
          
          window.scrollTo({
            top: targetScrollY + scrollAdjustment,
            behavior: 'smooth'
          });
        }
      }, 200);
      
      // Reset form after 5 seconds
      setTimeout(() => {
        setIsSubmitted(false);
        setCurrentStep(1);
        setNumberOfPeople(1);
        setCurrentPersonIndex(0);
        setSelectedDate('');
        setShowDateDropdown(false);
        
        // Reset people data
        const initialPerson: PersonData = {
          name: '',
          email: '',
          phone_number: '',
          certification_level: '',
          message: '',
          promoCode: '',
          promoDiscount: 0,
          selectedCourses: [],
          selectedGear: ['no_gear'],
          selectedSpecificGear: {},
          gearRentalType: 'no_gear',
          course_price: 0,
          gear_total_price: 0,
          total_booking_price: basePrice,
          needs_gear: false,
          gear_quantity: 0,
          gear_type: 'No Gear'
        };
        setPeopleData([initialPerson]);
      }, 5000);
    } catch (error) {
      console.error('Error submitting booking:', error);
      alert('There was an error submitting your booking. Please check your connection and try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div>
    <section id="store" className="py-12 sm:py-16 md:py-20 relative">
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

        
        {/* Video Preview */}
        <div className="mb-8">
          <div className="bg-slate-800/60 backdrop-blur-sm p-6 sm:p-8 rounded-xl border border-slate-600/30">
            <h3 className="font-luxury-heading text-xl sm:text-2xl font-semibold text-white mb-6 tracking-wide text-center">
              Experience the Adventure
            </h3>
            <div className="flex justify-center">
              <div className="relative w-full max-w-4xl aspect-video overflow-hidden rounded-lg shadow-lg">
                <iframe
                  className="absolute inset-0 w-full h-full"
                  src="https://www.youtube.com/embed/V34VBf5jBC4?si=EkaqHmGBvRvTvE8I"
                  title="YouTube video player"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                />
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mb-12 sm:mb-16">
          <h2 className="font-luxury-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl text-white mb-6 sm:mb-8 leading-tight px-2">
            Book Your Adventure
          </h2>
        </div>

        {/* Step 1: Select Your Package */}
        <div data-step="1" className={`mb-8 transition-all duration-500 ${currentStep >= 1 ? 'opacity-100' : 'hidden'}`}>
          <div className="bg-slate-800/60 backdrop-blur-sm p-6 sm:p-8 rounded-xl border border-slate-600/30">
            <h3 className="font-luxury-heading text-xl sm:text-2xl font-semibold text-white mb-6 tracking-wide">Step 1: Select Your Package</h3>
            
            {/* Package Card */}
            <div className="bg-slate-700/50 p-6 rounded-lg border border-slate-600/30">
              {/* Itinerary Image */}
              <div className="mb-6">
                <div className="relative">
                  <div className="flex justify-center">
                    <img 
                      src="/mald itienary computer.jpg" 
                      className="w-full md:w-[85%] rounded-lg shadow-lg"
                    />
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-all duration-300 bg-black/20 rounded-lg">
                  </div>
                </div>
              </div>
              <p className="font-luxury-body text-gray-200 mb-4 leading-relaxed">
               Join us to the beautiful Maldives and come to experience the trip of your life! See all details and book your cruise below!
              </p>
              <div className="flex flex-col items-center justify-center">
                  <div className="space-y-3 w-full max-w-sm">
                    <button 
                      onClick={() => setShowCruiseDetails(true)}
                      className="w-full bg-slate-600/70 hover:bg-slate-500/70 text-white font-luxury-accent font-bold py-3 px-6 rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-xl tracking-wide whitespace-nowrap border border-slate-500/50"
                    >
                      Cruise Details
                    </button>
                    
                    <button
                      type="button"
                      onClick={handleChooseDate}
                      className="w-full flex items-center justify-between bg-slate-600/70 hover:bg-slate-500/70 text-white font-luxury-accent font-bold py-3 px-6 rounded-full transition-all duration-300 tracking-wide border border-slate-500/50"
                    >
                      <span>{selectedDate || 'Choose the cruise date!'}</span>
                      {showDateDropdown ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </button>

                    {showDateDropdown && (
                      <div className="mb-3 overflow-hidden rounded-lg border border-slate-600/50 bg-slate-700/70">
                        {cruiseDates.map((cruiseDate) => (
                          <button
                            key={cruiseDate.id}
                            type="button"
                            onClick={() => {
                              handleDateSelect(cruiseDate.dateRange);
                              setShowDateDropdown(false);
                            }}
                            className={`w-full flex items-center justify-between px-4 py-3 text-left transition-colors duration-200 hover:bg-slate-600/70 ${
                              selectedDate === cruiseDate.dateRange ? 'bg-cyan-500/20 text-cyan-300' : 'text-gray-200'
                            }`}
                          >
                            <span className="font-luxury-body">{cruiseDate.dateRange}</span>
                            <span className="font-luxury-accent font-bold text-cyan-400">${cruiseDate.price}</span>
                          </button>
                        ))}
                      </div>
                    )}
                    
                    {selectedDate && (
                      <div className="mb-3 p-3 bg-slate-600/20 border border-slate-500/30 rounded-lg">
                        <p className="text-gray-200 font-luxury-body text-sm">
                          Selected Date: <span className="font-semibold">{selectedDate}</span>
                        </p>
                      </div>
                    )}
                    <button
                      id="book-now-btn"
                      onClick={() => {
                        handleSelectCruise();
                      }}
                     disabled={!selectedDate}
                     className={`w-full font-luxury-accent font-bold py-3 px-6 rounded-full transition-all duration-300 tracking-wide whitespace-nowrap ${
                       selectedDate 
                         ? 'bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white transform hover:scale-110 hover:shadow-xl cursor-pointer' 
                         : 'bg-gray-600 text-gray-400 cursor-not-allowed opacity-50'
                     }`}
                    >
                      Book Now
                    </button>
                  </div>
            </div>
          </div>

          </div>
        </div>

        {/* Step 2: Number of People */}
        <div data-step="2" className={`mb-8 transition-all duration-500 ${currentStep >= 2 ? 'opacity-100' : 'opacity-0 hidden'}`}>
          <div ref={step2Ref} className="p-6 sm:p-8 pb-12 sm:pb-16 rounded-xl bg-slate-800/60 backdrop-blur-sm border border-slate-600/30 mt-6">
            <div className="bg-slate-800/60 backdrop-blur-sm p-6 sm:p-8 pb-18 sm:pb-16 rounded-xl border border-slate-600/30">
              <h3 className="font-luxury-heading text-xl sm:text-2xl font-semibold text-white mb-6 tracking-wide">Step 2: Number of People</h3>
              
              <div className="flex items-center justify-center space-x-6 mb-6">
                <button 
                  onClick={() => setNumberOfPeople(Math.max(1, numberOfPeople - 1))}
                  className="bg-slate-600 hover:bg-slate-500 text-white p-3 rounded-full transition-all duration-200 hover:scale-110"
                >
                  <Minus className="w-5 h-5" />
                </button>
                
                <div className="flex items-center space-x-3">
                  <Users className="w-6 h-6 text-cyan-400" />
                  <span className="font-luxury-accent text-2xl font-bold text-white min-w-[2rem] text-center">{numberOfPeople}</span>
                </div>
                
                <button 
                  onClick={() => setNumberOfPeople(numberOfPeople + 1)}
                  className="bg-slate-600 hover:bg-slate-500 text-white p-3 rounded-full transition-all duration-200 hover:scale-110"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
              
              <div className="text-center mb-6">
                <p className="font-luxury-body text-gray-300">
                  Total: <span className="font-luxury-accent text-xl font-bold text-cyan-400">${cruisePrice * numberOfPeople}</span>
                </p>
              </div>
              
              <button 
                onClick={handleContinueToCourses}
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-luxury-accent font-bold py-3 px-6 rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-xl tracking-wide"
              >
                Continue to Courses
              </button>
            </div>
          </div>
        </div>

        {/* Step 3: Courses */}
        <div data-step="3" className={`mb-8 transition-all duration-500 ${currentStep >= 3 ? 'opacity-100' : 'opacity-0 hidden'}`}>
          <div className="bg-slate-800/60 backdrop-blur-sm p-6 sm:p-8 rounded-xl border border-slate-600/30">
            <h3 className="font-luxury-heading text-xl sm:text-2xl font-semibold text-white mb-6 tracking-wide">
              Step 3: Add Courses (Optional)
              {numberOfPeople > 1 && (
                <span className="text-cyan-400 text-lg ml-2">- Person {currentPersonIndex + 1} of {numberOfPeople}</span>
              )}
            </h3>
            
            
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              {availableCourses.map((course) => (
                <div 
                  key={course.id}
                  className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
                    currentPerson?.selectedCourses.includes(course.id)
                      ? 'border-cyan-400 bg-cyan-400/10'
                      : 'border-slate-600/50 bg-slate-700/50 hover:border-slate-500'
                  }`}
                  onClick={() => toggleCourse(course.id)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-luxury-heading text-lg font-semibold text-white">{course.name}</h4>
                    <span className="font-luxury-accent text-xl font-bold text-cyan-400">${course.price}</span>
                  </div>
                  <p className="font-luxury-body text-sm text-gray-300">{course.description}</p>
                </div>
              ))}
            </div>
            
            {currentPerson?.selectedCourses.length > 0 && (
              <div className="mb-6 p-4 bg-slate-700/50 rounded-lg">
                <h4 className="font-luxury-heading text-lg font-semibold text-white mb-2">Selected Courses:</h4>
                <div className="space-y-2">
                  {currentPerson.selectedCourses.map(courseId => {
                    const course = availableCourses.find(c => c.id === courseId);
                    return course ? (
                      <div key={courseId} className="flex justify-between items-center">
                        <span className="font-luxury-body text-gray-200">{course.name}</span>
                        <span className="font-luxury-accent font-bold text-cyan-400">${course.price}</span>
                      </div>
                    ) : null;
                  })}
                </div>
                <div className="border-t border-slate-600/30 mt-3 pt-3">
                  <div className="flex justify-between items-center">
                    <span className="font-luxury-body text-white font-semibold">Courses Total:</span>
                    <span className="font-luxury-accent text-xl font-bold text-cyan-400">
                      ${currentPerson.selectedCourses.reduce((total, courseId) => {
                        const course = availableCourses.find(c => c.id === courseId);
                        return total + (course ? course.price : 0);
                      }, 0)}
                    </span>
                  </div>
                </div>
              </div>
            )}

             
            
            <button 
              onClick={handleContinueToGear}
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-luxury-accent font-bold py-3 px-6 rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-xl tracking-wide"
            >
              Continue to Gear
            </button>
          </div>
        </div>

        {/* Step 4: Gear Selection */}
        <div data-step="4" className={`mb-8 transition-all duration-500 ${currentStep >= 4 ? 'opacity-100' : 'opacity-0 hidden'}`}>
          <div className="bg-slate-800/60 backdrop-blur-sm p-6 sm:p-8 rounded-xl border border-slate-600/30">
            <h3 className="font-luxury-heading text-xl sm:text-2xl font-semibold text-white mb-6 tracking-wide">
              Step 4: Gear Rental (Optional)
              {numberOfPeople > 1 && (
                <span className="text-cyan-400 text-lg ml-2">- Person {currentPersonIndex + 1} of {numberOfPeople}</span>
              )}
            </h3>
            
           
            
            <div className="space-y-4 mb-6">
              {/* Gear Deal - Orange */}
              <div 
                onClick={() => handleGearSelection('gear_deal')}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 bg-gradient-to-br from-orange-500/20 to-orange-600/20 ${
                  currentPerson?.selectedGear.includes('gear_deal') 
                    ? 'border-orange-400 bg-orange-400/20' 
                    : 'border-orange-500/50 hover:border-orange-400'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-luxury-heading text-lg font-semibold text-white mb-1">Gear deal! (7 days)</h4>
                    <p className="text-gray-300 text-sm mb-2">BCD, Regulator, Dive computer, Mask, and Fins</p>
                    <p className="text-orange-300 text-xs">Wetsuit is not included.</p>
                  </div>
                  <span className="text-orange-400 font-bold text-xl">$245</span>
                </div>
              </div>

              {/* Select Specific Gear - Turquoise */}
              <div 
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 border-cyan-400 bg-cyan-400/20 hover:border-cyan-300`}
                onClick={() => handleGearSelection('select_gear')}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-luxury-heading text-lg font-semibold text-white mb-1">Select Specific Gear</h4>
                    <p className="text-gray-300 text-sm">Choose individual items you need</p>
                  </div>
                  <span className="text-cyan-400 font-bold text-xl">
                    ${calculateSpecificGearPrice()}
                  </span>
                </div>

                {/* Gear Dropdown */}
                {currentPerson?.gearRentalType === 'select_gear' && (
                  <div 
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                    className="mt-4 space-y-2"
                  >
                    {gearOptions.map((gear) => (
                      <div
                        key={gear.id}
                        className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 ${
                          currentPerson?.selectedSpecificGear[gear.id]
                            ? 'border-cyan-400 bg-cyan-400/10'
                            : 'border-slate-600/50 bg-slate-700/30 hover:border-slate-500'
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSpecificGearChange(gear.id);
                        }}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <h5 className="font-luxury-heading text-white font-medium">
                                {gear.id === 'diveComputer' ? 'Dive Computer' : gear.name}
                              </h5>
                              <div className="flex items-center space-x-2">
                                <span className="text-gray-400 text-sm">${gear.price}/day</span>
                                <span className="text-cyan-400 font-bold">${gear.price * 7}</span>
                              </div>
                            </div>
                            <p className="text-gray-300 text-xs">{gear.description}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {Object.keys(currentPerson?.selectedSpecificGear || {}).filter(key => currentPerson?.selectedSpecificGear[key]).length > 0 && (
                      <div className="mt-3 p-3 bg-slate-600/30 rounded-lg border-t border-slate-500/30">
                        <div className="flex justify-between items-center">
                          <span className="text-white font-medium">
                            Selected: {Object.keys(currentPerson?.selectedSpecificGear || {}).filter(key => currentPerson?.selectedSpecificGear[key]).length} items
                          </span>
                          <span className="text-cyan-400 font-bold text-lg">
                            ${calculateSpecificGearPrice()}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              <div
                onClick={() => handleGearSelection('no_gear')}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                  currentPerson?.selectedGear.includes('no_gear') 
                    ? 'border-gray-400 bg-gray-400/10' 
                    : 'border-slate-600/50 bg-slate-700/50 hover:border-slate-500'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-luxury-heading text-lg font-semibold text-white mb-1">No Gear Needed</h4>
                    <p className="text-gray-300 text-sm">-I have my own gear</p>
                  </div>
                  <span className="text-gray-400 font-bold text-xl">$0</span>
                </div>
              </div>
            </div>
            
            {/* Gear Summary */}
            {currentPerson && (currentPerson.selectedGear.length > 0 && !currentPerson.selectedGear.includes('no_gear')) && (
              <div className="mb-6 p-4 bg-slate-700/50 rounded-lg">
                <h4 className="font-luxury-heading text-lg font-semibold text-white mb-2">Gear Summary:</h4>
                <div className="space-y-2">
                  {currentPerson.selectedGear.includes('gear_deal') && (
                    <div className="flex justify-between items-center">
                      <span className="font-luxury-body text-gray-200">Gear Deal Package</span>
                      <span className="font-luxury-accent font-bold text-orange-400">$245</span>
                    </div>
                  )}
                  {currentPerson.gearRentalType === 'select_gear' && Object.keys(currentPerson.selectedSpecificGear).filter(key => currentPerson.selectedSpecificGear[key]).length > 0 && (
                    <>
                      <div className="flex justify-between items-center">
                        <span className="font-luxury-body text-gray-200 text-sm">
                          Selected Gear ({Object.keys(currentPerson.selectedSpecificGear).filter(key => currentPerson.selectedSpecificGear[key]).length} items)
                        </span>
                        <span className="font-luxury-accent font-bold text-cyan-400">${calculateSpecificGearPrice()}</span>
                      </div>
                      {/* Individual gear items breakdown */}
                      <div className="ml-4 space-y-1">
                        {Object.keys(currentPerson.selectedSpecificGear).filter(key => currentPerson.selectedSpecificGear[key]).map(gearId => {
                          const gear = gearOptions.find(g => g.id === gearId);
                          return gear ? (
                            <div key={gearId} className="flex justify-between items-center">
                              <span className="font-luxury-body text-gray-300 text-xs">• {gear.name}</span>
                              <span className="font-luxury-body text-gray-300 text-xs">${gear.price * 7} (${gear.price}/day)</span>
                            </div>
                          ) : null;
                        })}
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}
            
            <button 
              onClick={handleContinueToDetails}
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-luxury-accent font-bold py-3 px-6 rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-xl tracking-wide"
            >
              Continue to Details
            </button>
          </div>
        </div>

        {/* Step 5: Contact Details */}
        <div data-step="5" className={`mb-8 transition-all duration-500 ${currentStep >= 5 ? 'opacity-100' : 'opacity-0 hidden'}`}>
          <div className="bg-slate-800/60 backdrop-blur-sm p-6 sm:p-8 rounded-xl border border-slate-600/30">
            {isSubmitted ? (
              <div className="text-center py-12">
                <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
                <h3 className="font-luxury-heading text-2xl font-semibold text-white mb-4">Booking Submitted Successfully!</h3>
                <p className="font-luxury-body text-gray-200 mb-6">
                  Thank you for your booking! We'll email to you to confirm your reservation and provide payment details. See you soon!
                </p>
                <div className="bg-slate-700/50 p-4 rounded-lg">
                  <p className="font-luxury-body text-gray-300 text-sm">
                    Total Amount: <span className="font-luxury-accent text-xl font-bold text-cyan-400">${calculateTotalPrice()}</span>
                  </p>
                </div>
              </div>
            ) : (
              <div>
                <h3 className="font-luxury-heading text-xl sm:text-2xl font-semibold text-white mb-6 tracking-wide">
                  Step 5: Contact Details
                  {numberOfPeople > 1 && (
                    <span className="text-cyan-400 text-lg ml-2">- Person {currentPersonIndex + 1} of {numberOfPeople}</span>
                  )}
                </h3>
                
                {/* Contact Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block font-luxury-body text-white mb-2 flex items-center">
                        <User className="w-4 h-4 mr-2 text-cyan-400" />
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={currentPerson?.name || ''}
                        onChange={handlePersonInputChange}
                        required
                        className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none transition-colors duration-200"
                        placeholder="Enter your full name"
                      />
                    </div>
                    
                    <div>
                      <label className="block font-luxury-body text-white mb-2 flex items-center">
                        <Mail className="w-4 h-4 mr-2 text-cyan-400" />
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={currentPerson?.email || ''}
                        onChange={handlePersonInputChange}
                        required
                        className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none transition-colors duration-200"
                        placeholder="Enter your email"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block font-luxury-body text-white mb-2 flex items-center">
                        <Phone className="w-4 h-4 mr-2 text-cyan-400" />
                        WhatsApp Number *
                      </label>
                      <input
                        type="tel"
                        name="phone_number"
                        value={currentPerson?.phone_number || ''}
                        onChange={handlePersonInputChange}
                        required
                        className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none transition-colors duration-200"
                        placeholder="+960 123 4567"
                      />
                      <p className="text-gray-400 text-xs mt-1">Include country code (e.g., +960 for Maldives)</p>
                    </div>
                    
                    <div>
                      <label className="block font-luxury-body text-white mb-2 flex items-center">
                        <Award className="w-4 h-4 mr-2 text-cyan-400" />
                        Existing certification Level
                      </label>
                      <select
                        name="certification_level"
                        value={currentPerson?.certification_level || ''}
                        onChange={handlePersonInputChange}
                        className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white focus:border-cyan-400 focus:outline-none transition-colors duration-200"
                      >
                        <option value="">Select your level</option>
                        {certificationLevels.map((level) => (
                          <option key={level} value={level}>{level}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Promo Code Section */}
                  <div>
                    <label className="block font-luxury-body text-white mb-2 flex items-center">
                      <Tag className="w-4 h-4 mr-2 text-cyan-400" />
                      Promo Code (Optional)
                    </label>
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        name="promoCode"
                        value={currentPerson?.promoCode || ''}
                        onChange={handlePersonInputChange}
                        className="flex-1 px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none transition-colors duration-200"
                        placeholder="Enter promo code"
                      />
                      <button
                        type="button"
                        onClick={handleApplyPromo}
                        className="px-2 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-bold rounded-lg transition-all duration-200"
                      >
                        Apply
                      </button>
                    </div>
                    {promoError && (
                      <p className="text-red-400 text-sm mt-1">{promoError}</p>
                    )}
                    {currentPerson?.promoDiscount > 0 && (
                      <div className="mt-2 p-3 bg-green-500/20 border border-green-500/30 rounded-lg flex justify-between items-center">
                        <span className="text-green-400 font-medium">
                          {currentPerson.promoCode === 'influencerpack' 
                            ? `Promo code "${currentPerson.promoCode}" applied! Full discount - Total: $0`
                            : `Promo code "${currentPerson.promoCode}" applied! -$${currentPerson.promoDiscount}`
                          }
                        </span>
                        <button
                          type="button"
                          onClick={handleRemovePromo}
                          className="text-green-400 hover:text-green-300"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                    {currentPerson?.promoCode === 'influencerpack' && currentPerson?.promoDiscount === 0 && (
                      <div className="mt-2 p-3 bg-green-500/20 border border-green-500/30 rounded-lg flex justify-between items-center">
                        <span className="text-green-400 font-medium">
                          Promo code "influencerpack" applied! Full discount - Total: $0
                        </span>
                        <button
                          type="button"
                          onClick={handleRemovePromo}
                          className="text-green-400 hover:text-green-300"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <label className="block font-luxury-body text-white mb-2 flex items-center">
                      <MessageSquare className="w-4 h-4 mr-2 text-cyan-400" />
                      Additional Message (Optional)
                    </label>
                    <textarea
                      name="message"
                      value={currentPerson?.message || ''}
                      onChange={handlePersonInputChange}
                      rows={4}
                      className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none transition-colors duration-200 resize-vertical"
                      placeholder="Any special requests or questions?"
                    />
                  </div>

                  {/* Continue to Summary button for single person */}
                  {numberOfPeople === 1 && !showSummary && (
                    <div className="flex justify-center">
                      <button
                        type="button"
                        onClick={handleContinueToSummary}
                        className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-luxury-accent font-bold py-3 px-6 rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-xl tracking-wide"
                      >
                        Continue to Summary
                      </button>
                    </div>
                  )}

                  {/* Person Navigation for Contact Details */}
                  {numberOfPeople > 1 && (
                    <div className="flex justify-center items-center mb-6 p-4 bg-slate-700/50 rounded-lg">
                      <div className="flex flex-col justify-center items-center gap-3 w-full max-w-[220px]">
                        <button
                          type="button"
                          onClick={() => {
                            goToPreviousPerson();
                            setShowSummary(false);
                          }}
                          disabled={currentPersonIndex === 0}
                          className={`flex justify-center items-center text-center px-6 py-3 w-full rounded-full transition-all duration-200 whitespace-nowrap ${
                            currentPersonIndex === 0
                              ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                              : 'bg-cyan-500 hover:bg-cyan-600 text-white hover:scale-105'
                          }`}
                        >
                          <span className="leading-tight text-sm sm:text-base">Previous Person</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            goToNextPerson();
                            setShowSummary(false);
                          }}
                          disabled={currentPersonIndex === numberOfPeople - 1}
                          className={`flex justify-center items-center text-center px-6 py-3 w-full rounded-full transition-all duration-200 whitespace-nowrap ${
                            currentPersonIndex === numberOfPeople - 1
                              ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                              : 'bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white hover:scale-105'
                          }`}
                        >
                          <span className="leading-tight text-sm sm:text-base">Next Person</span>
                        </button>

                        <button
                          type="button"
                          onClick={handleContinueToSummary}
                          className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-luxury-accent font-bold py-3 px-6 rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-xl tracking-wide"
                        >
                          Continue to Summary
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Booking Summary */}
                  {showSummary && (
                    <div
                      data-section="summary"
                      className="mb-8 p-6 bg-slate-700/50 rounded-lg border border-slate-600/30 transition-all duration-300"
                    >
                      <h4 className="font-luxury-heading text-lg font-semibold text-white mb-4 flex items-center">
                        <Ship className="w-5 h-5 mr-2 text-cyan-400" />
                        Booking Summary
                      </h4>

                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="font-luxury-body text-gray-200">
                            Cruise ({numberOfPeople} {numberOfPeople === 1 ? 'person' : 'people'})
                          </span>
                          <span className="font-luxury-accent font-bold text-cyan-400">
                            ${cruisePrice * numberOfPeople}
                          </span>
                        </div>

                        {selectedDate && (
                          <div className="flex justify-between items-center">
                            <span className="font-luxury-body text-gray-200">Date</span>
                            <span className="font-luxury-body text-gray-300 text-sm">
                              {selectedDate}
                            </span>
                          </div>
                        )}

                        {/* Individual Person Summaries */}
                        {peopleData.map((person, index) => {
                          const prices = calculatePersonPrices(person);
                          return (
                            <div key={index} className="border-t border-slate-600/30 pt-3">
                              <h5 className="font-luxury-heading text-white font-medium mb-2">
                                {person.name || `Person ${index + 1}`}
                              </h5>

                              {/* Selected Courses */}
                              {person.selectedCourses.length > 0 && (
                                <div className="ml-4 mb-2">
                                  <h6 className="font-luxury-body text-gray-300 text-sm font-medium mb-1">Selected Courses:</h6>
                                  {person.selectedCourses.map(courseId => {
                                    const course = availableCourses.find(c => c.id === courseId);
                                    return course ? (
                                      <div key={courseId} className="flex justify-between items-center ml-2 mb-1">
                                        <span className="font-luxury-body text-gray-200 text-sm">{course.name}</span>
                                        <span className="font-luxury-accent text-cyan-400 text-sm">${course.price}</span>
                                      </div>
                                    ) : null;
                                  })}
                                </div>
                              )}

                              {/* Selected Gear */}
                              {person.needs_gear && (
                                <div className="ml-4 mb-2">
                                  <h6 className="font-luxury-body text-gray-300 text-sm font-medium mb-1">Selected Gear:</h6>
                                  <div className="flex justify-between items-center ml-2 mb-1">
                                    <span className="font-luxury-body text-gray-200 text-sm">{person.gear_type}</span>
                                    <span className="font-luxury-accent text-cyan-400 text-sm">${prices.gear_total_price}</span>
                                  </div>
                                </div>
                              )}

                              <div className="ml-4 flex justify-between items-center">
                                <span className="font-luxury-body text-white font-medium text-sm">
                                  Subtotal
                                </span>
                                <span className="font-luxury-accent font-bold text-cyan-400">
                                  ${prices.total_booking_price}
                                </span>
                              </div>
                            </div>
                          );
                        })}

                        <div className="border-t border-slate-600/30 pt-3">
                          <div className="flex justify-between items-center mb-6">
                            <span className="font-luxury-body text-white font-semibold text-lg">
                              Grand Total
                            </span>
                            <span className="font-luxury-accent text-2xl font-bold text-cyan-400">
                              ${calculateTotalPrice()}
                            </span>
                          </div>

                          {/* Submit Button appears ONLY inside summary */}
                          <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`w-full font-luxury-accent font-bold py-4 px-8 rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-xl tracking-wide flex items-center justify-center space-x-2 ${
                              isSubmitting
                                ? 'bg-gray-600 cursor-not-allowed'
                                : 'bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white'
                            }`}
                          >
                            {isSubmitting ? (
                              <>
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                <span>Submitting...</span>
                              </>
                            ) : (
                              <>
                                <Send className="w-5 h-5" />
                                <span>Submit Booking</span>
                              </>
                            )}
                          </button>

                          {/* Data Collection & Privacy Notice - Collapsible */}
                    <div className="mt-6 p-4 bg-slate-600/30 rounded-lg border border-slate-500/30">
                      <button
                       type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          setShowMultiPersonPrivacyNotice(!showMultiPersonPrivacyNotice);
                        }}
                        className="w-full text-left flex items-center justify-between font-luxury-heading text-sm font-semibold text-white hover:text-gray-300 transition-colors duration-200"
                      >
                        <span>Data Collection & Privacy Notice</span>
                        {showMultiPersonPrivacyNotice ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </button>
                      <p className="font-luxury-body text-xs text-gray-300 leading-relaxed mt-2">
                        By submitting your information through our contact forms, you consent to the collection and processing of your personal data...
                      </p>
                      <div 
                        className={`overflow-hidden transition-all duration-300 ease-in-out ${
                          showMultiPersonPrivacyNotice
                            ? 'max-h-96 opacity-100 mt-2' 
                            : 'max-h-0 opacity-0'
                        }`}
                      >
                        <p className="font-luxury-body text-xs text-gray-300 leading-relaxed">
                          for the purpose of responding to your inquiry and providing diving services. We respect your privacy and will not share your 
                          information with third parties without your consent. Your data is securely stored and used solely for business communication purposes.
                        </p>
                      </div>
                    </div>
                        </div>
                      </div>
                    </div>
                  )}
                </form>
              </div>
            )}
          </div>
        </div>

        {/* Cruise Details Popup */}
        {showCruiseDetails && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-slate-800 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
              <div className="flex justify-between items-center p-6 border-b border-slate-600/30">
                <h3 className="font-luxury-heading text-2xl font-semibold text-white">Cruise Details</h3>
                <button
                  onClick={() => setShowCruiseDetails(false)}
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-100px)]" onScroll={handleDetailsScroll}>
                <div className="space-y-6">
                  <div className="text-center mb-6">
                    <img
                      src="/mald itienary computer.jpg"
                      alt="8 Days Maldives Cruise Itinerary"
                      className="w-full rounded-lg shadow-lg"
                    />
                  </div>

                  {/* 1. Trip Overview */}
                  <div className="space-y-4">
                    <h4 className="font-luxury-heading text-xl font-semibold text-white flex items-center">
                      <Ship className="w-5 h-5 mr-2 text-cyan-400" />
                      Trip Overview
                    </h4>
                    <div className="text-gray-200 space-y-3">
                      <p>
                        Embark on an unforgettable 8-day, 7-night diving adventure aboard
                        the Blue Shark 2 through the pristine waters of the Maldives. This
                        liveaboard experience takes you to some of the most spectacular
                        dive sites in the world, where you'll encounter magnificent marine
                        life including manta rays, whale sharks, and various shark species.
                      </p>
                      <p>
                        Our carefully planned itinerary covers multiple atolls, offering
                        diverse underwater landscapes from vibrant coral reefs to dramatic
                        drop-offs. With up to 3 dives per day, you'll have plenty of
                        opportunities to explore the underwater paradise that makes the
                        Maldives a world-renowned diving destination.
                      </p>
                    </div>
                  </div>

                  {/* 2. What's Included */}
                  <div className="space-y-4">
                    <h4 className="font-luxury-heading text-xl font-semibold text-white flex items-center">
                      <CheckCircle className="w-5 h-5 mr-2 text-cyan-400" />
                      What's Included
                    </h4>
                    <ul className="space-y-2 text-gray-200">
                      <li className="flex items-center">
                        <CheckCircle className="w-4 h-4 mr-2 text-green-400" />
                        8 days, 7 nights accommodation on Blue Shark 2
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="w-4 h-4 mr-2 text-green-400" />
                        All meals and snacks (breakfast, lunch, dinner)
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="w-4 h-4 mr-2 text-green-400" />
                        Tea, coffee, water and juice
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="w-4 h-4 mr-2 text-green-400" />
                        Up to 3 dives per day
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                        Tanks and weights
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="w-4 h-4 mr-2 text-green-400" />
                        Professional dive guide
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="w-4 h-4 mr-2 text-green-400" />
                        Airport transfers in Male
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="w-4 h-4 mr-2 text-green-400" />
                        Speedboat transfers to/from the boat
                      </li>
                    </ul>
                  </div>

                  {/* 3. What's NOT Included */}
                  <div className="space-y-4">
                    <h4 className="font-luxury-heading text-xl font-semibold text-white flex items-center">
                      <X className="w-5 h-5 mr-2 text-red-400" />
                      What's NOT Included
                    </h4>
                    <ul className="space-y-2 text-gray-200">
                      <li className="flex items-center">
                        <X className="w-4 h-4 mr-2 text-red-400" />
                        International flights to/from Maldives
                      </li>
                      <li className="flex items-center">
                        <X className="w-4 h-4 mr-2 text-red-400" />
                        Diving equipment rental (available separately)
                      </li>
                      <li className="flex items-center">
                        <X className="w-4 h-4 mr-2 text-red-400" />
                        Alcoholic beverages
                      </li>
                      <li className="flex items-center">
                        <X className="w-4 h-4 mr-2 text-red-400" />
                        Travel insurance
                      </li>
                      <li className="flex items-center">
                        <X className="w-4 h-4 mr-2 text-red-400" />
                        Personal expenses and tips
                      </li>
                      <li className="flex items-center">
                        <X className="w-4 h-4 mr-2 text-red-400" />
                        Nitrox certification and fills (available on board)
                      </li>
                    </ul>
                  </div>

                  

                  {/* 5. Sample Itinerary */}
                  <div className="space-y-4">
                    <h4 className="font-luxury-heading text-xl font-semibold text-white flex items-center">
                      <GraduationCap className="w-5 h-5 mr-2 text-cyan-400" />
                      Sample Daily Schedule
                    </h4>
                    <div className="bg-slate-700/50 p-4 rounded-lg">
                      <div className="space-y-3 text-gray-200">
                        <div>
                          <strong className="text-cyan-400">06:30</strong> - Wake up call & light breakfast
                        </div>
                        <div>
                          <strong className="text-cyan-400">07:00</strong> - First dive of the day
                        </div>
                        <div>
                          <strong className="text-cyan-400">09:00</strong> - Full breakfast
                        </div>
                        <div>
                          <strong className="text-cyan-400">11:00</strong> - Second dive
                        </div>
                        <div>
                          <strong className="text-cyan-400">13:00</strong> - Lunch & rest time
                        </div>
                        <div>
                          <strong className="text-cyan-400">15:30</strong> - Third dive (optional)
                        </div>
                        <div>
                          <strong className="text-cyan-400">18:00</strong> - Sunset & relaxation
                        </div>
                        <div>
                          <strong className="text-cyan-400">19:30</strong> - Dinner
                        </div>
                        <div>
                          <strong className="text-cyan-400">21:00</strong> - Night dive (optional) or free time
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 6. Important Information */}
                  <div className="space-y-4">
                    <h4 className="font-luxury-heading text-xl font-semibold text-white flex items-center">
                      <Shield className="w-5 h-5 mr-2 text-cyan-400" />
                      Important Information
                    </h4>
                    <div className="text-gray-200 space-y-3">
                      <p>
                        <strong className="text-cyan-400">Certification Requirements:</strong> Open Water Diver certification or equivalent is required. 
                        Advanced Open Water is recommended for some dive sites.
                      </p>
                      <p>
                        <strong className="text-cyan-400">Health & Safety:</strong> All divers must complete a medical questionnaire. 
                        Recent diving experience is recommended.
                      </p>
                      <p>
                        <strong className="text-cyan-400">Weather Conditions:</strong> Itineraries may be adjusted based on weather and sea conditions 
                        for safety reasons.
                      </p>
                      <p>
                        <strong className="text-cyan-400">Payment:</strong> A deposit is required to secure your booking, with the balance due before departure.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
    </div>
  );
};

export default TripAddons;
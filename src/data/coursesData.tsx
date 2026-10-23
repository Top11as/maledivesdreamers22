import React from 'react';
import { GraduationCap, Award, Shield, Anchor, Waves, Ship, Moon, Compass, Users } from 'lucide-react';

export interface DiveCourse {
  id: string;
  name: string;
  price: number;
  icon: React.ReactElement;
  description: string;
}

export const diveCourses: DiveCourse[] = [
  {
    id: 'open-water',
    name: 'PADI Open Water Diver',
    price: 450,
    icon: <GraduationCap className="w-8 h-8 text-cyan-400" />,
    description: 'Your first scuba certification! Learn the fundamentals of diving in confined and open water. Includes theory, pool sessions, and 4 open water dives. (Additional boat fees may apply)'
  },
  {
    id: 'advanced-open-water',
    name: 'PADI Advanced Open Water Diver',
    price: 195,
    icon: <Award className="w-8 h-8 text-blue-400" />,
    description: 'Build confidence and skills with 5 adventure dives including deep diving and underwater navigation. Explore different diving specialties and gain experience in various  environments.'
  },
  {
    id: 'rescue-diver',
    name: 'PADI Rescue Diver',
    price: 195,
    icon: <Shield className="w-8 h-8 text-red-400" />,
    description: 'Learn to prevent and manage problems underwater. Develop skills to help other divers and handle emergency situations. Includes rescue scenarios and emergency response training.'
  },
  {
    id: 'enriched-air',
    name: 'PADI Enriched Air (Nitrox)',
    price: 195,
    icon: <Waves className="w-8 h-8 text-green-400" />,
    description: 'Learn to dive with enriched air (nitrox) for longer bottom times and shorter surface intervals.'
  },
  {
    id: 'deep-diver',
    name: 'PADI Deep Diver Specialty',
    price: 195,
    icon: <Anchor className="w-8 h-8 text-indigo-400" />,
    description: 'Explore the deep blue with 4 training dives to 40 meters/131 feet. Learn deep diving techniques, safety procedures, and how to plan deep dives responsibly.'
  },
  {
    id: 'wreck-diver',
    name: 'PADI Wreck Diver Specialty',
    price: 195,
    icon: <Ship className="w-8 h-8 text-orange-400" />,
    description: 'Discover sunken ships and artificial reefs safely. Learn wreck diving techniques, penetration procedures, and how to explore wrecks while preserving their integrity.'
  }
];
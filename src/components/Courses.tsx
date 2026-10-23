import React from 'react';
import { diveCourses } from '../data/coursesData.tsx';

interface CoursesProps {
  currentPersonSelectedCourses?: { [courseId: string]: number };
  onCourseQuantityChange?: (courseId: string, change: number) => void;
}

const Courses: React.FC<CoursesProps> = ({ 
  currentPersonSelectedCourses = {}, 
  onCourseQuantityChange 
}) => {
  return (
    <section id="courses" className="py-12 sm:py-16 md:py-20 relative">
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="font-luxury-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl text-white mb-6 sm:mb-8 leading-tight px-2">
            Dive Courses Available
          </h2>
          <p className="font-luxury-body text-base sm:text-lg md:text-xl lg:text-2xl text-gray-200 max-w-4xl mx-auto leading-relaxed font-light px-2">
            Enhance your diving skills with our professional PADI courses. From beginner to professional level, we offer comprehensive training to take your diving to the next level.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6 md:gap-8">
          {diveCourses.map((course, index) => (
            <div 
              key={course.id}
              className="group p-3 sm:p-6 md:p-8 rounded-xl hover:scale-105 transition-all duration-500 transform hover:shadow-2xl bg-slate-800/40 backdrop-blur-sm border border-slate-600/30 hover:border-cyan-400/50 h-80 md:h-auto overflow-visible"
            >
              {/* Icon */}
              <div className="flex justify-center mb-2 sm:mb-4">
                {course.icon}
              </div>
              
              {/* Course Name */}
              <h3 className="font-luxury-heading text-sm sm:text-lg md:text-xl font-bold text-white mb-2 sm:mb-3 tracking-wide text-center leading-tight">
                {course.name}
              </h3>
              
              {/* Price */}
              <div className="text-center mb-2 sm:mb-4">
                <span className="font-luxury-accent text-xl sm:text-2xl md:text-3xl font-bold text-cyan-400">${course.price}</span>
              </div>
              
              {/* Description */}
              <p className="font-luxury-body text-xs sm:text-sm text-gray-200 leading-relaxed text-center opacity-100 transition-opacity duration-300">
                {course.description}
              </p>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12 sm:mt-16">
          <p className="font-luxury-body text-lg text-gray-200 mb-6">
            Ready to advance your diving skills? Add any of these courses to your booking below!
          </p>
        </div>
      </div>
    </section>
  );
};

export default Courses;
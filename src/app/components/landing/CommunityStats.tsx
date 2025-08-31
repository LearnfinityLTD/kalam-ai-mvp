"use client";
import { useEffect, useState } from "react";

function useCountUp(target: number, duration = 2000) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    let start: number | null = null;
    let animationFrame: number;

    const step = (timestamp: number) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      setValue(Math.floor(progress * target));
      if (progress < 1) {
        animationFrame = requestAnimationFrame(step);
      }
    };

    animationFrame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animationFrame);
  }, [target, duration]);

  return value;
}

export default function CommunityStats() {
  const learners = useCountUp(500);
  const countries = useCountUp(15);
  const rating = useCountUp(49); // we'll divide by 10 for 4.9

  return (
    <section className="py-16 bg-gradient-to-r from-green-600 to-blue-600">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl font-bold text-white mb-6">
          Real Stories from Our Community
        </h1>
        <p className="text-xl text-green-100 mb-8">
          Discover how كلام AI has transformed English communication for Arabic
          speakers across the Muslim world
        </p>
        <div className="flex items-center justify-center space-x-6 text-white">
          <div className="text-center">
            <div className="text-3xl font-bold">{learners}+</div>
            <div className="text-green-200">Active Learners</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold">{countries}+</div>
            <div className="text-green-200">Countries</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold">
              {(rating / 10).toFixed(1)}/5
            </div>
            <div className="text-green-200">Average Rating</div>
          </div>
        </div>
      </div>
    </section>
  );
}

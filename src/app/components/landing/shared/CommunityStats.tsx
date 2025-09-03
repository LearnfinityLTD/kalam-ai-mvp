"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

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

export const CommunityStats = () => {
  const learners = useCountUp(500);
  const countries = useCountUp(15);
  const rating = useCountUp(49);

  return (
    <section className="py-16 bg-gradient-to-r from-green-600 to-blue-600 relative overflow-hidden">
      <div className="absolute inset-0 bg-black/10"></div>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl font-bold text-white mb-4"
        >
          Join Our Growing Community
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-xl text-green-100 mb-12 max-w-3xl mx-auto"
        >
          Discover how KalamAI has transformed English communication for Arabic
          speakers across the Muslim world
        </motion.p>

        <div className="grid md:grid-cols-3 gap-8 text-white">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center bg-white/10 backdrop-blur rounded-lg p-6"
          >
            <div className="text-4xl font-bold mb-2">{learners}+</div>
            <div className="text-green-200 text-lg">Active Learners</div>
            <div className="text-green-300 text-sm mt-2">Growing daily 📈</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-center bg-white/10 backdrop-blur rounded-lg p-6"
          >
            <div className="text-4xl font-bold mb-2">{countries}+</div>
            <div className="text-green-200 text-lg">Countries</div>
            <div className="text-green-300 text-sm mt-2">
              Across MENA region 🌍
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center bg-white/10 backdrop-blur rounded-lg p-6"
          >
            <div className="text-4xl font-bold mb-2">
              {(rating / 10).toFixed(1)}/5
            </div>
            <div className="text-green-200 text-lg">User Rating</div>
            <div className="text-green-300 text-sm mt-2">
              ⭐⭐⭐⭐⭐ Reviews
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

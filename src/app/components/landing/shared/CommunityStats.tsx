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
  const coursesVerified = useCountUp(1200);
  const platformPartners = useCountUp(15);
  const avgScoreIncrease = useCountUp(23);

  return (
    <section className="py-16 bg-slate-900 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-indigo-600/10"></div>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-4xl font-bold text-white mb-4"
        >
          Trusted by Creators and Platforms Worldwide
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: true }}
          className="text-xl text-slate-300 mb-12 max-w-3xl mx-auto"
        >
          Independent verification that learners trust and creators rely on to
          stand out in a crowded marketplace
        </motion.p>

        <div className="grid md:grid-cols-3 gap-8 text-white">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-center bg-white/10 backdrop-blur rounded-lg p-6"
          >
            <div className="text-4xl font-bold mb-2">
              {coursesVerified.toLocaleString()}+
            </div>
            <div className="text-blue-300 text-lg">Courses Verified</div>
            <div className="text-slate-400 text-sm mt-2">
              Across 12 major categories
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="text-center bg-white/10 backdrop-blur rounded-lg p-6"
          >
            <div className="text-4xl font-bold mb-2">{platformPartners}+</div>
            <div className="text-blue-300 text-lg">Platform Partners</div>
            <div className="text-slate-400 text-sm mt-2">
              Including enterprise clients
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="text-center bg-white/10 backdrop-blur rounded-lg p-6"
          >
            <div className="text-4xl font-bold mb-2">{avgScoreIncrease}%</div>
            <div className="text-blue-300 text-lg">Avg. Sales Increase</div>
            <div className="text-slate-400 text-sm mt-2">
              For verified creators
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

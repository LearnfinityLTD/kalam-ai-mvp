// "use client";
// import { motion } from "framer-motion";
// import { Card, CardContent } from "@/ui/card";
// const Globe = ({ className }) => (
//   <svg
//     className={className}
//     fill="none"
//     stroke="currentColor"
//     viewBox="0 0 24 24"
//   >
//     <path
//       strokeLinecap="round"
//       strokeLinejoin="round"
//       strokeWidth={2}
//       d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
//     />
//   </svg>
// );
// const Mic = ({ className }) => (
//   <svg
//     className={className}
//     fill="none"
//     stroke="currentColor"
//     viewBox="0 0 24 24"
//   >
//     <path
//       strokeLinecap="round"
//       strokeLinejoin="round"
//       strokeWidth={2}
//       d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
//     />
//   </svg>
// );
// const Users = ({ className }) => (
//   <svg
//     className={className}
//     fill="none"
//     stroke="currentColor"
//     viewBox="0 0 24 24"
//   >
//     <path
//       strokeLinecap="round"
//       strokeLinejoin="round"
//       strokeWidth={2}
//       d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-2.866M13 7a4 4 0 11-8 0 4 4 0 018 0z"
//     />
//   </svg>
// );
// const Shield = ({ className }) => (
//   <svg
//     className={className}
//     fill="none"
//     stroke="currentColor"
//     viewBox="0 0 24 24"
//   >
//     <path
//       strokeLinecap="round"
//       strokeLinejoin="round"
//       strokeWidth={2}
//       d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.031 9-11.622 0-1.042-.133-2.052-.382-3.016z"
//     />
//   </svg>
// );
// const Briefcase = ({ className }) => (
//   <svg
//     className={className}
//     fill="none"
//     stroke="currentColor"
//     viewBox="0 0 24 24"
//   >
//     <path
//       strokeLinecap="round"
//       strokeLinejoin="round"
//       strokeWidth={2}
//       d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0H8m8 0v6a2 2 0 01-2 2H10a2 2 0 01-2-2V6m8 0H8"
//     />
//   </svg>
// );
// const MapPin = ({ className }) => (
//   <svg
//     className={className}
//     fill="none"
//     stroke="currentColor"
//     viewBox="0 0 24 24"
//   >
//     <path
//       strokeLinecap="round"
//       strokeLinejoin="round"
//       strokeWidth={2}
//       d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
//     />
//     <path
//       strokeLinecap="round"
//       strokeLinejoin="round"
//       strokeWidth={2}
//       d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
//     />
//   </svg>
// );
// const Star = ({ className }) => (
//   <svg
//     className={className}
//     fill="none"
//     stroke="currentColor"
//     viewBox="0 0 24 24"
//   >
//     <path
//       strokeLinecap="round"
//       strokeLinejoin="round"
//       strokeWidth={2}
//       d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
//     />
//   </svg>
// );

// const Testimonials = () => {
//   const testimonials = [
//     {
//       name: "Ahmed Al-Rashid",
//       role: "Mosque Guard, Masjid Al-Noor",
//       location: "Dubai, UAE",
//       content:
//         "KalamAI transformed how I welcome international visitors. I went from being nervous about English conversations to confidently explaining our mosque's history and prayer times. The cultural context lessons were invaluable.",
//       rating: 5,
//     },
//     {
//       name: "Fatima Hassan",
//       role: "Tour Guide",
//       location: "Cairo, Egypt",
//       content:
//         "The prayer-respectful timing feature shows they truly understand our needs. I can practice during breaks and never worry about interruptions during prayer time. My English has improved dramatically in just 3 months.",
//       rating: 5,
//     },
//     {
//       name: "Omar Khalil",
//       role: "Business Professional",
//       location: "Riyadh, Saudi Arabia",
//       content:
//         "Finally, an English app that gets our culture! The business scenarios feel real and the cultural intelligence lessons help me communicate more effectively with international clients. Highly recommended.",
//       rating: 5,
//     },
//   ];

//   return (
//     <section
//       id="testimonials"
//       className="py-20 bg-gradient-to-br from-green-50 to-blue-50"
//     >
//       <div className="container mx-auto px-4">
//         <motion.div
//           initial={{ opacity: 0, y: 30 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.6 }}
//           className="text-center mb-16"
//         >
//           <h2 className="text-4xl font-bold text-gray-900 mb-4">
//             Success Stories from Our Community
//           </h2>
//           <p className="text-xl text-gray-600 max-w-3xl mx-auto">
//             Real transformations from Arabic speakers who've mastered English
//             communication through KalamAI
//           </p>
//         </motion.div>

//         <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
//           {testimonials.map((testimonial, index) => (
//             <motion.div
//               key={testimonial.name}
//               initial={{ opacity: 0, y: 30 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.6, delay: index * 0.1 }}
//             >
//               <Card className="h-full bg-white shadow-lg hover:shadow-xl transition-all duration-300">
//                 <CardContent className="p-6">
//                   <div className="flex items-center mb-4">
//                     {[...Array(testimonial.rating)].map((_, i) => (
//                       <Star
//                         key={i}
//                         className="h-5 w-5 text-yellow-400 fill-current"
//                       />
//                     ))}
//                   </div>
//                   <p className="text-gray-700 mb-6 leading-relaxed italic">
//                     "{testimonial.content}"
//                   </p>
//                   <div className="border-t pt-4">
//                     <h4 className="font-semibold text-gray-900">
//                       {testimonial.name}
//                     </h4>
//                     <p className="text-green-600 font-medium">
//                       {testimonial.role}
//                     </p>
//                     <p className="text-gray-500 text-sm">
//                       {testimonial.location}
//                     </p>
//                   </div>
//                 </CardContent>
//               </Card>
//             </motion.div>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// };

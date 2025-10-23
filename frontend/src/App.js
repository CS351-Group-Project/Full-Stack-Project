// import React from "react";
// import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
// import "./App.css";
// import NavBar from "./components/NavBar";
// import LoginPage from "./pages/LoginPage";
// import Hub from "./pages/Hub";
// import Profile from "./pages/Profile";
// import Explore from "./pages/Explore";
// import Events from "./pages/Events";
// import About from "./pages/About";
// import Info from "./pages/Info";

// export default function App() {
//   // Minimal stubs so the JSX compiles
//   const [selectedCategory, setSelectedCategory] = React.useState<string>("all");
//   const [selectedDates, setSelectedDates] = React.useState<number[]>([]);
//   const categories = React.useMemo(
//     () => [
//       { id: "all", label: "All" },
//       { id: "music", label: "Music" },
//       { id: "sports", label: "Sports" },
//       { id: "talks", label: "Talks" },
//     ],
//     []
//   );

//   const getDaysInMonth = React.useCallback(() => {
//     // simple 30-day grid for demo
//     return Array.from({ length: 30 }, (_, i) => i + 1);
//   }, []);

//   const toggleDate = (day: number) => {
//     setSelectedDates((prev) =>
//       prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
//     );
//   };

//   const allEvents = React.useMemo(
//     () =>
//       [
//         { id: 1, title: "Concert", location: "Hall A", attendees: 120, date: 5, category: "music" },
//         { id: 2, title: "Marathon", location: "City Park", attendees: 300, date: 12, category: "sports" },
//         { id: 3, title: "Tech Talk", location: "Auditorium", attendees: 80, date: 12, category: "talks" },
//       ] as Array<{
//         id: number;
//         title: string;
//         location: string;
//         attendees: number;
//         date: number;
//         category: string;
//       }>,
//     []
//   );

//   const filteredEvents = React.useMemo(() => {
//     const byCat =
//       selectedCategory === "all"
//         ? allEvents
//         : allEvents.filter((e) => e.category === selectedCategory);
//     if (selectedDates.length === 0) return byCat;
//     return byCat.filter((e) => selectedDates.includes(e.date));
//   }, [allEvents, selectedCategory, selectedDates]);

//   const exploreItems = React.useMemo(
//     () => [
//       { id: "e1", color: "bg-blue-600", image: "Explore A" },
//       { id: "e2", color: "bg-green-600", image: "Explore B" },
//       { id: "e3", color: "bg-purple-600", image: "Explore C" },
//     ],
//     []
//   );

//   return (
//     <>
//       <BrowserRouter>
//         <NavBar />
//         <Routes>
//           <Route path="/" element={<Navigate to="/login" replace />} />
//           <Route path="/login" element={<LoginPage />} />
//           <Route path="/hub" element={<Hub />} />
//           <Route path="/profile" element={<Profile />} />
//           <Route path="/explore" element={<Explore />} />
//           <Route path="/events" element={<Events />} />
//           <Route path="/about" element={<About />} />
//           <Route path="/info" element={<Info />} />
//         </Routes>
//       </BrowserRouter>

//       <div
//         className="min-h-screen p-8 flex items-center justify-center relative"
//         style={{
//           fontFamily: "'Times New Roman', Times, serif",
//           backgroundImage: 'url("/images.jpeg")',
//           backgroundSize: "cover",
//           backgroundPosition: "center",
//           backgroundAttachment: "fixed",
//           opacity: 0.8,
//           zIndex: -2,
//         }}
//       >
//         <div className="max-w-7xl w-full relative z-10">
//           <div className="rounded-lg p-8 mb-8">
//             <div className="border-t border-black pt-6">
//               <div className="flex justify-center gap-8 mb-8">
//                 {categories.map((cat) => (
//                   <button
//                     key={cat.id}
//                     onClick={() => setSelectedCategory(cat.id)}
//                     className={`px-6 py-3 rounded-lg transition-all ${
//                       selectedCategory === cat.id
//                         ? "bg-gray-800 text-white shadow-lg"
//                         : "bg-gray-200 text-gray-700 hover:bg-gray-300"
//                     }`}
//                   >
//                     {cat.label}
//                   </button>
//                 ))}
//               </div>

//               {/* Calendar Section */}
//               <div className="mb-8">
//                 <div className="flex items-center gap-2 mb-4">
//                   <h3 className="text-lg font-semibold text-gray-800">calendar:</h3>
//                 </div>

//                 <div className="grid grid-cols-5 gap-2">
//                   {getDaysInMonth().map((day) => (
//                     <button
//                       key={day}
//                       onClick={() => toggleDate(day)}
//                       className={`p-6 border-2 transition-all ${
//                         selectedDates.includes(day)
//                           ? "bg-gray-300 border-white-400 shadow-md"
//                           : "bg-gray-100 border-white-300 hover:bg-white-200"
//                       }`}
//                     >
//                       <div className="text-lg font-medium text-gray-800">{day}</div>
//                     </button>
//                   ))}
//                 </div>
//               </div>

//               {/* Events Section */}
//               <div>
//                 <h3 className="text-lg font-semibold text-gray-800 mb-4">events:</h3>
//                 <div className="bg-gray-200 rounded-lg p-6 min-h-[200px]">
//                   {filteredEvents.length > 0 ? (
//                     <div className="space-y-4">
//                       {filteredEvents.map((event) => (
//                         <div
//                           key={event.id}
//                           className="bg-white rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow"
//                         >
//                           <div className="flex items-start justify-between">
//                             <div className="flex-1">
//                               <h4 className="font-semibold text-gray-800 mb-2">
//                                 {event.title}
//                               </h4>
//                               <div className="flex items-center gap-4 text-sm text-gray-600">
//                                 <div className="flex items-center gap-1">
//                                   <span>📍</span>
//                                   {event.location}
//                                 </div>
//                                 <div className="flex items-center gap-1">
//                                   <span>👥</span>
//                                   {event.attendees} attending
//                                 </div>
//                               </div>
//                             </div>
//                             <div className="bg-gray-800 text-white px-3 py-1 rounded-full text-sm font-medium">
//                               Day {event.date}
//                             </div>
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   ) : (
//                     <div className="flex items-center justify-center h-full text-gray-500">
//                       Select dates on the calendar to see events
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Explore Section */}
//           <div className="bg-white bg-opacity-90 rounded-lg shadow-lg p-8">
//             <h3 className="text-lg font-semibold text-gray-800 mb-4">explore:</h3>
//             <div className="flex gap-4 items-center">
//               {exploreItems.map((item) => (
//                 <div
//                   key={item.id}
//                   className={`${item.color} rounded-lg p-8 flex-1 h-32 flex items-center justify-center text-white font-semibold shadow-lg hover:shadow-xl transition-shadow cursor-pointer`}
//                 >
//                   {item.image}
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }


import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import NavBar from "./components/NavBar";
import LoginPage from "./pages/LoginPage";
import Hub from "./pages/Hub";
import Profile from "./pages/Profile";
import Explore from "./pages/Explore";
import Events from "./pages/Events";
import About from "./pages/About";
import Info from "./pages/Info";

export default function App() {
  return (
    <BrowserRouter>
      <NavBar />
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/hub" element={<Hub />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/events" element={<Events />} />
        <Route path="/about" element={<About />} />
        <Route path="/info" element={<Info />} />
      </Routes>
    </BrowserRouter>
  );
}

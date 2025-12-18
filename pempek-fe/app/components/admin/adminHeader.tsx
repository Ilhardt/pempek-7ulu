// "use client";

// import React, { useEffect, useState } from 'react';

// export default function AdminHeader() {
//   const [adminName, setAdminName] = useState('NAMA ADMIN');

//   useEffect(() => {
//     // Get admin name from localStorage or API
//     const storedName = localStorage.getItem('adminName');
//     if (storedName) {
//       setAdminName(storedName);
//     }
//   }, []);

//   return (
//     <header className="bg-white px-8 py-5 flex justify-end items-center shadow-sm">
//       <div className="text-gray-900 font-bold text-base tracking-wide">
//         {adminName}
//       </div>
//     </header>
//   );
// }
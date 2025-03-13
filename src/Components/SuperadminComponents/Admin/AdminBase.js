import React, { useState, useEffect } from 'react';
import AdminLogin from './AdminLogin';
import AdminMenubar from './AdminMenubar';
import AdminRouter from './AdminRouter';

export default function AdminBase() {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('auth-token');
    if (token) {
      setIsAdminLoggedIn(true);
    }
  }, []);

  const adminloginHandler = (authToken) => {
    localStorage.setItem('auth-token', authToken);
    setIsAdminLoggedIn(true);
  };

  const adminlogoutHandler = () => {
    localStorage.removeItem('auth-token');
    setIsAdminLoggedIn(false);
    console.log('Admin logged out');
  };

  return (
    <div id="admin-base">
      {isAdminLoggedIn ? (
        <>
          <AdminMenubar onLogout={adminlogoutHandler} />
          <div style={{ padding: '20px' }}>
            <AdminRouter />
          </div>
        </>
      ) : (
        <AdminLogin onLogin={adminloginHandler} />
      )}
    </div>
  );
}
























// import React, { useState } from 'react';
// import AdminLogin from './AdminLogin';
// import AdminMenubar from './AdminMenubar';
// import AdminRouter from './AdminRouter';

// export default function AdminBase() {
//   const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

//   const adminloginHandler = (authToken) => {
//     localStorage.setItem('auth-token', authToken);
//     setIsAdminLoggedIn(true);
//   };

//   const adminlogoutHandler = () => {
//     localStorage.removeItem('auth-token');
//     setIsAdminLoggedIn(false);
//     console.log('Admin logged out');
//   };

//   return (
//     <div id="admin-base">
//       {isAdminLoggedIn ? (
//         <>
//           <AdminMenubar onLogout={adminlogoutHandler} />
//           <div style={{ padding: '20px' }}>
//             <AdminRouter />
//           </div>
//         </>
//       ) : (
//         <AdminLogin onLogin={adminloginHandler} />
//       )}
//     </div>
//   );
// }





























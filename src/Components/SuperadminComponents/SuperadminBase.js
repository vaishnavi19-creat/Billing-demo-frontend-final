import React from 'react';
import Menubar from './Menubar';
import RouterPage from './RouterPage';

export default function SuperadminBase() {
  return (
    <div id="superadmin-base">
      {/* Menubar displayed at the top */}
      <Menubar />
      <RouterPage/>
      
      </div>
  );
}


































// import React from 'react';
// import Menubar from './Menubar';
// // import Router from './RouterPage';

// export default function SuperadminBase() {
//   return (
//     <div id="superadmin-base">
//       {/* Menubar displayed at the top */}
//       <Menubar />
      
//       {/* Main content of the page */}
//       <div style={{ padding: '20px' }}>
//         <RouterPage />
//       </div>
//     </div>
//   );
// }





import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SuperadminBase from './Components/SuperadminComponents/SuperadminBase';
import AdminBase from './Components/SuperadminComponents/Admin/AdminBase';

function App() {
  // You can conditionally render based on the role (superadmin/admin)
  const userRole = localStorage.getItem('user-role'); // Assume this is saved during login
  localStorage.setItem('user-role', 'admin');

  return (
    <BrowserRouter>
      <Routes>
        {userRole === 'superadmin' && <Route path="/*" element={<SuperadminBase />} />}
        {userRole === 'admin' && <Route path="/*" element={<AdminBase />} />}
      
      </Routes>
    </BrowserRouter>
  );
}

export default App;






















// import './App.css';
// import {BrowserRouter} from 'react-router-dom';
// import SuperadminBase from './Components/SuperadminComponents/SuperadminBase';


// function App() {

//   return (
//     <>
//     <BrowserRouter>
//       <SuperadminBase />
//     </BrowserRouter>
//     </>
//   );
// }

// export default App;

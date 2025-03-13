import React, { useState } from 'react';
import axios from 'axios'; // Import axios
import './AdminLogin.css';
import { FaUser, FaLock } from 'react-icons/fa';

function AdminLogin({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // const handleLogin = async () => {
  //   try {
  //     const response = await axios.post('http://localhost:3002/api/v1.0/login/login', {
  //       username,
  //       password,
  //     });

  //     if (response.data && response.data.token) {
  //       onLogin(response.data.token); // Pass the real token to the parent handler
  //       console.log('Login successful:', response.data);
  //     } else {
  //       setError('Invalid login response from server');
  //     }
  //   } catch (err) {
  //     setError('Login failed. Please check your credentials.');
  //     console.error('Login error:', err);
  //   }
  // };


  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:3002/api/v1.0/login/login', {
        username,
        password,
      });
  
      if (response.data && response.data.data && response.data.data.token) {
        const token = response.data.data.token; // Extract token correctly
        onLogin(token); // Pass the real token to the parent handler
        console.log('Login successful:', response.data);
      } else {
        setError('Invalid login response from server');
      }
    } catch (err) {
      setError('Login failed. Please check your credentials.');
      console.error('Login error:', err);
    }
  };  

  return (
    <div className="login-page">
      <div className="login-container">
        <h2 className="login-title">Admin Login</h2>
        <div className="login-form">
          <label>Username</label>
          <div className="input-container">
            <FaUser className="input-icon" />
            <input
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="login-input"
            />
          </div>

          <label>Password</label>
          <div className="input-container">
            <FaLock className="input-icon" />
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="login-input"
            />
          </div>

          {error && <p className="error-message">{error}</p>}

          <button onClick={handleLogin} className="login-button">
            LOGIN
          </button>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;





























// import React, { useState } from 'react';
// import './AdminLogin.css';
// import { FaUser, FaLock } from 'react-icons/fa';

// function AdminLogin({ onLogin }) {
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');

//   const handleLogin = () => {
//     // Simulate login success with dummy data
//     const dummyAuthToken = 'dummy-auth-token';
//     onLogin(dummyAuthToken); // Pass the dummy token to the parent handler
//     console.log('Login successful:', { username, password });
//   };

//   return (
//     <div className="login-page">
//       <div className="login-container">
//         <h2 className="login-title">Admin Login</h2>
//         <div className="login-form">
//           <label>Username</label>
//           <div className="input-container">
//             <FaUser className="input-icon" />
//             <input
//               type="text"
//               placeholder="Enter your username"
//               value={username}
//               onChange={(e) => setUsername(e.target.value)}
//               className="login-input"
//             />
//           </div>

//           <label>Password</label>
//           <div className="input-container">
//             <FaLock className="input-icon" />
//             <input
//               type="password"
//               placeholder="Enter your password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               className="login-input"
//             />
//           </div>

//           <button onClick={handleLogin} className="login-button">
//             LOGIN
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default AdminLogin;

















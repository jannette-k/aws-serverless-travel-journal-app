// src/App.js
import React, { useState } from "react";
import LoginPage from "./pages/LoginPage";
import DashboardLayout from "./layouts/DashboardLayout";
import { signOutUser } from "./auth";
import "./index.css";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("access_token") // stays logged in on refresh
  );

  return (
    <div className="app">
      {isLoggedIn ? (
        <DashboardLayout
          onLogout={() => {
            signOutUser();
            setIsLoggedIn(false);
          }}
        />
      ) : (
        <LoginPage onLogin={() => setIsLoggedIn(true)} />
      )}
    </div>
  );
};

export default App;


// import React, { useEffect, useState } from "react";
// import LoginPage from "./pages/LoginPage";
// import DashboardLayout from "./layouts/DashboardLayout";
// import "./index.css";

// const App = () => {
//   const [isLoggedIn, setIsLoggedIn] = useState(false);

//   useEffect(() => {
//     // 1️⃣ Handle redirect from Cognito
//     if (window.location.hash) {
//       const params = new URLSearchParams(
//         window.location.hash.replace("#", "")
//       );

//       const accessToken = params.get("access_token");

//       if (accessToken) {
//         localStorage.setItem("access_token", accessToken);
//         setIsLoggedIn(true);

//         // Clean URL
//         window.history.replaceState({}, document.title, "/");
//       }
//     }

//     // 2️⃣ Check existing login
//     const token = localStorage.getItem("access_token");
//     if (token) {
//       setIsLoggedIn(true);
//     }
//   }, []);

//   return (
//     <div className="app">
//       {isLoggedIn ? (
//         <DashboardLayout
//           onLogout={() => {
//             localStorage.removeItem("access_token");
//             setIsLoggedIn(false);
//           }}
//         />
//       ) : (
//         <LoginPage />
//       )}
//     </div>
//   );
// };

// export default App;

// import React, { useState } from "react";
// import LoginPage from "./pages/LoginPage";
// import DashboardLayout from "./layouts/DashboardLayout";
// import "./index.css";

// const App = () => {
//   const [isLoggedIn, setIsLoggedIn] = useState(false);

//   return (
//     <div className="app">
//       {isLoggedIn ? (
//         <DashboardLayout onLogout={() => setIsLoggedIn(false)} />
//       ) : (
//         <LoginPage onLogin={() => setIsLoggedIn(true)} />
//       )}
//     </div>
//   );
// };

// export default App;

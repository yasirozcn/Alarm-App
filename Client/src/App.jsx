/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import Check from './pages/Check';
import Alarm from './pages/Alarm';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Navbar from './components/navbar';

function App() {
  const [user, setUser] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true); // Auth yükleniyor durumu
  const [results, setResults] = useState({}); // Results state'i
  const [loading, setLoading] = useState(false); // Loading state'i

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoadingAuth(false); // Auth durumu yüklendiğinde loadingAuth'u false yap
    });
    return () => unsubscribe();
  }, []);

  if (loadingAuth) {
    return <h2>Loading...</h2>; // Auth durumu yüklenirken gösterilecek
  }

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            user ? (
              <div className="w-full">
                <Navbar />
                <h1>TCDD</h1>
                <Check setResults={setResults} setLoading={setLoading} />
                {loading ? <h2>Loading...</h2> : <Alarm results={results} />}
              </div>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    </Router>
  );
}

export default App;

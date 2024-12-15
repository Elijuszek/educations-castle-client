// src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { motion } from 'framer-motion';
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import Register from './components/Register';
import Login from './components/Login';
import ActivitiesList from './components/ActivitiesList';
import PackageList from './components/PackageList';
import OrganizersList from './components/OrganizersList';
import Admin from './components/Admin';
import Organizer from './components/Organizer';
import ActivityDetail from './components/ActivityDetail';
import UserProfile from './components/UserProfile';
import PopularActivities from './components/PopularActivities';
import CreatePackage from './components/CreatePackage';

function App() {
  const [showWelcome, setShowWelcome] = useState(true);

  useEffect(() => {
    const timer1 = setTimeout(() => {
      setShowWelcome(false);
    }, 5000); 
    return () => clearTimeout(timer1); // Cleanup the timer
  }, []);

  return (
    <div className="App flex flex-col min-h-screen">
      <Router>
        <NavBar />
        <main className="flex-grow p-6">
          <Routes>
            <Route
              path="/"
              element={
                <div>
                  {showWelcome ? (
                    <>
                      <motion.h1
                        className="text-4xl font-bold text-center my-8"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 2 }}
                      >
                        Welcome to the Education Castle
                      </motion.h1>
                      <motion.p
                        className="text-center text-2xl" // Increase font size
                        initial={{ opacity: 0, y: 50 }} // Start from further away
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 3, delay: 2 }} // Last longer
                      >
                        Explore the various activities and resources we offer.
                      </motion.p>
                    </>
                  ) : (
                    <PopularActivities />
                  )}
                </div>
              }
            />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/activities" element={<ActivitiesList />} />
            <Route path="/packages" element={<PackageList />} />
            <Route path="/organizers" element={<OrganizersList />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/organizer" element={<Organizer />} />
            <Route path="/activity/:id" element={<ActivityDetail />} />
            <Route path="/profile" element={<UserProfile />} />
            <Route path="/packages/create" element={<CreatePackage />} />
          </Routes>
        </main>
        <Footer />
      </Router>
      <ToastContainer position="top-center" autoClose={3000} />
    </div>
  );
}

export default App;
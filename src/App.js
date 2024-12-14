// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify'; // Import ToastContainer only here
import 'react-toastify/dist/ReactToastify.css';

import NavBar from './components/NavBar';
import Footer from './components/Footer';
import Register from './components/Register';
import Login from './components/Login';
import ActivitiesList from './components/ActivitiesList';
import OrganizersList from './components/OrganizersList';
import Admin from './components/Admin';
import Organizer from './components/Organizer';
import ActivityDetail from './components/ActivityDetail';
import UserProfile from './components/UserProfile';
function App() {
  return (
    <div className="App flex flex-col min-h-screen">
      <Router>
        <NavBar />
        <main className="flex-grow p-6">
          <Routes>
            <Route path="/" element={
              <div>
                <h1 className="text-4xl font-bold text-center my-8">
                  Welcome to the Education Castle
                </h1>
                <p className="text-center text-xl">
                  Explore the various activities and resources we offer.
                </p>
              </div>
            } />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/activities" element={<ActivitiesList />} />
            <Route path="/organizers" element={<OrganizersList />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/organizer" element={<Organizer />} />
            <Route path="/activity/:id" element={<ActivityDetail />} />
            <Route path="/profile" element={<UserProfile />} />
          </Routes>
        </main>
        <Footer />
      </Router>
      <ToastContainer position="top-center" autoClose={3000} /> {/* Keep ToastContainer here */}
    </div>
  );
}

export default App;
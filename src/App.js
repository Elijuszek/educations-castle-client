// src/App.js

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import Register from './components/Register';

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
          </Routes>
        </main>
        <Footer />
      </Router>
    </div>
  );
}

export default App;
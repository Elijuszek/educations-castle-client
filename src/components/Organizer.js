import React from 'react';
import { Link } from 'react-router-dom';

function Organizer() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center my-4">Organizer panel</h1>
      <div className="flex justify-center space-x-4">
        <Link to="/list-activities">
          <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded shadow-md transition duration-300">
            List All Activities
          </button>
        </Link>
      </div>
    </div>
  );
}

export default Organizer;
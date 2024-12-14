import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import defaultImage from '../res/images/default.jpg';
import '../styles/PackageList.css';

const PackagesList = () => {
  const [packages, setPackages] = useState([]);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await axios.get('https://educations-castle-sunch.ondigitalocean.app/api/v1/packages');
        setPackages(response.data);
      } catch (error) {
        console.error('Error fetching packages:', error);
      }
    };

    fetchPackages();
  }, []);

  return (
    <div id="packages-container" className="packages-container">
      <h1 className="text-3xl font-extrabold mb-6 text-center">Packages</h1>

      <div className="packages-grid">
        {packages.map((packageItem) => (
          <Link
            to={`/package/${packageItem.id}`}
            key={packageItem.id}
            className="package-link"
          >
            <div className="package-card">
              <div className="image-container">
                <img src={defaultImage} alt="Package" className="package-image" />
              </div>
              <div className="package-content">
                <h2 className="text-xl font-semibold mb-2">{packageItem.name}</h2>
                <p className="text-gray-600 mb-2">{packageItem.description}</p>
                <p className="text-gray-800 font-medium mb-2">Price: {packageItem.price}€</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default PackagesList;
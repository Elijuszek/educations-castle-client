import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getUserID } from '../utils/Auth';
import DeleteConfirmationModal from './Modal';

function Organizer() {
  const [packages, setPackages] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [packageToDelete, setPackageToDelete] = useState(null);
  const [packageNameToDelete, setPackageNameToDelete] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const userId = getUserID();
        if (!userId) {
          console.error('User ID could not be retrieved.');
          return;
        }

        const response = await axios.get(`https://educations-castle-sunch.ondigitalocean.app/api/v1/organizer/${userId}/packages`);
        setPackages(response.data);
      } catch (error) {
        console.error('Error fetching packages:', error);
      }
    };

    fetchPackages();
  }, []);

  const handleAddPackage = () => {
    navigate('/packages/create');
  };

  const handleEditPackage = (packageId) => {
    navigate(`/package/update/${packageId}`);
  };

  const openDeleteModal = (packageId, packageName) => {
    setPackageToDelete(packageId);
    setPackageNameToDelete(packageName);
    setIsModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsModalOpen(false);
    setPackageToDelete(null);
    setPackageNameToDelete('');
  };

  const confirmDeletePackage = async () => {
    if (!packageToDelete) return;

    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      console.error('Access token could not be retrieved.');
      return;
    }

    try {
      const response = await axios.delete(
        `https://educations-castle-sunch.ondigitalocean.app/api/v1/packages/delete/${packageToDelete}`,
        {
          headers: {
            Authorization: accessToken,
          },
        }
      );

      if (response.status === 202) {
        setPackages(packages.filter(pkg => pkg.id !== packageToDelete));
        toast.success('Package deleted successfully');
      } else {
        toast.error('Unexpected response while deleting package');
      }

    } catch (error) {
      console.error('Error deleting package:', error);
      toast.error(`Error deleting package: ${error.message}`);
    } finally {
      closeDeleteModal();
    }
  };

  return (
    <div className="container mx-auto p-4">
      <ToastContainer position="top-center" />
      <h1 className="text-3xl font-bold text-center my-4">Organizer Panel</h1>
  
      {/* Common container for alignment */}
      <div className="flex flex-col items-start mb-4">
        <button
          onClick={handleAddPackage}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded shadow-md transition duration-300 mb-4"
        >
          Add New Package
        </button>
  
        {packages.length > 0 ? (
          <table className="min-w-full bg-white shadow-md rounded mb-4">
            <thead>
              <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-left">Name</th>
                <th className="py-3 px-6 text-left">Description</th>
                <th className="py-3 px-6 text-left">Price</th>
                <th className="py-3 px-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm font-light">
              {packages.map((packageItem) => (
                <tr key={packageItem.id} className="border-b border-gray-200 hover:bg-gray-100">
                  <td className="py-3 px-6 text-left whitespace-nowrap">{packageItem.name}</td>
                  <td className="py-3 px-6 text-left">{packageItem.description}</td>
                  <td className="py-3 px-6 text-left">{packageItem.price}€</td>
                  <td className="py-3 px-6 text-center">
                    <div className="flex item-center justify-center space-x-2">
                      <button
                        onClick={() => handleEditPackage(packageItem.id)}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => openDeleteModal(packageItem.id, packageItem.name)}
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-center text-gray-600">No packages available.</p>
        )}
      </div>
  
      <DeleteConfirmationModal
        isOpen={isModalOpen}
        onRequestClose={closeDeleteModal}
        onConfirmDelete={confirmDeletePackage}
        packageName={packageNameToDelete}
      />
    </div>
  );
}

export default Organizer;
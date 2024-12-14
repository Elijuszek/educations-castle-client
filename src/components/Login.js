import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { saveTokens } from '../utils/Auth';
import { toast } from 'react-toastify';

function Login() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Check and show notification if set in local storage
    const notification = localStorage.getItem('notification');
    if (notification) {
      toast.success(notification);
      localStorage.removeItem('notification'); 
    }
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('https://educations-castle-sunch.ondigitalocean.app/api/v1/users/login', formData);

      if (response.status === 200) {
        const responseData = response.data;
        saveTokens(responseData.access_token, responseData.refresh_token);
        navigate('/activities'); // Redirect to /activities
      } else {
        setMessage(`Login failed: ${response.data.message}`);
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 400) {
          setMessage(`Error: ${error.response.data.error}`);
        } else {
          setMessage(`Login failed: ${error.response.data.message}`);
        }
      } else {
        setMessage(`Login failed: ${error.message}`);
      }
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded shadow-md">
      <h2 className="text-2xl font-bold mb-4">Login</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Username</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded">
          Login
        </button>
      </form>
      {message && <p className="mt-4 text-center text-red-600">{message}</p>}
    </div>
  );
}

export default Login;
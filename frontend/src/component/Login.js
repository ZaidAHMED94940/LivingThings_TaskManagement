import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

function Login() {
  const navigate = useNavigate();

  // Use one state for all form data
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    showPassword: false,
    error: ''
  });

  const handleLogin = async (event) => {
    event.preventDefault();
    setFormData(prevState => ({ ...prevState, error: '' })); // Reset error

    // Prepare data as a JSON object
    const dataToSend = {
      username: formData.username,
      password: formData.password
    };

    try {
      const response = await axios.post(
        'http://localhost:5000/api/v1/user/login',
        dataToSend, // Send data as JSON
        {
          headers: {
            'Content-Type': 'application/json', // Set the content type to application/json
          },
        }
      );

      const authtoken = response.data.token;
      localStorage.setItem('authtoken', authtoken);
      localStorage.setItem('username', formData.username); // Store username
      navigate('/TodoList');
    } catch (error) {
      // Handle errors and display the error message in the alert
      if (error.response) {
        // Server responded with a status code outside of the 2xx range
        alert(`Error: ${error.response.data.message || error.response.data}`);
      } else if (error.request) {
        // Request was made, but no response was received
        alert('No response received from the server.');
      } else {
        // Some other error occurred while setting up the request
        alert(`Error: ${error.message}`);
      }

      console.log('Error in Form Submission', error);
    }
  };

  const togglePasswordVisibility = () => {
    setFormData(prevState => ({
      ...prevState,
      showPassword: !prevState.showPassword
    }));
  };

  const handleRegister = () => {
    navigate('/Register');
  };

  return (
    <div className='bg-black min-h-screen flex items-center justify-center'>
      <div className='bg-gray-900 p-8 rounded-lg shadow-lg max-w-md w-full sm:w-96'>
        <h1 className='text-3xl text-center mb-8 text-yellow-500'>Sign In</h1>
        {formData.error && <div className="text-red-500 text-center mb-4">{formData.error}</div>}
        <form className='space-y-4' onSubmit={handleLogin}>
          {/* Username Input */}
          <div>
            <input
              type='text'
              id='username'
              name='username'
              value={formData.username}
              onChange={(e) =>
                setFormData(prevState => ({ ...prevState, username: e.target.value }))
              }
              className='w-full px-3 py-2 border border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 text-white bg-gray-800'
              placeholder='Enter your Username'
              required
            />
          </div>

          {/* Password Input with Visibility Toggle */}
          <div className="relative">
            <input
              type={formData.showPassword ? 'text' : 'password'}
              id='password'
              name='password'
              value={formData.password}
              onChange={(e) =>
                setFormData(prevState => ({ ...prevState, password: e.target.value }))
              }
              className='w-full px-3 py-2 border border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 text-white bg-gray-800'
              placeholder='Enter your password'
              required
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
            >
              <FontAwesomeIcon icon={formData.showPassword ? faEyeSlash : faEye} className="text-yellow-500" />
            </button>
          </div>

          {/* Sign In Button */}
          <div className='flex justify-center'>
            <button
              type='submit'
              className='py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-black bg-yellow-500 hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-400'
            >
              Sign In
            </button>
          </div>
        </form>

        {/* Register Link */}
        <div className='flex justify-center mt-4'>
          <button className='text-center text-yellow-500 underline' onClick={handleRegister}>
            Not a User? Register
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;

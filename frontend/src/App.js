import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Login from './component/Login';
import Register from './component/Register';
import TodoList from './component/TodoList';

// Axios Instance
const axiosInstance = axios.create({
  baseURL: `${process.env.REACT_APP_BACKEND_DJANGO_API}`, // Replace with your API base URL
});

// Axios Interceptor
const setupAxiosInterceptors = (navigate) => {
  axiosInstance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('authtoken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response && error.response.status === 401) {
        // If token is invalid or expired
        localStorage.removeItem('authtoken'); // Clear the token
        navigate('/'); // Redirect to login
      }
      return Promise.reject(error);
    }
  );
};

// ProtectedRoute Component
const ProtectedRoute = ({ element }) => {
  const navigate = useNavigate();
  const isAuthenticated = !!localStorage.getItem('authtoken');

  useEffect(() => {
    setupAxiosInterceptors(navigate); // Setup Axios interceptors with navigation
  }, [navigate]);

  return isAuthenticated ? element : <Navigate to="/" replace />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/Register" element={<Register />} />
        <Route 
          path="/TodoList" 
          element={<ProtectedRoute element={<TodoList />} />} 
        />
      </Routes>
    </Router>
  );
}

export default App;

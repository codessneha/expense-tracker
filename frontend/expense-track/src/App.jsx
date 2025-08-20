import React from 'react';
import './App.css';
import { UserProvider } from './context/userContext';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from 'react-router-dom';

import Login from './pages/auth/login';
import SignUp from './pages/auth/signup';
import Home from './pages/dashboard/home';
import Income from './pages/dashboard/income';
import Expense from './pages/dashboard/expense';
import { Toaster } from 'react-hot-toast';
import { ToastContainer } from 'react-toastify';

const Root = () => {
  const isAuthenticated = !!localStorage.getItem('token');
  return isAuthenticated ? (
    <Navigate to="/dashboard" />
  ) : (
    <Navigate to="/login" />
  );
};

const App = () => {
  return (
    <UserProvider>
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<Root />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/dashboard" element={<Home />} />
          <Route path="/income" element={<Income />} />
          <Route path="/expense" element={<Expense />} />
        </Routes>
      </Router>
    </div>
    <Toaster
    toastOptions={{
      className:"bg-white text-black",
      style:{
        fontSize:"14px"
      }
    }}
    />
    </UserProvider>
  );
};

export default App;

// src/Routes.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login/Login';
import Chat from './components/Chat/Chat';
import Users from './components/Users/Users';

const AppRoutes = () => (
  <Router>
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/chat" element={<Chat />} />
      <Route path="users" element={<Users />} />
    </Routes>
  </Router>
);

export default AppRoutes;

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from './Context/Themecontext';
import { AuthProvider } from './Context/AuthContext';
import { DataProvider } from './Context/DataContext';
import './index.css';
import App from './App';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
  <DataProvider>
  <ThemeProvider>
    <AuthProvider>
    <App />
    </AuthProvider>
  </ThemeProvider>
  </DataProvider>
  </BrowserRouter>
);



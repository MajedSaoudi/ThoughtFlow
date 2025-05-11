import React, { createContext, useState, useEffect } from 'react';

// Create Theme Context
export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light'); // Default to light mode

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    } else {
      // Optional: Respect system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const defaultTheme = prefersDark ? 'dark' : 'light';
      setTheme(defaultTheme);
      document.documentElement.classList.toggle('dark', defaultTheme === 'dark');
      localStorage.setItem('theme', defaultTheme);
    }
  }, []);

  // Function to toggle theme
  const toggleTheme = () => {
    setTheme((prevTheme) => {
      const newTheme = prevTheme === 'light' ? 'dark' : 'light';
     
      document.documentElement.classList.remove('dark'); 
      if (newTheme === 'dark') {
        document.documentElement.classList.add('dark');
      }
      localStorage.setItem('theme', newTheme);
   
      return newTheme;
    });
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }} key={theme}>
      {children}
    </ThemeContext.Provider>
  );
};
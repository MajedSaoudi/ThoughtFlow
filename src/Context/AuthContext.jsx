import React, { createContext, useState, useEffect } from 'react';
import { auth } from '../Configs/firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
     
      setLoading(false);
    },(error) => {
      console.error('Auth state error:', error);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={ user}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
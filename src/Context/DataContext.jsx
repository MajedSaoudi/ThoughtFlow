import { createContext, useContext, useState, useEffect } from 'react';
import { ref, get, onValue, off } from 'firebase/database';
import { database } from '../Configs/firebaseConfig'; 


const DataContext = createContext();


export const DataProvider = ({ children }) => {
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const DatabaseUrl = process.env.REACT_APP_FIREBASE_DATABASEURL;

async function fetchPosts() {
    try {
      const response = await fetch(`${DatabaseUrl}/posts.json`);
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error: ${response.status}, ${errorText}`);
      }
      const data = await response.json();
      if (data) {
        const postsArray = Object.values(data);
        
        setPosts(postsArray)
      } else {
    
      }

    } catch (error) {
      console.error('Fetch error:', error);
    }
  }

  async function fetchUsers() {
    try {
      const response = await fetch(`${DatabaseUrl}/users.json`);
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error: ${response.status}, ${errorText}`);
      }
      const data = await response.json();
      if (data) {
        const usersArray = Object.values(data);

        setUsers(usersArray)
      } else {
       
      }

    } catch (error) {
      console.error('Fetch error:', error);
    }
  }

  useEffect(() => {
    fetchPosts();
    fetchUsers()

  }, []);




  return (
    <DataContext.Provider
      value={{
        posts,
        setPosts,
        users,
        setUsers,
        loading,
        setLoading,
        error,
        setError,
        fetchPosts,
        fetchUsers,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};


export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

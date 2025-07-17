import './App.css';
import Login from './Pages/Login';
import Home from './Pages/Home';
import Signup from './Pages/Signup';
import './Configs/firebaseConfig';
import { Navigate, Route,Routes, useLocation } from 'react-router-dom';
import Navbar from './Components/Navbar';
import Blog from './Pages/Blog';
import CreateBlog from './Pages/CreateBlog';
import BlogPost from './Pages/BlogPost';
import Profile from './Pages/Profile';
import MobileSearch from './Pages/MobileSearch';
import Notification from './Pages/Notification';
import NotFound from './Pages/NotFound';
import { useEffect } from 'react';

function App() {

   const Location = useLocation();

   if(Location){
    window.scrollTo(0,0);
   
      
    
   }

   if(!Location){
    <Navigate to='/404' />
   }
   
  
    return (
      <div>
        <Navbar />
      <Routes>
        <Route element={<Home />} path='/' />
        <Route element={<Login />} path='/Login' />
        <Route element={<Signup />} path='/Signup' />
        <Route element={<Blog />} path='/Blogs' />
        <Route element={<CreateBlog/>} path='/CreateBlog/:PostToken' />
        <Route element={<BlogPost />} path='/Blogs/:PostToken' />
        <Route element={<Profile/>} path='/Profile/:UserUid' />
        <Route element={<MobileSearch/>} path='/Search' />
        <Route element={<Notification/>} path='/Notifications' />
        <Route element={<NotFound />} path='/404' />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
      </div>
    );
  
  
}

export default App;

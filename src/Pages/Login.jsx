import React, { useContext, useState } from 'react'
import Google from '../Assets/images/Google.webp';
import {AuthContext} from '../Context/AuthContext';
import { auth, googleProvider, syncUserWithImage } from '../Configs/firebaseConfig';
import { signInWithPopup, signInWithEmailAndPassword } from 'firebase/auth';
import { Link, useNavigate } from 'react-router-dom';
import { ThemeContext } from '../Context/Themecontext';
import { set } from 'firebase/database';
function Login() {
  const [email, setEmail] = useState('');
  const theme = useContext(ThemeContext);
  const [password, setPassword] = useState('');
 
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const user = useContext(AuthContext);

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      await syncUserWithImage(user, user.displayName, null);
  
      navigate('/Blogs'); 
    } catch (error) {
      setError(error.message);
      console.error('Google Sign-In error:', error);
    }
  };

  

 
  const handleSignin = async (e) =>{
    e.preventDefault();

    try {
      const result = await signInWithEmailAndPassword(auth,email,password);
      const user = result.user;
      await syncUserWithImage(user, user.displayName || email.split("@")[0], null);
      setEmail("");
      setPassword("");
      navigate('/')
    } catch (error) {
      setError(error.message);
      
    }
  } 



  return (
    <div className='flex  min-h-screen w-full justify-center text-center items-center dark:bg-black'>
      {!user?
      <div className='flex justify-center w-[500px] mt-[85px]'>
        <div className='p-6'>
          <div className='flex justify-center'>
            <div className='w-fit mb-6'>
              <h1 className='text-2xl mb-2 dark:text-white'>Login</h1>
              <hr className='border border-black dark:border-white' />
            </div>         
          </div>
          <div className='flex gap-2 justify-center mb-6'>
          <div onClick={handleGoogleSignIn}>
              <button type="button" class="">
                <span class="flex p-2 border border-black rounded-lg  dark:text-white dark:border-white">
                  <img src={Google} className='h-6 w-6'/>
                Log in with Google
              </span></button>
            </div>
           
            </div> 
          <p className='mb-4 text-base lg:text-xl md:text-xl sm:text-xl dark:text-white'>Welcome back to ThoughtFlow! Login to access the website </p>
          <form action="" onSubmit={handleSignin}>
            <input type="email" name="" id="" className='w-full border-b-2 mb-4 mt-4 pb-3 dark:bg-black dark:text-white' placeholder='Email' onChange={(e)=>setEmail(e.target.value)} value={email}/>
            <input type="password"  name="" id="" className='w-full border-b-2 pb-3 dark:bg-black dark:text-white' placeholder='Password' onChange={(e)=>setPassword(e.target.value)} value={password}/>
            <div className='text-end text-gray-500 '>
            <b className='text-sm'>Forgot Password?</b>
            </div>
            <button className='mt-6 pr-6 pl-6 p-2 rounded-lg bg-black text-white dark:border-white dark:border' type='submit'>Log in</button>
            {<p>{error}</p>}
          </form>
          
       
          <div className='flex justify-center gap-2 mt-6 items-center'>
            <b className='text-[16px] text-gray-500 flex gap-2'>
              New Thoughtflower ? 
            
            <Link to={"/Signup"} className='  border-b-2 text-gray-600 border-b-gray-600'>Create Account</Link>
            </b>
          </div>
        </div>
      </div>
    : <h1 className='dark:text-white'>You are already logged in </h1>}
   
      
    </div>
  )
}

export default Login
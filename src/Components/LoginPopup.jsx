import React,{useState,useContext} from 'react'
import Google from '../Assets/images/Google.webp';
import {AuthContext} from '../Context/AuthContext';
import { auth, googleProvider } from '../Configs/firebaseConfig';
import { signInWithPopup, signInWithEmailAndPassword } from 'firebase/auth';
import { Link, useNavigate } from 'react-router-dom';
import './LoginPopup.css';
import { ThemeContext } from '../Context/Themecontext';
function LoginPopup({ className, onClose }) {
      const navigate = useNavigate();
      const [error, setError] = useState(null);
      const user = useContext(AuthContext);
      const { theme, toggleTheme } = useContext(ThemeContext);
     
      const handleGoogleSignIn = async () => {
        try {
          const result = await signInWithPopup(auth, googleProvider);
          const user = result.user;
          console.log('Google Sign-In successful:', user);
          navigate('/'); 
        } catch (error) {
          setError(error.message);
          console.error('Google Sign-In error:', error);
        }
      };
  return (
  
        <div className='LoginPopup-card relative flex items-center rounded-lg bg-white text-black dark:bg-[#2D2D2D]'>
          <div className='absolute top-2 right-2 cursor-pointer' onClick={onClose}>
          <svg xmlns="http://www.w3.org/2000/svg"  width="24" height="24"   viewBox="0 0 24 24" ><path stroke="currentColor" stroke-linecap="round"  d="m5 5 7 7m7 7-7-7m0 0 7-7m-7 7-7 7" className='dark:fill-white'></path></svg>
          </div>
          <div>
            <div className=' flex justify-center mb-4'>
            <div className='dark:text-white text-black  w-max'>           
            <h1 className='text-2xl'>Login</h1>
            <hr className='border border-black dark:border-white ' />
            </div>
            </div>
            <div onClick={handleGoogleSignIn} className='flex justify-center'>
            <button type="button" class="">
                <span class="flex p-2 border border-black rounded-lg dark:text-white dark:border-white">
                  <img src={Google} className='h-6 w-6'/>
                Log in with Google
              </span></button>
            </div>
            <form action="">
            <input type="email" name="" id="" className='w-full border-b-2 mb-4 mt-4 pb-3 dark:bg-transparent dark:text-white' placeholder='Username' />
            <input type="password" name="" id="" className='w-full border-b-2 pb-3 dark:bg-transparent dark:text-white' placeholder='Password' />
          </form>
         
          <div className='flex justify-center'>
          <button className='mt-6 pr-6 pl-6 p-2 rounded-lg bg-black text-white dark:border-white dark:border '>Log in</button>
          </div>
           <div className='flex justify-center gap-2 mt-6 items-center'>
                      <b className='text-[16px] text-gray-500 flex gap-2'>
                        New Thoughtflower ? 
                      <Link to={"/Signup"} className='  border-b-2 text-gray-600 border-b-gray-600'>Create Account</Link>
                      </b>
                    </div>
          </div>
        </div>
   
  )
}

export default LoginPopup
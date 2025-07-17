import React,{useState,useEffect, useContext} from 'react'
import './Home.css';
import starttoread from '../Assets/images/starttoread.svg';
import People from '../Assets/images/people.png';
import Homeimg from '../Assets/images/Home_img.jpg';

import { auth } from '../Configs/firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import {AuthContext} from '../Context/AuthContext';

import LoginPopup from '../Components/LoginPopup';
import { Link } from 'react-router-dom';
import Loader from '../Components/Loader';
function Home() {
  
  const user = useContext(AuthContext);
  const [isloading,setIsLoading] = useState(true)
  const [showpopup,setShowPopup] = useState(false)
  

useEffect(()=>{
  setTimeout(()=>{
    setShowPopup(true)
  },5000)
  
  const handleLoad = () => {
    setTimeout(()=>{
      setIsLoading(false);
    },1000)
    };

    if (document.readyState === 'complete') {
        setTimeout(()=>{
        setIsLoading(false);
        },1000)
    } else {
      window.addEventListener('load', handleLoad);
      
      return () => window.removeEventListener('load', handleLoad);
    }

},[])
 
  
 
  return (
    <>
    {isloading? <Loader /> : 
    <>
    {!user&&showpopup? 
    <div className='Popup-Page absolute h-screen w-[100vw] flex items-center justify-center'>
      
      <LoginPopup onClose={() => setShowPopup(false)}/>
    </div>
    : ''}
    <div className='flex justify-center   min-h-screen dark:bg-[#121212] '>
    
      <div className='Home-container flex justify-between  w-[1500px] pl-4 pr-4 lg:mt-[160px] md:mt-[120px] sm:mt-[110px] mt-[85px]'>
    <div className='text-container w-[600px]'>
      <div className='w-[100%] sm:w-[100%] md:[100%] lg:w-[80%]'>   
      <h1 className='font-[Archivo] lg:text-[70px]    font-[700] text-[#171A1FFF] dark:text-white'>SHARE TO OTHERS, LEARN FROM OTHERS </h1>
      
    </div>
    <hr className='border-[1px] border-black dark:border-white'/>
    <div className='flex items-center gap-6 mt-4'>
      <img src={People} className='lg:h-20   sm:h-14 md:h-16 h-14 ' alt='users pictures'/>
      <h2 className='font-[Inter] text-[20px] text-gray-700 font-[600] dark:text-gray-500'>JOIN OUR COMMUNITY OF AUTHORS AND READERS!</h2>
    </div>
     <div className='flex gap-6 mt-4 Home-btns'>
      <Link className='Read-btn dark:bg-slate-600 dark:text-white' to='/Blogs'><button >Start to read<img src={starttoread} className='w-6 max-h-7'/> </button></Link>
      <Link to={"/Signup"}><button className='rounded-lg pr-6 p-6 border border-black dark:border-white dark:text-white'>Become an author</button></Link>
     </div>
    </div>
    <div className='Image-container w-[500px]'>
      <div className='w-full mb-2'>
      <img src={Homeimg} className='home-img w-[100%] h-[450px]  object-cover object-top' style={{borderRadius: '16px 0px 16px 0px'}}/>
      </div>
      <div className='home-text-container flex gap-4 text-center'>
        <div className=' border border-[#dbdbdb] dark:bg-[#2b2b2b] dark:border-none dark:text-[#f0f0f0] p-4' style={{borderRadius: '0px 0px 16px 0px'}}>
        <h1 className='lg:text-xl'>"It's not just about passive consumption it's about actively engaging with others who share my passion for learning."</h1>
        </div>
      </div>
      <div>

      </div>
    </div>
    </div>
    </div>
    </>
    }
    </>
  )
}

export default Home
import React, { useContext, useState } from 'react'
import Google from '../Assets/images/Google.webp';
import { auth, googleProvider,syncUserWithImage  } from '../Configs/firebaseConfig';
import { signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile} from 'firebase/auth';
import { Link, useNavigate } from 'react-router-dom';
import {AuthContext} from '../Context/AuthContext';
function Signup() {
  const [error, setError] = useState(null);
  const [username,setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordrepeat,setPasswordRepeat] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();
  const user = useContext(AuthContext);
 const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      navigate('/'); 
    } catch (error) {
      setError(error.message);
      console.error('Google Sign-In error:', error);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
  
    if (password === passwordrepeat) {
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        await updateProfile(user, {
          displayName: username,
        });
        await syncUserWithImage(user, user.displayName || email.split("@")[0], null);
        setSuccess(`Signed up as ${userCredential.user.email}`);
        setEmail("");
        setPassword("");
        setPasswordRepeat("");
        navigate('/'); 
      } catch (err) {
        setError(err.message);
      }
    } else {
      setError("Passwords do not match.");
      setPassword("");
      setPasswordRepeat("");
    }
  };


  
  return (
    <div className='flex  min-h-screen w-full justify-center text-center items-center dark:bg-black dark:text-white '>
      {!user? 
    <div className='flex justify-center w-[500px] mt-[85px]'>
      <div className='p-6'>
        <div className='flex justify-center'>
          <div className='w-fit mb-6'>
            <h1 className='text-2xl mb-2'>Signup</h1>
            <hr className='border border-black' />
          </div>         
        </div>
        <div className='flex gap-2 justify-center mb-6' onClick={handleGoogleSignIn}>
        <div >
            <button type="button" class="">
              <span class="flex p-2 border border-black rounded-lg dark:border-white">
                <img src={Google} className='h-6 w-6'/>
              Sign up with Google
            </span></button>
          </div>
         
          </div> 
        <p className='mb-4 text-base lg:text-xl md:text-xl sm:text-xl'>Welcome  to ThoughtFlow! Create an account to access the website </p>
        <form action="" onSubmit={handleSignUp}>
          <input type="username" name="" id="" className='w-full border-b-2 mb-4 mt-4 pb-3 dark:bg-black ' placeholder='Username' value={username} onChange={(e)=>setUsername(e.target.value)}/>
          <input type="email" name="" id="" className='w-full border-b-2 mb-4  pb-3 dark:bg-black' placeholder='email'  value={email}
        onChange={(e) => setEmail(e.target.value)}/>
          <input type="password" name="" id="" className='w-full border-b-2 pb-3 mb-4 dark:bg-black' placeholder='Password'  value={password}
        onChange={(e) => setPassword(e.target.value)}/>
          <input type="password" name="" id="" className='w-full border-b-2 pb-3 dark:bg-black' placeholder='Repeat Password'  value={passwordrepeat}
        onChange={(e) => setPasswordRepeat(e.target.value)}/>
          <button type='Submit' className='mt-6 pr-6 pl-6 p-2 rounded-lg bg-black text-white dark:border dark:border-white'>Sign up</button>
          {error && <p style={{ color: "red" }}>{error}</p>}
          {success && <p style={{ color: "green" }}>{success}</p>}
        </form>
      
       
        <div className='flex justify-center gap-2 mt-6 items-center'>
                    <b className='text-[16px] text-gray-500 flex gap-2'>
                      Old Thoughtflower ? 
                    
                    <Link to={"/Login"} className='  border-b-2 text-gray-600 border-b-gray-600'>Log in</Link>
                    </b>
                  </div>
      </div>
    </div>
  : <h1>You Are alreay Logged in </h1>}
 
    
  </div>
  )
}

export default Signup
import React from 'react'
import MobileWhiteLogo from '../Assets/images/mobilewhitelogo.png';
import MobileBlackLogo from '../Assets/images/mobileblacklogo.png';
function Loader() {
  return (
    <div className='z-50 fixed top-0 h-screen w-full flex justify-center bg-white items-center dark:bg-[#121212]'>
      <div>
        <img src={MobileBlackLogo} className='h-12 dark:hidden ' />
        <img src={MobileWhiteLogo} className='h-12 dark:flex hidden ' />
      </div>
    </div>
  )
}

export default Loader
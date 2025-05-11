import React from 'react'

function Notification() {
  
  return (
    
       <div className='flex justify-center dark:bg-[#121212] min-h-screen dark:text-white'>  
       <div className='lg:p-4 md:p-2 sm:p-2 p-4  w-[100%] mt-[100px] lg:w-[660px] '>
        <h1 className='lg:text-2xl md:text-xl sm:text-xl dark:text-white text-xl'>Notifications</h1>
        <hr className='border-[#F2F2F2] dark:border-gray-600 mt-4 mb-5'/>
        <strong >No Notification Yet</strong>
        </div>
        
    </div>
  )
}

export default Notification
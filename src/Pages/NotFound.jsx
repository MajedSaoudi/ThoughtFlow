import { Link } from 'react-router-dom';

const NotFound = () => {
 
  return (
    <div className='dark:bg-[#121212] dark:text-white text-center justify-center h-[100vh] flex items-center'>
        <div className='p-2'>
      <h1 className='text-7xl mb-4'>404</h1>
      <p className='text-3xl text-gray-600 mb-3'>Oops, this Page Not Found!</p>
      <b className='text-gray-300  text-xl'>the link might be corrupted</b>
      
      <p className='dark:text-white mb-4 text-xs' >or the page may have been removed</p>
     
      <Link to="/" className='mt-6 p-2 bg-black dark:bg-white text-white dark:text-black'>Back to Home</Link>
      </div>
    </div>
  );
};

export default NotFound;
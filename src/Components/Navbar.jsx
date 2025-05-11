import { ThemeContext } from '../Context/Themecontext';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';
import React, { useState, useEffect, useContext } from 'react';
import { auth } from '../Configs/firebaseConfig';
import downarrow from '../Assets/images/down-arrow.svg';
import ProfileHolder from '../Assets/images/ProfileHolder.jpg';
import uparrow from '../Assets/images/up-arrow.svg';
import Profile from '../Assets/images/profile.png';

import settings from '../Assets/images/setting.png';
import Logout from '../Assets/images/logoutt.png';
import Display from '../Assets/images/display-mode-removebg-preview.png';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { AuthContext } from '../Context/AuthContext';
import { useData } from '../Context/DataContext';
import MobileWhiteLogo from '../Assets/images/mobilewhitelogo.png';
import MobileBlackLogo from '../Assets/images/mobileblacklogo.png';
function Navbar() {
  const  user = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { users, posts } = useData();
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [ProfileOpened, setProfileOpened] = useState(false);
  const [search, setSearch] = useState('');
  
  



const generateToken = () => {

    
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
      (c ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))).toString(16)
    );
  
};

  const Token = generateToken();

  const handleLogout = async () => {
    
    try {
      await signOut(auth);
      
      setError(null);
      setProfileOpened(false);
      
      navigate('/Login');
      
    } catch (error) {
      setError(error.message);
      console.error('Logout error:', error);
    } finally {
     
    }
  };

  const SearchedPeople = users.filter((user) =>
    user.username
      .toLowerCase()
      .replace(/\s+/g, '')
      .trim()
      .includes(search.toLowerCase().trim().replace(/\s+/g, ''))
  );

  const SearchedPublications = posts?.filter((post) =>
    post?.Title?.toLowerCase()
      .replace(/\s+/g, '')
      .trim()
      .includes(search.toLowerCase().trim().replace(/\s+/g, ''))
  );


  return (
    <div className=''>
      <div className=" fixed top-0 flex justify-center z-40  dark:bg-[#2D2D2D] w-full border-b border-b-[#F2F2F2] dark:border-none dark:text-white">
        <div className="Navbar flex items-center justify-between lg:w-[1500px] w-full text-black bg-white  p-4 dark:bg-[#2D2D2D] md:w-[100%] sm:w-[100%]">
          <div className="flex gap-6 items-center">
            <Link to={user ? '/Blogs' : '/'}>
              <img src={MobileBlackLogo} className='h-10 dark:hidden ' />
              <img src={MobileWhiteLogo} className='h-10 dark:flex hidden ' />

            </Link>
            {!user ?

              <ul className="Links flex gap-4 text-black dark:text-gray-300">
                <Link to="/">
                  <li>Home</li>
                </Link>
                <Link to={'/Blogs'}>
                  <li>Blogs</li>
                </Link>
              
              </ul>
              :
              <div >
                <div className='search-container flex items-center h-[40px] bg-[#F9F9F9] rounded-3xl pl-3 pr-3 p-2 dark:bg-[#2D2D2D] dark:border dark:border-gray-500 dark:text-white'>
                  
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" className='search-svg '><path fill="currentColor" className='dark:fill-white' fill-rule="evenodd" d="M4.092 11.06a6.95 6.95 0 1 1 13.9 0 6.95 6.95 0 0 1-13.9 0m6.95-8.05a8.05 8.05 0 1 0 5.13 14.26l3.75 3.75a.56.56 0 1 0 .79-.79l-3.73-3.73A8.05 8.05 0 0 0 11.042 3z" clip-rule="evenodd"></path></svg>
                  
                  <input type='text' className='search-input outline-none bg-[#F9F9F9] dark:bg-transparent ml-1 ' placeholder='Search' value={search} onChange={(e) => setSearch(e.target.value)} />
                  {search !== '' && (
                    <div className='search-result absolute top-12 dark:bg-[#2D2D2D] dark:text-white'>
                      <div class="tooltip-box dark:bg-[#2D2D2D] dark:[&::before]:border-[#2D2D2D]">




                        <div className='w-[250px] '>
                          <div className='mt-4'>
                            {SearchedPeople.length > 0 ?
                              <>
                                <h1 className='text-[14px] text-gray-700 mb-1 dark:text-gray-400'>PEOPLE</h1>
                                <hr className='mb-4' />
                              </>
                              : ''}

                            {SearchedPeople.map((user) => (
                              <>
                                <Link to={`/Profile/${user.userUid}`} onClick={()=>setSearch('')}>
                                  <div className='flex gap-2 items-center mb-2 text-[15px] hover:cursor-pointer hover:opacity-70'>
                                    <img src={user?.profileImage} className='h-6 w-6 object-cover rounded-full' />
                                    <p>{user?.username}</p>
                                  </div>
                                </Link>
                              </>
                            ))}
                          </div>
                          <div>
                            {SearchedPublications.length > 0 ?
                              <>
                                <h1 className='text-[14px] text-gray-700 mb-1 mt-4 dark:text-gray-400'>PUBLICATION</h1>
                                <hr className='mb-3' />
                              </>
                              : ''}


                            {SearchedPublications.slice(0,5).map((post) => (
                              <>
                                <Link to={`/Blogs/${post.PostToken}`} onClick={()=>setSearch('')}>


                                  <div className='flex gap-2 items-center mb-2 hover:cursor-pointer hover:opacity-70'>
                                    <img src={post?.ImageUrl} className='h-6 w-6 object-cover rounded-full' />
                                    <p>{post?.Title.substr(0, 20)}</p>
                                  </div>
                                </Link>
                              </>
                            ))}

                          </div>
                        </div>

                      </div>
                    </div>
                  )}
                </div>
              </div>}
          </div>

          {user ? (
            <div className="Profile-Tab">
              <div
                className="Profile-Container flex items-center gap-3"

              >
                <div className='Search-Mobile mr-1' >
                  <Link to='/Search'>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="26"
                    height="26"
                    fill="none"
                    viewBox="0 0 24 24"
                    aria-label="Search"
                    className=' hover:opacity-100 opacity-60 cursor-pointer'
                  >
                    <path
                      className="fill-black dark:fill-white"
                      d="M4.092 11.06a6.95 6.95 0 1 1 13.9 0 6.95 6.95 0 0 1-13.9 0m6.95-8.05a8.05 8.05 0 1 0 5.13 14.26l3.75 3.75a.56.56 0 1 0 .79-.79l-3.73-3.73A8.05 8.05 0 0 0 11.042 3z"
                      clipRule="evenodd"
                    />
                  </svg>
                  </Link>
                </div>
                <div>
                  <Link to={`/CreateBlog/${Token}`} className='flex gap-1 items-center hover:opacity-100 opacity-60 mr-1'>
                    <svg className='dark:fill-white' xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" aria-label="Write"><path className='dark:fill-white' fill="currentColor" d="M14 4a.5.5 0 0 0 0-1zm7 6a.5.5 0 0 0-1 0zm-7-7H4v1h10zM3 4v16h1V4zm1 17h16v-1H4zm17-1V10h-1v10zm-1 1a1 1 0 0 0 1-1h-1zM3 20a1 1 0 0 0 1 1v-1zM4 3a1 1 0 0 0-1 1h1z"></path><path className='dark:fill-white' stroke="currentColor" d="m17.5 4.5-8.458 8.458a.25.25 0 0 0-.06.098l-.824 2.47a.25.25 0 0 0 .316.316l2.47-.823a.25.25 0 0 0 .098-.06L19.5 6.5m-2-2 2.323-2.323a.25.25 0 0 1 .354 0l1.646 1.646a.25.25 0 0 1 0 .354L19.5 6.5m-2-2 2 2"></path></svg>
                    <p className='write-p dark:text-white'>write</p>
                  </Link>
                </div>
                <div className=' rounded-full hover:bg-opacity-70   hover:opacity-100 opacity-60 cursor-pointer'>
                <Link to='/Notifications'>
                  <svg rpl="" className='dark:fill-white' height="22" icon-name="notification-outline" viewBox="0 0 20 20" width="22" xmlns="http://www.w3.org/2000/svg" >
                    <path d="M11 18h1a2 2 0 0 1-4 0h3Zm8-3.792v.673A1.12 1.12 0 0 1 17.883 16H2.117A1.12 1.12 0 0 1 1 14.881v-.673a3.947 3.947 0 0 1 1.738-3.277A2.706 2.706 0 0 0 3.926 8.7V7.087a6.07 6.07 0 0 1 12.138 0l.01 1.613a2.7 2.7 0 0 0 1.189 2.235A3.949 3.949 0 0 1 19 14.208Zm-1.25 0a2.7 2.7 0 0 0-1.188-2.242A3.956 3.956 0 0 1 14.824 8.7V7.088a4.819 4.819 0 1 0-9.638 0v1.615a3.956 3.956 0 0 1-1.738 3.266 2.7 2.7 0 0 0-1.198 2.239v.542h15.5v-.542Z"></path>
                  </svg>
                  </Link>
                </div>
                <div>

                </div>
                <div onClick={() => setProfileOpened(!ProfileOpened)} className='flex items-center gap-1 cursor-pointer hover:opacity-90'>
                  <img src={user?.photoURL || ProfileHolder} className="h-9 w-9 rounded-full object-cover" />
                  <img src={ProfileOpened ? uparrow : downarrow} className="h-3 mobile-dropdown" />
                </div>
              </div>
              <div
                style={{ display: ProfileOpened ? 'block' : 'none' }}
                className="Profile-Dropdown p-6 bg-white dark:bg-[#2D2D2D] text-black dark:text-gray-300"
              >
                <div className="flex gap-4 items-center mb-4">
                  <img src={user?.photoURL || ProfileHolder} className="h-9 w-9 rounded-full object-cover" />
                  <h1>{user.displayName}</h1>
                </div>
                <hr className="border border-[#F2F2F2] dark:border-gray-600" />
                <Link to={`/Profile/${user.uid}`} onClick={() => setProfileOpened(false)}>
                  <div className="flex gap-4 items-center mb-4 hover:opacity-100 opacity-80 cursor-pointer mt-6">

                    <img src={Profile} className="h-9 w-9 rounded-full" />
                    <p>Profile</p>
                  </div>
                </Link>
                <Link to={`/Profile/${user.uid}`} onClick={() => setProfileOpened(false)}>
                <div className="flex gap-4 items-center mb-4 hover:opacity-100 opacity-80 cursor-pointer">
                  <img src={settings} className="h-9 w-9 rounded-full " />
                  <p>Settings & Privacy</p>
                </div>
                </Link>
                <div
                  className="flex gap-4 items-center mb-4 hover:opacity-100 opacity-80 cursor-pointer"
                  onClick={toggleTheme}
                >
                  <img src={Display} className="h-9 w-9 rounded-full" />
                  <p>{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</p>
                </div>
                <Link>
                  <div
                    className="flex gap-4 items-center mb-4 cursor-pointer hover:opacity-100 opacity-80 cursor-pointer"
                    onClick={handleLogout}
                  >
                    <img src={Logout} className="h-9 w-9 rounded-full" />
                    <p>Logout</p>
                  </div>
                </Link>
              </div>
            </div>
          ) : (
            <div className="buttons-container flex gap-4 items-center">
              <Link to="/Login">
                <button  className="Login-btn rounded-lg pr-4 pl-4 p-2 border border-black dark:border-gray-300 text-black dark:text-gray-300">
                  Log in
                </button>
              </Link>
              <Link to="/Signup">
                <button className="rounded-lg pr-4 pl-4 p-2 bg-black dark:bg-gray-700 text-white">
                  Get started
                </button>
              </Link>
              <img src={Display} className="toggle-theme-btn h-9 w-9 rounded-full hover:cursor-pointer" onClick={toggleTheme} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Navbar;
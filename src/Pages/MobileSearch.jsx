import React,{useState} from 'react'
import { useData } from '../Context/DataContext';
import { Link } from 'react-router-dom';
function MobileSearch() {
    const [search, setSearch] = useState("");
    const { users, posts } = useData();


    const SearchedPeople = users.filter((user) => user.username.toLowerCase().replace(/\s+/g, '').trim().includes(search.toLowerCase().trim().replace(/\s+/g, '')));

    const SearchedPublications = posts?.filter((post) => post?.Title?.toLowerCase().replace(/\s+/g, '').trim().includes(search.toLowerCase().trim().replace(/\s+/g, '')))
  return (
    <div className='flex justify-center dark:bg-[#121212] min-h-screen dark:text-white'>  
      <div className='p-4 w-[100%] mt-[100px] lg:w-[1500px]'>
          <div className=' flex items-center h-[40px] border border-gray-300 rounded-3xl pl-3 pr-3 p-2 '>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" className='search-svg '><path fill="currentColor" fill-rule="evenodd" d="M4.092 11.06a6.95 6.95 0 1 1 13.9 0 6.95 6.95 0 0 1-13.9 0m6.95-8.05a8.05 8.05 0 1 0 5.13 14.26l3.75 3.75a.56.56 0 1 0 .79-.79l-3.73-3.73A8.05 8.05 0 0 0 11.042 3z" clip-rule="evenodd"></path></svg>
                  <input type='text' className='search-input outline-none  ml-1  w-[100%] bg-transparent' placeholder='Search' value={search} onChange={(e) => setSearch(e.target.value)} />
                </div>
                <h1 className='text-gray-600 text-2xl mt-4'>Results for {search}</h1>
                {search !== '' && (
                <div>
                <div className=''>
                          <div className='mt-4'>
                            {SearchedPeople.length > 0 ?
                              <>
                                <h1 className='text-[16px] text-gray-700 mb-2'>PEOPLE</h1>
                                <hr className='mb-4' />
                              </>
                              : ''}

                            {SearchedPeople.map((user) => (
                              <>
                                <Link to={`/Profile/${user.userUid}`}>
                                  <div className='flex gap-2 items-center mb-4 text-[15px] hover:cursor-pointer hover:opacity-70'>
                                    <img src={user?.profileImage} className='h-6 w-6 object-cover rounded-full' />
                                    <p >{user?.username}</p>
                                  </div>
                                </Link>
                              </>
                            ))}
                          </div>
                          <div>
                            {SearchedPublications.length > 0 ?
                              <>
                                <h1 className='text-[14px] text-gray-700 mb-2 mt-4'>PUBLICATION</h1>
                                <hr className='mb-3' />
                              </>
                              : ''}


                            {SearchedPublications.map((post) => (
                              <>
                                <Link to={`/Blogs/${post.PostToken}`}>


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
                 )}
                </div>
                         
    </div>
  )
}

export default MobileSearch
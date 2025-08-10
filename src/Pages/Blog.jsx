import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../Context/AuthContext';
import { useData } from '../Context/DataContext';
import { DeletePost } from '../Configs/firebaseConfig';

export const SkeletonPostCard = () => (
  <div className="Post-card flex justify-between gap-4 lg:w-[660px] md:w-[660px] sm:w-[500px] w-[100%]  animate-pulse">
    <div className="w-full">
      <div className="flex justify-between items-center mb-2">
        <div className="flex gap-2 items-center">
          <div className="h-5 w-5 rounded-full bg-gray-200 dark:bg-gray-700"></div>
          <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
        <div className="h-5 w-5 bg-gray-200 dark:bg-gray-700 rounded"></div>
      </div>
      <div className="h-6 w-3/4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
      <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded mb-1"></div>
      <div className="h-4 w-5/6 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
      <div className="flex justify-between items-center">
        <div className="flex gap-4">
          <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="h-4 w-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
        <div className="flex gap-3">
          <div className="h-5 w-5 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="h-5 w-5 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    </div>
    <div className="sm:w-[250px] sm:max-w-[250px]  flex justify-end">
      <div className="relative h-28 w-28">
        <div className="skeleton h-28 w-28 rounded"></div>
        <div className="absolute top-0 left-0 w-full h-full  opacity-50"></div>
      </div>
    </div>
  </div>
);

function Blog() {
  const { users, posts, fetchPosts } = useData();
  const user = useContext(AuthContext);
  const [isdeletepostopen, setIsDeletePostOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const Feed = ['For You', 'Following','AI','Sport','Data Science'];
  const POSTS_PER_PAGE = 6;
  const [visiblePostCount,setVisiblePostCount] = useState(POSTS_PER_PAGE);


 

  const deletePostHandler = async (user, PostToken, Authoruid) => {
    try {
      const result = await DeletePost(user, PostToken, Authoruid);
      fetchPosts();
      if (result.Succeed) {
        alert('post deleted ');
      } else {
        console.log('the deleting post message ', result.message);
      }
    } catch (error) {
      console.log('the deleting post message ', error.message);
    }
  };

  useEffect(() => {
    const loadPosts = async () => {
      setLoading(true);
      await fetchPosts();
      setLoading(false);
    };
    loadPosts();
  }, []);
  const UserProfile = users?.find((users)=> users?.userUid === user?.uid)

const getFilteredPosts = () => {
  if (currentIndex === 0) {
    // "For You" 
    return posts;
  } else if (currentIndex === 1) {
    // "Following" 
    return posts?.filter((post) =>
      UserProfile?.Following &&
      typeof UserProfile?.Following === 'object' &&
      post?.authorUid in UserProfile?.Following
    );
  } else {
    //  filtering (AI, Sport, etc.)
    return posts?.filter(
      (post) =>
        post.category &&
        post.category.toLowerCase() === Feed[currentIndex].toLowerCase()
    );
  }
};
useEffect(() => {
  setVisiblePostCount(POSTS_PER_PAGE);
}, [currentIndex]);

useEffect(() => {
    const handleScroll = () => {
      // Check if user is near the bottom of the page
      if (
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 150
      ) {
        setVisiblePostCount((prev) => prev + POSTS_PER_PAGE);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll); 

  }, []);
// Posts to display
const displayedPosts = getFilteredPosts();
  return (
    <>
    
      <div className="flex justify-center dark:bg-[#121212] bg-white min-h-screen">
        <div className="lg:w-[1100px] w-[100%] pl-6 pr-6 p-6 dark:bg-[#121212] text-black mt-[90px] flex gap-14">
          <div className="flex justify-center lg:w-full md:w-full sm:w-full ">
            <div className="Post-container text-black">
              <div className="relative flex gap-4 lg:w-[660px] md:w-[660px]  mb-8 dark:text-white">
                {Feed.map((feed, index) => (
                  <>
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={
                      index === currentIndex
                        ? 'feed opacity-100 border-b z-30 border-b-black pb-2 dark:border-b-white'
                        : 'feed opacity-70 pb-2'
                    }
                  >
                    <p className=''>
                    {feed}
                    </p>
                  </button>
                   
                  </>
                ))}
                <hr className="absolute dark:border-b-1 dark:border-gray-600 bottom-0 border-b-1 border-b-[#F2F2F2] w-full" />
              </div>
              <div className="w-full">
                <div className="Posts-container dark:text-white">
                  {loading || posts.length === 0 ? (
                    <div className='w-full'>
                      <SkeletonPostCard />
                      <hr className="border-1 border-gray-200 mt-6 mb-6 dark:border-gray-700" />
                      <SkeletonPostCard />
                      <hr className="border-1 border-gray-200 mt-6 mb-6 dark:border-gray-700" />
                      <SkeletonPostCard />
                      <hr className="border-1 border-gray-200 mt-6 mb-6 dark:border-gray-700" />
                      <SkeletonPostCard />
                    </div>
                  ) : (
                    displayedPosts.slice(0,visiblePostCount).map((post) => {
                      const Author = users.find((user) => user.userUid === post.authorUid);

                      return (
                        <div key={post.PostToken}>
                          <div className="mb-2">
                            {Author ? (
                              <div className="flex justify-between items-center">
                                <Link
                                  className="flex gap-2 hover:underline items-center"
                                  to={`/Profile/${Author.userUid}`}
                                >
                                  <img
                                    src={Author.profileImage}
                                    alt={`${Author.username}'s profile`}
                                    className="h-5 w-5 rounded-full object-cover"
                                  />
                                  <p>{Author.username}</p>
                                </Link>

                                {user?.uid === post?.authorUid ? (
                                  <>
                                    <button
                                      onClick={() => {
                                        setIsDeletePostOpen(true);
                                      }}
                                    >
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="20"
                                        height="20"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        className="ef dy eh eg"
                                      >
                                        <path
                                          stroke="currentColor"
                                          strokeLinecap="round"
                                          d="m5 5 7 7m7 7-7-7m0 0 7-7m-7 7-7 7"
                                          className="dark:fill-white"
                                        ></path>
                                      </svg>
                                    </button>
                                    <div
                                      className="Delete-popup-page left-0 fixed top-0 z-40 h-screen flex justify-center items-center w-full"
                                      style={{
                                        display: isdeletepostopen ? 'flex' : 'none',
                                      }}
                                    >
                                      <div className="Delete-popup text-center dark:text-white h-[100px] bg-white p-6 flex items-center dark:bg-[#121212]">
                                        <div>
                                          <p>Are you sure you want to delete this blog?</p>
                                          <div className="flex gap-4 justify-center mt-2">
                                            <button
                                              className="bg-red-700 p-2 rounded-full"
                                              onClick={() => {
                                                deletePostHandler(user, post.PostToken, Author.userUid);
                                                setIsDeletePostOpen(false);
                                              }}
                                            >
                                              Delete
                                            </button>
                                            <button onClick={() => setIsDeletePostOpen(false)}>Cancel</button>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </>
                                ) : (
                                  ''
                                )}
                              </div>
                            ) : (
                              <p>No author found</p>
                            )}
                          </div>
                          <Link to={`/Blogs/${post.PostToken}`}>
                            <div className="Post-card flex justify-between gap-4 max-w-[660px]">
                              <div>
                                <div>
                                  <h1 className="font-bold text-2xl mb-2 line-clamp-2">{post.Title}</h1>
                                  <p className="text-gray-700 dark:text-gray-400 line-clamp-2">
                                    {post.contentBlocks
                                      .find((block) => block.type === 'paragraph')
                                      ?.text.substr(0, 120) || 'No paragraph block found'}
                                  </p>
                                </div>
                                <div className="flex justify-between mt-4 gap-4 text-gray-600">
                                  <div className="flex gap-4 items-center">
                                    <p className="text-[14px]">
                                      {new Date(post.createdAt).toLocaleDateString('en-US', {
                                        month: 'short',
                                        day: 'numeric',
                                      })}
                                    </p>
                                    <button className="flex items-center gap-1">
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="16"
                                        height="16"
                                        fill="none"
                                        viewBox="0 0 16 16"
                                      >
                                        <path
                                          fill="#6B6B6B"
                                          fillRule="evenodd"
                                          d="m3.672 10.167 2.138 2.14h-.002c1.726 1.722 4.337 2.436 5.96.81 1.472-1.45 1.806-3.68.76-5.388l-1.815-3.484c-.353-.524-.849-1.22-1.337-.958-.49.261 0 1.56 0 1.56l.78 1.932L6.43 2.866c-.837-.958-1.467-1.108-1.928-.647-.33.33-.266.856.477 1.598.501.503 1.888 1.957 1.888 1.957.17.174.083.485-.093.655a.56.56 0 0 1-.34.163.43.43 0 0 1-.317-.135s-2.4-2.469-2.803-2.87c-.344-.346-.803-.54-1.194-.15-.408.406-.273 1.065.11 1.447.345.346 2.31 2.297 2.685 2.67l.062.06c.17.175.269.628.093.8-.193.188-.453.33-.678.273a.9.9 0 0 1-.446-.273S2.501 6.84 1.892 6.23c-.407-.406-.899-.333-1.229 0-.525.524.263 1.28 1.73 2.691.384.368.814.781 1.279 1.246m8.472-7.219c.372-.29.95-.28 1.303.244V3.19l1.563 3.006.036.074c.885 1.87.346 4.093-.512 5.159l-.035.044c-.211.264-.344.43-.74.61 1.382-1.855.963-3.478-.248-5.456L11.943 3.88l-.002-.037c-.017-.3-.039-.71.203-.895"
                                          clipRule="evenodd"
                                        ></path>
                                      </svg>
                                      <p className="text-xs">{post?.Likes}</p>
                                    </button>
                                    <button className="flex items-center gap-1">
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="16"
                                        height="16"
                                        fill="#6B6B6B"
                                        viewBox="0 0 16 16"
                                      >
                                        <path
                                          fill="#6B6B6B"
                                          d="M12.344 11.458A5.28 5.28 0 0 0 14 7.526C14 4.483 11.391 2 8.051 2S2 4.483 2 7.527c0 3.051 2.712 5.526 6.059 5.526a6.6 6.6 0 0 0 1.758-.236q.255.223.554.414c.784.51 1.626.768 2.512.768a.37.37 0 0 0 .355-.214.37.37 0 0 0-.03-.384 4.7 4.7 0 0 1-.857-1.958v.014z"
                                        ></path>
                                      </svg>
                                      <p className="text-xs">
                                        {post?.comments && typeof post?.comments === 'object'
                                          ? Object.values(post.comments).length
                                          : ''}
                                      </p>
                                    </button>
                                  </div>
                                  <div className="flex items-center gap-3">
                                    <svg
                                      className="opacity-60 hover:opacity-100 dark:fill-white fill-black"
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="24"
                                      height="24"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                    >
                                      <path d="M17.5 1.25a.5.5 0 0 1 1 0v2.5H21a.5.5 0 0 1 0 1h-2.5v2.5a.5.5 0 0 1-1 0v-2.5H15a.5.5 0 0 1 0-1h2.5zm-11 4.5a1 1 0 0 1 1-1H11a.5.5 0 0 0 0-1H7.5a2 2 0 0 0-2 2v14a.5.5 0 0 0 .8.4l5.7-4.4 5.7 4.4a.5.5 0 0 0 .8-.4v-8.5a.5.5 0 0 0-1 0v7.48l-5.2-4a.5.5 0 0 0-.6 0l-5.2 4z"></path>
                                    </svg>
                                    <svg
                                      className="opacity-80 hover:opacity-100"
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="24"
                                      height="24"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        fill="currentColor"
                                        fillRule="evenodd"
                                        d="M4.385 12c0 .55.2 1.02.59 1.41.39.4.86.59 1.41.59s1.02-.2 1.41-.59c.4-.39.59-.86.59-1.41s-.2-1.02-.59-1.41a1.93 1.93 0 0 0-1.41-.59c-.55 0-1.02.2-1.41.59-.4.39-.59.86-.59 1.41m5.62 0c0 .55.2 1.02.58 1.41.4.4.87.59 1.42.59s1.02-.2 1.41-.59c.4-.39.59-.86.59-1.41s-.2-1.02-.59-1.41a1.93 1.93 0 0 0-1.41-.59c-.55 0-1.03.2-1.42.59s-.58.86-.58 1.41m5.6 0c0 .55.2 1.02.58 1.41.4.4.87.59 1.43.59s1.03-.2 1.42-.59.58-.86.58-1.41-.2-1.02-.58-1.41a1.93 1.93 0 0 0-1.42-.59c-.56 0-1.04.2-1.43.59s-.58.86-.58 1.41"
                                        clipRule="evenodd"
                                      ></path>
                                    </svg>
                                  </div>
                                </div>
                              </div>
                              <div className="lg:w-[250px] md:w-[250px] sm:w-[250px] flex justify-end">
                                <div className="relative h-28 w-28">
                                  <img
                                    src={post.ImageUrl}
                                    className="h-28 w-28 object-cover"
                                    alt={`${post.Title} image`}
                                  />
                                  <div className="absolute top-0 left-0 w-full h-full bg-black opacity-50"></div>
                                </div>
                              </div>
                            </div>
                          </Link>
                          <hr className="border-1 border-gray-200 mt-6 mb-6 dark:border-gray-700" />
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className='Staff-picks pl-7 pr-4 border-l border-gray-200 dark:text-white'>
            <div >
              <b>Staff Picks</b>
              <div className='mt-5'>
                {
                  posts.slice(0,3).map((post)=>
                  {
                    return(
                      <div key={post.PostToken} >
                        {users.filter((user)=> user.userUid == post.authorUid).map((author)=>(
                          <div >
                          <Link className='flex items-center gap-2 mt-4 hover:cursor-pointer hover:underline' to={`/Profile/${author.userUid}`}> 
                          <img src={author.profileImage} className='h-5 w-5  rounded-full object-cover' />
                          <h1 className='text-gray-900 text-sm dark:text-gray-600'>{author.username}</h1>
                          </Link>
                          </div>
                        ))}
                        <Link to={`/Blogs/${post.PostToken}`}>
                          <h1 className='mt-2 font-bold '>{post.Title}</h1>
                          <p className='mt-2 text-sm mb-5 text-gray-900 dark:text-gray-600'> {new Date(post.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                          })}</p>
                          </Link>
                      </div>
                    )
                  })
                }
              </div>
              <hr></hr>
            </div>
            <div className='mt-4 mb-4'>
              <b>Who to follow</b>
              <div className='mt-5'>
                  
                        {users.filter((Author)=> Author.userUid !== user.uid).slice(0,4).map((author)=>(
                          <div className='flex mb-3 justify-between'>
                          <Link className='flex items-center gap-3' to={`/Profile/${author.userUid}`}> 
                          <img src={author.profileImage} className='h-8 w-8  rounded-full object-cover' />
                          <h1 className=' font-bold '>{author.username}</h1>
                          </Link>
                          
                          </div>
                        ))}
         
              </div>
              <hr />
            </div>
            <div>
            <b className='mt-4'>Reading list</b>
            <div className='flex mt-3 text-sm'>
              <p className='text-gray-600'>Click the</p>
             <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="none" viewBox="0 0 25 25" class="jz bl"><path fill="currentColor" d="M18 2.5a.5.5 0 0 1 1 0V5h2.5a.5.5 0 0 1 0 1H19v2.5a.5.5 0 1 1-1 0V6h-2.5a.5.5 0 0 1 0-1H18zM7 7a1 1 0 0 1 1-1h3.5a.5.5 0 0 0 0-1H8a2 2 0 0 0-2 2v14a.5.5 0 0 0 .805.396L12.5 17l5.695 4.396A.5.5 0 0 0 19 21v-8.5a.5.5 0 0 0-1 0v7.485l-5.195-4.012a.5.5 0 0 0-.61 0L7 19.985z"></path></svg>
              <p className='text-gray-600'>on any story to easily add it to</p>
              </div>
              <p className='text-gray-600 text-sm'>  your reading list or a custom list that you can share.</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Blog;
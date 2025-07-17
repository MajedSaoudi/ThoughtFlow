import React, { useState, useEffect, useContext } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { AuthContext } from '../Context/AuthContext';
import { addComment, addLikes, followUser, unfollowUser, likeComment, deleteComment } from '../Configs/firebaseConfig';
import { useData } from '../Context/DataContext';
import { formatDistanceToNow } from 'date-fns';
import './BlogPost.css';
function BlogPost() {


  
  const PostToken = useParams()
  const { posts, users, error, loading, fetchPosts, fetchUsers, setError, setLoading } = useData()


  const [Comment, setComment] = useState('');
  const user = useContext(AuthContext);
  const [commentlikes, setCommentLikes] = useState(0);
  const [bold, setBold] = useState(false);
  
  const [commentsIsOpen, setCommentIsOpen] = useState(false);
  const [likes, setLikes] = useState(0);
  const [fullScreenImage, setFullScreenImage] = useState(null);

  const Post = posts?.filter((post) => post.PostToken === PostToken.PostToken);
  const [blog, setBlog] = useState(Post || []);
 
  const Author = users?.filter((user) => user?.userUid === Post[0]?.authorUid);
  const date = new Date(Post[0]?.createdAt);
  const options = { month: 'short', day: 'numeric', year: 'numeric' };
  const formattedDate = date.toLocaleDateString('en-US', options);
  
 


  if (Post.length<1) return <Navigate to="/404" replace />;
 

  const PostComment = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    setComment("");
    try {

      const result = await addComment(PostToken.PostToken, user.uid, Comment);
      fetchPosts();
      if (result.success) {

      }
    } catch (error) {
      console.error('Create post error:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const addLikesHandler = async () => {


    if (!PostToken?.PostToken) {
      setError('Invalid post ID');
      return;
    }

    try {
      const result = await addLikes(1, PostToken.PostToken);

      if (result.success) {

        await fetchPosts();
      } else {
        setError(result.message);
      }
    } catch (error) {
      console.error('Error adding like:', error);
      setError(error.message || 'Failed to add like');
    }
  };



  const followUserHandler = async () => {
    if (!user || !user.uid) {
      setError('You must be logged in to follow a user');
      return;
    }

    if (!Post || !Array.isArray(Post) || !Post[0]?.authorUid) {
      setError('Invalid post or user data');
      return;
    }

    if (user.uid === Post[0].authorUid) {
      setError('You cannot follow yourself');
      return;
    }

    setLoading(true);
    setError(null);

    try {
     
      const result = await followUser(user.uid, Post[0].authorUid);
     
      if (result.success) {
        await fetchUsers();
       
      } else {
        setError(result.message);
      }
    } catch (error) {
      console.error(`Error following ${user.uid} to ${Post[0].authorUid}:`, error);
      setError('Failed to follow user. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const unfollowUserHandler = async () => {

    if (!user || !user.uid) {
      setError('You must be logged in to unfollow a user');
      return;
    }


    if (!Post || !Array.isArray(Post) || !Post[0]?.authorUid) {
      setError('Invalid post or user data');
      return;
    }


    if (user.uid === Post[0].authorUid) {
      setError('You cannot unfollow yourself');
      return;
    }


    setLoading(true);
    setError(null);

    try {
      const result = await unfollowUser(user.uid, Post[0].authorUid);
      if (result.success) {
        await fetchUsers();
        
      } else {
        setError(result.message);
      }
    } catch (error) {
      console.error(`Error unfollowing ${user.uid} from ${Post[0].authorUid}:`, error);
      setError('Failed to unfollow user. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const likeCommentHandler = async (postId, commentId, numberOfLikes) => {
    try {

      const result = await likeComment(postId, commentId, numberOfLikes);
      if (!Post[0]) {
        throw new Error('Post does not exist');
      }
      if (Post[0].PostToken !== postId) {
        throw new Error('Post ID does not match');
      }
      if (!Post[0].comments || !Post[0].comments[commentId]) {
        throw new Error('Comment does not exist');
      }
      if (result.success) {
        await fetchPosts();

        const updatedPost = {
          ...Post[0],
          comments: {
            ...Post[0].comments,
            [commentId]: {
              ...Post[0].comments[commentId],
              Likes: (Post[0].comments[commentId].Likes || 0) + numberOfLikes,
            },
          },
        };

        setBlog(updatedPost);
      }
    } catch (error) {
      console.error('Error in likeCommentHandler:', error.message);
    }
  };



  const deleteCommentHandler = async (postId, commentId) => {
    try {


      if (!Post[0] || Post[0].PostToken !== postId) {
        throw new Error('Post does not exist or Post ID does not match');
      }
      if (!Post[0].comments || !Post[0].comments[commentId]) {
        throw new Error('Comment does not exist');
      }
      const result = await deleteComment(postId, commentId);
      if (result.success) {
        await fetchPosts();
        const updatedPost = {
          ...blog,
          comments: { ...blog.comments }
        };
        delete updatedPost.comments[commentId];
        setBlog(updatedPost);
       
      } else {
        console.error('Failed to delete comment:', result.message);
      }
    } catch (error) {
      console.error('Error in deleteCommentHandler:', error.message);
    }
  };

  const openFullScreen = (imageUrl) => {
    setFullScreenImage(imageUrl);
  };

  const closeFullScreen = () => {
    setFullScreenImage(null);
  };



  return (

    <>

      <div className='comment-section fixed right-0 overflow-y-auto  white h-[100vh] transform transition-transform duration-300 ease-in-out w-[400px]  bg-white p-6 pr-5 z-50 overflow-x-hidden dark:bg-[#121212] dark:text-white' style={{
        transform: commentsIsOpen ? 'translateX(0)' : 'translateX(100%)'
      }}>
        {user ?
          <div>
            <div className='flex justify-between  mb-4 '>
              <h1 className='Comments-Header flex gap-1 text-xl'>Reponses<span>({(Post[0]?.comments && Object.values(Post[0]?.comments).length) ?? 0})</span></h1>
              <button className='opacity-60 hover:opacity-100' onClick={() => setCommentIsOpen(false)}><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" class="ef dy eh eg"><path stroke="currentColor" stroke-linecap="round" d="m5 5 7 7m7 7-7-7m0 0 7-7m-7 7-7 7"></path></svg></button>
            </div>
            <hr />
            <form onSubmit={PostComment} className='w-full'>
              <div className='flex items-center gap-2 mt-5'>
                <img src={user?.photoURL} className='h-9 w-9 object-cover rounded-full' />
                <h1>{user?.displayName}</h1>
              </div>
              <div className='pt-4 pb-4 bg-[#F2F2F2] p-3 mt-4 rounded-md dark:bg-transparent dark:border dark:border-gray-600'>
                <textarea rows={3} style={{
                  fontFamily: bold ? 'bold' : 'sans-serif'
                }} name="" id="" value={Comment} onChange={(e) => setComment(e.target.value)} placeholder='What are your thoughts' className='text-black  w-full bg-[#F2F2F2] outline-none resize-none overflow-y-auto dark:bg-transparent dark:text-white' />
                <div className='flex justify-between'>
                  <div>
                    <div className='hover:cursor-pointer hover:opacity-100' onClick={() => setBold(!bold)} style={{
                      opacity: bold ? '1' : '0.4'
                    }}><svg width="21" height="21"><path fill-rule="evenodd" d="M10.308 17.993h-5.92l.11-.894.783-.12c.56-.11.79-.224.79-.448V5.37c0-.225-.113-.336-.902-.448H4.5l-.114-.894h6.255c4.02 0 5.58 1.23 5.58 3.13 0 1.896-1.78 3.125-3.79 3.463v.11c2.69.34 4.25 1.56 4.25 3.57 0 2.35-2.01 3.69-6.37 3.69l.02.01h-.02zm-.335-12.96H8.967V10.5h1.23c1.788 0 2.79-1.23 2.79-2.683 0-1.685-1.004-2.803-3.006-2.803v.02zm-.223 6.36h-.783v5.588l1.225.23h.22c1.67 0 3.01-1.004 3.01-2.792 0-2.122-1.566-3.016-3.69-3.016h.018z" className='dark:fill-white'></path></svg></div>

                  </div>
                  <div className='Comment-buttons flex gap-3'>
                    <button onClick={() => setComment("")} className='text-xs'>Cancel</button>
                    <button type='submit' className='rounded-2xl p-2  text-white text-xs' style={{
                      background: Comment ? 'black' : '#cfcece'
                    }} >Respond</button>
                  </div>
                </div>
              </div>
            </form>
            <div className='mt-6 mb-4'>
              <select name="" id="" className='text-xs font-bold p-1 outline-none bg-transparent'>
                
                <option value="MOST RELEVENT">MOST RELEVENT</option>
                <option>MOST RECENT</option>
              </select>
            </div>
            <hr />
            <div>
              {Object.values(Post).map((post) => (
                <div key={post.PostToken}>

                  {post.comments &&
                    Object.entries(post?.comments).map(([commentId, comment]) => {
                      const commentator = users.find((user) => user.userUid === comment.commentatorUid);
                      return (
                        <form
                          key={commentId}
                          className="mt-6"
                          onSubmit={(e) => {
                            e.preventDefault();
                            if (post && PostToken.PostToken) {
                              likeCommentHandler(PostToken.PostToken, commentId, 1);
                            } else {
                              console.error('Post or PostToken is undefined');
                            }
                          }}
                        >
                          {commentator?.profileImage && (
                            <div>
                              
                              <div className="flex items-center gap-3">
                                <img
                                  src={commentator.profileImage}
                                  alt="Author Profile "
                                  className="h-9 w-9 object-cover rounded-full"
                                />
                                <div className="flex justify-between w-full">
                                  <div className="commentator-data">
                                    <Link className='cursor-pointer hover:underline' to={`/Profile/${commentator?.userUid
                                }`}>
                                    <p >{commentator?.username || 'Unknown User'}</p>
                                    </Link>
                                    <p>
                                      {comment?.createdAt
                                        ? formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })
                                        : 'Unknown Date'}
                                    </p>
                                  </div>
                                  <div>
                                    {user.uid === comment.commentatorUid ? (
                                      <button className="opacity-60 hover:opacity-100" type="button" onClick={(e) => {
                                        e.preventDefault();
                                        if (post && PostToken.PostToken) {
                                          deleteCommentHandler(PostToken.PostToken, commentId);
                                        } else {
                                          console.error('Post or PostToken is undefined');
                                        }
                                      }}>
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          width="20"
                                          height="20"
                                          fill="none"
                                          viewBox="0 0 24 24"
                                          className="ef dy eh eg "
                                        >
                                          <path
                                            stroke="currentColor"
                                            strokeLinecap="round"
                                            d="m5 5 7 7m7 7-7-7m0 0 7-7m-7 7-7 7"
                                          />
                                        </svg>
                                      </button>
                                    ) : (
                                      ''
                                    )}
                                  </div>
                                </div>
                              </div>
                              <div className="mt-3">
                                <h1
                                  className="text-wrap break-words"
                                  style={{
                                    overflowWrap: 'break-word',
                                    wordBreak: 'break-all',
                                    fontFamily: 'sohne, "Helvetica Neue", Helvetica, Arial, sans-serif',
                                    fontSize: '14px',
                                  }}
                                >
                                  {comment.content}
                                </h1>
                              </div>
                              <div className="flex mt-4">
                                {user.uid !== comment.commentatorUid ? (
                                  <>
                                    <button
                                      className="opacity-60 hover:opacity-100"
                                      onClick={() => likeCommentHandler(blog.PostToken, comment.commentId, 1)}
                                      aria-label="Like comment"
                                    >
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        role="img"
                                        aria-label="Clap icon"
                                        class="dark:fill-white"
                                      >
                                        <path
                                          fillRule="evenodd"
                                          clipRule="evenodd"
                                          d="M11.37.828 12 3.282l.63-2.454zM13.916 3.953l1.523-2.112-1.184-.39zM8.589 1.84l1.522 2.112-.337-2.501zM18.523 18.92c-.86.86-1.75 1.246-2.62 1.33a6 6 0 0 0 .407-.372c2.388-2.389 2.86-4.951 1.399-7.623l-.912-1.603-.79-1.672c-.26-.56-.194-.98.203-1.288a.7.7 0 0 1 .546-.132c.283.046.546.231.728.5l2.363 4.157c.976 1.624 1.141 4.237-1.324 6.702m-10.999-.438L3.37 14.328a.828.828 0 0 1 .585-1.408.83.83 0 0 1 .585.242l2.158 2.157a.365.365 0 0 0 .516-.516l-2.157-2.158-1.449-1.449a.826.826 0 0 1 1.167-1.17l3.438 3.44a.363.363 0 0 0 .516 0 .364.364 0 0 0 0-.516L5.293 9.513l-.97-.97a.826.826 0 0 1 0-1.166.84.84 0 0 1 1.167 0l.97.968 3.437 3.436a.36.36 0 0 0 .517 0 .366.366 0 0 0 0-.516L6.977 7.83a.82.82 0 0 1-.241-.584.82.82 0 0 1 .824-.826c.219 0 .43.087.584.242l5.787 5.787a.366.366 0 0 0 .587-.415l-1.117-2.363c-.26-.56-.194-.98.204-1.289a.7.7 0 0 1 .546-.132c.283.046.545.232.727.501l2.193 3.86c1.302 2.38.883 4.59-1.277 6.75-1.156 1.156-2.602 1.627-4.19 1.367-1.418-.236-2.866-1.033-4.079-2.246M10.75 5.971l2.12 2.12c-.41.502-.465 1.17-.128 1.89l.22.465-3.523-3.523a.8.8 0 0 1-.097-.368c0-.22.086-.428.241-.584a.847.847 0 0 1 1.167 0m7.355 1.705c-.31-.461-.746-.758-1.23-.837a1.44 1.44 0 0 0-1.11.275c-.312.24-.505.543-.59.881a1.74 1.74 0 0 0-.906-.465 1.47 1.47 0 0 0-.82.106l-2.182-2.182a1.56 1.56 0 0 0-2.2 0 1.54 1.54 0 0 0-.396.701 1.56 1.56 0 0 0-2.21-.01 1.55 1.55 0 0 0-.416.753c-.624-.624-1.649-.624-2.237-.037a1.557 1.557 0 0 0 0 2.2c-.239.1-.501.238-.715.453a1.56 1.56 0 0 0 0 2.2l.516.515a1.556 1.556 0 0 0-.753 2.615L7.01 19c1.32 1.319 2.909 2.189 4.475 2.449q.482.08.971.08c.85 0 1.653-.198 2.393-.579.231.033.46.054.686.054 1.266 0 2.457-.52 3.505-1.567 2.763-2.763 2.552-5.734 1.641439-7.586z"
                                        />
                                      </svg>
                                    </button>
                                    <p className="ml-2">{comment.Likes || 0} Clap</p>
                                  </>
                                ) : ''}
                              </div>
                              <hr className='mt-4' />
                            </div>
                          )}
                        </form>
                      );
                    })}

                </div>
              ))}
            </div>
          </div>
          :
          <>
            <div className='absolute right-10'>
              <button className='opacity-60 hover:opacity-100' onClick={() => setCommentIsOpen(false)}><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" class="ef dy eh eg"><path stroke="currentColor" stroke-linecap="round" d="m5 5 7 7m7 7-7-7m0 0 7-7m-7 7-7 7"></path></svg></button>
            </div>
            <div className='h-full items-center justify-center flex'>
              <div className='text-center'>
                <h1>Sign in to see comments</h1>
                <Link to={'/Login'}><button className='mt-6 pr-6 pl-6 p-2 rounded-lg bg-black text-white dark:border-white dark:border' type='submit'>Log in</button></Link>
              </div>
            </div>
          </>
        }
      </div>

      <div className='flex justify-center dark:text-[#CCCCCC] text-black dark:bg-[#121212] bg-white min-h-screen'>
        <div className='Blog-container w-[700px]  pl-4 pr-4 p-6 mt-[90px]'>
          <div>
            {Post?.map((post) => (
              <>
                <div>
                  <h1 className='Header dark:text-white lg:text-base '>{post.Title}</h1>
                  <h2 className='category'>{post.tags}</h2>
                  {Author.map((author) => (
                    <div className='Author-content flex items-center lg:gap-5 md:gap-3 sm:gap-2 gap-[5px]  mt-6'>
                      <div className='relative Author-image '>
                        <Link to={`/Profile/${author?.userUid}`}>
                          <img src={author?.profileImage} className='hover:opacity-60 hover:cursor-pointer rounded-full h-9 w-9  object-cover' />
                        </Link>
                        <div className='Author-Poppup absolute top-12 bg-white z-30 left-0 p-4 w-[250px] dark:bg-[#121212] '>
                          <Link to={`/Profile/${author?.userUid}`}>
                            <div className='flex justify-between items-end '>

                              <img src={author?.profileImage} className='rounded-full h-14 w-14 object-cover' />

                              {user && user.uid && Post && Array.isArray(Post) && Post[0]?.authorUid && user.uid !== Post[0].authorUid && author ? (
                                <button
                                  onClick={() => {

                                    return author?.Followers?.[user.uid] === true ? unfollowUserHandler() : followUserHandler();
                                  }}
                                  className="pr-2 pl-2 p-1 rounded-3xl border bg-black text-white hover:opacity-75 text-sm"
                                  disabled={loading}
                                >
                                  {author?.Followers?.[user.uid] === true ? 'Unfollow' : 'Follow'}
                                </button>
                              ) : null}
                            </div>

                            <div className='mt-3'>

                              <p className='hover:decoration-slice hover:cursor-pointer hover:underline'>{author.username}</p>

                            </div>
                          </Link>
                          <div>

                            <p>
                              {(author?.Followers && typeof author.Followers === 'object'
                                ? Object.values(author.Followers).filter(value => value === true).length
                                : 0)}
                              <span className='ml-1 text-[#6B6B6B]'>Followers</span>
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className='flex items-center'>
                        <Link to={``}></Link>
                        <Link to={`/Profile/${author?.userUid}`}>
                         
                          <h1 className='hover:underline hover:cursor-pointer mr-3'>{author.username}</h1>
                        </Link>
                        {user && user.uid && Post && Array.isArray(Post) && Post[0]?.authorUid && user.uid !== Post[0].authorUid && author ? (
                          <button
                            onClick={() => {
                          
                              return author?.Followers?.[user.uid] === true ? unfollowUserHandler() : followUserHandler();
                            }}
                            className="pr-2 pl-2 p-1 rounded-3xl border border-black text-[14px] dark:bg-white dark:text-black dark:border-white"
                            disabled={loading}
                          >
                            {author?.Followers?.[user.uid] === true ? 'Unfollow' : 'Follow'}
                          </button>
                        ) : null}

                      </div>
                       
                      <h2>5 min read </h2>
                      <span >·</span>
                      <h2>{formattedDate}</h2>
                    </div>
                  ))}
                </div>
                <div className=' mt-8'>
                  <hr></hr>
                  <div className='Stats-Tab flex justify-between mt-2 mb-2 pl-2 pr-2'>
                    <div className='flex gap-4'>
                      <div className='Likes-Tab flex items-center gap-1 relative' onClick={() => { setLikes(likes + 1) }}>
                        <button onClick={addLikesHandler}>
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" aria-label="clap" className="fill-black dark:fill-white"><path fill-rule="evenodd" d="M11.37.828 12 3.282l.63-2.454zM13.916 3.953l1.523-2.112-1.184-.39zM8.589 1.84l1.522 2.112-.337-2.501zM18.523 18.92c-.86.86-1.75 1.246-2.62 1.33a6 6 0 0 0 .407-.372c2.388-2.389 2.86-4.951 1.399-7.623l-.912-1.603-.79-1.672c-.26-.56-.194-.98.203-1.288a.7.7 0 0 1 .546-.132c.283.046.546.231.728.5l2.363 4.157c.976 1.624 1.141 4.237-1.324 6.702m-10.999-.438L3.37 14.328a.828.828 0 0 1 .585-1.408.83.83 0 0 1 .585.242l2.158 2.157a.365.365 0 0 0 .516-.516l-2.157-2.158-1.449-1.449a.826.826 0 0 1 1.167-1.17l3.438 3.44a.363.363 0 0 0 .516 0 .364.364 0 0 0 0-.516L5.293 9.513l-.97-.97a.826.826 0 0 1 0-1.166.84.84 0 0 1 1.167 0l.97.968 3.437 3.436a.36.36 0 0 0 .517 0 .366.366 0 0 0 0-.516L6.977 7.83a.82.82 0 0 1-.241-.584.82.82 0 0 1 .824-.826c.219 0 .43.087.584.242l5.787 5.787a.366.366 0 0 0 .587-.415l-1.117-2.363c-.26-.56-.194-.98.204-1.289a.7.7 0 0 1 .546-.132c.283.046.545.232.727.501l2.193 3.86c1.302 2.38.883 4.59-1.277 6.75-1.156 1.156-2.602 1.627-4.19 1.367-1.418-.236-2.866-1.033-4.079-2.246M10.75 5.971l2.12 2.12c-.41.502-.465 1.17-.128 1.89l.22.465-3.523-3.523a.8.8 0 0 1-.097-.368c0-.22.086-.428.241-.584a.847.847 0 0 1 1.167 0m7.355 1.705c-.31-.461-.746-.758-1.23-.837a1.44 1.44 0 0 0-1.11.275c-.312.24-.505.543-.59.881a1.74 1.74 0 0 0-.906-.465 1.47 1.47 0 0 0-.82.106l-2.182-2.182a1.56 1.56 0 0 0-2.2 0 1.54 1.54 0 0 0-.396.701 1.56 1.56 0 0 0-2.21-.01 1.55 1.55 0 0 0-.416.753c-.624-.624-1.649-.624-2.237-.037a1.557 1.557 0 0 0 0 2.2c-.239.1-.501.238-.715.453a1.56 1.56 0 0 0 0 2.2l.516.515a1.556 1.556 0 0 0-.753 2.615L7.01 19c1.32 1.319 2.909 2.189 4.475 2.449q.482.08.971.08c.85 0 1.653-.198 2.393-.579.231.033.46.054.686.054 1.266 0 2.457-.52 3.505-1.567 2.763-2.763 2.552-5.734 1.439-7.586z" clip-rule="evenodd"></path></svg>
                        </button>
                        <p>{post.Likes}</p>



                      </div>
                      <div className='Comments-Tab flex items-center gap-1'>
                        <button onClick={() => setCommentIsOpen(!commentsIsOpen)}>
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" class="zg" ><path className="fill-black dark:fill-white" d="M18.006 16.803c1.533-1.456 2.234-3.325 2.234-5.321C20.24 7.357 16.709 4 12.191 4S4 7.357 4 11.482c0 4.126 3.674 7.482 8.191 7.482.817 0 1.622-.111 2.393-.327.231.2.48.391.744.559 1.06.693 2.203 1.044 3.399 1.044.224-.008.4-.112.486-.287a.49.49 0 0 0-.042-.518c-.495-.67-.845-1.364-1.04-2.057a4 4 0 0 1-.125-.598zm-3.122 1.055-.067-.223-.315.096a8 8 0 0 1-2.311.338c-4.023 0-7.292-2.955-7.292-6.587 0-3.633 3.269-6.588 7.292-6.588 4.014 0 7.112 2.958 7.112 6.593 0 1.794-.608 3.469-2.027 4.72l-.195.168v.255c0 .056 0 .151.016.295.025.231.081.478.154.733.154.558.398 1.117.722 1.659a5.3 5.3 0 0 1-2.165-.845c-.276-.176-.714-.383-.941-.59z"></path></svg>
                        </button>
                        <p>{post?.comments && Object.values(post?.comments).length}</p>
                      </div>
                    </div>
                    <div>
                      <button>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path fill="currentColor" fill-rule="evenodd" d="M4.385 12c0 .55.2 1.02.59 1.41.39.4.86.59 1.41.59s1.02-.2 1.41-.59c.4-.39.59-.86.59-1.41s-.2-1.02-.59-1.41a1.93 1.93 0 0 0-1.41-.59c-.55 0-1.02.2-1.41.59-.4.39-.59.86-.59 1.41m5.62 0c0 .55.2 1.02.58 1.41.4.4.87.59 1.42.59s1.02-.2 1.41-.59c.4-.39.59-.86.59-1.41s-.2-1.02-.59-1.41a1.93 1.93 0 0 0-1.41-.59c-.55 0-1.03.2-1.42.59s-.58.86-.58 1.41m5.6 0c0 .55.2 1.02.58 1.41.4.4.87.59 1.43.59s1.03-.2 1.42-.59.58-.86.58-1.41-.2-1.02-.58-1.41a1.93 1.93 0 0 0-1.42-.59c-.56 0-1.04.2-1.43.59s-.58.86-.58 1.41" clip-rule="evenodd"></path></svg>
                      </button>
                    </div>
                  </div>
                  <hr />
                </div>
                <div className='mt-12'>
                  <div className='flex justify-center'>
                    <img src={post?.ImageUrl} className=' cursor-zoom-in' onClick={() => setFullScreenImage(post?.ImageUrl)} />
                    {fullScreenImage && (
                      <div
                        className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 hover:cursor-zoom-out"
                        onClick={closeFullScreen}
                      >
                        <div className="relative max-w-full max-h-full">
                          <img
                            src={fullScreenImage}
                            alt="Full screen"
                            className="max-w-[90vw] max-h-[90vh] object-contain"
                          />
                         
                        </div>
                      </div>
                    )}
                  </div>
                  <div className='Content text-black'>
                    {post.contentBlocks.map((content) => {
                      if (content?.type === 'header') {
                        return <strong key={content.id} className='Strong mb-6 mt-4  dark:text-white'>{content?.text}</strong>;
                      } else if (content?.type === 'paragraph') {
                        return <p key={content.id} className='mb-4 mt-4 dark:text-[#e2e0e0]'>{content?.text}</p>;
                      } else if (content?.type === 'image') {
                        return <div className='flex justify-center mb-6'>
                          <img src={content?.url} className=' cursor-zoom-in' onClick={() => setFullScreenImage(content?.url)} />
                          {fullScreenImage && (
                            <div
                              className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 hover:cursor-zoom-out"
                              onClick={closeFullScreen}
                            >
                              <div className="relative max-w-full max-h-full">
                                <img
                                  src={fullScreenImage}
                                  alt="Full screen"
                                  className="max-w-[90vw] max-h-[90vh] object-contain"
                                />
                          
                              </div>
                            </div>
                          )}
                        </div>;
                      }
                      return null;
                    })}
                  </div>

                </div>

              </>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default BlogPost
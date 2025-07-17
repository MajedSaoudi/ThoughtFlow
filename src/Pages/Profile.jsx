import React, { useContext, useEffect, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { useData } from '../Context/DataContext';
import { AuthContext } from '../Context/AuthContext';
import { followUser, unfollowUser, updateUserProfile } from '../Configs/firebaseConfig';
import { DeletePost } from '../Configs/firebaseConfig';
import { SkeletonPostCard } from './Blog';
import './Profile.css';

function Profile() {
    const useruid = useParams();
    const { users, posts, loading, setLoading, fetchUsers, setError, fetchPosts } = useData();
    const user = useContext(AuthContext)
    const UserData = users?.find((user) => user?.userUid === useruid?.UserUid);
    const [isdeletepostopen, setIsDeletePostOpen] = useState(false);
    const [openeditprofile, setOpenEditProfile] = useState(false);
    const [updatedprofileimage, setUpdatedProfileImage] = useState('');
    const [updatedemail, setUpdatedEmail] = useState('')
    const [updatedusername, setUpdatedUsername] = useState('');
    const UserPosts = posts?.filter((post) => post?.authorUid === UserData?.userUid)
    const UserProfile = users?.find((users) => users?.userUid === user?.uid);
    const FollowingUsers = users.filter((user) => {
        return UserData?.Following && user?.userUid && UserData.Following[user.userUid] === true;
    });
  
    const followUserHandler = async () => {
        if (!user || !user.uid) {
            setError('You must be logged in to follow a user');
            return;
        }

        if (user.uid === UserData.userUid) {
            setError('You cannot follow yourself');
            return;
        }
        setLoading(true);
        setError(null);

        try {

            const result = await followUser(user.uid, UserData?.userUid);

            if (result.success) {
                await fetchUsers();

            } else {
                setError(result.message);
            }
        } catch (error) {
            console.error(`Error following ${user.uid} to ${UserData?.userUid}:`, error);
            setError('Failed to follow user. Please try again.');
        } finally {
            setLoading(false);
        }
    }

    const unfollowUserHandler = async () => {
        if (!user || !user.uid) {
            setError('You must be logged in to unfollow a user');
            return;
        }

        if (user?.uid === UserData?.userUid) {
            setError('You cannot unfollow yourself');
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const result = await unfollowUser(user?.uid, UserData?.userUid);
            if (result.success) {
                await fetchUsers();
               
            } else {
                setError(result.message);
            }
        } catch (error) {
            console.error(`Error unfollowing ${user.uid} from ${UserData?.userUid}:`, error);
            setError('Failed to unfollow user. Please try again.');
        } finally {
            setLoading(false);
        }
    }



    const deletePostHandler = async (user, PostToken, Authoruid) => {

        try {
            const result = await DeletePost(user, PostToken, Authoruid)
            fetchPosts()
            if (result.Succeed) {
                alert('post deleted ')
            } else {
               
            }
        } catch (error) {
            console.log('the deleting post message ', error.message);
        }
    }

    const updateProfile = async (e) => {
        e.preventDefault();

        if (!user || !user.uid) {
            setError("You must be logged in to update your profile");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const result = await updateUserProfile(updatedusername, updatedprofileimage);
            if (result.success) {
                await fetchUsers();
                
                setOpenEditProfile(false);
            }
        } catch (error) {
            console.error("Error updating profile:", error.message);
            setError(error.message);
        } finally {
            setLoading(false);
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

    if (!UserData) {
    return <Navigate to="/404" replace />;
    }
    return (
        <div className='flex justify-center  dark:bg-[#121212] bg-white min-h-[100vh]'>
            <div className='Profile-container  lg:w-[1150px] md:w-[100%] pl-6 pr-6 p-6 dark:text-white text-black mt-[45px] lg:flex md:flex sm:flex justify-between'>


                <div key={UserData?.userUid} className='posts w-[70%] sm:w-[80%] mt-[45px] '>

                    <div className='flex justify-center mt-[55px]'>
                        <div className='lg:w-[680px] lg:pr-4 w-full'>
                            <div className='pc-details flex justify-between mb-8'>
                                <h1 className='text-[36px]'> {UserData?.username}</h1>
                                <button className='opacity-70 hover:opacity-100'>
                                    <svg width="25" height="25" className='dark:fill-white'><path fill-rule="evenodd" d="M5 12.5q0 .828.586 1.414.585.585 1.414.586.828 0 1.414-.586.585-.586.586-1.414 0-.828-.586-1.414A1.93 1.93 0 0 0 7 10.5q-.828 0-1.414.586-.585.586-.586 1.414m5.617 0q0 .828.586 1.414.587.585 1.414.586.828 0 1.414-.586t.586-1.414-.586-1.414a1.93 1.93 0 0 0-1.414-.586q-.827 0-1.414.586-.586.586-.586 1.414m5.6 0q0 .828.586 1.414.585.585 1.432.586.827 0 1.413-.586t.587-1.414q0-.828-.587-1.414a1.93 1.93 0 0 0-1.413-.586q-.847 0-1.432.586t-.587 1.414z"></path></svg>
                                </button>
                            </div>
                            <div className='Profile-mobile hidden'>
                                <div className='flex justify-between items-center'>
                                    <div className='flex items-center gap-3'>
                                        <img src={UserData?.profileImage} className=' rounded-full h-24 w-24 object-cover' />
                                        <div>
                                            <h1 className='text-xl font-bold'> {UserData?.username}</h1>
                                            <p className='flex gap-2 text-gray-600'>{UserData?.Followers && typeof UserData?.Followers === 'object' ? Object.values(UserData?.Followers).length : ''}<span>Followers</span></p>
                                        </div>

                                    </div>
                                    {user ?
                                        <button
                                            onClick={() => {
                                                if (UserData?.userUid === user?.uid) {
                                                 
                                                    setOpenEditProfile(true);
                                                } else {
                                                
                                                    return UserData?.Followers?.[user.uid] === true ? unfollowUserHandler() : followUserHandler();
                                                }
                                            }}
                                            className="ml-4 pr-2 pl-2 p-1 mt-4 rounded-3xl border bg-black text-white hover:opacity-75 text-sm dark:bg-white dark:text-black"
                                            disabled={loading}

                                        >
                                            {(() => {
                                                if (UserData?.userUid === user?.uid) {
                                                    return 'EditProfile';
                                                }
                                                return UserData?.Followers?.[user?.uid] === true ? 'Unfollow' : 'Follow';
                                            })()}
                                        </button>
                                        : ''}
                                </div>

                            </div>
                            <div className='relative nav-buttons flex '>
                                <button className='pb-3 border-b border-b-black z-10 dark:border-b-white'>Home</button>
                                <hr className='absolute border bottom-0 border-b-gray-50 w-full dark:border-gray-800' />
                            </div>
                            <div className='mt-12'>
                                <div>
                                    <div className='Posts-container'>
                                        {loading ? (
                                            <div>
                                                <SkeletonPostCard />
                                                <hr className="border-1 border-gray-200 mt-6 mb-6 dark:border-gray-700" />
                                            </div>
                                        ) : UserPosts.length === 0 ? (
                                            <strong>No Posts Available</strong>
                                        ) : (UserPosts.map((post) => (
                                            <>

                                                <>
                                                    {user?.uid === post.authorUid ?
                                                        <>
                                                            <div className='flex justify-end mb-4'>
                                                                <button onClick={() => {
                                                                    setIsDeletePostOpen(true)

                                                                }}><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" class="ef dy eh eg"><path stroke="currentColor" stroke-linecap="round" d="m5 5 7 7m7 7-7-7m0 0 7-7m-7 7-7 7" className='dark:fill-white'></path></svg></button>
                                                            </div>
                                                            <div className='Delete-popup-page left-0 fixed top-0 z-40 h-screen flex justify-center items-center w-full' style={{
                                                                display: isdeletepostopen ? 'flex' : 'none',
                                                            }}>

                                                                <div className='Delete-popup text-center dark:text-white h-[100px] bg-white p-6 flex items-center  dark:bg-[#121212]'>
                                                                    <div >
                                                                        <p>Are you Sure You want to Delete this blog ? </p>
                                                                        <div className='flex gap-4 justify-center mt-2'>
                                                                            <button className='bg-red-700 p-2  rounded-full' onClick={() => {
                                                                                deletePostHandler(user, post.PostToken, user.uid);
                                                                                setIsDeletePostOpen(false)
                                                                            }}>Delete</button>
                                                                            <button onClick={() => setIsDeletePostOpen(false)}>Cancel</button>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </>
                                                        : ''}
                                                </>

                                                <Link to={`/Blogs/${post.PostToken}`}>
                                                    <div className='Post-card flex gap-8'>
                                                        <div>
                                                            <div>
                                                                <h1 className='font-bold  text-2xl mb-2 line-clamp-2'>{post.Title}</h1>
                                                                <p className='text-gray-700 dark:text-gray-500 line-clamp-2'>
                                                                    {post.contentBlocks.find((block) => block.type === 'paragraph')?.text.substr(0, 140) || 'No paragraph block found'}
                                                                </p>
                                                            </div>
                                                            <div className='flex justify-between mt-4 gap-4 text-gray-600'>
                                                                <div className='flex gap-4 items-center'>
                                                                    <p className='text-[14px]'>{new Date(post.createdAt).toLocaleDateString('en-US', {
                                                                        month: 'short',
                                                                        day: 'numeric',
                                                                    })}</p>
                                                                    <button className='flex items-center gap-1'>
                                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 16 16"><path fill="#6B6B6B" fill-rule="evenodd" d="m3.672 10.167 2.138 2.14h-.002c1.726 1.722 4.337 2.436 5.96.81 1.472-1.45 1.806-3.68.76-5.388l-1.815-3.484c-.353-.524-.849-1.22-1.337-.958-.49.261 0 1.56 0 1.56l.78 1.932L6.43 2.866c-.837-.958-1.467-1.108-1.928-.647-.33.33-.266.856.477 1.598.501.503 1.888 1.957 1.888 1.957.17.174.083.485-.093.655a.56.56 0 0 1-.34.163.43.43 0 0 1-.317-.135s-2.4-2.469-2.803-2.87c-.344-.346-.803-.54-1.194-.15-.408.406-.273 1.065.11 1.447.345.346 2.31 2.297 2.685 2.67l.062.06c.17.175.269.628.093.8-.193.188-.453.33-.678.273a.9.9 0 0 1-.446-.273S2.501 6.84 1.892 6.23c-.407-.406-.899-.333-1.229 0-.525.524.263 1.28 1.73 2.691.384.368.814.781 1.279 1.246m8.472-7.219c.372-.29.95-.28 1.303.244V3.19l1.563 3.006.036.074c.885 1.87.346 4.093-.512 5.159l-.035.044c-.211.264-.344.43-.74.61 1.382-1.855.963-3.478-.248-5.456L11.943 3.88l-.002-.037c-.017-.3-.039-.71.203-.895" clip-rule="evenodd"></path></svg><p className='text-xs'>{post?.Likes}</p></button>
                                                                    <button className='flex items-center gap-1'>
                                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#6B6B6B" viewBox="0 0 16 16"><path fill="#6B6B6B" d="M12.344 11.458A5.28 5.28 0 0 0 14 7.526C14 4.483 11.391 2 8.051 2S2 4.483 2 7.527c0 3.051 2.712 5.526 6.059 5.526a6.6 6.6 0 0 0 1.758-.236q.255.223.554.414c.784.51 1.626.768 2.512.768a.37.37 0 0 0 .355-.214.37.37 0 0 0-.03-.384 4.7 4.7 0 0 1-.857-1.958v.014z"></path></svg>
                                                                        <p className='text-xs'><p>{post?.comments && typeof post?.comments === 'object' ? Object.values(post.comments).length : ''}</p></p>
                                                                    </button>
                                                                </div>
                                                                <div className='flex items-center gap-3'>
                                                                    <svg className='opacity-60 hover:opacity-100 dark:fill-white fill-black' xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" ><path d="M17.5 1.25a.5.5 0 0 1 1 0v2.5H21a.5.5 0 0 1 0 1h-2.5v2.5a.5.5 0 0 1-1 0v-2.5H15a.5.5 0 0 1 0-1h2.5zm-11 4.5a1 1 0 0 1 1-1H11a.5.5 0 0 0 0-1H7.5a2 2 0 0 0-2 2v14a.5.5 0 0 0 .8.4l5.7-4.4 5.7 4.4a.5.5 0 0 0 .8-.4v-8.5a.5.5 0 0 0-1 0v7.48l-5.2-4a.5.5 0 0 0-.6 0l-5.2 4z"></path></svg>
                                                                    <svg className='opacity-80 hover:opacity-100 ' xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path fill="currentColor" fill-rule="evenodd" d="M4.385 12c0 .55.2 1.02.59 1.41.39.4.86.59 1.41.59s1.02-.2 1.41-.59c.4-.39.59-.86.59-1.41s-.2-1.02-.59-1.41a1.93 1.93 0 0 0-1.41-.59c-.55 0-1.02.2-1.41.59-.4.39-.59.86-.59 1.41m5.62 0c0 .55.2 1.02.58 1.41.4.4.87.59 1.42.59s1.02-.2 1.41-.59c.4-.39.59-.86.59-1.41s-.2-1.02-.59-1.41a1.93 1.93 0 0 0-1.41-.59c-.55 0-1.03.2-1.42.59s-.58.86-.58 1.41m5.6 0c0 .55.2 1.02.58 1.41.4.4.87.59 1.43.59s1.03-.2 1.42-.59.58-.86.58-1.41-.2-1.02-.58-1.41a1.93 1.93 0 0 0-1.42-.59c-.56 0-1.04.2-1.43.59s-.58.86-.58 1.41" clip-rule="evenodd"></path></svg>
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
                                                <hr className='border-1 border-gray-200 mt-6 mb-6 dark:border-gray-700' />
                                            </>
                                        )))}
                                    </div>

                                </div>
                            </div>
                            <div>

                            </div>
                        </div>


                    </div>
                </div>
                <div className="Profile-Details min-h-[86vh] dark:border-l-gray-700 border-l border-l-[#F2F2F2]">
                    <div className=' sticky top-[50px]  flex justify-center'>
                        <div className='pl-6  lg:pl-12 h-[50%] mt-[55px] '>

                            <img src={UserData?.profileImage} className='rounded-full h-24 w-24 object-cover' />
                            <h1 className='text-[18px] mt-4 font-bold'>{UserData?.username}</h1>
                            <p className='flex gap-2 text-gray-600'> {(UserData?.Followers && typeof UserData.Followers === 'object'
                                ? Object.values(UserData.Followers).filter(value => value === true).length
                                : 0)}<span>Followers</span></p>
                            <p className='flex gap-2 text-gray-600'>{UserData?.Biography && typeof UserData?.Biography === 'string' ? UserData.Biography : ''}</p>
                            {user ?
                                <button
                                    onClick={() => {
                                        if (UserData?.userUid === user?.uid) {
                                           
                                            setOpenEditProfile(true);
                                        } else {
                                        
                                            return UserData?.Followers?.[user.uid] === true ? unfollowUserHandler() : followUserHandler();
                                        }
                                    }}
                                    className="pr-2 pl-2 p-1 mt-4 rounded-3xl border bg-black text-white hover:opacity-75 text-sm dark:bg-white dark:text-black"
                                    disabled={loading}

                                >
                                    {(() => {
                                        if (UserData?.userUid === user?.uid) {
                                            return 'EditProfile';
                                        }
                                        return UserData?.Followers?.[user?.uid] === true ? 'Unfollow' : 'Follow';
                                    })()}
                                </button>
                                : ''}
                                {FollowingUsers.length > 0 ?
                            <h1 className='text-[16px] mt-8 font-bold'>Following</h1>
                            :''}
                            <div className='mt-5'>
                                <div >
                                    {FollowingUsers.slice(0, 5).map((user) => (
                                        <Link to={`/Profile/${user.userUid}`} className='flex gap-2 hover:underline hover:cursor-pointer mb-2' key={user.userUid}>
                                            <img src={user.profileImage} className='h-6 w-6 rounded-full' />
                                            <h1 className='hover:underline line-clamp-1'>{user.username}</h1>
                                        </Link>
                                    ))}

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div >
                    {openeditprofile ?
                        <div className='Edit-container fixed right-0 z-10 top-[72px] left-0 h-full flex justify-center '>
                            <div className='w-[80%]  lg:w-[1400px] md:w-[80%] flex justify-center p-6 mt-[20px]'>
                                <form onSubmit={updateProfile} className='lg:w-[600px] md:w-[500px] w-[320px] relative dark:bg-[#2D2D2D] bg-white z-10 p-6 border-[#2D2D2D] border h-[500px]'>
                                    <div className='flex   justify-center'>


                                        <img src={UserProfile?.profileImage} className=' rounded-full h-24 w-24 object-cover' />
                                    </div>
                                    <div className='mt-4'>
                                        <p>Profile Image</p>
                                        <input placeholder='Profile Picture URL ' className='bg-transparent pt-4 pb-4' value={updatedprofileimage} onChange={(e) => setUpdatedProfileImage(e.target.value)} />
                                        <p>First Name</p>
                                        <input value={updatedusername} onChange={(e) => setUpdatedUsername(e.target.value)} placeholder={UserProfile?.username} className='bg-transparent pt-4 pb-4' />
                                        <p>Email</p>
                                        <input placeholder={UserProfile?.email} value={updatedemail} onChange={(e) => setUpdatedEmail(e.target.value)} className='bg-transparent pt-4 pb-4' />

                                    </div>
                                    <button type='submit' className='w-full bg-black text-white pt-3 pb-3 rounded-lg mt-4'>Apply</button>
                                    <div className='absolute top-2 right-2 cursor-pointer' onClick={() => setOpenEditProfile(false)}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" class="ef dy eh eg"><path stroke="currentColor" stroke-linecap="round" d="m5 5 7 7m7 7-7-7m0 0 7-7m-7 7-7 7" class="dark:fill-white"></path></svg>
                                    </div>
                                </form>
                            </div>
                        </div>
                        : ''}
                </div>
            </div>
        </div>
    )
}

export default Profile
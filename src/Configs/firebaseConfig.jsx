import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider,updateProfile } from "firebase/auth";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import { getDatabase, ref, set,get, query, orderByChild ,push,child,update,runTransaction,remove} from "firebase/database";
import { useNavigate } from "react-router-dom";
import ProfileHolder from '../Assets/images/ProfileHolder.jpg';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  databaseURL:process.env.REACT_APP_FIREBASE_DATABASEURL,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
};





console.log("Firebase Config:", firebaseConfig); // Debug config
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const storage = getStorage(app);
export const database = getDatabase(app);



export const syncUserWithImage = async (user, username, imageFile) => {
  if (!user) return;

  let imageUrl = user.photoURL || 'https://imgur.com/PmxW4E3.png'; 
  if (imageFile) {
    const imageRef = storageRef(storage, `profileImages/${user.uid}`);
    await uploadBytes(imageRef, imageFile);
    imageUrl = await getDownloadURL(imageRef);
  }

  await update(ref(database, `users/${user.uid}`), {
    userUid:user.uid,
    email: user.email,
    username: username || "Anonymous",
    profileImage: imageUrl,
    
  });
};




export const PostBlog = async (contentBlocks,title,thumbnailUrl, tags, category, user, Token) => {
  try {
    
   
    if (!user?.uid) throw new Error('User must be authenticated');
    if (!category || category.trim() === '') throw new Error('Category is required');
    if (!Token || typeof Token !== 'string') throw new Error('Token must be a valid string');
    if (!Array.isArray(contentBlocks) || contentBlocks.length === 0) throw new Error('Content blocks are required and must be a non-empty array');

  
    if (!isValidUrl(thumbnailUrl)) {
      throw new Error(`Invalid Url`);
    }
      
    for (const [index, block] of contentBlocks.entries()) {
      if (!block.type || !['header', 'paragraph', 'image'].includes(block.type)) {
        throw new Error(`Block at index ${index} must have a valid type: header, paragraph, or image`);
      }
      if (block.type === 'image') {
        if (!block.url || typeof block.url !== 'string' || block.url.trim() === '') {
          throw new Error(`Image block at index ${index} must have a non-empty URL`);
        }
        if (!isValidUrl(block.url)) {
          throw new Error(`Image block at index ${index} has an invalid URL`);
        }
      } else {
        if (!block.text || typeof block.text !== 'string' || block.text.trim() === '') {
          throw new Error(`${block.type} block at index ${index} must have non-empty text`);
        }
      }
    }

    // Prepare post data
    const postData = {
      
      PostToken: Token,
      Title:title,
      ImageUrl:thumbnailUrl,
      authorUid: user.uid,
      tags: tags || '',
      category: category.trim(),
      contentBlocks: contentBlocks.map((block) => {
        const cleanedBlock = { type: block.type };
        if (block.type === 'image') {
          cleanedBlock.url = block.url.trim();
        } else {
          cleanedBlock.text = block.text.trim();
        }
        return cleanedBlock;
      }),
      createdAt: Date.now(),
    };
    console.log('Post data:', postData);

    // Write to specific Token path
    const postRef = ref(database, `posts/${Token}`);
    console.log('Post ref:', postRef.toString());
    console.log('Writing to database...');
    await set(postRef, postData);
    console.log('Write successful');

    return { success: true, postId: Token };
  } catch (error) {
    console.error('Error posting blog:', error.code, error.message, error.stack);
    return { success: false, error: error.message };
  }
};
export const DeletePost = async (user,PostToken,Authoruid) => {

  if(Authoruid && Authoruid != 'string'){
    console.log('Invalid post uid');
  }
  if(user?.uid !== Authoruid){
    console('cannot delete post that its not yours you dumb shit');
  }

  try {
    const PostRef = ref(database, `posts/${PostToken}`);
    await remove(PostRef);


  } catch (error) {
    
  }
}


const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};


export async function fetchPosts() {
  try {
    const postsRef = ref(database, '/posts');
    // Order by createdAt to get posts in chronological order
    const postsQuery = query(postsRef, orderByChild('createdAt'));
    const snapshot = await get(postsQuery);

    if (!snapshot.exists()) {
      return []; // Return empty array if no posts exist
    }

    // Convert Firebase object to array of posts
    const posts = Object.entries(snapshot.val()).map(([pushKey, post]) => ({
      pushKey,
      ...post,
    }));

    return posts;
  } catch (error) {
    console.error('Error fetching posts:', error.code, error.message);
    throw new Error(`Failed to fetch posts: ${error.message}`); // Throw to allow caller to handle
  }
}


export async function addComment(postId, commentatorUid, content) {
  try {
    if(content.length<2) throw new Error('Comment is too short ');
    const commentRef = ref(database, `posts/${postId}/comments`);
    const newCommentRef = push(commentRef); 
    await set(newCommentRef, {
      commentatorUid: commentatorUid,
      content: content,
      createdAt: Date.now()
    });
   
    
  } catch (error) {
    console.error("Error adding comment:", error);
  }
}

export async function addLikes(numberOfLikes, postId) {
  try {

    if (!postId || typeof postId !== 'string') {
      throw new Error('Invalid postId');
    }
    if (typeof numberOfLikes !== 'number' || numberOfLikes <= 0) {
      throw new Error('numberOfLikes must be a positive number');
    }

    const likeRef = ref(database, `posts/${postId}`);
    const snapshot = await get(likeRef); 

    if (!snapshot.exists()) {
      throw new Error(`Post with ID ${postId} does not exist`);
    }

    const postData = snapshot.val();
    const prevLikes = postData.Likes || 0; 


    await update(likeRef, {
      Likes: prevLikes + numberOfLikes,
    });

    console.log('Like added successfully');
    return { success: true, message: 'Like added' }; 
  } catch (error) {
    console.error('Error adding Likes:', error);
    return { success: false, message: error.message }; 
  }
}



export async function followUser(followerId, userId) {
  try {
    // Validate inputs
    if (!followerId || !userId || followerId === userId) {
      return { success: false, message: 'Invalid follower or user ID' };
    }

    // Check if user exists
    const userRef = ref(database, `users/${userId}`);
    const userSnapshot = await get(userRef);
    if (!userSnapshot.exists()) {
      return { success: false, message: 'User does not exist' };
    }

    // Check if follower exists
    const followerRef = ref(database, `users/${followerId}`);
    const followerSnapshot = await get(followerRef);
    if (!followerSnapshot.exists()) {
      return { success: false, message: 'Follower does not exist' };
    }

    // Check if already following
    const followersRef = ref(database, `users/${userId}/Followers/${followerId}`);
    const followerCheck = await get(followersRef);
    if (followerCheck.exists() && followerCheck.val() === true) {
      return { success: false, message: 'Already following this user' };
    }

    // Perform atomic update
    await update(ref(database), {
      [`users/${userId}/Followers/${followerId}`]: true,
      [`users/${followerId}/Following/${userId}`]: true,
    });

    return { success: true, message: 'Follow added successfully' };
  } catch (error) {
    console.error('Error adding follow:', { followerId, userId, error });
    return { success: false, message: error.message || 'Failed to follow user' };
  }
}

export async function unfollowUser(followerId, userId) {
  try {
    // Validate user and follower existence
    const userRef = ref(database, `users/${userId}`);
    const userSnapshot = await get(userRef);
    if (!userSnapshot.exists()) {
      return { success: false, message: 'User does not exist' };
    }

    const followerRef = ref(database, `users/${followerId}`);
    const followerSnapshot = await get(followerRef);
    if (!followerSnapshot.exists()) {
      return { success: false, message: 'Follower does not exist' };
    }

    // Check if the follower is actually following the user
    const followersRef = ref(database, `users/${userId}/Followers/${followerId}`);
    const followerCheck = await get(followersRef);
    if (!followerCheck.exists() || followerCheck.val() === false) {
      return { success: false, message: 'Not following this user' };
    }

    // Set follower relationship to false
    await update(userRef, {
      [`Followers/${followerId}`]: false,
    });

    // Set following relationship to false
    await update(followerRef, {
      [`Following/${userId}`]: false,
    });

    return { success: true, message: 'Unfollowed successfully' };
  } catch (error) {
    console.error('Error unfollowing user:', error);
    return { success: false, message: error.message || 'Failed to unfollow user' };
  }
}

export const deleteComment = async (postId, commentId) => {
  try {
    const commentRef = ref(database, `posts/${postId}/comments/${commentId}`);
    await remove(commentRef);
    return { success: true };
  } catch (error) {
    return { success: false, message: error.message };
  }
};


export async function updateUserProfile(displayName, photoURL) {
  const user = auth.currentUser;

  if (!user) {
    throw new Error("No user is signed in.");
  }

  try {
    // Prepare the profile update object for Authentication
    const authUpdate = {
      displayName: displayName || user.displayName,
      photoURL: photoURL || user.photoURL,
    };

    // Update Firebase Authentication profile
    await updateProfile(user, authUpdate);

    // Prepare the update object for Realtime Database
    const dbUpdate = {
      username: authUpdate.displayName,
      profileImage: authUpdate.photoURL,
    };

   
    const userRef = ref(database, `users/${user.uid}`);
    await update(userRef, dbUpdate);

    console.log("Profile updated successfully!");
    return { success: true };
  } catch (error) {
    console.error("Error updating profile:", error.message);
    throw error;
  }
}


export async function likeComment(postId, commentId, numberOfLikes) {
  try {
   
    if (!postId || typeof postId !== 'string') {
      throw new Error('Invalid postId: Must be a non-empty string');
    }
    if (!commentId || typeof commentId !== 'string') {
      throw new Error('Invalid commentId: Must be a non-empty string');
    }
    if (typeof numberOfLikes !== 'number' || !Number.isInteger(numberOfLikes) || numberOfLikes <= 0) {
      throw new Error('numberOfLikes must be a positive integer');
    }

    
    const commentRef = ref(database, `posts/${postId}/comments/${commentId}`);

    
    const snapshot = await get(commentRef);
    if (!snapshot.exists()) {
      throw new Error(`Comment with ID ${commentId} does not exist`);
    }

    
    await runTransaction(commentRef, (currentData) => {
      if (!currentData) {
        return { Likes: numberOfLikes };
      }
      const newLikes = (currentData.Likes || 0) + numberOfLikes;
      return { ...currentData, Likes: newLikes };
    });

    console.log('Like added successfully');
    return { success: true, message: 'Like added' };
  } catch (error) {
    console.error('Error adding likes:', error);
    return { success: false, message: error.message };
  }
}
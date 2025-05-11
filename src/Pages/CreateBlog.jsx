import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../Context/AuthContext';
import { PostBlog } from '../Configs/firebaseConfig';

function CreateBlog() {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState('');
  const [contentBlocks, setContentBlocks] = useState([]);
  const  user  = useContext(AuthContext); 
  const [thumbnailimg,setThumbnailImg] = useState('');
  const navigate = useNavigate();
 

 



  const addBlock = (type) => {
    setContentBlocks([...contentBlocks, { type, text: type !== 'image' ? '' : undefined, url: type === 'image' ? '' : undefined }]);
  };


  const updateBlock = (index, field, value) => {
    const updatedBlocks = [...contentBlocks];
    updatedBlocks[index] = { ...updatedBlocks[index], [field]: value };
    setContentBlocks(updatedBlocks);
  };

  
  const deleteBlock = (index) => {
    setContentBlocks(contentBlocks.filter((_, i) => i !== index));
  };


  const moveBlock = (index, direction) => {
    const updatedBlocks = [...contentBlocks];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex >= 0 && newIndex < contentBlocks.length) {
      [updatedBlocks[index], updatedBlocks[newIndex]] = [updatedBlocks[newIndex], updatedBlocks[index]];
      setContentBlocks(updatedBlocks);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await PostBlog(
   
      contentBlocks,
      title,
      thumbnailimg,
      tags,
      category,
      { uid: user.uid }, 
      crypto.randomUUID() 
    );
    if (result.success) {
      console.log('Post created with ID:', result.postId);
      navigate('/Blogs');
    } else {
      console.error('Failed to create post:', result.error);
    }
  };
  return (
    <div className="w-full min-h-screen dark:bg-[#121212] dark:text-white ">
           <form className="max-w-4xl mx-auto p-4  "  onSubmit={handleSubmit} >
            <div className='text-center  mt-[80px]'>
                
            </div>
      <div className="space-y-4 ">
        <div>
          
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 block w-full lg:text-5xl text-3xl rounded-md p-2 bg-transparent"
            placeholder="Title"
          />
        </div>
        <div>
          
          <input
            type="text"
            value={thumbnailimg}
            onChange={(e) => setThumbnailImg(e.target.value)}
             className="mt-1 block w-full lg:text-2xl text-xl rounded-md p-2 bg-transparent"
            placeholder="ThumbNail Image Url"
          />
        </div>
        <div>
        
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
             className="mt-1 block w-full lg:text-2xl text-xl rounded-md p-2 bg-transparent"
            placeholder="Category"
          />
        </div>
        <div>
       
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
             className="text-gray-600 mt-1 block w-full lg:text-2xl text-xl rounded-md p-2 bg-transparent"
            placeholder="Tags"
          />
        </div>
        <div>
          
          {contentBlocks.map((block, index) => (
            <div key={index} className="  mb-4 rounded-md ">
              <div className="flex justify-end items-center mb-2">
             
                <div className="space-x-2">
                  <button
                    onClick={() => moveBlock(index, 'up')}
                    disabled={index === 0}
                    className="text-blue-600 disabled:text-gray-400 bg-transparent"
                  >
                    ↑
                  </button>
                  <button
                    onClick={() => moveBlock(index, 'down')}
                    disabled={index === contentBlocks.length - 1}
                    className="text-blue-600 disabled:text-gray-400 bg-transparent"
                  >
                    ↓
                  </button>
                 
              <button className='opacity-60 hover:opacity-100' onClick={() => deleteBlock(index)}><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" class="ef dy eh eg"><path stroke="currentColor" stroke-linecap="round" d="m5 5 7 7m7 7-7-7m0 0 7-7m-7 7-7 7"></path></svg></button>

                </div>
              </div>
              {block.type === 'image' ? (
                <input
                  type="text"
                  value={block.url || ''}
                  onChange={(e) => updateBlock(index, 'url', e.target.value)}
                   className="mt-1 block w-full lg:text-2xl text-xl rounded-md p-2 outline-none bg-transparent"
                   placeholder="Image Url"
                />
              ) : (
                <textarea
                  value={block.text || ''}
                  onChange={(e) => updateBlock(index, 'text', e.target.value)}
                   className={`${block.type ==='header' ? 'Strong w-full bg-transparent mt-1 block w-full lg:text-xl text-lg rounded-md p-2 outline-none dark:text-white':' mt-1 block w-full lg:text-xl text-lg rounded-md p-2 outline-none bg-transparent'}`}
                  
                  placeholder={`Enter ${block.type} content`}
                  rows={block.type === 'header' ? 2 : 4}
                />
              )}
            </div>
          ))}
          <div className="space-x-2">
            <button
              onClick={() => addBlock('header')}
              className="bg-black text-white px-4 py-2 mt-2 rounded-md hover:opacity-80 dark:bg-white dark:border-white dark:text-black"
            >
              Add Header
            </button>
            <button
              onClick={() => addBlock('paragraph')}
              className="bg-black text-white px-4 py-2  mt-2 rounded-md hover:opacity-80 dark:bg-white dark:border-white dark:text-black" 
            >
              Add Paragraph
            </button>
            <button
              onClick={() => addBlock('image')}
              className="bg-black text-white px-4 py-2  mt-2 rounded-md hover:opacity-80 dark:bg-white dark:border-white dark:text-black"
            >
              Add Image
            </button>
          </div>
        </div>
        <button
         
          type='submit'
          className="border border-black  text-black px-6 py-2 rounded-md hover:opacity-80 dark:border-white dark:text-white"
        >
          Submit Post
        </button>
      </div>
    </form>
    </div>
  );
}

export default CreateBlog;
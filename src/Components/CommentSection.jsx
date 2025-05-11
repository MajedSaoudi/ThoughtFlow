import React from 'react'

function CommentSection({ Comments }) {
  const CommentsLength = Comments.length();
  return (
    <div className='fixed h-[100vh] w-full'>
      <div className='absolute right-0 p-3 h-full w-[400px]'>
        {Comments.map((comment) => (
          <div className='flex justify-between mt-2'>
            <h1>Reponses({CommentsLength})</h1>
            <button ><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" class="ef dy eh eg"><path stroke="currentColor" stroke-linecap="round" d="m5 5 7 7m7 7-7-7m0 0 7-7m-7 7-7 7"></path></svg></button>
          </div>
        ))}
        <hr />
        <div>
          
        </div>
      </div>
    </div>
  )
}

export default CommentSection
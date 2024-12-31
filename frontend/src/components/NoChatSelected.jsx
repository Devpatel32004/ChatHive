import { MessageSquare } from 'lucide-react'
import React from 'react'

const NoChatSelected = () => {
  return (
    <div className='w-full bg-base-100 flex items-center justify-center'>
      <div className='max-w-md w-full text-center space-y-6'>
        <div className='flex justify-center items-center  animate-bounce'>
          <div className='p-3 sm:p-4 bg-primary/20 rounded-lg'><MessageSquare className='size-10 sm:size-12 text-primary' /></div>
        </div>
        <div className='font-bold text-xl'>
          Welcome to Chatty!
        </div>
        <p className='text-base-content/60'>
          Select a conversation from the sidebar to start chatting
        </p>
      </div>
    </div>
  )
}

export default NoChatSelected

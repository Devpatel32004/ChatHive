import React from 'react'
import NoChatSelected from '../components/NoChatSelected'
import ChatContainer from '../components/ChatContainer'
import Sidebar from "../components/Sidebar"
import { useChatStore } from '../store/useChatStore'

const Home = () => {
  const {selectedUser} = useChatStore();
  return (
     <div className='h-screen bg-base-200'>
      <div className='flex items-center justify-center px-4 pt-8 sm:pt-10 rounded-lg h-full'>
        <div className='h-[calc(100vh-8rem)] rounded-lg mx-auto bg-base-100 max-w-6xl w-full'>
          <div className='flex h-full rounded-lg overflow-hidden'>
            <Sidebar />
            {!selectedUser ? <NoChatSelected /> : <ChatContainer /> }
          </div>
        </div>
      </div>
     </div>
  )
}

export default Home

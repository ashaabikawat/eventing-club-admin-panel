import React from 'react'
import { useNavigate } from 'react-router-dom'

const EventingClubePage = () => {

  const navigate = useNavigate()

  return (
    <div>
      <div className='w-full h-[100vh] flex flex-col justify-center items-center space-y-4'>
        <button 
          className='flex items-center text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-3 py-2 text-center dark:border-blue-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900' 
          onClick={() => navigate("/superAdmin")}
        >
          Super Admin Login 
        </button>

        <button 
          className='flex items-center text-purple-700 hover:text-white border border-purple-700 hover:bg-purple-800 focus:ring-4 focus:outline-none focus:ring-purple-300 font-medium rounded-lg text-sm px-3 py-2 text-center dark:border-purple-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900' 
          onClick={() => navigate("/organizerlogin")}
        >
          Organizer Login 
        </button>

        <button 
          className='flex items-center text-green-700 hover:text-white border border-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-3 py-2 text-center dark:border-green-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900' 
          onClick={() => navigate("/promoterlogin")}
        >
          Promoter Login 
        </button>

        
      </div>
    </div>
  )
}

export default EventingClubePage

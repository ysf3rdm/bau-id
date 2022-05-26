import React from 'react'
import Mainbar from './components/Mainbar'
import Sidebar from './components/Sidebar'

export default function Profile() {
  return (
    <div className="mt-[40px]">
      <div className="flex">
        {/* SideBar Component */}
        <Sidebar className="mr-[32px]" />
        <Mainbar />
      </div>
    </div>
  )
}

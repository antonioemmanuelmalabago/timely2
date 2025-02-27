import React from 'react'
import { MdOutlineSearch } from 'react-icons/md'
import { useDispatch, useSelector } from 'react-redux'
import { CiMenuBurger } from 'react-icons/ci'
import { setOpenSidebar } from '../redux/slices/authSlice'
import UserAvatar from './UserAvatar'
import NotificationPanel from './NotificationPanel'

const Navbar = () => {
  const { user } = useSelector((select) => select.auth)
  const dispatch = useDispatch()

  return (
    <div className="flex justify-between items-center bg-white px-4 py-3 sticky z-15 top-0">
      <div className="flex gap-4">
        <button
          onClick={() => dispatch(setOpenSidebar(true))}
          className="text-2xl text-gray-500 block md:hidden"
        >
          <CiMenuBurger />
        </button>

        <div className="w-64 2xl:w-[300px] flex items-center py-2 px-3 gap-2 rounded-full bg-[#f3f4f6]">
          <MdOutlineSearch />

          <input
            type="text"
            placeholder="Search tasks..."
            className="flex-1 outline-none bg-transparent placeholder:text-gray-500 text-gray-800"
          />
        </div>
      </div>

      <div className="flex gap-2 items-center">
        <NotificationPanel />
        <UserAvatar />
      </div>
    </div>
  )
}

export default Navbar

import React, { Fragment, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BsThreeDots } from 'react-icons/bs'
import { HiDuplicate } from 'react-icons/hi'
import { FaRegFolderOpen } from 'react-icons/fa'
import { MdAdd, MdOutlineEdit } from 'react-icons/md'
import { RiDeleteBin6Line } from 'react-icons/ri'
import { Menu, Transition } from '@headlessui/react'
import AddTask from './AddTask'
import AddSubTask from './AddSubTask'
import ConfirmationDialog from '../Dialogs'
import {
  useDuplicateTaskMutation,
  useTrashTaskMutation,
} from '../../redux/slices/api/taskApiSlice'
import { toast } from 'sonner'

const TaskDialog = ({ task }) => {
  const [open, setOpen] = useState(false)
  const [openEdit, setOpenEdit] = useState(false)
  const [openDialog, setOpenDialog] = useState(false)

  const navigate = useNavigate()
  const [deleteTask] = useTrashTaskMutation()
  const [duplicateTask] = useDuplicateTaskMutation()

  const duplicateHandler = async () => {
    try {
      const res = await duplicateTask(task._id).unwrap()

      toast.success(res?.message)

      setTimeout(() => {
        setOpenDialog(false)
        window.location.reload()
      }, 500)
    } catch (error) {
      console.log(error)
      toast.error(error?.data?.message || error.error)
    }
  }

  const deleteClicks = () => {
    setOpenDialog(true)
  }

  const deleteHandler = async () => {
    try {
      const res = await deleteTask({
        id: task._id,
        isTrashed: 'trash',
      }).unwrap()

      toast.success(res?.message)

      setTimeout(() => {
        setOpenDialog(false)
        window.location.reload()
      }, 500)
    } catch (error) {
      console.log(error)
      toast.error(error?.data?.message || error.error)
    }
  }

  const items = [
    {
      label: 'Open Task',
      icon: <FaRegFolderOpen className="mr-2 h-5 w-5" aria-hidden="true" />,
      onClick: () => navigate(`/task/${task._id}`),
    },
    {
      label: 'Edit',
      icon: <MdOutlineEdit className="mr-2 h-5 w-5" aria-hidden="true" />,
      onClick: () => setOpenEdit(true),
    },
    {
      label: 'Add Sub-Task',
      icon: <MdAdd className="mr-2 h-5 w-5" aria-hidden="true" />,
      onClick: () => setOpen(true),
    },
    {
      label: 'Duplicate',
      icon: <HiDuplicate className="mr-2 h-5 w-5" aria-hidden="true" />,
      onClick: () => duplicateHandler(),
    },
  ]

  return (
    <>
      <div>
        <Menu as="div" className="relative inline-block text-left z-10">
          <Menu.Button className="inline-flex w-full justify-center rounded-md px-4 py-2 text-md">
            <BsThreeDots className="h-5 w-5" />
          </Menu.Button>

          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="absolute p-2 right-0 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none">
              <div className="px-1 py-1 space-y-2">
                {items.map((item) => (
                  <Menu.Item key={item.label}>
                    {({ active }) => (
                      <button
                        onClick={item?.onClick}
                        className={`${
                          active ? 'bg-[#4A90E2] text-white' : 'text-gray-600'
                        } group flex w-full items-center text-center rounded-md px-2 py-2 text-md`}
                      >
                        {item.icon}
                        {item.label}
                      </button>
                    )}
                  </Menu.Item>
                ))}
              </div>

              <div className="px-1 py-1">
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={() => deleteClicks()}
                      className={`${
                        active ? 'bg-blue-600 text-white' : 'text-gray-600'
                      } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                    >
                      <RiDeleteBin6Line
                        className="mr-2 h-5 w-5"
                        aria-hidden="true"
                      />
                      Delete
                    </button>
                  )}
                </Menu.Item>
              </div>
            </Menu.Items>
          </Transition>
        </Menu>
      </div>

      <AddTask
        open={openEdit}
        setOpen={setOpenEdit}
        task={task}
        key={new Date().getTime()}
      />

      <AddSubTask open={open} setOpen={setOpen} id={task._id} />

      <ConfirmationDialog
        open={openDialog}
        setOpen={setOpenDialog}
        onClick={deleteHandler}
      />
    </>
  )
}

export default TaskDialog

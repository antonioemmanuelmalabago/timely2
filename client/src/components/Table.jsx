import clsx from 'clsx'
import React, { useState } from 'react'
import { BiMessageAltDetail } from 'react-icons/bi'
import {
  MdAttachFile,
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
  MdKeyboardDoubleArrowUp,
} from 'react-icons/md'
import { toast } from 'sonner'
import { BGS, TASK_TYPE, formatDate } from '../utils'
import { PRIORITYSTYLES } from '../utils'
import { FaList } from 'react-icons/fa'
import UserInfo from './UserInfo'
import Button from './Button'
import ConfirmationDialog from './Dialogs'
import { useTrashTaskMutation } from '../redux/slices/api/taskApiSlice'
import AddTask from './task/AddTask'

const ICONS = {
  high: <MdKeyboardDoubleArrowUp />,
  medium: <MdKeyboardArrowUp />,
  normal: <MdKeyboardArrowDown />,
}

const Table = ({ tasks }) => {
  const [openDialog, setOpenDialog] = useState(false)
  const [selected, setSelected] = useState(null)
  const [openEdit, setOpenEdit] = useState(false)

  const [trashTask] = useTrashTaskMutation()

  const deleteClicks = (id) => {
    setSelected(id)
    setOpenDialog(true)
  }

  const editTaskHandler = (el) => {
    setSelected(el)
    setOpenEdit(true)
  }

  const deleteHandler = async () => {
    try {
      const res = await trashTask({
        id: selected,
        isTrash: 'trash',
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

  const TableHeader = () => (
    <thead className="w-full border-b border-gray-300">
      <tr className="w-full text-black text-left">
        <th className="p-2">Task Title</th>
        <th className="py-2">Priority</th>
        <th className="py-2 line-clamp-1">Created At</th>
        <th className="py-2">Assets</th>
        <th className="py-2">Team</th>
        <th className="py-2 text-center">Options</th>
      </tr>
    </thead>
  )

  const TableRow = ({ task }) => (
    <tr className="border-b border-gray-200 text-gray-600 hover:bg-gray-300/10">
      <td className="p-2">
        <div className="flex items-center gap-2">
          <div
            className={clsx('w-4 h-4 rounded-full', TASK_TYPE[task.stage])}
          />
          <p className="min-w-[200px] md:w-full line-clamp-2 text-base text-black">
            {task?.title}
          </p>
        </div>
      </td>

      <td className="py-2">
        <div className="min-w-[100px] md:w-full flex gap-1 items-center">
          <span className={clsx('text-lg', PRIORITYSTYLES[task?.priority])}>
            {ICONS[task?.priority]}
          </span>
          <span className="capitalize line-clamp-1">{task?.priority}</span>
        </div>
      </td>

      <td className="py-2">
        <div className="min-w-[110px] md:w-full">
          <span className="text-sm text-gray-600">
            {formatDate(new Date(task?.date))}
          </span>
        </div>
      </td>

      <td className="py-2">
        <div className="min-w-[110px] md:w-full flex items-center gap-2 md:gap-3">
          <div className="flex gap-0 md:gap-1 items-center text-sm text-gray-600">
            <BiMessageAltDetail />
            <span>{task?.activities?.length}</span>
          </div>
          <div className="flex gap-0 md:gap-1 items-center text-sm text-gray-600">
            <MdAttachFile />
            <span>{task?.assets?.length}</span>
          </div>
          <div className="flex gap-1 items-center text-sm text-gray-600">
            <FaList />
            <span>{task?.subTasks?.length}</span>
          </div>
        </div>
      </td>

      <td className="py-2">
        <div className="min-w-[90px] w-full flex">
          {task?.team?.map((m, index) => (
            <div
              key={m._id}
              className={clsx(
                'w-7 h-7 rounded-full text-white flex items-center justify-center text-sm -mr-1',
                BGS[index % BGS?.length]
              )}
            >
              {<UserInfo user={m} />}
            </div>
          ))}
        </div>
      </td>

      <td className="py-2 flex gap-1 md:gap-4 justify-center">
        <Button
          className="text-blue-600 hover:text-blue-500 sm:px-0 text-sm md:text-base"
          label="Edit"
          type="button"
          onClick={() => editTaskHandler(task)}
        />
        <Button
          className="text-red-700 hover:text-red-500 sm:px-0 text-sm md:text-base"
          label="Delete"
          type="button"
          onClick={() => deleteClicks(task._id)}
        />
      </td>
    </tr>
  )

  return (
    <>
      <div className="bg-white px-2 md:px-4 pt-4 mt-6 pb-9 shadow-md rounded">
        <div className="overflow-x-auto">
          <table className="w-full">
            <TableHeader />
            <tbody>
              {tasks.map((task, index) => (
                <TableRow key={index} task={task} />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmationDialog
        open={openDialog}
        setOpen={setOpenDialog}
        onClick={deleteHandler}
      />

      <AddTask
        open={openEdit}
        setOpen={setOpenEdit}
        task={selected}
        key={new Date().getTime()}
      />
    </>
  )
}

export default Table

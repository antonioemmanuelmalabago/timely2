import express from 'express'
import { isAdminRoute, protectRoute } from '../middlewares/authMiddleware.js'
import {
  activateUserProfile,
  changeUserPassword,
  deleteUserProfile,
  getNotificationsList,
  getTeamList,
  loginUser,
  logoutUser,
  markNotificationRead,
  registerUser,
  updatedUserProfile,
} from '../controllers/userController.js'

const router = express.Router()

router.post('/register', registerUser)
router.post('/login', loginUser)
router.post('/logout', logoutUser)

router.get('/get-team', protectRoute, isAdminRoute, getTeamList)
router.get('/notifications', protectRoute, getNotificationsList)

router.put('/profile', protectRoute, updatedUserProfile)
router.put('/read-notif', protectRoute, markNotificationRead)
router.put('/change-password', protectRoute, changeUserPassword)

// // For Admin Only - Admin Routes
router
  .route('/:id')
  .put(protectRoute, isAdminRoute, activateUserProfile)
  .delete(protectRoute, isAdminRoute, deleteUserProfile)

export default router

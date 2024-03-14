const express = require('express');
const { loginController, registerController, authController, applyDoctorController, getAllNotificationController, deleteAllNotificationController, getAllDoctorsController, bookAppointmentController, bookingAvailabilityController, userAppointmentsController } = require('../controllers/userController');
// const { auth } = require('../middlewares/auth');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/login', loginController);
router.post('/register', registerController);
router.post('/getUserData', authMiddleware, authController);
// router.post('/getUserData', authController);
// router.post('/logOut', auth, logOut);

router.post('/apply-for-doctor', authMiddleware, applyDoctorController);
router.post('/get-all-notification', authMiddleware, getAllNotificationController);
router.post('/delete-all-notification', authMiddleware, deleteAllNotificationController);
router.get('/getAllDoctors', authMiddleware, getAllDoctorsController);
router.post('/book-appointment', authMiddleware, bookAppointmentController);
router.post('/booking-availability', authMiddleware, bookingAvailabilityController);
router.get('/user-appointments', authMiddleware, userAppointmentsController);

module.exports = router;
const doctorModel = require('../models/doctorModels');
const userModel = require('../models/userModels');

const getAllUsersController = async (req, res) => {
    try {
        const users = await userModel.find({});
        res.status(200).json({ success: true, message: 'User List', data: users });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: 'Error in getting users.', error });
    }
}

const getAllDoctorsController = async (req, res) => {
    try {
        const doctors = await doctorModel.find({});
        res.status(200).json({ success: true, message: 'Doctors List', data: doctors });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: 'Error in getting doctors data', error });
    }
}

const changeAccountStatusController = async (req, res) => {
    try {
        const { doctorId, status } = req.body;
        const doctor = await doctorModel.findByIdAndUpdate(doctorId, { status });
        const user = await userModel.findOne({ _id: doctor.userId });
        const notification = user.notification;
        notification.push({
            type: 'doctor-account-request-updated',
            message: `Your account request status is ${status}`,
            inClickPath: '/notification'
        })
        user.isDoctor = status === 'approved' ? true : false;
        await user.save();
        res.status(201).json({ success: true, message: 'Account status successfully updated', data: doctor });

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: 'Error in changing account status', error });
    }
}


module.exports = { getAllUsersController, getAllDoctorsController, changeAccountStatusController };
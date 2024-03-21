const doctorModel = require("../models/doctorModels");
const appointmentModel = require("../models/appointmentModel");
const userModel = require("../models/userModels");

const getDoctorInfoController = async (req, res) => {
  try {
    const doctor = await doctorModel.findOne({ userId: req.body.userId });
    res.status(200).json({
      success: true,
      message: "Data successfully fetched",
      data: doctor,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ success: false, message: "Error in fetching details", error });
  }
};

const updateProfileController = async (req, res) => {
  try {
    const doctor = await doctorModel.findOneAndUpdate(
      { userId: req.body.userId },
      req.body
    );
    res.status(201).json({
      success: true,
      message: "Doctor profile updated sucessfully",
      data: doctor,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ success: false, message: "Error in updating details", error });
  }
};

const getDoctorByIdController = async (req, res) => {
  try {
    const doctor = await doctorModel.findOne({ _id: req.body.doctorId });
    res.status(200).json({
      success: true,
      message: `Details of Dr. ${doctor.firstName} fetched successfully`,
      data: doctor,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error in getting doctor details",
      error,
    });
  }
};

const doctorAppointmentsController = async (req, res) => {
  try {
    const doctor = await doctorModel.findOne({ userId: req.body.userId });
    const appointments = await appointmentModel.find({
      doctorId: doctor._id,
      // doctorId: req.body.doctorId,
    });

    res.status(200).json({
      success: true,
      message: "Data fetched successfully",
      data: appointments,
    });
    console.log(appointments);
  } catch (error) {
    res
      .status(500)
      .json({ success: false, error, message: "Error in Appointment" });
  }
};

const updateStatusController = async (req, res) => {
  try {
    const { appointmentsId, status } = req.body;
    const appointments = await appointmentModel.findByIdAndUpdate(
      appointmentsId,
      { status }
    );

    const user = await userModel.findOne({ _id: appointments.userId });
    const notification = user.notification;
    notification.push({
      type: "status-updated",
      message: `Your appointment status has been updated: ${status}`,
      onClickPath: "/doctor-appointments",
    });
    await user.save();
    res
      .status(200)
      .json({ success: true, message: "Appointment status updated" });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ success: false, error, message: "Error in updating status" });
  }
};

module.exports = {
  getDoctorInfoController,
  updateProfileController,
  getDoctorByIdController,
  doctorAppointmentsController,
  updateStatusController,
};

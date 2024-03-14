const userModel = require("../models/userModels");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const doctorModel = require("../models/doctorModels");
const appointmentModel = require("../models/appointmentModel");
const moment = require("moment");

const registerController = async (req, res) => {
  try {
    var { name, email, password } = req.body;
    const user = await userModel.findOne({ email: email });
    if (user) {
      return res
        .status(200)
        .json({ message: `${email} already in use`, success: false });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new userModel({ name, email, password: hashedPassword });
    await newUser.save();
    res.status(201).json({ message: "Registration Successful", success: true });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Error in controller : ${error.message}`,
    });
    console.log(error);
  }
};

// const loginController = async (req, res) => {
//     try {
//         const { email, password } = req.body;
//         const user = await userModel.findOne({ email: email });
//         // console.log(user)
//         if (!user) {
//             return res.status(200).json({ success: false, message: 'User not registered' });
//         }

//         const passwordMatch = await bcrypt.compare(password, user.password);
//         if (!passwordMatch) {
//             return res.status(200).json({ success: true, message: 'Invalid credentials' });
//         }

//         const token = jwt.sign({ id: user._id }, process.env.JWT, { expiresIn: '1d' });
//         res.cookie('jwt', token, {
//             maxAge: 12 * 60 * 60 * 1000,
//             sameSite: 'None',
//             secure: true,
//             httpOnly: true
//         })
//         res.status(200).send({ message: 'Login Successful.', success: true, token });

//     } catch (error) {
//         res.status(500).json({ success: false, message: `Error in controller : ${error.message}` });
//     }
// }

const loginController = async (req, res) => {
  try {
    const user = await userModel.findOne({ email: req.body.email });
    if (!user) {
      return res
        .status(200)
        .send({ message: "user not found", success: false });
    }
    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) {
      return res
        .status(200)
        .send({ message: "Invlid Email or Password", success: false });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT, {
      expiresIn: "1d",
    });
    res.status(200).send({ message: "Login Success", success: true, token });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: `Error in Login ${error.message}` });
  }
};

const authController = async (req, res) => {
  try {
    const user = await userModel.findById({ _id: req.body.userId });
    user.password = undefined;
    if (!user) {
      return res.status(200).send({
        message: "user not found",
        success: false,
      });
    } else {
      res.status(200).send({
        success: true,
        data: user,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "auth error",
      success: false,
      error,
    });
  }
};

// const authController = async (req, res) => {
//     // const token = req.cookies.jwt
//     // console.log(req.cookies.jwt)
//     try {
//         const token = req.cookies.jwt

//         if (token) {

//             const verifyUser = jwt.verify(token, process.env.JWT);
//             const { id } = verifyUser;
//             const rootUser = await userModel.findById(id);
//             rootUser.password = undefined;
//             // console.log(rootUser)

//             if (!rootUser) {
//                 return res.status(200).json({ success: false, message: 'User not found.' });
//             }
//             else {
//                 res.status(200).json({ success: true, data: rootUser })
//             }
//         }
//         else {
//             res.status(422).json({ success: false, message: "JWT Not found" })
//         }

//     } catch (error) {
//         res.status(500).json({ success: false, message: `Error in auth : ${error.message}` });
//     }
// }

// const logOut = async (req, res) => {
//     try {
//         req.rootUser.tokens = req.rootUser.tokens.filter((curelem) => {
//             return curelem.token !== req.token
//         });

//         res.clearCookie("jwt", { path: "/" });

//         req.rootUser.save();

//         res.status(200).json({ message: "Logout " })

//     } catch (error) {
//         console.log(error)
//         res.status(401).json({ status: 401, error })
//     }
// }

// const authController = async (req, res) => {
//     try {
//       const user = await userModel.findById({ _id: req.body.userId });
//       user.password = undefined;
//       if (!user) {
//         return res.status(200).send({
//           message: "user not found",
//           success: false,
//         });
//       } else {
//         res.status(200).send({
//           success: true,
//           data: user,
//         });
//       }
//     } catch (error) {
//       console.log(error);
//       res.status(500).send({
//         message: "auth error",
//         success: false,
//         error,
//       });
//     }
//   };

const applyDoctorController = async (req, res) => {
  try {
    const newDoctor = await doctorModel({ ...req.body, status: "Pending" });
    await newDoctor.save();

    const adminUser = await userModel.findOne({ isAdmin: true });
    const notification = adminUser.notification;
    notification.push({
      type: "apply-doctor-request",
      message: `${newDoctor.firstName} ${newDoctor.lastName} applied for a doctor account `,
      data: {
        doctorId: newDoctor._id,
        name: newDoctor.firstName + " " + newDoctor.lastName,
        onClickPath: "/admin/doctors",
      },
    });
    await userModel.findByIdAndUpdate(adminUser._id, { notification });
    res
      .status(201)
      .json({ success: true, message: "Doctor account applied successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: `Error ${error}` });
  }
};

const getAllNotificationController = async (req, res) => {
  try {
    const user = await userModel.findOne({ _id: req.body.userId });
    const seenNotification = user.seenNotification;
    const notification = user.notification;
    seenNotification.push(...notification);
    user.notification = [];
    user.seenNotification = notification;
    const updatedUser = await user.save();
    res.status(200).json({
      success: true,
      message: `All notifications marked as read`,
      data: updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: `Error in getting notification: ${error}`,
    });
  }
};

const deleteAllNotificationController = async (req, res) => {
  try {
    const user = await userModel.findOne({ _id: req.body.userId });
    user.notification = [];
    user.seenNotification = [];
    const updatedUser = await user.save();
    updatedUser.password = undefined;
    res
      .status(200)
      .json({ success: true, message: "Notifications deleted successfully." });
    data: updatedUser;
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: `Something went wrong` });
  }
};

const getAllDoctorsController = async (req, res) => {
  try {
    const doctors = await doctorModel.find({ status: "approved" });
    res.status(200).json({
      success: true,
      message: "Doctors list fetched successfully",
      data: doctors,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error in fetching doctor list",
      error,
    });
  }
};

const bookAppointmentController = async (req, res) => {
  try {
    console.log(req.body);
    req.body.status = "pending";
    const newAppointment = new appointmentModel(req.body);
    await newAppointment.save();

    const user = await userModel.findOne({ _id: req.body.doctorInfo.userId });
    user.notification.push({
      type: "New-appointment-request",
      message: `${req.body.userInfo.name} requested for an appointment`,
      onClickPath: "/user/appointments",
    });
    await user.save();
    res
      .status(200)
      .json({ success: true, message: "Appointment successfully booked" });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ success: false, message: "Error in booking appointment", error });
  }
};

// const bookingAvailabilityController = async (req, res) => {
//     console.log(req.body);
//   try {
//     const date = moment(req.body.date, "DD-MM-YY").toISOString();
//     const fromTime = moment(req.body.time, "HH:mm")
//       .subtract(1, "hours")
//       .toISOString();
//     const toTime = moment(req.body.time, "HH:mm").add(1, "hours").toISOString();
//     const doctorId = req.body.doctorId;
//     const bookingId = req.body.id;

//     console.log(fromTime, toTime);

//     const appointment = await appointmentModel.find({
//       doctorId,
//       date,
//       time: {
//         $gte: fromTime,
//         $lte: toTime,
//       },
//     });
//     if (appointment.length > 0) {
//       return res
//         .status(200)
//         .json({ message: "Appointment not available", success: true });
//     } else {
//       return res
//         .status(200)
//         .json({ success: true, message: "Appointment available" });
//     }
//   } catch (error) {
//     console.log(error);
//     res
//       .status(500)
//       .json({ success: false, message: "Error in booking", error });
//   }
// };
const bookingAvailabilityController = async (req, res) => {
  try {
    const { doctorId, date, time, id, userId } = req.body;

    const isDoctor = await doctorModel.findById({ _id: id });

    function isTimeWithinRange(time, ranges) {
      const [hours, minutes] = time.split(":").map(Number);
      for (let i = 0; i < ranges.length; i++) {
        const [startHour, startMinute] = ranges[i].split(":").map(Number);
        const nextIndex = (i + 1) % ranges.length;
        const [endHour, endMinute] = ranges[nextIndex].split(":").map(Number);
        if (
          (hours > startHour ||
            (hours === startHour && minutes >= startMinute)) &&
          (hours < endHour || (hours === endHour && minutes <= endMinute))
        ) {
          return true;
        }
      }
      return false;
    }

    const isAvailable = isTimeWithinRange(time, isDoctor.timings);

    if (!isAvailable) {
      return res
        .status(200)
        .json({ message: "Appointment out Time limit!", success: true });
    }

    const appointment = await appointmentModel.find({
      doctorId: doctorId,
      date: date,
      time: time,
      userId: userId,
    });

    if (appointment.length > 0) {
      return res
        .status(200)
        .json({ message: "Appointment not available", success: true });
    } else {
      return res
        .status(200)
        .json({ success: true, message: "Appointment available" });
    }
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ success: false, message: "Error in booking", error });
  }
};

const userAppointmentsController = async (req, res) => {
  try {
    const appointments = await appointmentModel.find({
      userId: req.body.userId,
    });
    res.status(200).json({
      success: true,
      message: "User appointment details fetched successfully",
      data: appointments,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error in fetching appointment details.",
    });
  }
};

module.exports = {
  registerController,
  loginController,
  authController,
  applyDoctorController,
  getAllNotificationController,
  deleteAllNotificationController,
  getAllDoctorsController,
  bookAppointmentController,
  bookingAvailabilityController,
  userAppointmentsController,
};

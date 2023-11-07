const Doctor = require("../models/Doctor");
const jwt = require("jsonwebtoken");
const Patient = require("../models/Patient");

const generateToken = (user) => {
  return jwt.sign({ id: user._id, email: user.email }, process.env.SECRET_KEY);
};

const register = async (req, res) => {
  try {
    const { name, email, password, specialty, contactInformation } = req.body;

    const doctor = new Doctor({
      name,
      email,
      password,
      specialty,
      contactInformation,
    });

    await doctor.save();

    const token = generateToken(doctor);

    return res
      .status(201)
      .json({ message: "Doctor registered successfully", token });
  } catch (error) {
    return res
      .status(400)
      .json({ message: "Doctor registration failed", error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const doctor = await Doctor.findOne({ email });

    if (!doctor) {
      return res
        .status(401)
        .json({ message: "Authentication failed. Doctor not found." });
    }

    const isMatch = await doctor.comparePassword(password);

    if (!isMatch) {
      return res
        .status(401)
        .json({ message: "Authentication failed. Incorrect password." });
    }

    const token = generateToken(doctor);

    return res.json({
      message: "Authentication successful",
      token,
      name: doctor.name,
      email: doctor.email,
      specialty: doctor.specialty,
      contactInformation: doctor.contactInformation,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

const addPatient = async (req, res) => {
  try {
    const { name, age, medicalHistory } = req.body;
    const doctorId = req.user.id;

    const patient = new Patient({
      name,
      age,
      medicalHistory,
      doctor: doctorId,
    });

    const newPatient = await patient.save();

    return res.status(201).json({
      message: "Patient registered successfully",
      patient: newPatient,
    });
  } catch (error) {
    return res
      .status(400)
      .json({ message: "Patient registration failed", error: error.message });
  }
};

const getAllPatients = async (req, res) => {
  try {
    const doctorId = req.user.id;

    const patients = await Patient.find({ doctor: doctorId });

    return res.status(200).json({ patients });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error while fetching patients", error: error.message });
  }
};

const removePatient = async (req, res) => {
  try {
    const patientId = req.params.patientId;
    const doctorId = req.user.id;

    const deletedPatient = await Patient.findOneAndDelete({
      _id: patientId,
      doctor: doctorId,
    });

    if (!deletedPatient) {
      return res
        .status(404)
        .json({ message: "Patient not found or unauthorized to delete" });
    }

    return res
      .status(200)
      .json({ message: "Patient deleted successfully", deletedPatient });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error while deleting patient", error: error.message });
  }
};

const editProfile = async (req, res) => {
  try {
    console.log(req.user);
    const doctorId = req.user.id;
    const { name, specialty, contactInformation } = req.body;

    const doctor = await Doctor.findById(doctorId);

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    if (name) {
      doctor.name = name;
    }

    if (specialty) {
      doctor.specialty = specialty;
    }

    if (contactInformation) {
      doctor.contactInformation = contactInformation;
    }

    const updatedDoctor = await doctor.save();
    const { password, _id,__v, ...sanitizedDoctor } = updatedDoctor._doc;
    return res
      .status(200)
      .json({ message: "Profile updated successfully", data: sanitizedDoctor });
  } catch (error) {
    return res.status(500).json({
      message: "Error while updating profile",
      error: error.message,
    });
  }
};

module.exports = {
  login,
  register,
  addPatient,
  getAllPatients,
  removePatient,
  editProfile,
};

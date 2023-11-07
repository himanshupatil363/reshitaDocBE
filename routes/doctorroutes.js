const express = require("express");
const {
  login,
  register,
  getAllPatients,
  addPatient,
  removePatient,
  editProfile,
} = require("../controllers/doctorcontroller");
const { authenticate } = require("../middelwares/authenticate");
const doctorroutes = express.Router();
doctorroutes.get("/patients", authenticate, getAllPatients);
doctorroutes.post("/patient/add", authenticate, addPatient);
doctorroutes.post("/patient/remove/:patientId", authenticate, removePatient);
doctorroutes.post("/profile/edit", authenticate, editProfile);
doctorroutes.post("/login", login);
doctorroutes.post("/register", register);
module.exports = { doctorroutes };

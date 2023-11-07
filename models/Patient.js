const mongoose = require("mongoose");
const patientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  medicalHistory: {
    type: String,
    required: true,
  },
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Doctor",
  },
});

module.exports = mongoose.model("Patient", patientSchema);

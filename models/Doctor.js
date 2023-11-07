const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const doctorSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  specialty: {
    type: String,
    required: true,
  },
  contactInformation: {
    type: String,
    required: true,
  },
});

doctorSchema.pre("save", async function (next) {
  const doctor = this;

  if (!doctor.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(doctor.password, salt);

    doctor.password = hash;
    next();
  } catch (err) {
    return next(err);
  }
});

doctorSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    const isMatch = await bcrypt.compare(candidatePassword, this.password);
    return isMatch;
  } catch (err) {
    throw err;
  }
};

module.exports = mongoose.model("Doctor", doctorSchema);

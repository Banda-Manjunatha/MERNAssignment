const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  mobileNumber: { type: Number, required: true },
  designation: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    enum: ["Male", "Female", "Not to expose"],
    required: true,
  },
  course: [{ type: String, enum: ["MCA", "BCA", "MSC"] }],
  image: { type: String, required: true },
  createdDate: {
    type: Date,
    default: Date.now,
  },
});

// Create Employee model
const Employee = mongoose.model("Employee", employeeSchema);

module.exports = Employee;

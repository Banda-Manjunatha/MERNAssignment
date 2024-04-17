// Import required modules
const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const bcrypt = require("bcrypt");
const User = require("./model/User");
const Employee = require("./model/Employee");
const jwtToken = require("jsonwebtoken");

// Create an Express app
const app = express();
const port = process.env.PORT || 4000;

// Middleware
app.use(express.json());
app.use(cors());

mongoose
  .connect(
    "mongodb+srv://manjunath:manju2002@cluster0.vwh2wmo.mongodb.net/employers",
    { useNewUrlParser: true, useUnifiedTopology: true },
  )
  .then(() => {
    console.log("Connected to MongoDB Atlas successfully!");
    // Start your server or perform other operations here
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB Atlas:", err);
  });

// Define Employee schema

// Signup route
app.post("/signup", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if username and password are provided
    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Username and password are required" });
    }

    // Check if the username already exists in the database
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(409).json({ message: "Username already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    let cart = {};
    for (let i = 0; i < 300 + 1; i++) {
      cart[i] = 0;
    }
    // Create a new user document
    const newUser = new User({
      username,
      password: hashedPassword,
      cartData: cart,
    });

    // Save the new user to the database
    await newUser.save();
    const data = { id: newUser.id };
    const token = jwtToken.sign(data, "1234");
    res.json({ success: true, token, message: "Signup successful." });
  } catch (error) {
    console.error("Signup error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

const generateToken = (data) => {
  return jwtToken.sign(data, "1234"); // Change 'your_secret_key' to your actual secret key
};

// Login route
app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if username and password are provided
    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Username and password are required" });
    }

    const user = await User.findOne({ username });
    if (!user) {
      return res
        .status(401)
        .json({ success: false, error: "Invalid username." });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res
        .status(401)
        .json({ success: false, error: "Invalid password." });
    }

    // Your logic to check if the username exists in the database
    const token = generateToken({ id: user.id });
    res.json({ success: true, token, message: "Login successful." });

    return res.status(200).json({ message: "Login successful" });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// Image storage engine
const storage = multer.diskStorage({
  destination: "./upload/images",
  filename: (req, file, cb) => {
    return cb(
      null,
      `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`,
    );
  },
});

const upload = multer({ storage: storage });

// Creating Upload Endpoint for images
app.use("/images", express.static("upload/images"));

app.post("/upload", upload.single("product"), (req, res) => {
  if (!req.file) {
    return res.status(400).send("No files are uploaded.");
  }
  //If ffile uploaded successfully, return the file.
  res.send({
    success: 1,
    image_url: `http://localhost:${port}/images/${req.file.filename}`,
  });
});

// Validate and send the details to the db.
app.post("/employee_details", async (req, res) => {
  try {
    // Validate the request body against the defined schema
    const { name, email, mobileNumber, designation, gender, courses, image } =
      req.body;
    const employee = new Employee({
      name,
      email,
      mobileNumber,
      designation,
      gender,
      courses,
      image,
    });
    const savedEmployee = await employee.save();
    res.status(201).json(savedEmployee);
  } catch (error) {
    // Handle validation errors or other errors
    console.error("Error saving employee details:", error);
    res.status(400).json({ message: "Validation failed" });
  }
});

// Route to get all employee details
app.get("/getemployees", async (req, res) => {
  try {
    const employees = await Employee.find(); // Retrieve all employees from the database
    res.json(employees); // Send the employees as JSON response
  } catch (error) {
    console.error("Error fetching employees:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// API for deleting user from DB
app.post("/removeuser", async (req, res) => {
  try {
    const { email } = req.body;

    const deletedUser = await Employee.findOneAndDelete({ email });

    if (deletedUser) {
      return res.json({
        success: true,
        message: "User deleted successfully",
        deletedUser,
      });
    } else {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
  } catch (error) {
    console.error("Error deleting user:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
});
const fetchUser = async (req, res, next) => {
  const token = req.header("auth-token");
  if (!token) {
    return res
      .status(401)
      .json({ error: "Please authenticate using a valid token." });
  }
  try {
    const data = jwtToken.verify(token, "1234");
    console.log("Token successfully verified by middleware.");
    req.user = data.id;
    next();
  } catch (error) {
    console.error("Error verifying token:", error);
    return res
      .status(401)
      .json({ error: "Please authenticate using a valid token." });
  }
};

app.put("/update", fetchUser, async (req, res) => {
  try {
    console.log(req.employee); // Check if req.employee is populated after middleware

    const { name, mobileNumber, designation, gender, courses, image } =
      req.body;

    if (!req.employee) {
      // Double-check employee existence before update
      return res.status(404).json({ message: "Employee not found" });
    }

    const updatedEmployee = await Employee.findOneAndUpdate(
      { name: name }, // Use employee's _id for robust update
      { name, mobileNumber, designation, gender, courses, image },
      { new: true }, // Return the updated document
    );

    res.status(200).json(updatedEmployee);
  } catch (error) {
    console.error("Error updating employee details:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/", (req, res) => {
  res.send("Express is running");
});

app.listen(port, (err) => {
  if (err) {
    console.log(err);
  } else console.log("You server is running on port 3000");
});

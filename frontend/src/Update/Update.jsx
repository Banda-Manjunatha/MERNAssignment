import React, { useState, useEffect } from "react";
import "./Update.css"; // Importing the CSS file
import { useNavigate, useParams } from "react-router-dom";
import { getCookie } from "../utils";

const Update = (props) => {
  const { name } = props;
  const [image, setImage] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobileNumber: "",
    designation: "",
    gender: "",
    courses: [],
    image: "",
  });

  useEffect(() => {
    const fetchEmployeeData = async () => {
      try {
        const token = getCookie("token");
        if (!token) {
          navigate("/"); // Redirect to login if token is not found
          return;
        }

        await fetch("http://localhost:4000/update", {
          method: "PUT",
          headers: {
            Accept: "application/json", // Fixed typo here
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ name: name }),
        });
      } catch (error) {
        console.error("Error fetching employee details:", error);
      }
    };
    if (name) {
      fetchEmployeeData();
    }
  }, [name]); // Added name to the dependency array

  const imageHandler = (e) => {
    setImage(e.target.files[0]);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleCheckboxChange = (e) => {
    const { name, value } = e.target;
    const isChecked = e.target.checked;

    if (isChecked) {
      setFormData({
        ...formData,
        [name]: [...formData[name], value],
      });
    } else {
      setFormData({
        ...formData,
        [name]: formData[name].filter((course) => course !== value),
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Handle form submission
    console.log(formData);

    // For now, let's assume the submission is successful
    navigate("/employeepage"); // Redirect to employee page
  };

  return (
    <div className="container">
      <h1 style={{ textAlign: "center" }}>Edit Employee Details</h1>
      <form className="employee-form" onSubmit={handleSubmit}>
        <h2>Employee Details</h2>
        <div className="form-group">
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
            placeholder="enter name"
          />
        </div>
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
            placeholder="enter email"
          />
        </div>
        <div className="form-group">
          <label>Mobile Number:</label>
          <input
            type="tel"
            name="mobileNumber"
            value={formData.mobileNumber}
            onChange={handleInputChange}
            required
            placeholder="mobile number"
          />
        </div>
        <div className="form-group">
          <label>Designation:</label>
          <input
            type="text"
            name="designation"
            value={formData.designation}
            onChange={handleInputChange}
            required
            placeholder="enter your designation"
          />
        </div>
        <div className="form-group">
          <label>Gender:</label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleInputChange}
            required
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Not to expose">Not to expose</option>
          </select>
        </div>
        <div className="form-checkbox">
          <label style={{ fontSize: "1.1rem" }}>Courses:</label>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              paddingTop: "10px",
            }}
          >
            <input
              type="checkbox"
              name="courses"
              value="MCA"
              onChange={handleCheckboxChange}
              className="checkbox"
              id="checkinput0"
            />
            <label for="checkinput0">MCA</label>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <input
              type="checkbox"
              name="courses"
              value="BCA"
              onChange={handleCheckboxChange}
              className="checkbox"
              id="checkinput1"
            />
            <label className="checkLabel" for="checkinput1">
              BCA
            </label>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <input
              type="checkbox"
              name="courses"
              value="MSC"
              onChange={handleCheckboxChange}
              className="checkbox"
              id="checkinput2"
            />
            <label className="checkLabel" for="checkinput2">
              MSC
            </label>
          </div>
        </div>
        <div className="addproduct-itemfield">
          <p style={{ color: "black" }}>Upload your image</p>
          <label htmlFor="file-input">
            <img
              src={
                image
                  ? URL.createObjectURL(image)
                  : "https://res.cloudinary.com/dmn7qksnf/image/upload/v1709793758/upload_area_xxwlvc.svg"
              }
              alt=""
              className="addproduct-thumbnail-image"
            />
          </label>
          <input
            onChange={imageHandler}
            type="file"
            name="image"
            id="file-input"
            hidden
          />
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default Update;

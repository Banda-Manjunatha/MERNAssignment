import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./EmployeePage.css";
import { getCookie } from "../utils";
import Update from "../Update/Update";

const EmployeePage = () => {
  const navigate = useNavigate(); // For navigation within the component

  const [allEmployers, setAllEmployers] = useState(null);
  const [isLoading, setIsLoading] = useState(false); // Track loading state
  const [error, setError] = useState(null); // Store potential errors

  const fetchEmployeeDetails = async () => {
    setIsLoading(true); // Set loading state to true
    setError(null); // Clear any previous errors

    try {
      const token = getCookie("token");
      if (!token) {
        navigate("/"); // Redirect to login if token is not found
        return;
      }

      // Fetch employee details only if user is authenticated
      const response = await fetch("http://localhost:4000/getemployees", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setAllEmployers(data);
      } else {
        throw new Error("Failed to fetch employee details"); // Handle non-200 status codes
      }
    } catch (error) {
      setError(error);
      console.error("Error fetching employee details:", error);
    } finally {
      setIsLoading(false); // Set loading state to false after fetching (success or error)
    }
  };

  useEffect(() => {
    fetchEmployeeDetails();
  }, []);

  const removeEmployer = async (email) => {
    try {
      const token = getCookie("token");
      if (!token) {
        navigate("/"); // Redirect to login if token is not found
        return;
      }

      await fetch("http://localhost:4000/removeuser", {
        method: "POST",
        headers: {
          Accept: "application/jsos",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ email: email }),
      });
      await fetchEmployeeDetails();
    } catch (error) {
      console.error("Error removing employer:", error);
    }
  };

  const handleEditClick = () => {
    // Redirect to edit form using useNavigate
  };

  if (isLoading) {
    return <div>Loading...</div>; // Display a loading message
  }

  if (error) {
    return (
      <div>
        <p>Error: {error.message}</p>{" "}
        {/* Display user-friendly error message */}
        <button onClick={() => fetchEmployeeDetails()}>Retry</button>{" "}
        {/* Retry button */}
      </div>
    );
  }

  if (!allEmployers) {
    return <div>Employee not found.</div>; // Handle case where employee is not found
  }

  return (
    <div className="Employercontainer">
      <h1 style={{ textAlign: "center" }}>Employee Details</h1>

      <div className="employee-heading">
        <p>Image</p>
        <p>Name</p>
        <p>Email</p>
        <p>Mobile No</p>
        <p>Designation</p>
        <p>Gender</p>
        <p>Created Date</p>
        <p>Edit / Delete</p>
      </div>
      <div className="outerDiv">
        {" "}
        {allEmployers.map((data, index) => {
          return (
            <div>
              <div key={index} className="innerDiv">
                <div className="employee-details">
                  <div>
                    <img
                      src={data.image}
                      alt="Employee"
                      className="listproduct-product-icon"
                    />
                  </div>
                  <div>{data.name}</div>
                  <div>{data.email}</div>
                  <div>{data.mobileNumber}</div>
                  <div>{data.designation}</div>
                  <div>{data.gender}</div>
                  <div>{data.createdDate}</div>
                  <div>
                    <button
                      onClick={() => navigate(`/update?name=${data.name}`)}
                      className="edit"
                    >
                      Edit
                    </button>
                    <button
                      className="delete"
                      onClick={() => {
                        removeEmployer(data.email);
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default EmployeePage;

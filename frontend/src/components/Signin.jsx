import { Link, useNavigate } from "react-router-dom";
import { InputField } from "./Signup";
import { useState } from "react";
import axios from "axios";

const url = "http://localhost:3000/api/v1/user/signin";


function Signin() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(url, {
        username: formData.email,
        password: formData.password,
      });

      //navigate to dashborad-page
      navigate("/dashboard");

      console.log("Signup successful", response);
    } catch (error) {
      console.error("Input field invalid", error);
    }
  };

  return (
        <div
      id="window"
      className="bg-neutral-900 min-h-screen flex justify-center items-center"
    >
      <div
        id="main-container"
        className="border border-slate-600 h-2/3 bg-neutral-950 rounded-md flex flex-col justify-center"
      >
        <div className="flex flex-col items-center ">
          <h1 className="text-slate-100 font-bold text-3xl mt-3 p-1">
            SignIn
          </h1>
          <span className="text-slate-200 w-2/3 text-center">
            Enter your information to create an account
          </span>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col p-5 gap-7">

          <InputField
            label="Email"
            placeholder="johndoe@email.com"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
          <InputField
            label="Password"
            placeholder="password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
          <button className="bg-green-600 text-white font-medium rounded-lg w-full h-12 hover:bg-opacity-75 active:scale-95 active:bg-opacity-90">
            LogIn
          </button>
        </form>
        <div className="flex justify-center my-2 text-white">
          <span>
            Don't have an account?{" "}
            <Link to="/SignUp" className="underline text-blue-500 font-medium">
             SignUp 
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
}

export default Signin;

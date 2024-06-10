import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useState } from "react";
import {
  startRegistration,
  startAuthentication,
} from "@simplewebauthn/browser";

const url = "http://localhost:3000/api/user";

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${url}/register`, {
        email,
        password,
      });

      // create challenge
      const challenge = await axios.post(`${url}/register-challenge`, {
        email,
      });

      const { options } = challenge.data;

      // start browser side registration
      const authResult = await startRegistration(options);

      //verify user
      const verify = await axios.post(`${url}/register-verify`, {
        email,
        cred: authResult,
      });

      if (verify) {
        navigate("/dashboard");
      }

      console.log("SignUp successful");
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
        <div className="flex flex-col items-center p-5">
          <div className="flex gap-1 justify-center items-center">
            <h1 className="text-4xl">
            <span className="text-orange-600">मेघ </span>  
            <span className="text-blue-500">बुद्धिमान</span>
            </h1>
            <img src="./cloud.svg" alt="" />
          </div>

          <h1 className="text-slate-100 font-bold text-3xl mt-3 p-1">
            Sign Up
          </h1>
          <span className="text-slate-200 w-2/3 text-center">
            Enter your information to create an account
          </span>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col p-5 gap-7">
          <div className="flex gap-2"></div>
          <InputField
            label="Email"
            placeholder="johndoe@email.com"
            type="email"
            name="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          <InputField
            label="Password"
            placeholder="password"
            type="password"
            name="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          <button className="bg-green-600 text-white font-medium rounded-lg w-full h-12 hover:bg-opacity-75 active:scale-95 active:bg-opacity-90">
            Sign Up
          </button>
        </form>
        <div className="flex justify-center my-2 text-white">
          <span>
            Already have an account?{" "}
            <Link to="/signin" className="underline text-blue-500 font-medium">
              Login
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
}

function InputField({
  label,
  placeholder,
  type = "text",
  name,
  value,
  onChange,
}) {
  return (
    <div className="flex flex-col">
      <label className="font-mediuma text-white font-medium">{label}</label>
      <input
        className="border border-slate-500 p-2 rounded-lg bg-black text-white hover:border-blue-500 hover:ring-2"
        placeholder={placeholder}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        autoComplete="webauthn"
      />
    </div>
  );
}

export { Signup, InputField };

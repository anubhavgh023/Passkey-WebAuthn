import { Link, useNavigate } from "react-router-dom";
import { InputField } from "./Signup";
import { useState } from "react";
import axios from "axios";
import { startAuthentication } from "@simplewebauthn/browser";

const url = "http://localhost:3000/api/user";

function Signin() {
  const [email, setEmail] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const challenge = await axios.post(`${url}/login-challenge`, {
        email: email,
      });

      const { options } = challenge.data;

      // start browser side authentication
      const authResult = await startAuthentication(options);
      console.log(authResult);

      //verify user
      const verify = await axios.post(`${url}/login-verify`, {
        email,
        cred: authResult,
      });

      if (verify.success) {
        navigate("/dashboard");
      }

      console.log("SignIn successful", response);
    } catch (error) {
      console.error("ERR:", error.message);
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
          <h1 className="text-slate-100 font-bold text-3xl mt-3 p-1">SignIn</h1>
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
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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

import React from "react";
import Typist from "react-typist-component";

function Dashboard() {
  return (
    <div className="flex items-center justify-center h-screen bg-slate-950 text-white">
      <div className="text-center border-slate-400 border p-8 rounded-md bg-black">
        <div className="text-6xl font-bold relative">
          <Typist
            typingDelay={100}
            cursor={
              <span className="inline-block bg-white w-1 h-16 align-middle"></span>
            }
            loop={true}
          >
            <span className="inline-block">Dashboard</span>
            <Typist.Delay ms={10000} />
            <Typist.Backspace count={9} />
            <Typist.Delay ms={100} />
          </Typist>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;

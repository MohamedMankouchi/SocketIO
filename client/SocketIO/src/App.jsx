import React, { useEffect, useRef, useState } from "react";
import "./App.css";
import io from "socket.io-client";
import { Chat } from "./Chat";
const socket = io.connect("http://localhost:3000");
import { useSpring, animated } from "@react-spring/web";

function App() {
  const springs = useSpring({
    delay: 200,
    from: { y: 100, opacity: 0 },
    to: { y: 0, opacity: 1 },
    config: {
      tension: 100,
    },
  });

  const springs2 = useSpring({
    from: { y: 100, opacity: 0 },
    to: { y: 0, opacity: 1 },
    config: {
      tension: 200,
      clamp: true,
    },
  });
  const ref1 = useRef();
  const ref2 = useRef();
  const [credentials, setCredentials] = useState({ roomId: "", name: "" });
  const [showChat, setShowChat] = useState(false);
  const joinRoom = () => {
    if (credentials.name == "" && credentials.roomId == "") {
      return alert("Please fill in the missing fields ");
    }
    socket.emit("joinRoom", credentials.roomId);
    setShowChat(true);
  };

  return (
    <>
      {showChat ? (
        <Chat {...credentials} socket={socket} />
      ) : (
        <>
          <animated.div style={springs2} className="text">
            <h1 className="title">ChatPulse</h1>
            <p className="slogan">Chat made easy.</p>
          </animated.div>
          <animated.div style={springs} className="outerForm">
            <div className="form">
              <h1 style={{ color: "white" }}>Join Room</h1>
              <input
                ref={ref1}
                type="text"
                placeholder="Room number"
                className="inputRoom"
                required
                onChange={() => {
                  setCredentials((prev) => ({
                    ...prev,
                    roomId: ref1.current.value,
                  }));
                }}
              />
              <input
                ref={ref2}
                type="text"
                placeholder="Name.."
                className="inputRoom"
                onChange={() => {
                  setCredentials((prev) => ({
                    ...prev,
                    name: ref2.current.value,
                  }));
                }}
                required
              />
              <button className="button-33" type="submit" onClick={joinRoom}>
                Join Room{" "}
              </button>
            </div>
          </animated.div>
        </>
      )}
    </>
  );
}

export default App;

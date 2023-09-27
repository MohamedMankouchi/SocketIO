import React, { useEffect, useId, useRef, useState } from "react";
import "./App.css";
import ScrollToBottom from "react-scroll-to-bottom";
import { useSpring, animated } from "@react-spring/web";

export const Chat = ({ roomId, name, socket }) => {
  const [listMessages, setListMessages] = useState([]);
  const [value, setValue] = useState("");
  const springs = useSpring({
    from: { x: -100, opacity: 0 },
    to: { x: 0, opacity: 1 },
  });
  const ref = useRef();
  const sendMessage = () => {
    const message = {
      name,
      roomId,
      currentMessage: ref.current.value,
    };
    setListMessages((prev) => [...prev, message]);
    socket.emit("sendMessage", message);
    setValue("");
  };

  useEffect(() => {
    socket.on("getMessages", (data) => {
      setListMessages((prev) => [...prev, data]);
    });

    return () => {
      socket.removeListener("getMessages");
    };
  }, [socket]);
  return (
    <>
      <div className="chatContainer">
        <div className="chatHeader">
          <h3>Live on chatroom {roomId}</h3>
        </div>
        <div className="chatBody">
          <ScrollToBottom className="chatcontent">
            {listMessages.map((el) => (
              <animated.div
                style={springs}
                key={useId}
                id={el.name == name ? "you" : "other"}
              >
                <h3>{el.currentMessage}</h3>
                <p>{el.name}</p>
              </animated.div>
            ))}
          </ScrollToBottom>
        </div>
        <div className="chatInput">
          <input
            type="text"
            placeholder="Message..."
            className="inputRoom"
            required
            ref={ref}
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
          <button
            id="button33"
            className="button-33"
            type="submit"
            onClick={sendMessage}
            disabled={value == ""}
          >
            Send Message
          </button>
        </div>
      </div>
    </>
  );
};

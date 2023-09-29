import React, { useEffect, useId, useRef, useState } from "react";
import "./App.css";
import ScrollToBottom from "react-scroll-to-bottom";
import { useSpring, animated, useTransition } from "@react-spring/web";
import useSound from "use-sound";
import notification from "./assets/achievement-message-tone.mp3";
import InitialsAvatar from "react-initials-avatar";
import "react-initials-avatar/lib/ReactInitialsAvatar.css";
export const Chat = ({ roomId, name, socket }) => {
  const [listMessages, setListMessages] = useState([]);
  const [value, setValue] = useState("");
  const [play] = useSound(notification);
  const [isWriting, setIsWriting] = useState(false);
  const [dataWriting, setDataWriting] = useState("");
  const transitions = useTransition(listMessages, {
    from: { opacity: 0, x: -400 },
    enter: { opacity: 1, x: 0, delay: 300, transition: "ease-in-out" },
  });

  const checkWriting = () => {
    console.log("writing");
    socket.emit("writing", { name, typing: true, roomId });
  };

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
    play();
  };

  useEffect(() => {
    socket.on("getMessages", (data) => {
      setListMessages((prev) => [...prev, data]);
    });

    socket.on("showWriting", (status) => {
      if (status.typing) {
        clearTimeout();
        setDataWriting(status.name);
        setIsWriting(true);
      }
    });

    socket.on("showStatus", (status) => {
      if (!status) {
        clearTimeout();
        setTimeout(() => {
          setDataWriting("");
          setIsWriting(false);
        }, 3000);
      }
    });

    return () => {
      socket.removeListener("getMessages");
      socket.removeListener("showWriting");
      socket.removeListener("showStatus");
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
            {transitions((style, item) => {
              return (
                <animated.div
                  style={style}
                  key={item.index}
                  id={item.name == name ? "you" : "other"}
                >
                  <h3>{item.currentMessage}</h3>
                  <InitialsAvatar name={item.name} />
                </animated.div>
              );
            })}
          </ScrollToBottom>
        </div>

        <div className="writing">
          {isWriting ? <p>{dataWriting} is writing..</p> : ""}
        </div>
        <form className="chatInput">
          <input
            type="text"
            placeholder="Message..."
            className="inputRoom"
            required
            ref={ref}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={checkWriting}
            onKeyUp={() => {
              socket.emit("WritingStatus", { roomId, status: false });
            }}
          />
          <button
            id="button33"
            className="button-33"
            type="submit"
            onClick={sendMessage}
            disabled={value.trim() == ""}
          >
            Send Message
          </button>
        </form>
      </div>
    </>
  );
};

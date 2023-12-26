import "./App.css";
import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import dayjs from "dayjs";

const socket = io("http://localhost:3001", {
  transports: ["websocket"],
});

function minBetweenMax(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
const user = `User_${minBetweenMax(1, 100)}`;

function App() {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");

  const [connected, setConnected] = useState(false);

  useEffect(() => {
    socket.on("connect", () => {
      setConnected(true);
    });

    socket.on("message", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.off("message");
    };
  }, []);

  const sendMessage = () => {
    if (!inputMessage) return;
    const data = {
      user: user,
      msg: inputMessage,
      datetime: new Date(),
    };
    socket.emit("message", data);
    setInputMessage("");
  };
  const enterKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="container">
      {connected ? `접속완료!` : "접속중..."}

      <div className="container__message">
        {messages.map((message, index) => {
          const isMe = message.user === user;
          const datetime = dayjs(message.datetime).format("h:mm A");
          return (
            <div key={index} className="box__message">
              <div
                className={`message ${isMe ? "message-me" : "message-other"}`}
              >
                {message.msg}
              </div>
              <span
                className={`message__datetime ${
                  isMe ? "datetime-me" : "datetime-other"
                }`}
              >
                {datetime}
              </span>
            </div>
          );
        })}
      </div>
      <div className="container__send">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          className="send__input"
          placeholder="메세지를 입력하세요."
          onKeyDown={enterKeyPress}
        />
        <button onClick={sendMessage} className="send__button">
          전송
        </button>
      </div>
    </div>
  );
}

export default App;

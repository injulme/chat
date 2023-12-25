import React, { useState, useEffect } from "react";
import io from "socket.io-client";

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
    const data = {
      user: user,
      msg: inputMessage,
    };
    socket.emit("message", data);
    setInputMessage("");
  };

  return (
    <div>
      {connected ? `접속완료! 님이 들어왔습니다.` : "접속중..."}
      <ul>
        {messages.map((message, index) => (
          <li
            key={index}
            style={{ color: message.user === user ? "blue" : "pink" }}
          >
            {message.user}:{message.msg}
          </li>
        ))}
      </ul>
      <input
        type="text"
        value={inputMessage}
        onChange={(e) => setInputMessage(e.target.value)}
      />
      <button onClick={sendMessage}>전송</button>
    </div>
  );
}

export default App;

import React, { useEffect, useState, useContext } from "react";
import "../styles/App.css";
import Sidebar from "./Sidebar";
import Chat from "./Chat";
import Pusher from "pusher-js";
import axios from "./axios";
import { Context } from "../context/Context";

function App() {
  const [messages, setMessages] = useState([]);
  //const [state, dispatch] = useContext(Context);


  useEffect(() => {
    axios.get("/messages/sync").then((response) => {
      setMessages(response.data);
    });
  }, []);

  useEffect(() => {
    var pusher = new Pusher('fc2a2aeac06bd3041897', {
      cluster: 'ap2'
    });

    const channel = pusher.subscribe("message");
    channel.bind("inserted", (newMessage) => {
      setMessages([...messages, newMessage]);
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, [messages]);

  console.log(messages);

  return (
    <div className="app">
      <div className="app__body">
        <Chat messages={messages} />
        <Sidebar />
      </div>
    </div>
  );
}

export default App;

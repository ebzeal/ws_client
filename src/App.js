import React, {useState, useEffect, useMemo} from 'react';
import io from "socket.io-client";
import './App.css';

function App() {
  const [messages, setMessages] = useState([]);
  const [values, setValues] = useState({
    clientId: '',
    message: '',
  });
  const socket = useMemo(()=> io("ws://localhost:3001"), []);

  useEffect(()=>{
    socket.on("msgToClient", data => {
    console.log("🚀 ~ file: App.js ~ line 22 ~ useEffect ~ data", data)
      setMessages([...messages, data])
    });
  }, [socket, messages]);


  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(values);
    const data = {
      text: values.message,
      id:   values.clientId,
      date: Date.now()
    }
    socket.emit('msgToServer', data)
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: value.trim(),
    });
  };
  console.log("🚀 ~ file: App.js ~ line 7 ~ App ~ messages", messages)
  return (
    <div className="App">
      
      <form onSubmit={handleSubmit}>
        <div>
          <input
            type="text"
            name="clientId"
            onChange={handleInputChange}
            placeholder="Client Id"
          />
          </div>
        <br></br>
          <div>
          <input
            type="text"
            name="message"
            onChange={handleInputChange}
            placeholder="message"
          />
        </div>
        <br></br>
    <button type='submit'>Submit</button>
      </form>

      <ul>
        {messages.map(message=>{
        console.log("🚀 ~ file: App.js ~ line 72 ~ App ~ message", message)
        return <li id={messages.indexOf(message)}>
          <span>userId:</span>  {message["id"]} <br></br>
          <span>message:</span> {message["text"]} <br></br>
         <span>time:</span> {message["date"]} <br></br>
          </li>})}
      </ul>
    </div>
  );
}

export default App;

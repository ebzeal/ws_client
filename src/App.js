import React, {useState, useEffect, useMemo} from 'react';
import io from "socket.io-client";
import './App.css';

function App() {
  const [messages, setMessages] = useState([]);
  const [values, setValues] = useState({
    clientId: '',
    message: '',
  });
  const [room, setRoom] = useState("")
  console.log("🚀 ~ file: App.js ~ line 12 ~ App ~ room", room)
  const socket = useMemo(()=> io("ws://localhost:3001/livestream"), []);

  useEffect(()=>{
    socket.emit('joinRoom', room)
    socket.on("msgToClient", data => {
    console.log("🚀 ~ file: App.js ~ line 22 ~ useEffect ~ data", data)
      setMessages([...messages, data])
    });
  }, [socket, messages, room]);


  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(values);
    const data = {
      message: values.message,
      sender:   values.clientId,
      date: Date.now(),
      room 
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
      <div className='buttonDiv'>
        <button onClick={()=>setRoom("episode1")}>Episode 1</button>
        <button  onClick={()=>setRoom("episode2")}>Episode 2</button>
        <button  onClick={()=>setRoom("episode3")}>Episode 3</button>
      </div>
      
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
        return <li key={messages.indexOf(message)}>
          <span>userId:</span>  {message["sender"]} <br></br>
          <span>message:</span> {message["message"]} <br></br>
         <span>time:</span> {message["date"]} <br></br>
          </li>})}
      </ul>
    </div>
  );
}

export default App;

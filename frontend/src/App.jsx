import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Routes, Route } from "react-router-dom";
import Home from './routes/Home';
import About from './routes/About';
import Login from './routes/Login';
import Register from './routes/Register';
import Rooms from './routes/Rooms';
import axios from 'axios';

axios.defaults.withCredentials=true;

function App() {
  const [count, setCount] = useState(0)
  const [user,setUser]=useState(null);
  const [loading,setLoading]=useState(true);

  useEffect(()=>{
    const fetchUser=async()=>{
      try{
        const response=await axios.get('http://localhost:5000/api/auth/me')
        console.log('Fetched user2:',response);
        setUser(response.data);
      }catch(error){
        console.error('Error fetching user:',error);
        setUser(null);
      }finally{
        setLoading(false);
      }
    }
    fetchUser();
  },[])

  if(loading){
    return <div>Loading...</div>
  }

  return (
    <Routes>
      <Route path="/" element={<Home user={user} setUser={setUser} />} />
      <Route path="/about" element={<About />} />
      <Route path="/login" element={<Login setUser={setUser} />} />
      <Route path="/register" element={<Register setUser={setUser} />}/>
      <Route path="/rooms" element={<Rooms />}/>
      {/* <Route path="/:type/:id" element={<Details />} /> */}
      {/* <Route path="/search/:query" element={<Search />} /> */}
    </Routes>
  )
}

export default App

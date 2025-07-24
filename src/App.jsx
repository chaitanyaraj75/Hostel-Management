import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Routes, Route } from "react-router-dom";
import Home from './routes/Home';
import About from './routes/About';
import Login from './routes/Login';
import Register from './routes/Register';

function App() {
  const [count, setCount] = useState(0)

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />}/>
      {/* <Route path="/:type/:id" element={<Details />} /> */}
      {/* <Route path="/search/:query" element={<Search />} /> */}
    </Routes>
  )
}

export default App

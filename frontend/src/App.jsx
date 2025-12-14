import { useEffect, useState } from 'react'
import './App.css'
import { Routes, Route } from "react-router-dom";
import Home from './routes/Home';
import About from './routes/About';
import Login from './routes/Login';
import Register from './routes/Register';
import Rooms from './routes/Rooms';
import axios from 'axios';
import Header from './routes/componenets/Header';
import Navbar from './routes/componenets/Navbar';
import server_url from './routes/componenets/server_url.js';
import ErrorBoundary from './routes/componenets/ErrorBoundary.jsx';
import Complaints from './routes/Complaints.jsx';
import Contacts from './routes/Contacts.jsx';

axios.defaults.withCredentials = true;

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`${server_url}/api/auth/me`)
        console.log('Fetched user2:', response);
        setUser(response.data.user);
      } catch (error) {
        console.error('Error fetching user:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, [])

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <ErrorBoundary>
      {/* <Header /> */}
      <Navbar user={user} setUser={setUser}/>
      <Routes>
        <Route path="/" element={<Home user={user} setUser={setUser} />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/register" element={<Register setUser={setUser} />} />
        <Route path="/rooms" element={<Rooms user={user} setUser={setUser} />} />
        <Route path='/complaints' element={<Complaints user={user} />} />
        <Route path='/contacts' element={<Contacts user={user} />} />
        {/* <Route path="/:type/:id" element={<Details />} /> */}
        {/* <Route path="/search/:query" element={<Search />} /> */}
      </Routes>
    </ErrorBoundary>
  )
}

export default App

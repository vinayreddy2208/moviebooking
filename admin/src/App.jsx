import { Route, Routes } from 'react-router-dom'
import './App.css'
import axios from "axios";
import AdminRegister from './pages/AdminRegister';
import AdminLogin from './pages/AdminLogin'
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import { Notifications } from '@mantine/notifications';
import Available from './pages/movies/Available';
import Upcoming from './pages/movies/Upcoming';
import Private from './pages/movies/Private';
import AdminContextProvider from './AdminContext';
import Admin from './pages/Admin';
import AddMovie from './components/AddMovie';
import { MantineProvider } from '@mantine/core';
import AddTheatre from './components/AddTheatre';
import VerifyTicket from './pages/VerifyTicket';
import Layout from './Layout';
import AdminProfile from './pages/AdminProfile';
import Theatres from './pages/Theatres';

const serverBase = import.meta.env.VITE_SERVER_BASE_URL

axios.defaults.baseURL = `${serverBase}`
axios.defaults.withCredentials = true;

function App() {

  return (
    <MantineProvider>
      <Notifications styles={{
        root: {
          display: 'flex',
          justifyContent: 'center',
        },
        notification: {
          padding: '10px 20px'
        }
      }} />
      <AdminContextProvider>
        <Routes>

          <Route path='/' element={<Layout />}>

            <Route index element={<Admin />} />

            <Route path='/admin/profile' element={<AdminProfile />} />

            <Route path='/movies/available' element={<Available />} />
            <Route path='/movies/upcoming' element={<Upcoming />} />
            <Route path='/movies/private' element={<Private />} />

            <Route path='/theatres' element={<Theatres />} />

            <Route path='/movies/new' element={<AddMovie />} />
            <Route path='/theatres/new' element={<AddTheatre />} />
            <Route path='/movies/:id' element={<AddMovie />} />
            <Route path='/theatres/:id' element={<AddTheatre />} />

            <Route path='/verify/:id' element={<VerifyTicket />} />

          </Route>

          <Route path='/admin/login' element={<AdminLogin />} />
          <Route path='/admin/register' element={<AdminRegister />} />
        </Routes>
      </AdminContextProvider>
    </MantineProvider>


  )
}

export default App

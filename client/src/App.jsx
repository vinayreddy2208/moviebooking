
import { Route, Routes } from 'react-router-dom'
import './App.css'
import '@mantine/core/styles.css';
import '@mantine/carousel/styles.css';
import '@mantine/notifications/styles.css';
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import MainPage from './pages/MainPage'
import Layout from './Layout'
import axios from 'axios'
import UserContextProvider from './UserContext'
import ProfilePage from './pages/ProfilePage'
import BookingsPage from './pages/BookingsPage'
import MoviePage from './pages/MoviePage';
import BookTicket from './pages/BookTicket';
import SeatLayout from './pages/SeatLayout';
import CheckoutPage from './pages/CheckoutPage';
import TestPage from './pages/TestPage';
import MoviePageNew from './pages/MoviePageNew';

const serverBase = import.meta.env.VITE_SERVER_BASE_URL
axios.defaults.baseURL = `${serverBase}`;
// axios.defaults.baseURL = 'https://amtbs-server.onrender.com'
axios.defaults.withCredentials = true;

function App() {

  return (

    <MantineProvider>
      <Notifications styles={{
        root: {
          display: 'flex',
          justifyContent: 'center',
        },
      }}/>
      <UserContextProvider>
        <Routes>

          <Route path='/' element={<Layout />}>

            <Route index element={<MainPage />} />
            <Route path='/user/profile' element={<ProfilePage />} />
            <Route path='/user/bookings' element={<BookingsPage />} />
            <Route path='/movies/:id' element={<MoviePage/>} />
            <Route path='/book/:id' element={<BookTicket />} />
            <Route path='/book/seats/:id' element={<SeatLayout />} />
            <Route path='/checkout/seats/:id' element={<CheckoutPage />} />
          </Route>

          <Route path='/login' element={<LoginPage />} />
          <Route path='/register' element={<RegisterPage />} />
          <Route path='/test' element={<TestPage />} />

        </Routes>
      </UserContextProvider>
    </MantineProvider>




  )
}

export default App

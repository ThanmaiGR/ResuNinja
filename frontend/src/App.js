import logo from './logo.svg';
import './App.css';
import Sidebar from "./components/Sidebar";
import AppRoutes from './routes/AppRoutes';
import { BrowserRouter } from 'react-router-dom';
import Alerts from './components/Alerts';
import React from'react';
import { AlertProvider } from './context/AlertContext';

function App() {
        const user = {
        username: 'johndoe123',
        name: 'John Doe',
        email: 'john.doe@gmail.com',
        // password: 'password',
        contact: '123456789',
        country: 'India',
        feedback: ['Great work', 'Keep it up']
    }

  return (
    <BrowserRouter>
      <AlertProvider>
        <div style={{display: 'flex'}}>
        <Sidebar user={user}/>
        <div style={{marginLeft: '200px', width: '100%'}}  > {/* Adjust margin based on Sidebar width */}
          <AppRoutes />
        </div>
        </div>
        <Alerts />
      </AlertProvider>

    </BrowserRouter>
  );
}

export default App;

import './App.css';
import Sidebar from "./components/Sidebar";
import AppRoutes from './routes/AppRoutes';
import {BrowserRouter, createPath} from 'react-router-dom';
import Alerts from './components/Alerts';
import React from'react';
import { AlertProvider } from './context/AlertContext';
import { UserProvider } from './context/UserContext'; // Import UserProvider
function App() {


  return (
    <BrowserRouter>
      <AlertProvider>
          <UserProvider>
              <div style={{display: 'flex'}}>
                <Sidebar />
                <div className='main-content' > {/* Adjust margin based on Sidebar width */}
                    <AppRoutes />
                </div>
              </div>
            </UserProvider>
        <Alerts />
      </AlertProvider>

    </BrowserRouter>
  );
}

export default App;

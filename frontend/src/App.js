import './styles/App.css';
import Sidebar from "./components/Sidebar";
import AppRoutes from './routes/AppRoutes';
import { BrowserRouter } from 'react-router-dom';
import Alerts from './components/Alerts';
import React from'react';
import { AlertProvider } from './context/AlertContext';
import { UserProvider } from './context/UserContext'; // Import UserProvider
function App() {

  return (
    <BrowserRouter>
      <UserProvider> {/* Wrap the app with UserProvider */}
        <AlertProvider>
          <div style={{display: 'flex'}}>
          <Sidebar />
          <div className='main-content' style={{marginLeft: '200px', width: '100%'}}  > {/* Adjust margin based on Sidebar width */}
            <AppRoutes />
          </div>
          </div>
          <Alerts />
        </AlertProvider>
      </UserProvider>

    </BrowserRouter>
  );
}

export default App;

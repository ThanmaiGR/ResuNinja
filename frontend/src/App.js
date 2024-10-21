import logo from './logo.svg';
import './App.css';
import Sidebar from "./components/Sidebar";
import AppRoutes from './routes/AppRoutes';
import { BrowserRouter } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <div style={{ display: 'flex' }}>
        <Sidebar />
        <div style={{ marginLeft: '60px', width: '100%' }}> {/* Adjust margin based on Sidebar width */}
          <AppRoutes />
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;

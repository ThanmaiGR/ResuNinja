// src/components/Alerts.js
import { useAlert } from '../context/AlertContext';
import '../styles/Alerts.css'; // Import CSS

export default function Alerts() {
    const { alerts } = useAlert();
    return (
        <div className="alert-container">
            {alerts.map((alert) => (
                <div key={alert.id} className={`alert-toast ${alert.type}`}>
                    {alert.message}
                </div>
            ))}
        </div>
    );
}

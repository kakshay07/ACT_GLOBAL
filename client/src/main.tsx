import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext.tsx';
import { MasterProvider } from './contexts/MasterContext.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
    // <React.StrictMode>
    <BrowserRouter>
        <AuthProvider>
            <MasterProvider>
                <App />
            </MasterProvider>
        </AuthProvider>
    </BrowserRouter>
    // </React.StrictMode>
);
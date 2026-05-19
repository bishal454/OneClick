
import { StrictMode } from 'react'


import { createRoot } from 'react-dom/client'


import './index.css'


import App from './App.tsx'


import { GoogleOAuthProvider } from '@react-oauth/google';


import { AppProvider } from './context/AppContext.tsx'
import 'leaflet/dist/leaflet.css';
import { SocketProvider } from './context/SocketContext.tsx';




export const authService = "http://localhost:5000";
export const restaurantService = "http://localhost:5001";
export const utilsService = "http://localhost:5002";
export const realtimeService = "http://localhost:5004";
export const riderService = "http://localhost:5005";


createRoot(document.getElementById('root')!).render(

  <StrictMode>

    <GoogleOAuthProvider clientId="768287714158-h23i4gbavljg67dqcd8lk4i9l2qmcrci.apps.googleusercontent.com">

      <AppProvider>
        <SocketProvider> <App />
        </SocketProvider>

      </AppProvider>

    </GoogleOAuthProvider>

  </StrictMode>
);


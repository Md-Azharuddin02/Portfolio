import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import {ThemeProvider} from "./Store/ThemeContext .jsx"
import OfflineDetector from './Components/OfflineDetector.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <OfflineDetector>
        <App />
        </OfflineDetector>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>,
) 
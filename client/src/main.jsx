import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Developer Easter Egg Signature
console.log(
  "%c🚀 تم تصميم وتطوير هذا الموقع بواسطة مصعب طارق | Developed by Mussab Tarig",
  "color: #00ff00; background: #000000; font-size: 16px; padding: 10px; border-radius: 5px; font-weight: bold;"
);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

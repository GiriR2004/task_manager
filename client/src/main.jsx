import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { TaskProvider } from './context/TaskContext' // ✅ import TaskProvider

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <TaskProvider>
      <App />
    </TaskProvider>
  </StrictMode>
)

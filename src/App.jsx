import { BrowserRouter } from 'react-router-dom'
import AppRoutes from './routes/index.jsx'
import './App.css'

function App() {
  return (
    <>
      {/* <div className="min-h-screen flex flex-col">
        <KickHeader />
        <KickMain />
        <KickFooter />
      </div> */}
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </>
    
  )
}

export default App
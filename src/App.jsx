import KickHeader from './components/KickHeader'
import KickMain from './components/KickMain'
import KickFooter from './components/KickFooter'
import './App.css'

function App() {
  return (
    <>
      <div className="min-h-screen flex flex-col">
        <KickHeader />
        <KickMain />
        <KickFooter />
      </div>
    </>
    
  )
}

export default App
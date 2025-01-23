import './App.css'
import Navbar from './Components/CommonComponents/Navbar'
import LandingPage from './Components/LandingPage'

function App() {

  return (
    <>
    <div className="min-h-screen"
      style={{
        background: 'linear-gradient(45deg, rgba(15, 3, 23) 40%, rgba(60, 46, 76) 100%)',        
      }}> 
      <Navbar /> 
         <LandingPage />
    </div>
    </>
  )
}

export default App

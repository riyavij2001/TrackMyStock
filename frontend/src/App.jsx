import './App.css'
import AboutUs from './Components/AboutUs'
import Navbar from './Components/CommonComponents/Navbar'
import LandingPage from './Components/LandingPage'
import Stocks from './Components/Stocks'
import Subscribe from './Components/Subscribe'

function App() {

  return (
    <>
    <div className="min-h-screen"
      style={{
        background: 'linear-gradient(45deg, rgba(15, 3, 23) 40%, rgba(60, 46, 76) 100%)',        
      }}> 
      <Navbar /> 
         <LandingPage />
         <AboutUs />
         <Stocks />
         {/* <Subscribe /> */}
    </div>
    </>
  )
}

export default App

import { useState } from 'react'
import { Menu, X, Upload, Share2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useContext } from 'react'
import Authcontext from '../../context/Authcontext'
import { useEffect } from 'react'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false) 
  const {user,setuser}=useContext(Authcontext);
const navigate=useNavigate();
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

   const logout=async()=>{
        try{
            const res=await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/user/logout`,{
                method:'POST',
                credentials:'include'
            })
            if(res.ok){
                setuser({});
                setIsLoggedIn(false);
            }
        }
        catch(err){
            console.log(err);
        }
    }

 
  useEffect(()=>{
    if(user!={})setIsLoggedIn(true);
  },[])

  return (
    <header className="header">
      <div className="header-container">
        {/* Logo Section */}
        <div className="logo-section">
          <div className="logo-wrapper">
            <Share2 className="logo-icon" />
            <span className="logo-text">ShareBox</span>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="desktop-nav">
          <a href="/" className="nav-link active">Home</a>
          <button onClick={()=>navigate('/upload')} className="nav-button upload-btn">
            <Upload className="w-4 h-4" />
            Upload Files
          </button>
          {isLoggedIn ? (
            <button onClick={logout} className="nav-button logout-btn">
              Logout
            </button>
          ) : (
            <>
              <button onClick={()=>navigate('/login')} className="nav-button login-btn">
                Login
              </button>
              <button onClick={()=>navigate('/signup')} className="nav-button signup-btn">
                Sign Up
              </button>
            </>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button 
          className="mobile-menu-btn"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Navigation */}
      <div className={`mobile-nav ${isMenuOpen ? 'mobile-nav-open' : ''}`}>
        <div className="mobile-nav-content">
          <a href="/" className="mobile-nav-link active">Home</a>
          <button onClick={()=>navigate('/upload')} className="mobile-nav-button upload-btn">
            <Upload className="w-4 h-4" />
            Upload Files
          </button>
          {isLoggedIn ? (
            <button onClick={logout} className="mobile-nav-button logout-btn">
              Logout
            </button>
          ) : (
            <>
              <button onClick={()=>navigate('/login')} className="mobile-nav-button login-btn">
                Login
              </button>
              <button onClick={()=>navigate('/signup')} className="mobile-nav-button signup-btn">
                Sign Up
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header
import { auth, googleProvider } from "../config/firebase";
import {
  signInWithRedirect,
  setPersistence,
  browserLocalPersistence,
  getRedirectResult,
  // eslint-disable-next-line no-unused-vars
  signInWithPopup,
} from "firebase/auth";
import dropLogo from "../assets/logo.png";
import globe from '../assets/globe.png';
import "../styles/login.css";
import { useState } from "react";
import { Link } from "react-router-dom";
import SEO from "../components/SEO";

export default function Login() {

  const [isWorking, setIsWorking] = useState(false);
  const [hasError, setHasError] = useState(false);

  const onClick = async () => {
    
    try {
      // Set persistence to local storage
      await setPersistence(auth, browserLocalPersistence);

      // Try sign in with redirect
      await signInWithRedirect(auth, googleProvider);
      const result = await getRedirectResult(auth)

      // Development sign in with popup !!! Comment out before commit !!!
      // const result = await signInWithPopup(auth, googleProvider)
      
      
      setIsWorking(true)
      if (!result) {
        setHasError(true)
        throw new Error("No redirect result found");
      }
    } catch (error) {
      console.log("Error during sign-in process:", error);
    }
  };

  return (
    <>
      <SEO title='Login to GeoDrop' desc='Login to GeoDrop, the location-based social media app.' canon='login'/>
      <section id="loginPage" className="flex vertical center gapM">
        <img src={dropLogo} alt="GeoDrop" width="80%" />
        {isWorking && !hasError && <img src={globe} alt="globe" width='100%' className="loginGlobe"></img>}
        <h1 style={{ display: "none" }}>GeoDrop</h1>
        <h2>Welcome to GeoDrop!</h2>
        <p>Sign in to get started</p>
        <button
          className="gsi-material-button"
          style={{ width: "200px" }}
          onClick={onClick}
        >
          <div className="gsi-material-button-state"></div>
          <div className="gsi-material-button-content-wrapper">
            <div className="gsi-material-button-icon">
              <svg
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 48 48"
                xmlnsXlink="http://www.w3.org/1999/xlink"
                style={{ display: "block" }}
              >
                <path
                  fill="#EA4335"
                  d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                ></path>
                <path
                  fill="#4285F4"
                  d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                ></path>
                <path
                  fill="#FBBC05"
                  d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                ></path>
                <path
                  fill="#34A853"
                  d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                ></path>
                <path fill="none" d="M0 0h48v48H0z"></path>
              </svg>
            </div>
            <span className="gsi-material-button-contents">
              Sign in with Google
            </span>
            <span style={{ display: "none" }}>Sign in with Google</span>
          </div>
        </button>
        {hasError && <p style={{padding: '1rem', textAlign: 'center', background: 'red', color: 'white'}}>Error occurred during login. Please try again later.</p>}
        <div style={{padding: '2rem', textAlign: 'center'}} id="learnMore">
          <Link to='/about' style={{textDecoration: 'underline', color: 'var(--blue)'}}>Learn more about GeoDrop</Link>
        </div>
      </section>
    </>
  );
}

import React from 'react'
import { Link } from 'react-router-dom';

function Landing() {
  return (
    <div className='landingContainer'>
      <nav>
        <div className="navHeader">
            <h2>
                Video Conferencing
            </h2>
        </div>

        <div className="navList">
            <p>
                Join as Guest
            </p>

            <p>
                Register
            </p>

            <div role='button'>
                 Login
            </div>
        </div>
      </nav>

      <main className='landingMainContainer'>
            <div className="landText">
                <h1>
                    <span style={{color:"orange"}}>Connect</span>
                    &nbsp; with your <br/> Loved one's.
                </h1>
                <p>Cover distance by Apna Video Call...</p>

                <div className='StartBtn'>
                    <Link to='/auth'>Get Started</Link>
                </div>
            </div>
            <div className='landImg'>
                <img src="public/mobile.png" alt="VC-Image" />
            </div>
      </main>
    </div>
  )
}

export default Landing;

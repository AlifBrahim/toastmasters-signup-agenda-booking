import React from 'react';
import { FaGithub } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer style={{position: 'absolute', width: '100%', backgroundColor: 'black'}}>
      <div className="container">
        <div className="row">
        <div className="col-md-12" style={{fontFamily: 'Gotham', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <a href="https://github.com/AlifBrahim/toastmasters-signup-agenda-booking" target="_blank" rel="noopener noreferrer">
              <FaGithub style={{color: 'white', fontSize: '22px'}}/>
            </a>
            <div style={{marginLeft: '15px', color: "white"}}>Made by Alif Ibrahim with Next.js</div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
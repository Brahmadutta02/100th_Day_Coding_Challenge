import React from 'react';
import Typical from 'react-typical';
import "./Profile.css";

export default function profile() {
  return (
    <div className='profile-container'>
      <div className='profile-parent'>
        <div className='profile-details'>
            <div className='colz'>
                <div className='colz-icon'>
                <a href='https://www.linkedin.com/in/brahmadutta-dalai/'>
                    <i className='fa fa-linkedin-square'></i>
                </a>
                <a href='#'>
                    <i className='fa fa-google-plus-square'></i>
                </a>
                <a href='#'>
                    <i className='fa fa-instagram'></i>
                </a>
                <a href='https://www.youtube.com/@brehmscapture8328'>
                    <i className='fa fa-youtube-square'></i>
                </a>
                <a href='https://twitter.com/brehms02'>
                    <i className='fa fa-twitter'></i>
                </a>
                </div>
            </div>
            <div className="profile-details-name">
                <span className="primary-text">
                    {" "}
                    Hello, I'M <span className="highlighted-text">Brahma</span>
                </span>
            </div>
            <div className='profile-details-role'>
                <span className='primary-text'>
                    {" "}
                    <h1>
                    {" "}
                    <Typical
                    loop={Infinity}
                    steps={[
                        "Enthusiastic",
                        1000,
                        "Web Developer",
                        1000,
                        "Web Designing",
                        1000,
                        "Developer",
                        1000,
                        "Programmer",
                        1000,
                    ]}
                    />
                    </h1>
                    <span className='profile-role-tagline'>
                    Web Developer
                    </span>
                </span>
            </div>
            <div className="profile-options">
                <button className="btn primary-btn">
                    {""}
                    Hire Me{" "}
                </button>
                <a href='Brahmadutta.pdf' download='Brahmadutta.pdf'>
                    <button className="btn highlighted-btn">Get Resume</button>
                </a>
            </div>
        </div>
        <div className='profile-picture'>
            <div className='profile-picture-background'>

            </div>
        </div>
      </div>
    </div>
  )
}

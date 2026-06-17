import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import heroImg from '../assets/hero.png';
import videoSrc from '../assets/videos.mp4';
import projectsIcon from '../assets/projects_icon.png';
import certificatesIcon from '../assets/certificates_icon.png';
import aboutIcon from '../assets/about_icon.png';
import uiuxDesigner from '../assets/uiux_designer.png';
import graphicDesigner from '../assets/graphic_designer.png';
import videoEditor from '../assets/video_editor.png';
import uiuxPopupMenu from '../assets/uiux_popup_menu.png';
import popupSoundSrc from '../assets/popup_sound.mp3';
import exitButton from '../assets/exit_button.png';

/**
 * Main Menu Screen component (Desktop-3).
 * Renders the home screen of the portfolio with full-screen background video and interactive controls.
 */
export default function MainMenu({ onNavigate }) {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  // Sound and opening delay trigger
  const handleUiuxClick = () => {
    if (!window.__audioMuted) {
      const audio = new Audio(popupSoundSrc);
      audio.volume = 1.0;
      audio.loop = false;
      audio.play().catch((err) => {
        console.log("Audio blocked:", err);
      });
    }

    setTimeout(() => {
      setIsPopupOpen(true);
    }, 200);
  };

  // Escape key closing behavior
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsPopupOpen(false);
      }
    };
    if (isPopupOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isPopupOpen]);

  return (
    <div className="w-full h-full min-h-screen relative flex items-center justify-center overflow-x-hidden overflow-y-auto lg:overflow-hidden bg-black px-6 py-10 lg:px-8 lg:py-12">
      {/* Wrapper container that blurs and dims when popup is open */}
      <div
        style={{
          filter: isPopupOpen ? "blur(12px)" : "none",
          opacity: isPopupOpen ? 0.5 : 1,
          pointerEvents: isPopupOpen ? "none" : "auto",
          transition: "filter 0.25s ease-out, opacity 0.25s ease-out",
          zIndex: 10
        }}
        className="relative lg:absolute lg:top-0 lg:left-0 w-full h-auto lg:h-full min-h-full lg:min-h-0 flex flex-col lg:flex-row items-center justify-center"
      >
        {/* 1. Full-Screen Background Video */}
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute top-0 left-0 w-full h-full object-cover z-0"
        >
          <source src={videoSrc} type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* 2. Subtle Dark Overlay for Readability */}
        <div className="absolute top-0 left-0 w-full h-full bg-black/45 z-10" />

        {/* 3. Content Layout: Explicit True Two-Column Side-by-Side Layout */}
        <div className="relative z-20 w-full max-w-6xl flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-10">
          
          {/* Left Column: Floating Wizard Crewmate (hero.png) - Enlarged by another 15-20% */}
          <div className="flex-none lg:flex-1 flex justify-center lg:justify-end pr-0 lg:pr-2">
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="flex justify-center items-center animate-fade-in"
            >
              <img
                src={heroImg}
                alt="Yogita Crewmate"
                className="w-[140px] md:w-[180px] lg:w-[730px] h-auto lg:h-[766px] object-contain drop-shadow-[0_15px_30px_rgba(0,0,0,0.7)] select-none pointer-events-none"
              />
            </motion.div>
          </div>

          {/* Right Column: Title, Roles, and Navigation Circles - Left Aligned and moved closer */}
          <div className="flex-none lg:flex-1 flex flex-col items-center lg:items-start justify-center pl-0 lg:pl-2 text-center lg:text-left w-full">
            {/* Typography Header - Increased by exactly 40% from the base 48px (to 68px) and desktop sizes (84px-108px) */}
            <h1 className="font-joffrey text-white text-3xl md:text-4xl lg:text-[108px] tracking-wide select-none drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)] uppercase">
              HI, I'M YOGITA
            </h1>

            {/* Role Buttons Group - Utilizing provided Figma image assets directly at their scaled up size (mt reduced for a connected layout) */}
            <div className="flex flex-col items-center lg:items-start gap-4 lg:gap-3 w-full lg:max-w-[430px] mt-6 lg:mt-3">
              {/* Primary Role (UI/UX Designer) */}
              <button 
                onClick={handleUiuxClick}
                className="bg-transparent border-0 p-0 hover:scale-[1.03] active:scale-[0.98] transition-transform duration-200 cursor-pointer focus:outline-none w-[85%] max-w-[320px] lg:w-[430px] lg:max-w-none flex items-center justify-center lg:justify-start"
              >
                <img
                  src={uiuxDesigner}
                  alt="UI/UX Designer"
                  className="w-full h-auto object-contain select-none pointer-events-none"
                />
              </button>

              {/* Secondary Roles Side-by-Side */}
              <div className="flex flex-col md:flex-row gap-4 md:gap-3 w-[85%] max-w-[320px] md:max-w-[320px] lg:w-[430px] lg:max-w-none justify-center lg:justify-start">
                {/* Graphic Designer */}
                <button 
                  onClick={() => onNavigate('graphic-intro')}
                  className="bg-transparent border-0 p-0 hover:scale-[1.03] active:scale-[0.98] transition-transform duration-200 cursor-pointer focus:outline-none w-full md:flex-1 flex items-center justify-center lg:justify-start"
                >
                  <img
                    src={graphicDesigner}
                    alt="Graphic Designer"
                    className="w-full h-auto object-contain select-none pointer-events-none"
                  />
                </button>

                {/* Video Editor */}
                <button className="bg-transparent border-0 p-0 hover:scale-[1.03] active:scale-[0.98] transition-transform duration-200 cursor-pointer focus:outline-none w-full md:flex-1 flex items-center justify-center lg:justify-start">
                  <img
                    src={videoEditor}
                    alt="Video Editor"
                    className="w-full h-auto object-contain select-none pointer-events-none"
                  />
                </button>
              </div>
            </div>

            {/* Navigation Icons at Bottom - Medium-sized icons, increased horizontal spacing, fully bg-transparent backgrounds */}
            <div 
              style={{
                opacity: isPopupOpen ? 0 : 1,
                pointerEvents: isPopupOpen ? 'none' : 'auto',
                transition: 'opacity 0.2s ease-out'
              }}
              className="flex flex-row flex-wrap items-center justify-center w-full gap-4 mt-8 lg:flex-nowrap lg:gap-12 lg:max-w-[430px] lg:mt-8"
            >
              {/* Circle 1: Certificates */}
              <button
                onClick={() => onNavigate('certs-intro')}
                className="group relative w-14 h-14 sm:w-16 sm:h-16 rounded-full border-2 border-white bg-transparent hover:bg-white/10 hover:scale-110 active:scale-95 transition-all duration-200 flex items-center justify-center focus:outline-none shadow-[0_4px_10px_rgba(0,0,0,0.4)]"
              >
                <img
                  src={certificatesIcon}
                  alt="Certificates"
                  className="w-[35px] h-[35px] sm:w-[38px] sm:h-[38px] object-contain select-none pointer-events-none group-hover:scale-105 transition-transform duration-200"
                />
              </button>

              {/* Circle 2: Projects */}
              <button
                onClick={() => console.log('Projects clicked')}
                className="group relative w-14 h-14 sm:w-16 sm:h-16 rounded-full border-2 border-white bg-transparent hover:bg-white/10 hover:scale-110 active:scale-95 transition-all duration-200 flex items-center justify-center focus:outline-none shadow-[0_4px_10px_rgba(0,0,0,0.4)]"
              >
                <img
                  src={projectsIcon}
                  alt="Projects"
                  className="w-[35px] h-[35px] sm:w-[38px] sm:h-[38px] object-contain select-none pointer-events-none group-hover:scale-105 transition-transform duration-200"
                />
              </button>

              {/* Circle 3: About */}
              <button
                onClick={() => onNavigate('about-intro')}
                className="group relative w-14 h-14 sm:w-16 sm:h-16 rounded-full border-2 border-white bg-transparent hover:bg-white/10 hover:scale-110 active:scale-95 transition-all duration-200 flex items-center justify-center focus:outline-none shadow-[0_4px_10px_rgba(0,0,0,0.4)]"
              >
                <img
                  src={aboutIcon}
                  alt="About"
                  className="w-[35px] h-[35px] sm:w-[38px] sm:h-[38px] object-contain select-none pointer-events-none group-hover:scale-105 transition-transform duration-200"
                />
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* 4. UI/UX Designer Popup Menu Overlay */}
      <AnimatePresence>
        {isPopupOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              backgroundColor: "transparent",
              backdropFilter: "none",
              WebkitBackdropFilter: "none",
              filter: "none",
              boxShadow: "none"
            }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
            onClick={() => setIsPopupOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              style={{
                filter: "none",
                boxShadow: "none"
              }}
              className="relative w-full max-w-[570px] aspect-[1658/684] select-none"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={uiuxPopupMenu}
                alt="UI/UX Designer Popup Menu"
                className="w-full h-full object-contain pointer-events-none select-none"
              />
              
              {/* Invisible clickable area: Projects */}
              <button 
                onClick={() => {
                  setIsPopupOpen(false);
                  onNavigate('projects-intro');
                }}
                style={{
                  left: "17.25%",
                  width: "74.73%",
                  top: "23.98%",
                  height: "11.11%"
                }}
                className="absolute bg-transparent border-none cursor-pointer focus:outline-none opacity-0 hover:bg-white/5 active:bg-white/10 rounded"
              />

              {/* Invisible clickable area: Experience */}
              <button 
                onClick={() => {
                  setIsPopupOpen(false);
                  onNavigate('experience-intro');
                }}
                style={{
                  left: "17.25%",
                  width: "74.73%",
                  top: "60.82%",
                  height: "11.40%"
                }}
                className="absolute bg-transparent border-none cursor-pointer focus:outline-none opacity-0 hover:bg-white/5 active:bg-white/10 rounded"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 5. Exit Megaphone Button - Rendered outside containing blocks for absolute screen bounds */}
      <AnimatePresence>
        {isPopupOpen && (
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
            onClick={() => setIsPopupOpen(false)}
            style={{
              position: 'fixed',
              bottom: '32px',
              right: '32px',
              zIndex: 60
            }}
            className="bg-transparent border-0 p-0 cursor-pointer focus:outline-none w-[65px] sm:w-[75px] md:w-[90px] h-auto"
          >
            <img
              src={exitButton}
              alt="Exit Button"
              className="w-full h-auto object-contain select-none pointer-events-none"
            />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}

import { useState, useEffect, useRef } from 'react';
import { AnimatePresence } from 'framer-motion';
import ScreenTransition from './components/ScreenTransition';
import LoadingScreen from './components/LoadingScreen';
import ShhhScreen from './components/ShhhScreen';
import MainMenu from './components/MainMenu';
import CertificatesIntro from './components/CertificatesIntro';
import ProjectsIntro from './components/ProjectsIntro';
import CafeteriaCerts from './components/CafeteriaCerts';
import EmergencyTransition from './components/EmergencyTransition';
import UiuxProjects from './components/UiuxProjects';
import UiuxExperience from './components/UiuxExperience';
import ExperienceIntro from './components/ExperienceIntro';
import AboutIntro from './components/AboutIntro';
import About from './components/About';
import GraphicIntro from './components/GraphicIntro';
import GraphicProjects from './components/GraphicProjects';
import loadingSoundSrc from './assets/loading.mp3';
import startSoundSrc from './assets/start.mp3';
import exitSoundSrc from './assets/exit.mp3';
import footstepsSoundSrc from './assets/footsteps.mp3';
// Global Audio Interceptor for mute functionality
if (typeof window !== 'undefined') {
  window.__activeAudios = window.__activeAudios || [];
  window.__audioMuted = localStorage.getItem('isMuted') === 'true';

  const OriginalAudio = window.Audio;

  const CustomAudio = function(...args) {
    const instance = new OriginalAudio(...args);
    window.__activeAudios.push(instance);

    const originalPlay = instance.play;
    instance.play = function() {
      if (window.__audioMuted) {
        console.log("Audio play blocked: muted");
        return Promise.resolve();
      }
      return originalPlay.apply(this, arguments);
    };

    instance.addEventListener('ended', () => {
      window.__activeAudios = window.__activeAudios.filter(a => a !== instance);
    });

    return instance;
  };

  CustomAudio.prototype = OriginalAudio.prototype;
  window.Audio = CustomAudio;

  const originalProtoPlay = HTMLAudioElement.prototype.play;
  HTMLAudioElement.prototype.play = function() {
    if (window.__audioMuted) {
      console.log("HTMLAudioElement play blocked: muted");
      return Promise.resolve();
    }
    return originalProtoPlay.apply(this, arguments);
  };
}

/**
 * Main application component.
 * Acts as the state controller routing between different screens in the portfolio matching the Figma flow.
 */
export default function App() {
  const [screen, setScreen] = useState('loading');
  const [audioUnlocked, setAudioUnlocked] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [isMuted, setIsMuted] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('isMuted') === 'true';
    }
    return false;
  });

  const loadingAudioRef = useRef(null);
  const startAudioRef = useRef(null);
  const menuAudioRef = useRef(null);
  const exitAudioRef = useRef(null);
  const footstepsAudioRef = useRef(null);
  const menuTimeoutRef = useRef(null);

  // Sync isMuted changes with window.__audioMuted, localStorage, and pause/reset all audios when muted
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.__audioMuted = isMuted;
      localStorage.setItem("isMuted", String(isMuted));
      
      if (isMuted) {
        // Stop all active audios immediately
        if (window.__activeAudios) {
          window.__activeAudios.forEach((audio) => {
            try {
              audio.pause();
              audio.currentTime = 0;
            } catch (err) {
              console.error("Error pausing audio:", err);
            }
          });
        }
        // Also explicitly stop refs inside App.jsx
        const refs = [loadingAudioRef, startAudioRef, menuAudioRef, exitAudioRef, footstepsAudioRef];
        refs.forEach(ref => {
          if (ref.current) {
            try {
              ref.current.pause();
              ref.current.currentTime = 0;
            } catch (err) {
              console.error("Error pausing ref:", err);
            }
          }
        });
      }
    }
  }, [isMuted]);

  // Expose audio refs globally so intros/other pages can stop them if needed
  useEffect(() => {
    window._appAudioRefs = {
      loadingAudioRef,
      startAudioRef,
      menuAudioRef,
      exitAudioRef,
      footstepsAudioRef
    };
    return () => {
      delete window._appAudioRefs;
    };
  }, []);

  // Audio Unlock System: Listen to the first user interaction to unlock audio playback
  useEffect(() => {
    const handleInteraction = () => {
      setAudioUnlocked(true);
      window.removeEventListener('click', handleInteraction);
      window.removeEventListener('keydown', handleInteraction);
      window.removeEventListener('touchstart', handleInteraction);
      console.log('Audio unlocked via user interaction');
    };

    window.addEventListener('click', handleInteraction);
    window.addEventListener('keydown', handleInteraction);
    window.addEventListener('touchstart', handleInteraction);

    return () => {
      window.removeEventListener('click', handleInteraction);
      window.removeEventListener('keydown', handleInteraction);
      window.removeEventListener('touchstart', handleInteraction);
    };
  }, []);

  useEffect(() => {
    // Helper function to stop an audio instance safely
    const stopAudio = (audioRef, label) => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        console.log(`${label} audio stopped`);
      }
    };

    if (screen === 'loading') {
      if (!hasStarted) {
        return;
      }
      // 1. Loading Screen: play loading.mp3 immediately
      stopAudio(startAudioRef, "Start");
      stopAudio(menuAudioRef, "Menu");
      stopAudio(footstepsAudioRef, "Footsteps");
      if (menuTimeoutRef.current) {
        clearTimeout(menuTimeoutRef.current);
        menuTimeoutRef.current = null;
      }
      if (!loadingAudioRef.current) {
        loadingAudioRef.current = new Audio(loadingSoundSrc);
      }
      loadingAudioRef.current.loop = false;
      loadingAudioRef.current.volume = 1.0;
      console.log('Loading audio started');
      if (!isMuted && !window.__audioMuted) {
        loadingAudioRef.current.play().catch((err) => {
          console.log("Audio blocked:", err);
        });
      }
    } else if (screen === 'shhh') {
      // 2. SHHH Screen: play start.mp3 once (non-looping)
      stopAudio(loadingAudioRef, "Loading");
      stopAudio(menuAudioRef, "Menu");
      stopAudio(footstepsAudioRef, "Footsteps");
      if (menuTimeoutRef.current) {
        clearTimeout(menuTimeoutRef.current);
        menuTimeoutRef.current = null;
      }

      // Always transition to main-menu after exactly 2500ms
      const transitionTimeout = setTimeout(() => {
        console.log('SHHH screen timeout, transitioning to main-menu');
        setScreen('main-menu');
      }, 2500);

      if (!isMuted && !window.__audioMuted) {
        if (!startAudioRef.current) {
          startAudioRef.current = new Audio(startSoundSrc);
        }
        const audio = startAudioRef.current;
        audio.loop = false;
        audio.volume = 1.0;
        audio.currentTime = 0;
        console.log('Start audio started');
        audio.play().catch((err) => {
          console.log("Audio blocked:", err);
        });
      }

      return () => {
        clearTimeout(transitionTimeout);
        stopAudio(startAudioRef, "Start");
      };
    } else if (['main-menu'].includes(screen)) {
      // 3. Ambient menu screens: play "loading.mp3", volume 0.25/0.50, loop natively
      stopAudio(loadingAudioRef, "Loading");
      stopAudio(startAudioRef, "Start");
      stopAudio(footstepsAudioRef, "Footsteps");

      if (!isMuted && !window.__audioMuted && audioUnlocked) {
        if (!menuAudioRef.current) {
          menuAudioRef.current = new Audio(loadingSoundSrc);
        }
        const audio = menuAudioRef.current;
        audio.volume = screen === 'cafeteria-certs' ? 0.5 : 0.25;
        audio.loop = true;

        if (audio.paused) {
          audio.currentTime = 0;
          console.log('Main menu audio started');
          audio.play().catch((err) => {
            console.log("Audio blocked:", err);
          });
        }
      }
    } else if (['uiux-projects', 'uiux-experience', 'graphic-design', 'about', 'cafeteria-certs'].includes(screen)) {
      // 4. Content screens: play footsteps.mp3
      stopAudio(loadingAudioRef, "Loading");
      stopAudio(startAudioRef, "Start");
      stopAudio(menuAudioRef, "Menu");

      if (!isMuted && !window.__audioMuted && audioUnlocked) {
        if (!footstepsAudioRef.current) {
          footstepsAudioRef.current = new Audio(footstepsSoundSrc);
        }
        const audio = footstepsAudioRef.current;
        audio.volume = 0.5;
        audio.loop = true;

        if (audio.paused) {
          audio.currentTime = 0;
          console.log('Footsteps audio started');
          audio.play().catch((err) => {
            console.log("Audio blocked:", err);
          });
        }
      }
    } else if (screen === 'returning-splash') {
      stopAudio(loadingAudioRef, "Loading");
      stopAudio(startAudioRef, "Start");
      stopAudio(menuAudioRef, "Menu");
      stopAudio(footstepsAudioRef, "Footsteps");

      if (menuTimeoutRef.current) {
        clearTimeout(menuTimeoutRef.current);
        menuTimeoutRef.current = null;
      }

      if (!isMuted && !window.__audioMuted && audioUnlocked) {
        if (!exitAudioRef.current) {
          exitAudioRef.current = new Audio(exitSoundSrc);
        }
        const audio = exitAudioRef.current;
        audio.loop = false;
        audio.volume = 1.0;
        audio.currentTime = 0;
        console.log('Exit transition audio started');
        audio.play().catch((err) => {
          console.log("Audio blocked:", err);
        });
      }
    } else {
      stopAudio(loadingAudioRef, "Loading");
      stopAudio(startAudioRef, "Start");
      stopAudio(menuAudioRef, "Menu");
      stopAudio(exitAudioRef, "Exit");
      stopAudio(footstepsAudioRef, "Footsteps");

      if (menuTimeoutRef.current) {
        clearTimeout(menuTimeoutRef.current);
        menuTimeoutRef.current = null;
      }
    }

    return () => {
      if (screen === 'loading') {
        stopAudio(loadingAudioRef, "Loading");
      }
      if (screen === 'returning-splash') {
        stopAudio(exitAudioRef, "Exit");
      }
      if (['uiux-projects', 'uiux-experience', 'graphic-design', 'about', 'cafeteria-certs'].includes(screen)) {
        stopAudio(footstepsAudioRef, "Footsteps");
      }
    };
  }, [screen, audioUnlocked, hasStarted, isMuted]);

  return (
    <div className="w-full h-full min-h-screen bg-black text-white relative">
      <button
        onClick={() => setIsMuted(prev => !prev)}
        style={{
          position: "fixed",
          top: "20px",
          right: "20px",
          zIndex: 999999,
          background: "black",
          color: "white",
          border: "2px solid white",
          borderRadius: "12px",
          padding: "12px 20px",
          fontSize: "18px",
          cursor: "pointer"
        }}
      >
        {isMuted ? "🔇 SOUND OFF" : "🔊 SOUND ON"}
      </button>
      <AnimatePresence mode="wait">
        {screen === 'loading' && (
          <ScreenTransition key="loading">
            {!hasStarted ? (
              <div className="w-full h-full min-h-screen bg-black flex flex-col items-center justify-center relative overflow-hidden">
                <button
                  onClick={() => setHasStarted(true)}
                  className="font-vcr border-2 border-[#FFD84D] text-[#FFD84D] bg-transparent px-8 py-3 rounded-md shadow-[0_0_15px_rgba(255,216,77,0.5)] transition-all duration-300 hover:shadow-[0_0_25px_rgba(255,216,77,0.8)] cursor-pointer text-xl tracking-wider uppercase font-bold"
                >
                  CLICK TO START
                </button>
              </div>
            ) : (
              <LoadingScreen onComplete={() => setScreen('shhh')} />
            )}
          </ScreenTransition>
        )}
        
        {screen === 'shhh' && (
          <ScreenTransition key="shhh">
            <ShhhScreen />
          </ScreenTransition>
        )}
        
        {screen === 'main-menu' && (
          <ScreenTransition key="main-menu">
            <MainMenu onNavigate={setScreen} />
          </ScreenTransition>
        )}
        
        {screen === 'certs-intro' && (
          <ScreenTransition key="certs-intro">
            <CertificatesIntro onComplete={() => setScreen('cafeteria-certs')} />
          </ScreenTransition>
        )}
        
        {screen === 'projects-intro' && (
          <ScreenTransition key="projects-intro">
            <ProjectsIntro onComplete={() => setScreen('uiux-projects')} />
          </ScreenTransition>
        )}
        
        {screen === 'cafeteria-certs' && (
          <ScreenTransition key="cafeteria-certs" scrollable={true}>
            <CafeteriaCerts onExit={() => setScreen('returning-splash')} />
          </ScreenTransition>
        )}
        
        {screen === 'returning-splash' && (
          <ScreenTransition key="returning-splash">
            <EmergencyTransition onComplete={() => setScreen('main-menu')} />
          </ScreenTransition>
        )}

        {screen === 'about-intro' && (
          <ScreenTransition key="about-intro">
            <AboutIntro onComplete={() => setScreen('about')} />
          </ScreenTransition>
        )}

        {screen === 'experience-intro' && (
          <ScreenTransition key="experience-intro">
            <ExperienceIntro onComplete={() => setScreen('uiux-experience')} />
          </ScreenTransition>
        )}

        {screen === 'graphic-intro' && (
          <ScreenTransition key="graphic-intro">
            <GraphicIntro onComplete={() => setScreen('graphic-design')} />
          </ScreenTransition>
        )}

        {screen === 'graphic-design' && (
          <ScreenTransition key="graphic-design" scrollable={true}>
            <GraphicProjects onBack={() => setScreen('returning-splash')} />
          </ScreenTransition>
        )}

        {screen === 'about' && (
          <ScreenTransition key="about" scrollable={true}>
            <About onBack={() => setScreen('returning-splash')} />
          </ScreenTransition>
        )}
        
        {screen === 'uiux-projects' && (
          <ScreenTransition key="uiux-projects" scrollable={true}>
            <UiuxProjects onBack={() => setScreen('returning-splash')} />
          </ScreenTransition>
        )}
        
        {screen === 'uiux-experience' && (
          <ScreenTransition key="uiux-experience" scrollable={true}>
            <UiuxExperience onBack={() => setScreen('returning-splash')} />
          </ScreenTransition>
        )}
      </AnimatePresence>

    </div>
  );
}

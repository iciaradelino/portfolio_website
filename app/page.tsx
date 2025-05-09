"use client";

import { useEffect, useState, useRef } from 'react';
import Image from "next/image";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { HiMail } from "react-icons/hi";
import { HiDocumentText } from "react-icons/hi2";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { IoAdd, IoClose } from "react-icons/io5";
import { FiMapPin } from "react-icons/fi";

// Define a type for project media items (images or videos)
interface ProjectMedia {
  type: 'image' | 'video';
  src: string;
  alt: string;
}

// Define a type for project data
interface Project {
  id: string;
  title: string;
  techStack: string;
  description: string | string[]; // Allow single string or array for bullet points
  media: ProjectMedia[];
  status?: 'In Development'; // Optional status
}

export default function Home() {
  const [activeSection, setActiveSection] = useState('projects');
  const [currentPersonalImage, setCurrentPersonalImage] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  const introRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);
  const [isCarouselAnimating, setIsCarouselAnimating] = useState(false);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [currentModalImageIndex, setCurrentModalImageIndex] = useState(0);
  const [isModalRendered, setIsModalRendered] = useState(false); // Track if modal has been rendered at least once

  // State for custom cursor effect
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [showPlusIcon, setShowPlusIcon] = useState(false);
  const [hoveredProjectId, setHoveredProjectId] = useState<string | null>(null);

  // Add state for screen size detection
  const [isMobile, setIsMobile] = useState(false);

  // Add state for mobile menu toggle
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Add state for conditional mobile header visibility
  const [showMobileHeader, setShowMobileHeader] = useState(false);

  // Projects eligible for the plus icon hover effect
  const eligibleProjectIds = ['mappy', 'diverged', 'iconic', 'climbr'];

  // Restructured Project Data
  const projectsData: Project[] = [
    {
      id: "climbr",
      title: "Climbr - Social Media App for Climbers",
      techStack: "React Native • Expo Go • MongoDB • Flask",
      description: [
        "Developed the frontend and backend for a social media application tailored for climbers.",
        "Features include post sharing, user profiles, workout tracking, and following other climbers.",
        "Currently deployed to the Play Store for internal testing, with a full public release planned soon."
      ],
      media: [{ type: 'video', src: "/images/climbr_video.mp4", alt: "Climbr App Video Demo" }],
      status: "In Development",
    },
    {
      id: "mappy",
      title: "Mappy - Travel Planning Platform",
      techStack: "React • Next.js • TypeScript • Supabase",
      description: [ 
        "Designed and implemented the UI/UX for a travel planning web application using React and JavaScript.",
        "Developed the backend infrastructure utilizing TypeScript, Supabase, and integrated Amadeus and OpenAI APIs for enhanced functionality."
      ],
      media: [{ type: 'video', src: "/images/mappy_demo.mp4", alt: "Mappy Travel Planning Platform" }],
    },
    {
      id: "victoria",
      title: "VictorIA - IEU Robotics and AI Club",
      techStack: "ROS • OPENCV • PYTHON",
      description: [
        "Programming a WidowX 250 S robotic arm to play Connect 4.",
        "Utilized Python, Computer Vision (OpenCV), and Robot Operating System (ROS) for control and perception."
      ],
      media: [{ type: 'image', src: "/images/victoria_project.png", alt: "VictorIA Robotics Project" }],
      status: "In Development",
    },
    {
      id: "clothing",
      title: "Clothing Recognition Website",
      techStack: "Python • OpenCV • YOLOv8 • Machine Learning",
      description: [
        "Trained a YOLOv8 computer vision model on the Fashionpedia dataset in Google Colab for real-time clothing item identification.",
        "Integrated the model into a functional website.",
        "Currently developing a mobile application version."
      ],
      media: [{ type: 'image', src: "/images/clothing_recognition.png", alt: "AI Clothing Recognition System" }],
      status: "In Development",
    },
    {
      id: "energy",
      title: "Energy Production Prediction Model - NTT Hackathon",
      techStack: "XGBoost • Prophet • Machine Learning",
      description: [
          "Developed a machine learning model to forecast energy production for wind and solar plants.",
          "Employed XGBoost and Prophet algorithms for time-series prediction during the NTT Hackathon."
      ],
      media: [{ type: 'image', src: "/images/energy_prediction.png", alt: "Energy Production Prediction Model" }],
    },
    {
      id: "iconic",
      title: "Be Iconic - Fashion App",
      techStack: "REACT NATIVE • EXPO GO • SUPABASE",
      description: [
          "Designed the UI and UX for a mobile fashion application.",
          "Built the frontend using JavaScript, React Native, and Expo Go.",
          "Developed the backend with TypeScript and Supabase for user authentication and data management."
      ],
      media: [{ type: 'video', src: "/images/beiconic.mp4", alt: "Be Iconic Fashion App" }],
    },
  ];

  const personalImages = [
    { src: "/images/personal/horse_jump.jpg", alt: "Horse Jumping" },
    { src: "/images/personal/scuba.jpg", alt: "Scuba Diving" },
    { src: "/images/personal/surfskate.jpg", alt: "Surfskate" },
    { src: "/images/personal/wing.jpg", alt: "Wing Foiling" },
    { src: "/images/personal/horse2.jpg", alt: "Horseback Riding" },
    { src: "/images/personal/surf.jpg", alt: "Surfing" },
    { src: "/images/personal/piano.JPG", alt: "Playing Piano" },
    { src: "/images/personal/horse.PNG", alt: "Horse" },
    { src: "/images/personal/surf2.jpg", alt: "Surfing" }
  ];

  const nextPersonalImage = () => {
    setCurrentPersonalImage((prev) => (prev === personalImages.length - 1 ? 0 : prev + 1));
  };

  const prevPersonalImage = () => {
    setCurrentPersonalImage((prev) => (prev === 0 ? personalImages.length - 1 : prev - 1));
  };

  // Modal Logic Functions
  const openModal = (project: Project) => {
    setSelectedProject(project);
    setCurrentModalImageIndex(0); // Reset image index
    setIsModalRendered(true); // Ensure modal is rendered
    // Using setTimeout to ensure the DOM updates before adding the visible class
    setTimeout(() => {
      setIsModalOpen(true);
    }, 10);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    // Keep the selectedProject until animation completes
    setTimeout(() => {
      if (!isModalOpen) {
        setSelectedProject(null);
      }
    }, 300); // Match the transition duration
  };

  const nextModalImage = () => {
    if (selectedProject && selectedProject.media.length > 1) {
      setCurrentModalImageIndex((prev) => (prev === selectedProject.media.length - 1 ? 0 : prev + 1));
    }
  };

  const prevModalImage = () => {
    if (selectedProject && selectedProject.media.length > 1) {
      setCurrentModalImageIndex((prev) => (prev === 0 ? selectedProject.media.length - 1 : prev - 1));
    }
  };

  // Effect for background scrolling and modal
  useEffect(() => {
    if (isModalOpen) {
      // Calculate scrollbar width and store it as a CSS variable
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.documentElement.style.setProperty('--scrollbar-width', `${scrollbarWidth}px`);
      
      // Add modal-open class to body
      document.body.classList.add('modal-open');
    } else {
      // Remove modal-open class from body when modal closes
      document.body.classList.remove('modal-open');
    }
    
    // Add logic to prevent body scroll when mobile menu is open
    if (isMobileMenuOpen && isMobile) {
       document.body.style.overflow = 'hidden';
    } else {
       document.body.style.overflow = '';
    }

    // Cleanup function for menu scroll lock
    return () => {
       document.body.style.overflow = '';
    };
  }, [isModalOpen, isMobileMenuOpen, isMobile]); // Add isMobileMenuOpen and isMobile dependencies

  // Track if intro has reached final position
  const [introLocked, setIntroLocked] = useState(false);
  
  // Max scroll for animation effect (adjust as needed)
  const MAX_SCROLL = 300;

  useEffect(() => {
    const handleScroll = () => {
      // Always track scroll and lock intro 
      // if (!isMobile) { // REMOVED condition
        const currentScrollY = window.scrollY;
        setScrollY(currentScrollY);

        // Lock intro in final position once it reaches MAX_SCROLL
        if (!introLocked && currentScrollY >= MAX_SCROLL) {
          setIntroLocked(true);
        }
      // }
    };

    // Check initial screen size
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768); // Example breakpoint for md
    };

    checkScreenSize(); // Initial check
    window.addEventListener('resize', checkScreenSize); // Update on resize
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('resize', checkScreenSize);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [introLocked, MAX_SCROLL, isMobile]); // Add isMobile dependency

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        // When 60% or more of the section is visible, update the active section.
        if (entry.isIntersecting && entry.intersectionRatio >= 0.6) {
          setActiveSection(entry.target.id);
        }
      });
    }, { 
      threshold: 0.6,
      rootMargin: '0px'
    });

    // Observe all sections with an id
    document.querySelectorAll('section[id]').forEach((section) => {
      observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const introElement = introRef.current;
    if (!introElement) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // Show header when intro is NOT intersecting (scrolled past)
        setShowMobileHeader(!entry.isIntersecting);
      },
      { 
        rootMargin: '-100px 0px 0px 0px', // Trigger slightly before it's fully out of view
        threshold: 0 
      }
    );

    observer.observe(introElement);

    return () => observer.disconnect();
  }, []); // Run only once on mount

  // Handle smooth scrolling to sections
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string): void => {
    e.preventDefault();
    const section = document.getElementById(sectionId);
    if (section) {
      // Calculate a target position
      const viewportHeight = window.innerHeight;
      const sectionHeight = section.getBoundingClientRect().height;
      const offset = (viewportHeight - sectionHeight) / 3;
      const targetPosition = section.offsetTop - Math.max(offset, 50);

      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
      
      // Optionally update active section immediately
      setActiveSection(sectionId);
    }
  };

  // Mobile-specific navigation click handler
  const handleMobileNavClick = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string): void => {
    handleNavClick(e, sectionId); // Reuse existing scroll logic
    setIsMobileMenuOpen(false); // Close menu after clicking a link
  };

  // Calculate intro section transform based on scroll position
  const scrollProgress = Math.min(scrollY / MAX_SCROLL, 1);

  // Determine main container alignment and padding based on scroll position and locked state
  const mainContainerStyle = {
    // Revert to original dynamic styles for all screen sizes
    justifyContent: introLocked ? 'flex-start' : (scrollProgress > 0.9 ? 'flex-start' : 'center'), // Lock to flex-start once introLocked
    paddingTop: introLocked ? '10vh' : `${Math.max(10, 30 - scrollProgress * 25)}vh`, // Lock padding-top once introLocked
    transition: 'padding-top 0.5s ease-out, justify-content 0.5s ease-out', // Re-enable transition for all
  };

  // Intro doesn't need transform - container handles positioning
  const introStyle = {
    opacity: 1, // Intro is always visible
    // Revert to original dynamic styles for all screen sizes
    paddingTop: introLocked ? '0' : (scrollProgress < 0.2 ? '1rem' : '0'), // Lock padding-top once introLocked
    transition: 'padding-top 0.5s ease-out', // Re-enable transition for all
  };

  // Calculate content opacity based on scroll progress for fade-in effect, lock once introLocked
  // Revert to original dynamic calculation for all screen sizes
  const contentOpacity = introLocked ? 1 : Math.min(Math.max((scrollProgress - 0.1) / 0.5, 0), 1);

  // Add this function to handle copying to clipboard
  const copyToClipboard = (email: string) => {
    navigator.clipboard.writeText(email)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
      })
      .catch(err => {
        console.error('Failed to copy: ', err);
      });
  };

  // Set up auto-scrolling carousel
  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;
    
    // Start automatic scroll after 1 second
    const timeout = setTimeout(() => {
      setIsCarouselAnimating(true);
    }, 1000);
    
    return () => clearTimeout(timeout);
  }, []);

  // Handlers for custom cursor effect
  const handleMouseMove = (event: React.MouseEvent) => {
    // Only update position if the icon should be shown (and not on mobile)
    if (!isMobile && showPlusIcon) {
      setMousePosition({ x: event.clientX, y: event.clientY });
    }
  };

  const handleMouseEnterProject = (projectId: string, event: React.MouseEvent) => {
    // Only trigger hover effect if not on mobile and eligible
    if (!isMobile && eligibleProjectIds.includes(projectId)) {
      setHoveredProjectId(projectId);
      setShowPlusIcon(true);
      // Set initial position immediately on enter
      setMousePosition({ x: event.clientX, y: event.clientY });
    }
  };

  const handleMouseLeaveProject = () => {
    // Always reset hover state on leave, regardless of mobile status
    setHoveredProjectId(null);
    setShowPlusIcon(false);
  };

  return (
    <div 
      className="min-h-screen p-8 bg-white text-[#1d1d1f] flex flex-col" 
      style={mainContainerStyle}
      // Only track mouse move for the effect if not on mobile
      onMouseMove={!isMobile ? handleMouseMove : undefined}
    >
      {/* Mobile Header - Appears on scroll */}
      <header className={`md:hidden fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-sm shadow-sm p-4 z-50 flex justify-end items-center transition-transform duration-300 ease-in-out ${isMobile && showMobileHeader ? 'translate-y-0' : '-translate-y-full'}`}>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          className="z-50 text-2xl" // Ensure button is clickable above backdrop
        >
          {isMobileMenuOpen ? <IoClose /> : <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}> <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16m-7 6h7" /> </svg>}
        </button>
      </header>

      {/* Mobile Menu Panel - Slides from top, short, right-aligned */}
      <div 
        className={`md:hidden fixed top-16 right-4 w-auto h-auto bg-white rounded-md z-40 px-6 py-4 shadow-md transition-transform duration-300 ease-in-out transform origin-top-right ${isMobileMenuOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0 pointer-events-none'}`}
      >
        <nav>
          {/* Align items to the end (right) */}
          <ul className="flex flex-col items-end space-y-3 text-base font-medium">
             <li>
                <a href="#projects" onClick={(e) => handleMobileNavClick(e, 'projects')} className="block py-1 hover:text-[#D81159]">Projects</a>
              </li>
              <li>
                <a href="#experience" onClick={(e) => handleMobileNavClick(e, 'experience')} className="block py-1 hover:text-[#D81159]">Competitions</a>
              </li>
              <li>
                <a href="#technologies" onClick={(e) => handleMobileNavClick(e, 'technologies')} className="block py-1 hover:text-[#D81159]">Skills</a>
              </li>
              <li>
                <a href="#about" onClick={(e) => handleMobileNavClick(e, 'about')} className="block py-1 hover:text-[#D81159]">About Me</a>
              </li>
          </ul>
        </nav>
      </div>

      {/* Floating Plus Icon - Conditionally render based on state AND !isMobile */}
      {!isMobile && showPlusIcon && hoveredProjectId && (
        <div 
          className={`fixed flex items-center justify-center h-9 px-4 bg-[#D81159] rounded-full pointer-events-none shadow-md gap-2 transition-opacity transition-transform duration-300 ease-out ${showPlusIcon ? 'opacity-100' : 'opacity-0'}`}
          style={{ 
            left: 0, // Set base position
            top: 0,  // Set base position
            // Use transform for smoother movement relative to top-left
            transform: `translate(${mousePosition.x + 12}px, ${mousePosition.y + 12}px)`,
            zIndex: 50, // Ensure it's above other elements
            transitionDuration: '100ms, 300ms', // transform, opacity
            transitionProperty: 'transform, opacity', // Specify properties
            opacity: showPlusIcon ? 1 : 0, // Control opacity directly for transition
          }} 
          onMouseLeave={handleMouseLeaveProject}
        >
          <IoAdd 
            className="text-white text-xl" 
          />
          <span className="text-white text-sm font-medium">View more</span> {/* Increased text size */}
        </div>
      )}
      <div className="max-w-4xl mx-auto w-full relative">
        <div ref={introRef} style={introStyle} className="mb-4">
          <h1 className="clean-heading text-4xl md:text-5xl font-semibold mb-8 text-[#1d1d1f] text-left">
            Hi, I am <span className="gradient-text">Iciar</span>!
          </h1>
          <div className="mb-10">
            {/* Full Description for larger screens */}
            <p className="text-lg md:text-xl leading-relaxed font-light tracking-tight text-left mt-6 hidden md:block">
              Welcome to my portfolio website. I am a Computer Science and Artificial Intelligence student with an insatiable curiosity and a true passion for learning. I have hands-on experience in web and app development as well as machine learning models. I also have some background in the startup industry with several prizes in entrepreneurial competitions. I am especially interested in robotics and exploring the intersection between the virtual and physical world. I am open to new opportunities!
            </p>
            {/* Shorter Description for mobile screens */}
            <p className="text-base md:text-lg leading-relaxed font-light tracking-tight text-left mt-6 block md:hidden">
              I'm a CompSci & AI student passionate about web/app development, ML, and robotics. Experienced in startups and eager for new opportunities.
            </p>
          </div>

          <div className="flex gap-3 md:gap-4 mb-12 justify-start flex-wrap">
            <a
              href="https://github.com/iciaradelino"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 md:px-6 md:py-3 bg-[#D81159] text-white rounded-full text-sm md:text-[15px] font-normal tracking-wide transition-all duration-200 hover:scale-110"
            >
              <FaGithub className="text-sm md:text-lg" />
              GitHub
            </a>
            <a
              href="https://www.linkedin.com/in/ic%C3%ADar-adeli%C3%B1o-219b53331/?trk=opento_sprofile_topcard"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 md:px-6 md:py-3 bg-[#8F2D56] text-white rounded-full text-sm md:text-[15px] font-normal tracking-wide transition-all duration-200 hover:scale-110"
            >
              <FaLinkedin className="text-sm md:text-lg" />
              LinkedIn
            </a>
            <button
              onClick={() => copyToClipboard('iciaradelinoordax@gmail.com')}
              className="group relative flex items-center gap-2 px-4 py-2 md:px-6 md:py-3 bg-[#FFBC42] text-[#1d1d1f] rounded-full text-sm md:text-[15px] font-normal tracking-wide transition-all duration-200 hover:scale-110"
            >
              <HiMail className="text-sm md:text-lg" />
              Email
              <span className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 px-3 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                {copied ? 'Copied!' : 'Copy email to clipboard'}
              </span>
            </button>
            <div className="flex items-center gap-2 px-4 py-2 md:px-6 md:py-3 bg-gray-100 text-[#1d1d1f] rounded-full text-sm md:text-[15px] font-normal tracking-wide">
              <FiMapPin className="text-sm md:text-lg text-[#D81159]" />
              Based in Madrid
            </div>
          </div>
          
          {/* Scroll down indicator - only visible when scrollY is 0 AND intro is not locked - Re-enable for mobile */}
          <div className={`flex flex-col items-center justify-center transition-opacity duration-300 ${(scrollY > 0 || introLocked) ? 'opacity-0' : 'opacity-70'}`}>
            <svg 
              className="w-6 h-6 text-gray-500 animate-bounce" 
              fill="none" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="2" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
            </svg>
          </div>
        </div>

        <div 
          className="flex gap-12 transition-opacity duration-700 ease-out"
          style={{ opacity: contentOpacity }} // Apply calculated opacity directly
        >
          {/* Index Column - Hidden on mobile */}
          <nav className="hidden md:block w-48 flex-shrink-0">
            <ul className="space-y-5 text-sm md:text-base sticky top-[15vh] font-light tracking-wide">
              <li>
                <a 
                  href="#projects" 
                  onClick={(e) => handleNavClick(e, 'projects')}
                  className={`transition-all duration-200 block ${
                    activeSection === 'projects' 
                      ? 'text-[#D81159] font-semibold' 
                      : 'hover:scale-105'
                  }`}
                >
                  Projects
                </a>
              </li>
              <li>
                <a 
                  href="#experience" 
                  onClick={(e) => handleNavClick(e, 'experience')}
                  className={`transition-all duration-200 block ${
                    activeSection === 'experience' 
                      ? 'text-[#D81159] font-semibold' 
                      : 'hover:scale-105'
                  }`}
                >
                  Competitons
                </a>
              </li>
              <li>
                <a 
                  href="#technologies" 
                  onClick={(e) => handleNavClick(e, 'technologies')}
                  className={`transition-all duration-200 block ${
                    activeSection === 'technologies' 
                      ? 'text-[#D81159] font-semibold' 
                      : 'hover:scale-105'
                  }`}
                >
                  Skills
                </a>
              </li>
              <li>
                <a 
                  href="#about" 
                  onClick={(e) => handleNavClick(e, 'about')}
                  className={`transition-all duration-200 block ${
                    activeSection === 'about' 
                      ? 'text-[#D81159] font-semibold' 
                      : 'hover:scale-105'
                  }`}
                >
                  About Me
                </a>
              </li>
            </ul>
          </nav>

          {/* Content Column - Full width on mobile */}
          <div className="flex-1 space-y-12 max-w-2xl w-full">
            <section id="projects" className="scroll-mt-8">
              <h2 className="clean-heading text-2xl md:text-3xl font-semibold mb-8 tracking-tight">Projects</h2>
              <div className="space-y-8">
                {/* Map through projectsData */}
                {projectsData.map((project) => (
                  <div
                    key={project.id}
                    className={`group relative ${ // Use standard cursor for eligible projects
                      eligibleProjectIds.includes(project.id) ? 'cursor-pointer' : ''
                    }`}
                    // Attach event handlers for custom effect
                    onMouseEnter={(e) => handleMouseEnterProject(project.id, e)}
                    onMouseLeave={handleMouseLeaveProject}
                    // Still handle click for modal, but only if not mobile
                    onClick={() => {
                      if (!isMobile && eligibleProjectIds.includes(project.id)) {
                        openModal(project);
                      }
                    }}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg md:text-xl font-medium tracking-tight mb-2 mt-6 flex items-center">
                          {project.title}
                          {project.status && (
                            <span className="ml-3 px-2 py-0.5 text-xs font-medium bg-amber-100 text-amber-700 rounded whitespace-nowrap flex-shrink-0">{project.status}</span>
                          )}
                        </h3>
                        <p className="text-[#8F2D56] mb-3 font-light text-xs md:text-sm tracking-wider uppercase">{project.techStack}</p>
                        {/* Handle description: single string or array */}
                        {Array.isArray(project.description) ? (
                          project.description.map((descPoint, index) => (
                            <p key={index} className="font-light text-sm md:text-base leading-relaxed text-zinc-700"> • {descPoint}</p>
                          ))
                        ) : (
                          <p className="font-light text-sm md:text-base leading-relaxed text-zinc-700">{project.description}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section id="experience" className="scroll-mt-8">
              <h2 className="clean-heading text-2xl md:text-3xl font-semibold mb-16">Competitions and awards</h2>
              {/* Timeline Container with thicker dotted line */}
              <div className="relative border-l-4 border-dotted border-gray-300 dark:border-gray-600 ml-4">
                {/* Timeline Item 1: Google Dev Group RL */}
                <div className="mt-6 mb-8 ml-6">
                  <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between mb-1">
                    <h3 className="text-base md:text-lg font-medium text-gray-900 dark:text-white">Google Developers Group RL Hackathon</h3>
                    <p className="text-sm md:text-base font-normal text-[#8F2D56] dark:text-pink-300 sm:ml-4">April 2025</p>
                  </div>
                  <p className="text-sm md:text-base font-light text-zinc-600 dark:text-zinc-400">First Place</p>
                </div>

                {/* Timeline Item 2: IE HackEd */}
                <div className="mb-8 ml-6">
                  <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between mb-1">
                    <h3 className="text-base md:text-lg font-medium text-gray-900 dark:text-white">IE HackEd Hackathon - DivergED</h3>
                    <p className="text-sm md:text-base font-normal text-[#8F2D56] dark:text-pink-300 sm:ml-4">March 2025</p>
                  </div>
                  <p className="text-sm md:text-base font-light text-zinc-600 dark:text-zinc-400">First place award from 20 teams</p>
                </div>

                {/* Timeline Item 3: Tech Venture Bootcamp - Mappy */}
                <div className="mb-8 ml-6">
                  <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between mb-1">
                    <h3 className="text-base md:text-lg font-medium text-gray-900 dark:text-white">2025 Tech Venture Bootcamp - Mappy</h3>
                    <p className="text-sm md:text-base font-normal text-[#8F2D56] dark:text-pink-300 sm:ml-4">March 2025</p>
                  </div>
                  <p className="text-sm md:text-base font-light text-zinc-600 dark:text-zinc-400">Top 5 from 20 competing teams</p>
                </div>

                {/* Timeline Item 4: NTT Hackathon */}
                <div className="mb-8 ml-6">
                  <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between mb-1">
                    <h3 className="text-base md:text-lg font-medium text-gray-900 dark:text-white">NTT Hackathon</h3>
                    <p className="text-sm md:text-base font-normal text-[#8F2D56] dark:text-pink-300 sm:ml-4">February 2025</p>
                  </div>
                  <p className="text-sm md:text-base font-light text-zinc-600 dark:text-zinc-400">Seventh place</p>
                </div>

                {/* Timeline Item 5: Tech Venture Bootcamp - Carlink */}
                <div className="ml-6"> {/* No mb on the last item */}
                  <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between mb-1">
                    <h3 className="text-base md:text-lg font-medium text-gray-900 dark:text-white">2024 Tech Venture Bootcamp - Carlink</h3>
                    <p className="text-sm md:text-base font-normal text-[#8F2D56] dark:text-pink-300 sm:ml-4">October 2024</p>
                  </div>
                  <p className="text-sm md:text-base font-light text-zinc-600 dark:text-zinc-400">3rd place award</p>
                </div>
              </div>
            </section>

            <section id="technologies" className="scroll-mt-8">
              <h2 className="clean-heading text-2xl md:text-3xl font-semibold mb-8">Skills and technologies</h2>
              
              <div className="space-y-6">
                {/* Web Development Category */}
                <div>
                  <h3 className="text-base md:text-lg font-medium mb-3 mt-6">Web Development</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-2 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
                      <h3 className="text-sm md:text-base font-medium text-[#8F2D56]">React </h3>
                    </div>
                    <div className="p-2 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
                      <h3 className="text-sm md:text-base font-medium text-[#8F2D56]"> Next.js </h3>
                    </div>
                    <div className="p-2 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
                      <h3 className="text-sm md:text-base font-medium text-[#8F2D56]"> Node.js </h3>
                    </div>
                    <div className="p-2 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
                      <h3 className="text-sm md:text-base font-medium text-[#8F2D56]">API integrations</h3>
                    </div>
                  </div>
                </div>

                {/* App deevelopment Category */}
                <div>
                  <h3 className="text-base md:text-lg font-medium mb-3">App Development</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-2 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
                      <h3 className="text-sm md:text-base font-medium text-[#8F2D56]">React Native</h3>
                    </div>
                    <div className="p-2 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
                      <h3 className="text-sm md:text-base font-medium text-[#8F2D56]">Expo Go</h3>
                    </div>
                    <div className="p-2 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
                      <h3 className="text-sm md:text-base font-medium text-[#8F2D56]">Supabase</h3>
                    </div>
                    <div className="p-2 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
                      <h3 className="text-sm md:text-base font-medium text-[#8F2D56]"> MongoDB </h3>
                    </div>
                  </div>
                </div>
                
                {/* AI & Machine Learning Category */}
                <div>
                  <h3 className="text-base md:text-lg font-medium mb-3">Machine Learning</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-2 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
                      <h3 className="text-sm md:text-base font-medium text-[#8F2D56]">Computer Vision</h3>
                    </div>
                    <div className="p-2 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
                      <h3 className="text-sm md:text-base font-medium text-[#8F2D56]">YOLOv8</h3>
                    </div>
                    <div className="p-2 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
                      <h3 className="text-sm md:text-base font-medium text-[#8F2D56]">XGBoost </h3>
                    </div>
                    <div className="p-2 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
                      <h3 className="text-sm md:text-base font-medium text-[#8F2D56]">Prophet</h3>
                    </div>
                  </div>
                </div>
                
                {/* Programming languages Category */}
                <div>
                  <h3 className="text-base md:text-lg font-medium mb-3">Programming languages</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-2 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
                      <h3 className="text-sm md:text-base font-medium text-[#8F2D56]">Python</h3>
                    </div>
                    <div className="p-2 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
                      <h3 className="text-sm md:text-base font-medium text-[#8F2D56]">Javascript</h3>
                    </div>
                    <div className="p-2 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
                      <h3 className="text-sm md:text-base font-medium text-[#8F2D56]">Typescript</h3>
                    </div>
                    <div className="p-2 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
                      <h3 className="text-sm md:text-base font-medium text-[#8F2D56]"> C </h3>
                    </div>
                  </div>
                </div>
                
              </div>
            </section>

            <section id="about" className="scroll-mt-8 mb-16">
              <h2 className="clean-heading text-2xl md:text-3xl font-semibold mb-10">About Me</h2>
              <p className="text-base md:text-lg font-light leading-relaxed mb-10 mt-6">
                I'm a very curious and active person, always looking to get out of my comfort zone, try new things and meet new people. 
                Besides from coding and academics, I love doing adrenaline-rushing sports. Currently I really enjoy climbing, padel and horserding. 
              </p>
              
              <div className="mt-6 w-full overflow-hidden relative mb-10">
                <div 
                  ref={carouselRef}
                  className={`flex gap-2 md:gap-4 py-4 ${isCarouselAnimating ? 'animate-carousel' : ''}`}
                  style={{
                    width: 'fit-content',
                  }}
                >
                  {[...personalImages, ...personalImages].map((image, index) => (
                    <div 
                      key={index} 
                      className="relative flex-shrink-0 rounded-lg overflow-hidden shadow-md hover:scale-105 transition-transform duration-300"
                      style={{ 
                        width: '200px',
                        height: '150px',
                        background: 'white'
                      }}
                    >
                      <Image
                        src={image.src}
                        alt={image.alt}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </section>

          </div>
        </div>
      </div>

      {/* Modal Component - Always rendered but conditionally visible */}
      <div 
        className={`modal-backdrop ${isModalOpen ? 'modal-backdrop-visible' : 'modal-backdrop-hidden'}`}
        onClick={closeModal}
        role="dialog"
        aria-modal={isModalOpen ? "true" : "false"}
        aria-labelledby="project-modal-title"
        style={{ display: isModalRendered ? 'flex' : 'none' }} // Only render if it has been opened at least once
      >
        <div 
          className={`modal-content ${isModalOpen ? 'modal-content-visible' : 'modal-content-hidden'} font-inter`}
          onClick={(e) => e.stopPropagation()}
        >
          {selectedProject && (
            <>
              {/* Close Button */}
              <button
                onClick={closeModal}
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 transition-colors p-2 rounded-full bg-gray-100 hover:bg-gray-200"
                aria-label="Close project details"
              >
                <IoClose className="w-5 h-5" />
              </button>

              {/* Modal Content */}
              <h3 
                id="project-modal-title" 
                className="clean-heading text-xl md:text-2xl font-semibold mb-6 text-[#1d1d1f]"
              >
                {selectedProject.title}
              </h3>
              <p className="text-[#8F2D56] mt-2 mb-4 font-light text-xs md:text-sm tracking-wider uppercase font-inter">{selectedProject.techStack}</p>

              {/* Description */}
              <div className="mb-6 prose prose-zinc max-w-none prose-p:my-1 prose-ul:my-1 font-inter">
                {Array.isArray(selectedProject.description) ? (
                  <ul className="list-disc pl-5 space-y-1 font-light text-sm md:text-base">
                    {selectedProject.description.map((descPoint, index) => (
                      <li key={index}>{descPoint}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="font-light text-sm md:text-base leading-relaxed">{selectedProject.description}</p>
                )}
              </div>

              {/* Image/Video Carousel */}
              {selectedProject.media.length > 0 && (
                <div className="relative mt-auto">
                  {selectedProject.media.length > 1 ? (
                    // Carousel for multiple media items
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={prevModalImage}
                        className="flex-shrink-0 p-2 text-[#8F2D56] hover:bg-gray-100 rounded-full transition-all duration-200 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label="Previous image"
                      >
                        <IoIosArrowBack className="text-xl" />
                      </button>
                      
                      <div className="relative flex-grow overflow-hidden rounded-lg bg-gray-100 aspect-[16/9]">
                        {selectedProject.media[currentModalImageIndex].type === 'video' ? (
                          // Render video
                          <video
                            key={selectedProject.media[currentModalImageIndex].src}
                            src={selectedProject.media[currentModalImageIndex].src}
                            controls
                            autoPlay
                            loop
                            muted
                            playsInline
                            className="w-full h-full object-contain"
                          />
                        ) : (
                          // Render image
                          <Image
                            key={selectedProject.media[currentModalImageIndex].src}
                            src={selectedProject.media[currentModalImageIndex].src}
                            alt={selectedProject.media[currentModalImageIndex].alt}
                            fill
                            className="object-contain transition-opacity duration-300"
                            quality={90}
                          />
                        )}
                      </div>
                      
                      <button 
                        onClick={nextModalImage}
                        className="flex-shrink-0 p-2 text-[#8F2D56] hover:bg-gray-100 rounded-full transition-all duration-200 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label="Next image"
                      >
                        <IoIosArrowForward className="text-xl" />
                      </button>
                    </div>
                  ) : (
                    // Single Media Display
                    <div className="overflow-hidden rounded-lg bg-gray-100 aspect-[16/9]">
                      {selectedProject.media[0].type === 'video' ? (
                        // Render video
                        <video
                          src={selectedProject.media[0].src}
                          controls
                          autoPlay
                          loop
                          muted
                          playsInline
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        // Render image
                        <Image
                          src={selectedProject.media[0].src}
                          alt={selectedProject.media[0].alt}
                          fill
                          className="object-contain"
                          quality={90}
                        />
                      )}
                    </div>
                  )}

                  {/* Dots for multiple media items */}
                  {selectedProject.media.length > 1 && (
                    <div className="flex justify-center space-x-2 mt-3">
                      {selectedProject.media.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentModalImageIndex(index)}
                          className={`w-2 h-2 rounded-full transition-colors ${
                            currentModalImageIndex === index ? 'bg-[#8F2D56]' : 'bg-gray-300 hover:bg-gray-400'
                          }`}
                          aria-label={`View item ${index + 1}`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

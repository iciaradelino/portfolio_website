"use client";

import { useEffect, useState, useRef, type CSSProperties } from 'react';
import Image from "next/image";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { HiMail } from "react-icons/hi";
import { IoChevronDown, IoClose } from "react-icons/io5";
import { FiExternalLink, FiMapPin } from "react-icons/fi";

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
  link?: string; // optional external site
}

// Define a type for experience data
interface Experience {
  id: string;
  company: string;
  role: string;
  website?: string;
  link?: string; // optional external site (e.g. live demo)
  date: string;
  description: string | string[];
}

interface Competition {
  id: string;
  place: string;
  title: string;
  description: string;
  date: string;
}

export default function Home() {
  const [activeSection, setActiveSection] = useState('experience');
  const [currentPersonalImage, setCurrentPersonalImage] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  const introRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);
  const [isCarouselAnimating, setIsCarouselAnimating] = useState(false);
  const [expandedProjectId, setExpandedProjectId] = useState<string | null>(null);

  // Add state for screen size detection
  const [isMobile, setIsMobile] = useState(false);

  // Add state for mobile menu toggle
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Add state for conditional mobile header visibility
  const [showMobileHeader, setShowMobileHeader] = useState(false);

  // State for intro animation
  const [startIntroAnimation, setStartIntroAnimation] = useState(false);

  const navItems = [
    { id: 'experience', label: 'Experience' },
    { id: 'projects', label: 'Projects' },
    { id: 'competitions', label: 'Competitions' },
    { id: 'technologies', label: 'Skills' },
    { id: 'about', label: 'About Me' },
  ] as const;

  const navListRef = useRef<HTMLUListElement>(null);
  const navItemRefs = useRef<Record<string, HTMLLIElement | null>>({});
  const [navIndicator, setNavIndicator] = useState({ top: 0, height: 0, opacity: 0 });

  // helper function to render text with clickable links
  const renderTextWithLinks = (text: string) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = text.split(urlRegex);
    
    return parts.map((part, index) => {
      if (part.match(urlRegex)) {
        return (
          <a
            key={index}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#8F2D56] hover:text-[#D81159] underline transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            {part}
          </a>
        );
      }
      return part;
    });
  };

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
      media: [
        { type: 'image', src: "/images/projects/climbr/climbr-1.png", alt: "Climbr login screen" },
        { type: 'image', src: "/images/projects/climbr/climbr-2.png", alt: "Climbr app screen" },
        { type: 'image', src: "/images/projects/climbr/climbr-3.png", alt: "Climbr app screen" },
        { type: 'image', src: "/images/projects/climbr/climbr-4.png", alt: "Climbr app screen" },
        { type: 'image', src: "/images/projects/climbr/climbr-5.png", alt: "Climbr app screen" },
        { type: 'image', src: "/images/projects/climbr/climbr-6.png", alt: "Climbr app screen" },
        { type: 'image', src: "/images/projects/climbr/climbr-7.png", alt: "Climbr app screen" },
      ],
    },
    {
      id: "population",
      title: "Population Calculator - Travel Time Demographics",
      techStack: "Next.js • Python FastAPI • PostgreSQL • PostGIS",
      link: "https://population-calculator-roan.vercel.app/",
      description: [
        "Built a web application that calculates population within travel time isochrones for any location in Europe.",
        "Interactive map interface with support for walking, cycling, and driving modes with adjustable travel times (5-60 minutes).",
        "Integrated Eurostat census data (2021) with OpenRouteService API for real-time isochrone generation and spatial analysis.",
      ],
      media: [{ type: 'image', src: "/images/population_calculator.png", alt: "Population Calculator Application" }],
    },
    {
      id: "mappy",
      title: "Mappy - Travel Planning Platform",
      techStack: "React • Next.js • TypeScript • Supabase",
      description: [ 
        "Designed and implemented the UI/UX for a travel planning web application using React and JavaScript.",
        "Developed the backend infrastructure utilizing TypeScript, Supabase, and integrated Amadeus and OpenAI APIs for enhanced functionality."
      ],
      media: [{ type: 'image', src: "/images/mappy_image.png", alt: "Mappy Travel Planning Platform" }],
    },
    {
      id: "robopreneur",
      title: "Robopreneur - Human & Robot Simulation",
      techStack: "Python • Mesa • Solara",
      description: [
        "Built an agent-based simulation to study human–robot interaction with cryptocurrency-based task rewards.",
        "Mesa powers the simulation backend; a Solara web interface exposes live controls, wealth trends, battery levels, inequality metrics, and time allocation charts."
      ],
      media: [
        { type: 'image', src: "/images/projects/simulator/simulator.png", alt: "Robopreneur human and robot simulation dashboard" },
      ],
    },
    {
      id: "film-revenue",
      title: "Film Revenue Prediction - Multimodal ML Pipeline",
      techStack: "Python • Gradient Boosting • Embeddings • Feature Engineering",
      description: [
        "Built a multimodal pipeline to predict film revenue by combining poster embeddings, synopsis embeddings, and structured metadata to train gradient boosting models.",
        "The largest performance gains came from richer feature engineering, not from model selection."
      ],
      media: [],
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
      media: [],
    }
  ];

  // Experience Data
  const experienceData: Experience[] = [
    {
      id: 'ie-cyphy',
      company: 'IE CyPhy Life',
      role: 'Research Assistant',
      website: 'https://cyphy.life/',
      date: 'Sep 2025 – Present',
      description: [
        'Working on simulation models to evaluate the scalability and efficiency of a human-robot interaction system with cryptocurrency-based task rewards.',
      ],
    },
    {
      id: 'innovis',
      company: 'Innovis VC',
      role: 'Head of Ventures',
      website: 'https://www.innovis.vc/',
      date: 'January 2026 – Present',
      description: [
        'Leading the quality assurance and strategic direction of startup sourcing activities: ensuring alignment with investment criteria, assessing sourced opportunities, providing pitch feedback, and advancing high-potential opportunities for partner VC firms.',
      ],
    },
    {
      id: 'vulpix',
      company: 'Vulpix AI',
      role: 'Software Engineering Intern',
      website: 'https://new.vulpix-ai.com/',
      date: 'June – July 2026',
      description: [
        'Developed and trained a Convolutional Neural Network (CNN) to analyze ECG data into 5 distinct diagnostic categories.',
        'Redesigned the company website (full-stack) using Next.js and integrated forms with Resend.',
      ],
    },
    {
      id: 'huuh',
      company: 'huuh.me',
      role: 'Software Engineering Intern',
      date: 'June – July 2025',
      description: [
        'Helped implement multimodal RAG capabilities and image processing pipelines across both backend and frontend, as well as other feature implementations.',
      ],
    },
    {
      id: 'rentee',
      company: 'Rentee',
      role: 'Software Engineering Intern',
      website: 'https://www.rentee.es/',
      link: 'https://rentee-managersuite-demo-frontend.vercel.app/analytics',
      date: 'June – July 2025',
      description: [
        'Built the company\'s second platform from scratch, Rentee Manager Suite, to help property managers organize and analyze their clients\' financial data. Responsible for the backend architecture, database design, and frontend user experience.',
      ],
    },
    {
      id: 'frontier',
      company: 'Frontier Diagnostics',
      role: 'Frontend App Developer',
      website: 'https://frontierdiagnostics.net/',
      date: 'June 2025',
      description: [
        'Developed a mobile application for Frontier Diagnostics, a breast cancer diagnostics company specializing in personalized treatments. The app keeps patients informed with key updates like appointments and signing documents, and offers an anonymous social space for support and connection during treatment.',
      ],
    },
    {
      id: 'freelance',
      company: 'Freelance',
      role: 'Freelance Web Developer',
      website: '#',
      date: 'March 2025 – Present',
      description: [
        'Offering freelance web design and development services for clients seeking high-end, custom websites. I specialize in React and Next.js to build visually compelling, high-converting websites.',
      ],
    },
  ];

  const competitionsData: Competition[] = [
    {
      id: 'gdg-rl',
      place: '1st',
      title: 'Google Developers Group RL Hackathon',
      description: 'Built RL agent to play top-down shooter game',
      date: 'April 2025',
    },
    {
      id: 'ie-venture-lab',
      place: 'Top 12 of 145',
      title: 'IE Venture Lab',
      description: 'IE University startup accelerator for student ventures',
      date: 'March 2026',
    },
    {
      id: 'hacked',
      place: '1st',
      title: 'IE HackEd Hackathon',
      description: 'Built a learning platform for ADHD students',
      date: 'March 2025',
    },
    {
      id: 'tv-mappy',
      place: 'Top 5 of 20',
      title: '2025 Tech Venture Bootcamp',
      description: 'Startup intensive: built Mappy, a travel planning platform',
      date: 'March 2025',
    },
    {
      id: 'ntt',
      place: '7th',
      title: 'NTT Hackathon',
      description: 'ML model for wind and solar energy production prediction',
      date: 'February 2025',
    },
    {
      id: 'tv-carlink',
      place: '3rd',
      title: '2024 Tech Venture Bootcamp',
      description: 'Startup intensive: built Carlink, carsharing platform',
      date: 'October 2024',
    },
    {
      id: 'top1',
      place: 'Top 1',
    title: 'Class ranking',
      description: 'Out of 81 CS & AI students',
      date: 'First and second year',
    },
  ];

  // skills derived from projects + experience on this site
  const skillsData: { title: string; items: string[] }[] = [
    {
      title: 'Languages',
      items: ['Python', 'C', 'TypeScript', 'Solidity'],
    },
    {
      title: 'Web & App Development',
      items: ['React', 'Next.js', 'React Native', 'Expo Go'],
    },
    {
      title: 'Backend & Databases',
      items: ['Flask', 'FastAPI', 'Supabase', 'MongoDB', 'PostgreSQL', 'PostGIS'],
    },
    {
      title: 'Machine Learning & AI',
      items: [
        'Computer Vision',
        'OpenCV',
        'Gradient Boosting',
        'Embeddings',
        'Multimodal RAG',
        'Reinforcement Learning',
      ],
    },
    {
      title: 'Tools',
      items: ['Git', 'Docker', 'Azure Cloud', 'Vercel', ],
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

  // freelance landing page previews
  const freelanceSites = [
    { src: "/images/web/vulpix.png", alt: "Vulpix AI landing page", label: "Vulpix AI", href: "https://new.vulpix-ai.com/" },
    { src: "/images/web/governance.png", alt: "The Governance Post landing page", label: "Governance Post", href: "https://the-governance-post.vercel.app/" },
    { src: "/images/web/arte.png", alt: "Arte en Papel landing page", label: "Arte en Papel", href: "https://arteenpapel.vercel.app/" },
  ];

  const nextPersonalImage = () => {
    setCurrentPersonalImage((prev) => (prev === personalImages.length - 1 ? 0 : prev + 1));
  };

  const prevPersonalImage = () => {
    setCurrentPersonalImage((prev) => (prev === 0 ? personalImages.length - 1 : prev - 1));
  };

  const toggleProject = (projectId: string) => {
    setExpandedProjectId((prev) => (prev === projectId ? null : projectId));
  };

  // prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen && isMobile) {
       document.body.style.overflow = 'hidden';
    } else {
       document.body.style.overflow = '';
    }

    return () => {
       document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen, isMobile]);

  // Track if intro has reached final position
  const [introLocked, setIntroLocked] = useState(false);
  
  // Max scroll for animation effect (adjust as needed)
  const MAX_SCROLL = isMobile ? 300 : 240;

  // reset scroll on load so the intro is centered after refresh
  useEffect(() => {
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }

    const resetScroll = () => {
      window.scrollTo(0, 0);
      setScrollY(0);
      setIntroLocked(false);
    };

    resetScroll();
    // catch late browser scroll restoration
    window.addEventListener("load", resetScroll);
    return () => window.removeEventListener("load", resetScroll);
  }, []);

  // Effect to trigger intro animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setStartIntroAnimation(true);
    }, 100); // Short delay to ensure initial state is rendered before animation starts
    return () => clearTimeout(timer);
  }, []);

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
    const sectionIds = navItems.map((item) => item.id);

    const updateActiveSection = () => {
      const lastId = sectionIds[sectionIds.length - 1];
      const scrollBottom = window.scrollY + window.innerHeight;
      const pageHeight = document.documentElement.scrollHeight;

      // small bottom sections never reach the marker — force last nav item near page end
      if (scrollBottom >= pageHeight - 80) {
        setActiveSection(lastId);
        return;
      }

      const marker = window.innerHeight * 0.3;
      let current = sectionIds[0]; // default to experience

      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (!el) continue;
        if (el.getBoundingClientRect().top <= marker) {
          current = id;
        }
      }

      setActiveSection(current);
    };

    const observer = new IntersectionObserver(updateActiveSection, {
      threshold: [0, 0.1, 0.25, 0.5, 0.75, 1],
      rootMargin: '0px',
    });

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    window.addEventListener('scroll', updateActiveSection, { passive: true });
    updateActiveSection();

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', updateActiveSection);
    };
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
        rootMargin: isMobile ? '-100px 0px 0px 0px' : '-80px 0px 0px 0px', // Trigger slightly before it's fully out of view
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
      const targetPosition = section.offsetTop - Math.max(offset, isMobile ? 50 : 40);

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
  const contentReady = contentOpacity > 0.4;

  // update sliding nav indicator to match the active section
  useEffect(() => {
    const updateIndicator = () => {
      const activeItem = navItemRefs.current[activeSection];
      if (!activeItem) {
        setNavIndicator((prev) => ({ ...prev, opacity: 0 }));
        return;
      }
      setNavIndicator({
        top: activeItem.offsetTop,
        height: activeItem.offsetHeight,
        opacity: 1,
      });
    };

    updateIndicator();
    window.addEventListener('resize', updateIndicator);
    return () => window.removeEventListener('resize', updateIndicator);
  }, [activeSection]);

  // reveal sections once the main content is visible enough to notice motion
  useEffect(() => {
    if (!contentReady) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const elements = document.querySelectorAll<HTMLElement>('[data-reveal]');

    if (prefersReducedMotion) {
      elements.forEach((el) => el.classList.add('is-visible'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -6% 0px' }
    );

    elements.forEach((el) => {
      if (!el.classList.contains('is-visible')) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [contentReady]);

  // Add this function to handle copying to clipboard
  const copyToClipboard = (email: string) => {
    navigator.clipboard.writeText(email)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), isMobile ? 2000 : 1600); // Reset after 2 seconds
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
    }, isMobile ? 1000 : 800);
    
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div 
      className="min-h-screen p-8 bg-white text-[#1d1d1f] flex flex-col" 
      style={mainContainerStyle}
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
                <a href="#experience" onClick={(e) => handleMobileNavClick(e, 'experience')} className="block py-1 hover:text-[#D81159]">Experience</a>
              </li>
              <li>
                <a href="#projects" onClick={(e) => handleMobileNavClick(e, 'projects')} className="block py-1 hover:text-[#D81159]">Projects</a>
              </li>
              <li>
                <a href="#competitions" onClick={(e) => handleMobileNavClick(e, 'competitions')} className="block py-1 hover:text-[#D81159]">Competitions</a>
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

      <div className="max-w-4xl mx-auto w-full relative">
        <div ref={introRef} style={introStyle} className="mb-4">
          <h1 className={`clean-heading text-4xl md:text-5xl font-semibold mb-8 text-[#1d1d1f] text-left transform transition-all ease-out duration-700 delay-100 ${startIntroAnimation ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            Hi, I am <span className="gradient-text">Iciar</span>!
          </h1>
          <div className={`mb-8 transform transition-all ease-out duration-700 delay-200 ${startIntroAnimation ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            {/* Full Description for larger screens */}
            <p className="text-lg md:text-xl leading-relaxed font-light tracking-tight text-justify hidden md:block">
              Welcome to my portfolio website. I am a Computer Science and Artificial Intelligence student with an insatiable curiosity and a true passion for learning. I have hands-on experience in web and app development as well as machine learning models. I also have some background in the startup industry with several prizes in entrepreneurial competitions. I am especially interested in robotics and exploring the intersection between the virtual and physical world. I am open to new opportunities!
            </p>
            {/* Shorter Description for mobile screens */}
            <p className="text-base md:text-lg leading-relaxed font-light tracking-tight text-justify block md:hidden">
              I'm a CompSci & AI student passionate about web/app development, ML, and robotics. Experienced in startups and eager for new opportunities.
            </p>
          </div>

          <div className={`flex gap-3 md:gap-4 mb-8 justify-start flex-wrap transform transition-all ease-out duration-700 delay-300 ${startIntroAnimation ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <a
              href="https://github.com/iciaradelino"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 md:px-6 md:py-3 bg-[#D81159] text-white rounded-full text-sm md:text-[12px] font-normal tracking-wide transition-all duration-200 hover:scale-110"
            >
              <FaGithub className="text-sm md:text-lg" />
              GitHub
            </a>
            <a
              href="https://www.linkedin.com/in/ic%C3%ADar-adeli%C3%B1o-219b53331/?trk=opento_sprofile_topcard"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 md:px-6 md:py-3 bg-[#8F2D56] text-white rounded-full text-sm md:text-[12px] font-normal tracking-wide transition-all duration-200 hover:scale-110"
            >
              <FaLinkedin className="text-sm md:text-lg" />
              LinkedIn
            </a>
            <button
              onClick={() => copyToClipboard('iciaradelinoordax@gmail.com')}
              className="group relative flex items-center gap-2 px-4 py-2 md:px-6 md:py-3 bg-[#FFBC42] text-[#1d1d1f] rounded-full text-sm md:text-[12px] font-normal tracking-wide transition-all duration-200 hover:scale-110"
            >
              <HiMail className="text-sm md:text-lg" />
              Email
              <span className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 px-3 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                {copied ? 'Copied!' : 'Copy email to clipboard'}
              </span>
            </button>
            <div className="flex items-center gap-2 px-4 py-2 md:px-6 md:py-3 bg-gray-100 text-[#1d1d1f] rounded-full text-sm md:text-[12px] font-normal tracking-wide">
              <FiMapPin className="text-sm md:text-lg text-[#D81159]" />
              Based in Madrid
            </div>
          </div>
          
          {/* Scroll down indicator - only visible when scrollY is 0 AND intro is not locked - Re-enable for mobile */}
          <div className={`flex flex-col items-center justify-center transform transition-all ease-out duration-700 delay-400 ${startIntroAnimation ? `translate-y-0 ${(scrollY > 0 || introLocked) ? 'opacity-0' : 'opacity-70'}` : 'opacity-0 translate-y-10'}`}>
            <svg 
              className="w-6 h-6 text-gray-500 animate-bounce" 
              fill="none" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={isMobile ? "2" : "1.6"}
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
            <ul ref={navListRef} className="relative flex flex-col gap-6 text-sm md:text-base sticky top-[15vh] font-light tracking-wide pl-3">
              <span
                aria-hidden="true"
                className="pointer-events-none absolute left-0 w-[2px] rounded-full bg-[#D81159] transition-[top,height,opacity] duration-300 ease-out"
                style={{
                  top: navIndicator.top,
                  height: navIndicator.height,
                  opacity: navIndicator.opacity,
                }}
              />
              {navItems.map((item) => (
                <li
                  key={item.id}
                  ref={(el) => {
                    navItemRefs.current[item.id] = el;
                  }}
                >
                  <a
                    href={`#${item.id}`}
                    onClick={(e) => handleNavClick(e, item.id)}
                    className={`transition-all duration-200 block ${
                      activeSection === item.id
                        ? 'text-[#D81159] font-semibold'
                        : 'hover:scale-105'
                    }`}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Content Column - Full width on mobile */}
          <div className="flex-1 space-y-16 max-w-2xl w-full">
            {/* Experience Section */}
            <section id="experience" className="scroll-mt-8 reveal" data-reveal>
              <h2 className="clean-heading text-2xl md:text-3xl font-semibold mb-8 tracking-tight">Experience</h2>
              <div className="space-y-8">
                {experienceData.map((exp, index) => (
                  <div
                    key={exp.id}
                    className="group relative reveal-child"
                    style={{ '--reveal-index': index } as CSSProperties}
                  >
                    <div className="flex flex-col md:flex-row md:justify-between md:items-baseline mb-2">
                      <h3 className="text-lg md:text-xl font-medium tracking-tight mb-2 flex items-center gap-2">
                        {exp.id === 'freelance' ? (
                          exp.role
                        ) : (
                          <>
                            {exp.role} @&nbsp;
                            {exp.website ? (
                              <a href={exp.website} target="_blank" rel="noopener noreferrer" className="text-[#8F2D56] hover:text-[#D81159] underline transition-colors">{exp.company}</a>
                            ) : (
                              <span className="text-[#8F2D56]">{exp.company}</span>
                            )}
                          </>
                        )}
                        {exp.link && (
                          <a
                            href={exp.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`Visit ${exp.company} link`}
                            className="text-[#8F2D56] hover:text-[#D81159] transition-colors shrink-0"
                          >
                            <FiExternalLink className="w-4 h-4 md:w-[1.1rem] md:h-[1.1rem]" />
                          </a>
                        )}
                      </h3>
                      <p className="text-sm md:text-base font-normal text-[#8F2D56] md:ml-4 mt-2 md:mt-0">{exp.date}</p>
                    </div>
                    <div className="mb-2">
                      <p className="font-light text-sm md:text-base leading-relaxed text-zinc-700 text-justify">
                        {Array.isArray(exp.description) ? (
                          <>
                            {exp.description.map((desc, idx) => (
                              <span key={idx}>
                                {exp.id === 'freelance' ? (
                                  <>
                                    {desc}
                                    {idx === exp.description.length - 1 && (
                                      <> Recent projects include:</>
                                    )}
                                  </>
                                ) : (
                                  desc
                                )}
                                {idx < exp.description.length - 1 && ' '}
                              </span>
                            ))}
                          </>
                        ) : (
                          exp.description
                        )}
                      </p>
                      {exp.id === 'freelance' && (
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
                          {freelanceSites.map((site) => (
                            <a
                              key={site.href}
                              href={site.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="group/site block"
                            >
                              <div className="relative aspect-[16/10] overflow-hidden">
                                <Image
                                  src={site.src}
                                  alt={site.alt}
                                  fill
                                  sizes="(max-width: 640px) 100vw, 200px"
                                  className="object-cover object-top transition-opacity duration-300 group-hover/site:opacity-80"
                                />
                              </div>
                              <span className="mt-2 block text-xs font-light tracking-wider uppercase text-zinc-500 transition-colors group-hover/site:text-[#8F2D56]">
                                {site.label}
                              </span>
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section id="projects" className="scroll-mt-8 reveal" data-reveal>
              <h2 className="clean-heading text-2xl md:text-3xl font-semibold mb-8 tracking-tight">Projects</h2>
              <div className="space-y-10">
                {projectsData.map((project, index) => {
                  const isExpanded = expandedProjectId === project.id;
                  const preview = project.media[0];
                  const hasMultipleImages = project.media.length > 1 && project.media.every((m) => m.type === 'image');

                  return (
                    <div
                      key={project.id}
                      className="reveal-child"
                      style={{ '--reveal-index': index } as CSSProperties}
                    >
                      {hasMultipleImages ? (
                        <div
                          role="button"
                          tabIndex={0}
                          onClick={() => toggleProject(project.id)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              toggleProject(project.id);
                            }
                          }}
                          aria-expanded={isExpanded}
                          aria-label={`${isExpanded ? 'Collapse' : 'Expand'} ${project.title}`}
                          className="w-full mb-4 cursor-pointer group"
                        >
                          <div className="overflow-hidden">
                            <div
                              className="flex gap-3 overflow-x-auto pb-4 -mb-4 hide-scrollbar [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
                              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                            >
                              {project.media.map((item) => (
                                <div
                                  key={item.src}
                                  className="relative flex-shrink-0 w-[120px] sm:w-[140px] aspect-[9/19] overflow-hidden bg-zinc-100"
                                >
                                  <Image
                                    src={item.src}
                                    alt={item.alt}
                                    fill
                                    sizes="140px"
                                    className="object-cover object-top transition-opacity duration-300 group-hover:opacity-90"
                                  />
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      ) : preview ? (
                        <button
                          type="button"
                          onClick={() => toggleProject(project.id)}
                          aria-expanded={isExpanded}
                          aria-label={`${isExpanded ? 'Collapse' : 'Expand'} ${project.title}`}
                          className="relative w-full aspect-[16/9] mb-4 overflow-hidden bg-zinc-100 cursor-pointer group block"
                        >
                          {preview.type === 'video' ? (
                            <video
                              src={preview.src}
                              muted
                              loop
                              autoPlay
                              playsInline
                              preload="metadata"
                              className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                            />
                          ) : (
                            <Image
                              src={preview.src}
                              alt={preview.alt}
                              fill
                              sizes="(max-width: 768px) 100vw, 800px"
                              className="object-cover object-top transition-opacity duration-300 group-hover:opacity-90"
                            />
                          )}
                        </button>
                      ) : null}

                      <div className="flex items-start justify-between gap-3 mb-2">
                        <h3 className="text-lg md:text-xl font-medium tracking-tight flex items-center gap-2 flex-wrap">
                          <button
                            type="button"
                            onClick={() => toggleProject(project.id)}
                            aria-expanded={isExpanded}
                            className="text-left cursor-pointer hover:text-[#8F2D56] transition-colors"
                          >
                            {project.title}
                          </button>
                          {project.link && (
                            <a
                              href={project.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              aria-label={`Visit ${project.title}`}
                              className="text-[#8F2D56] hover:text-[#D81159] transition-colors shrink-0"
                            >
                              <FiExternalLink className="w-4 h-4 md:w-[1.1rem] md:h-[1.1rem]" />
                            </a>
                          )}
                        </h3>
                        <button
                          type="button"
                          onClick={() => toggleProject(project.id)}
                          aria-expanded={isExpanded}
                          aria-label={`${isExpanded ? 'Collapse' : 'Expand'} ${project.title} details`}
                          className="shrink-0 text-[#8F2D56] hover:text-[#D81159] transition-colors cursor-pointer"
                        >
                          <IoChevronDown
                            className={`w-5 h-5 transition-transform duration-300 ${
                              isExpanded ? 'rotate-180' : ''
                            }`}
                            aria-hidden="true"
                          />
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => toggleProject(project.id)}
                        aria-expanded={isExpanded}
                        className="text-[#8F2D56] font-light text-xs md:text-sm tracking-wider uppercase text-left cursor-pointer"
                      >
                        {project.techStack}
                      </button>

                      <div
                        className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out ${
                          isExpanded ? 'grid-rows-[1fr] opacity-100 mt-4' : 'grid-rows-[0fr] opacity-0'
                        }`}
                      >
                        <div className="overflow-hidden">
                          {Array.isArray(project.description) ? (
                            project.description.map((descPoint, descIndex) => (
                              <p
                                key={descIndex}
                                className="font-light text-sm md:text-base leading-relaxed text-zinc-700 text-justify mb-2 last:mb-0"
                              >
                                • {renderTextWithLinks(descPoint)}
                              </p>
                            ))
                          ) : (
                            <p className="font-light text-sm md:text-base leading-relaxed text-zinc-700 text-justify">
                              {renderTextWithLinks(project.description)}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            <section id="competitions" className="scroll-mt-8 reveal" data-reveal>
              <h2 className="clean-heading text-2xl md:text-3xl font-semibold mb-8 tracking-tight">Competitions and awards</h2>
              <ul className="divide-y divide-zinc-200">
                {competitionsData.map((item, index) => (
                  <li
                    key={item.id}
                    className="flex gap-3 sm:gap-4 py-3.5 reveal-child"
                    style={{ '--reveal-index': index } as CSSProperties}
                  >
                    <span className="w-14 sm:w-16 shrink-0 pt-0.5 text-sm md:text-base font-medium tabular-nums text-[#8F2D56]">
                      {item.place}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-baseline justify-between gap-3">
                        <h3 className="text-lg md:text-xl font-medium tracking-tight leading-snug">
                          {item.title}
                        </h3>
                        <span className="shrink-0 text-sm md:text-base font-light text-zinc-500">
                          {item.date}
                        </span>
                      </div>
                      <p className="mt-0.5 font-light text-sm md:text-base text-zinc-500">
                        {item.description}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </section>

            <section id="technologies" className="scroll-mt-8 reveal" data-reveal>
              <h2 className="clean-heading text-2xl md:text-3xl font-semibold mb-8">Skills and technologies</h2>
              
              <div className="space-y-8">
                {skillsData.map((category, index) => (
                  <div
                    key={category.title}
                    className="reveal-child"
                    style={{ '--reveal-index': index } as CSSProperties}
                  >
                    <h3 className="text-base md:text-lg font-medium mb-4">{category.title}</h3>
                    <div className="grid grid-cols-2 gap-3">
                      {category.items.map((skill) => (
                        <div
                          key={skill}
                          className="p-2 border rounded-lg shadow-sm hover:shadow-md transition-shadow"
                        >
                          <h3 className="text-sm md:text-base font-medium text-[#8F2D56]">{skill}</h3>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section id="about" className="scroll-mt-8 mb-16 reveal" data-reveal>
              <h2 className="clean-heading text-2xl md:text-3xl font-semibold mb-8">About Me</h2>
              <p className="text-base md:text-lg font-light leading-relaxed text-justify mb-8 reveal-child" style={{ '--reveal-index': 0 } as CSSProperties}>
                I'm a very curious and active person, always looking to get out of my comfort zone, try new things and meet new people. 
                Besides from coding and academics, I love doing adrenaline-rushing sports. Currently I really enjoy climbing, padel and horseriding. 
              </p>
              
              <div className="w-full overflow-hidden relative reveal-child" style={{ '--reveal-index': 1 } as CSSProperties}>
                <div 
                  ref={carouselRef}
                  className={`flex gap-2 md:gap-4 py-4 ${isCarouselAnimating ? (isMobile ? 'animate-carousel-mobile' : 'animate-carousel-desktop') : ''}`}
                  style={{
                    width: 'fit-content',
                  }}
                >
                  {[...personalImages, ...personalImages].map((image, index) => (
                    <div 
                      key={index} 
                      className="relative flex-shrink-0 rounded-lg overflow-hidden shadow-md hover:scale-105 transition-transform duration-300"
                      style={{ 
                        width: isMobile ? '200px' : '160px',
                        height: isMobile ? '150px' : '120px',
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
    </div>
  );
}

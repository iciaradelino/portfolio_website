"use client";

import { useEffect, useState, useRef } from 'react';
import Image from "next/image";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { HiMail } from "react-icons/hi";
import { HiDocumentText } from "react-icons/hi2";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { IoAdd } from "react-icons/io5";

export default function Home() {
  const [activeSection, setActiveSection] = useState('projects');
  const [currentADHDImage, setCurrentADHDImage] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  const [contentVisible, setContentVisible] = useState(false);
  const introRef = useRef<HTMLDivElement>(null);
  const [visibleImages, setVisibleImages] = useState({
    mappy: false,
    adhd: false,
    clothing: false,
    energy: false,
    victoria: false,
    iconic: false
  });
  
  const adhdImages = [
    { src: "/images/adhd (1).png", alt: "ADHD Learning Platform - Main View" },
    { src: "/images/adhd (2).png", alt: "ADHD Learning Platform - Features View" },
    { src: "/images/adhd (3).png", alt: "ADHD Learning Platform - Dashboard View" }
  ];

  const toggleImageVisibility = (project: keyof typeof visibleImages) => {
    setVisibleImages(prev => ({
      ...prev,
      [project]: !prev[project]
    }));
  };

  const nextADHDImage = () => {
    setCurrentADHDImage((prev) => (prev === adhdImages.length - 1 ? 0 : prev + 1));
  };

  const prevADHDImage = () => {
    setCurrentADHDImage((prev) => (prev === 0 ? adhdImages.length - 1 : prev - 1));
  };

  // Track if intro has reached final position
  const [introLocked, setIntroLocked] = useState(false);
  
  // Max scroll for animation effect (adjust as needed)
  const MAX_SCROLL = 500;

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrollY(currentScrollY);
      
      // Show content after scrolling past threshold
      if (currentScrollY > 100 && !contentVisible) {
        setContentVisible(true);
      }

      // Lock intro in final position once it reaches MAX_SCROLL
      if (currentScrollY >= MAX_SCROLL && !introLocked) {
        setIntroLocked(true);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [contentVisible, introLocked, MAX_SCROLL]);

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

  // Calculate intro section transform based on scroll position
  const scrollProgress = Math.min(scrollY / MAX_SCROLL, 1);
  
  // Determine main container alignment based on scroll position
  const mainContainerStyle = {
    justifyContent: introLocked ? 'flex-start' : scrollProgress > 0.8 ? 'flex-start' : 'center',
    paddingTop: introLocked ? '10vh' : scrollProgress === 0 ? '30vh' : `${scrollProgress * 8}vh`,
    transition: 'all 0.5s ease-out',
  };
  
  // Intro doesn't need transform - container handles positioning
  const introStyle = {
    opacity: 1,
    paddingTop: scrollProgress < 0.2 ? '1rem' : '0',
    transition: 'padding-top 0.5s ease-out',
  };

  // Determine if content should be visible (include introLocked state)
  const shouldShowContent = contentVisible || scrollProgress > 0.3 || introLocked;

  // Add this near the top of the component, with the other state declarations
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  // Add this with the other constants at the top of the component
  const personalPhotos = [
    { 
      src: "/images/personal1.jpg", 
      alt: "Personal photo 1",
      caption: "Coding at my favorite café in Madrid" 
    },
    { 
      src: "/images/personal2.jpg", 
      alt: "Personal photo 2",
      caption: "Working on a robotics project" 
    },
    { 
      src: "/images/personal3.jpg", 
      alt: "Personal photo 3",
      caption: "Giving a tech presentation at IE University" 
    },
    { 
      src: "/images/personal4.jpg", 
      alt: "Personal photo 4",
      caption: "Hiking in the mountains - where I get my best ideas" 
    }
  ];
  
  // Add auto-sliding functionality
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPhotoIndex(prevIndex => 
        prevIndex === personalPhotos.length - 1 ? 0 : prevIndex + 1
      );
    }, 3000); // Change slide every 3 seconds
    
    return () => clearInterval(interval);
  }, [personalPhotos.length]);

  return (
    <div 
      className="min-h-screen p-8 bg-white text-[#1d1d1f] flex flex-col" 
      style={mainContainerStyle}
    >
      <main className="max-w-4xl mx-auto relative">
        <div ref={introRef} style={introStyle} className="mb-8">
          <h1 className="clean-heading text-5xl font-semibold mb-8 text-[#1d1d1f] text-center md:text-left">
            Hi, I am <span className="gradient-text">Iciar</span>!
          </h1>
          <div className="mb-10">
            <p className="text-xl leading-relaxed font-light tracking-tight text-center md:text-left">
              Welcome to my portfolio website. I am passionate about creating beautiful and functional web applications
              that solve real-world problems. With expertise in modern web technologies and AI,
              I strive to deliver innovative solutions through clean and efficient code. I am open to new opportunities!
            </p>
          </div>

          <div className="flex gap-4 mb-20 justify-center md:justify-start flex-wrap">
            <a 
              href="https://github.com/iciaradelino" 
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-3 bg-[#D81159] text-white rounded-full text-[15px] font-normal tracking-wide transition-all duration-200 hover:scale-110"
            >
              <FaGithub className="text-lg" />
              GitHub
            </a>
            <a
              href="https://www.linkedin.com/in/ic%C3%ADar-adeli%C3%B1o-219b53331/?trk=opento_sprofile_topcard" 
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-3 bg-[#8F2D56] text-white rounded-full text-[15px] font-normal tracking-wide transition-all duration-200 hover:scale-110"
            >
              <FaLinkedin className="text-lg" />
              LinkedIn
            </a>
            <a 
              href="mailto:iciaradelinoordax@gmail.com"
              className="flex items-center gap-2 px-6 py-3 bg-[#FFBC42] text-[#1d1d1f] rounded-full text-[15px] font-normal tracking-wide transition-all duration-200 hover:scale-110"
            >
              <HiMail className="text-lg" />
              Email
            </a>
            <a 
              href="/cv_iciar_adeliño.pdf" 
              target="_blank"
              className="flex items-center gap-2 px-6 py-3 border-[1.5px] border-[#FFBC42] text-[#1d1d1f] rounded-full text-[15px] font-normal tracking-wide transition-all duration-200 hover:scale-110"
            >
              <HiDocumentText className="text-lg" />
              CV
            </a>
          </div>
        </div>

        <div className={`flex gap-12 transition-opacity duration-500 ease-in-out ${shouldShowContent ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
          {/* Index Column */}
          <nav className="w-48 flex-shrink-0">
            <ul className="space-y-5 text-base sticky top-[30vh] font-light tracking-wide">
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
                  Experience
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
                  Technologies
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

          {/* Content Column */}
          <div className="flex-1 space-y-16">
            <section id="projects" className="scroll-mt-8">
              <h2 className="clean-heading text-3xl font-semibold mb-6 tracking-tight">Projects</h2>
              <div className="space-y-12">
                <div className="group relative">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-medium tracking-tight mb-2">Mappy - Travel Planning Platform</h3>
                      <p className="text-[#8F2D56] mb-3 font-light text-sm tracking-wider uppercase">React • Next.js • TypeScript • Supabase</p>
                      <p className="font-light text-base leading-relaxed text-zinc-700"> • Designed and built UI/UX for a travel planning website using React and Next.js. </p>
                        <p className="font-light text-base leading-relaxed text-zinc-700"> • Built backend using TypeScript, Supabase, and Amadeus and OpenAI APIs.</p>
                    </div>
                    <button 
                      onClick={() => toggleImageVisibility('mappy')}
                      className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-2 bg-[#D81159] text-white rounded-full"
                      aria-label="Show image"
                    >
                      <IoAdd className="text-lg" />
                    </button>
                  </div>
                  {visibleImages.mappy && (
                    <div className="mt-4 overflow-hidden rounded-xl bg-gray-100 max-w-lg">
                      <Image
                        src="/images/mappy_image.png"
                        alt="Mappy Travel Planning Platform"
                        width={900}
                        height={150}
                        className="w-full object-contain transition-transform duration-300"
                        priority
                        quality={100}
                      />
                    </div>
                  )}
                </div>

                <div className="group relative">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-medium tracking-tight mb-2">DivergED - ADHD Learning Platform</h3>
                      <p className="text-[#8F2D56] mb-3 font-light text-sm tracking-wider uppercase">OCR • OpenAI API • Blackboard Integration</p>
                      <p className="font-light text-base leading-relaxed text-zinc-700">Built a learning platform for ADHD students that syncs with Blackboard, featuring OCR for PDF recognition and integrated AI chatbots. Awarded 1st place.</p>
                    </div>
                    <button 
                      onClick={() => toggleImageVisibility('adhd')}
                      className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-2 bg-[#D81159] text-white rounded-full"
                      aria-label="Show image"
                    >
                      <IoAdd className="text-lg" />
                    </button>
                  </div>
                  {visibleImages.adhd && (
                    <div className="mt-4 max-w-lg flex items-center space-x-2">
                      <button 
                        onClick={prevADHDImage}
                        className="flex-shrink-0 p-2 text-[#8F2D56] hover:bg-gray-100 rounded-full transition-all duration-200 focus:outline-none"
                        aria-label="Previous image"
                      >
                        <IoIosArrowBack className="text-lg" />
                      </button>
                      
                      <div className="relative flex-grow">
                        <div className="overflow-hidden rounded-xl bg-gray-100">
                          <Image
                            src={adhdImages[currentADHDImage].src}
                            alt={adhdImages[currentADHDImage].alt}
                            width={500}
                            height={250}
                            className="w-full object-cover transition-transform duration-300"
                          />
                        </div>
                        <div className="flex justify-center space-x-2 mt-2">
                          {adhdImages.map((_, index) => (
                            <button
                              key={index}
                              onClick={() => setCurrentADHDImage(index)}
                              className={`w-2 h-2 rounded-full ${
                                currentADHDImage === index ? 'bg-[#8F2D56]' : 'bg-gray-300'
                              }`}
                              aria-label={`View image ${index + 1}`}
                            />
                          ))}
                        </div>
                      </div>
                      
                      <button 
                        onClick={nextADHDImage}
                        className="flex-shrink-0 p-2 text-[#8F2D56] hover:bg-gray-100 rounded-full transition-all duration-200 focus:outline-none"
                        aria-label="Next image"
                      >
                        <IoIosArrowForward className="text-lg" />
                      </button>
                    </div>
                  )}
                </div>

                <div className="group relative">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-medium tracking-tight mb-2">Energy Production Prediction Model - NTT Hackathon</h3>
                      <p className="text-[#8F2D56] mb-3 font-light text-sm tracking-wider uppercase">XGBoost • Prophet • Machine Learning</p>
                      <p className="font-light text-base leading-relaxed text-zinc-700">Trained a machine learning model to predict energy production from eolic and solar plants for the NTT Hackathon.</p>
                    </div>
                    <button 
                      onClick={() => toggleImageVisibility('energy')}
                      className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-2 bg-[#D81159] text-white rounded-full"
                      aria-label="Show image"
                    >
                      <IoAdd className="text-lg" />
                    </button>
                  </div>
                  {visibleImages.energy && (
                    <div className="mt-4 overflow-hidden rounded-xl bg-gray-100 max-w-lg">
                      <Image
                        src="/images/energy_prediction.png"
                        alt="Energy Production Prediction Model"
                        width={300}
                        height={150}
                        className="w-full object-cover transition-transform duration-300"
                      />
                    </div>
                  )}
                </div>

                <div className="group relative">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-medium tracking-tight mb-2 flex items-center">
                        VictorIA - IEU Robotics and AI Club
                        <span className="ml-3 px-2 py-0.5 text-xs font-medium bg-amber-100 text-amber-700 rounded">In Development</span>
                      </h3>
                      <p className="text-[#8F2D56] mb-3 font-light text-sm tracking-wider uppercase">ROS • OPENCV • PYTHON • January 2025 - Present</p>
                      <p className="font-light text-base leading-relaxed text-zinc-700">Programming a robotic arm to play Connect 4 using computer vision (OpenCV), ROS, and WidowX 250 S</p>
                    </div>
                    <button 
                      onClick={() => toggleImageVisibility('victoria')}
                      className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-2 bg-[#D81159] text-white rounded-full"
                      aria-label="Show image"
                    >
                      <IoAdd className="text-lg" />
                    </button>
                  </div>
                  {visibleImages.victoria && (
                    <div className="mt-4 overflow-hidden rounded-xl bg-gray-100 max-w-lg">
                      <Image
                        src="/images/victoria_project.png"
                        alt="VictorIA Robotics Project"
                        width={300}
                        height={150}
                        className="w-full object-cover transition-transform duration-300"
                      />
                    </div>
                  )}
                </div>

                <div className="group relative">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-medium tracking-tight mb-2 flex items-center">
                        Be Iconic - Fashion App
                        <span className="ml-3 px-2 py-0.5 text-xs font-medium bg-amber-100 text-amber-700 rounded">In Development</span>
                      </h3>
                      <p className="text-[#8F2D56] mb-3 font-light text-sm tracking-wider uppercase">Venture Lab • March 2025 - Present</p>
                      <p className="font-light text-base leading-relaxed text-zinc-700">Developing a mobile app using React Native and Expo Go for digital wardrobe management with features for clothing organization and management</p>
                    </div>
                    <button 
                      onClick={() => toggleImageVisibility('iconic')}
                      className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-2 bg-[#D81159] text-white rounded-full"
                      aria-label="Show image"
                    >
                      <IoAdd className="text-lg" />
                    </button>
                  </div>
                  {visibleImages.iconic && (
                    <div className="mt-4 overflow-hidden rounded-xl bg-gray-100 max-w-lg">
                      <Image
                        src="/images/fashion_app.png"
                        alt="Be Iconic Fashion App"
                        width={300}
                        height={150}
                        className="w-full object-cover transition-transform duration-300"
                      />
                    </div>
                  )}
                </div>

                <div className="group relative">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-medium tracking-tight mb-2">Clothing Recognition Website</h3>
                      <p className="text-[#8F2D56] mb-3 font-light text-sm tracking-wider uppercase">Python • OpenCV • YOLOv8 • Machine Learning</p>
                      <p className="font-light text-base leading-relaxed text-zinc-700">Trained a computer vision model that identifies clothing items in real-time, leveraging the Fashionpedia dataset and integrated it into a website.</p>
                    </div>
                    <button 
                      onClick={() => toggleImageVisibility('clothing')}
                      className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-2 bg-[#D81159] text-white rounded-full"
                      aria-label="Show image"
                    >
                      <IoAdd className="text-lg" />
                    </button>
                  </div>
                  {visibleImages.clothing && (
                    <div className="mt-4 overflow-hidden rounded-xl bg-gray-100 max-w-lg">
                      <Image
                        src="/images/clothing_recognition.png"
                        alt="AI Clothing Recognition System"
                        width={300}
                        height={150}
                        className="w-full object-cover transition-transform duration-300"
                      />
                    </div>
                  )}
                </div>

              </div>
            </section>

            <section id="experience" className="scroll-mt-8">
              <h2 className="clean-heading text-3xl font-semibold mb-6">Experience</h2>
              <div className="space-y-6">
               
                <div>
                  <h3 className="text-lg font-medium mb-2">Full Stack Web Developer - Mappy</h3>
                  <p className="text-[#8F2D56] mb-3 font-light text-sm tracking-wider uppercase">Tech Venture Bootcamp • February 2025 - March 2025</p>
                  <ul className="font-light text-base list-disc pl-4 space-y-2">
                    <li>Designed and implemented UI/UX for a travel planning website using React and Next.js</li>
                    <li>Built backend infrastructure using TypeScript, Supabase, and integrated Amadeus and OpenAI APIs</li>
                  </ul>
                </div>
              </div>
            </section>

            <section id="technologies" className="scroll-mt-8">
              <h2 className="clean-heading text-3xl font-semibold mb-6">Skills and technologies</h2>
              
              <div className="space-y-6">
                {/* Web Development Category */}
                <div>
                  <h3 className="text-lg font-medium mb-3">Web Development</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-2 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
                      <h3 className="text-sm font-medium text-[#8F2D56]">React.js / Next.js</h3>
                    </div>
                    <div className="p-2 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
                      <h3 className="text-sm font-medium text-[#8F2D56]">TypeScript</h3>
                    </div>
                    <div className="p-2 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
                      <h3 className="text-sm font-medium text-[#8F2D56]">React Native / Expo</h3>
                    </div>
                    <div className="p-2 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
                      <h3 className="text-sm font-medium text-[#8F2D56]">Supabase</h3>
                    </div>
                  </div>
                </div>
                
                {/* AI & Machine Learning Category */}
                <div>
                  <h3 className="text-lg font-medium mb-3">AI & Machine Learning</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-2 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
                      <h3 className="text-sm font-medium text-[#8F2D56]">OpenCV / Computer Vision</h3>
                    </div>
                    <div className="p-2 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
                      <h3 className="text-sm font-medium text-[#8F2D56]">YOLOv8</h3>
                    </div>
                    <div className="p-2 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
                      <h3 className="text-sm font-medium text-[#8F2D56]">XGBoost / Prophet</h3>
                    </div>
                    <div className="p-2 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
                      <h3 className="text-sm font-medium text-[#8F2D56]">OpenAI API</h3>
                    </div>
                  </div>
                </div>
                
                {/* Robotics & Tools Category */}
                <div>
                  <h3 className="text-lg font-medium mb-3">Robotics & Tools</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-2 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
                      <h3 className="text-sm font-medium text-[#8F2D56]">ROS</h3>
                    </div>
                    <div className="p-2 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
                      <h3 className="text-sm font-medium text-[#8F2D56]">Python</h3>
                    </div>
                    <div className="p-2 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
                      <h3 className="text-sm font-medium text-[#8F2D56]">Git / GitHub</h3>
                    </div>
                    <div className="p-2 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
                      <h3 className="text-sm font-medium text-[#8F2D56]">OCR Technologies</h3>
                    </div>
                  </div>
                </div>
                
                {/* APIs & Integration Category */}
                <div>
                  <h3 className="text-lg font-medium mb-3">APIs & Integration</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-2 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
                      <h3 className="text-sm font-medium text-[#8F2D56]">RESTful APIs</h3>
                    </div>
                    <div className="p-2 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
                      <h3 className="text-sm font-medium text-[#8F2D56]">Amadeus API</h3>
                    </div>
                    <div className="p-2 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
                      <h3 className="text-sm font-medium text-[#8F2D56]">Blackboard Integration</h3>
                    </div>
                    <div className="p-2 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
                      <h3 className="text-sm font-medium text-[#8F2D56]">Database Management</h3>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section id="about" className="scroll-mt-8 mb-16">
              <h2 className="clean-heading text-3xl font-semibold mb-6">About Me</h2>
              <p className="text-lg font-light leading-relaxed mb-10">
                I'm a passionate Full Stack Developer with a strong foundation in computer science and 
                a keen interest in creating efficient, scalable web applications. Based in Madrid, 
                I combine technical expertise with creative problem-solving to deliver high-quality 
                software solutions.
              </p>
              
              {/* Photo Carousel */}
              <div className="mt-8">                
                <div className="relative max-w-3xl mx-auto">
                  {/* Carousel Component */}
                  <div className="carousel">
                    {/* Photo Carousel - Auto-sliding */}
                    <div className="relative overflow-hidden rounded-xl h-64">
                      <div 
                        className="flex transition-transform duration-500 ease-in-out" 
                        style={{ 
                          transform: `translateX(-${currentPhotoIndex * 100}%)`,
                          width: `${personalPhotos.length * 100}%`
                        }}
                      >
                        {personalPhotos.map((photo, index) => (
                          <div 
                            key={index} 
                            className="relative w-full" 
                            style={{ width: `${100 / personalPhotos.length}%` }}
                          >
                            <Image
                              src={photo.src}
                              alt={photo.alt}
                              width={800}
                              height={450}
                              className="w-full h-64 object-cover"
                            />
                            {/* Photo caption */}
                            <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-2 text-sm">
                              {photo.caption}
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      {/* Manual navigation buttons (optional) */}
                      <button 
                        onClick={() => {
                          const newIndex = currentPhotoIndex === 0 ? personalPhotos.length - 1 : currentPhotoIndex - 1;
                          setCurrentPhotoIndex(newIndex);
                        }}
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10 p-2 bg-white/80 rounded-full text-[#8F2D56] hover:bg-white transition-all duration-200 focus:outline-none"
                        aria-label="Previous photo"
                      >
                        <IoIosArrowBack className="text-xl" />
                      </button>
                      
                      <button 
                        onClick={() => {
                          const newIndex = currentPhotoIndex === personalPhotos.length - 1 ? 0 : currentPhotoIndex + 1;
                          setCurrentPhotoIndex(newIndex);
                        }}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 z-10 p-2 bg-white/80 rounded-full text-[#8F2D56] hover:bg-white transition-all duration-200 focus:outline-none"
                        aria-label="Next photo"
                      >
                        <IoIosArrowForward className="text-xl" />
                      </button>
                    </div>
                    
                    {/* Indicators */}
                    <div className="flex justify-center space-x-2 mt-4">
                      {personalPhotos.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentPhotoIndex(index)}
                          className={`w-2.5 h-2.5 rounded-full transition-all duration-200 ${
                            currentPhotoIndex === index ? 'bg-[#D81159] w-4' : 'bg-gray-300'
                          }`}
                          aria-label={`View photo ${index + 1}`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </section>

          </div>
        </div>
      </main>
    </div>
  );
}

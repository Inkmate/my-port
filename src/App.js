import React, { useState, useEffect, useRef } from 'react';
import {
  Home,
  User,
  Lightbulb,
  Briefcase,
  Mail,
  Github,
  // Linkedin,
  // Twitter,
  ExternalLink,
  Sparkle,
  Facebook,
  Instagram,
  ChevronLeft,
  ChevronRight,
  Atom,
  Code,
  Palette,
  Server,
  Database,
  GitBranch,
  Cpu,
  HardDrive, 
  CircuitBoard,
} from 'lucide-react';


import depedPortalImage from './assets/images/1.png';
import dtrConverterImage from './assets/images/3.png';
import tabulationImage from './assets/images/2.png';
import iotSystemImage from './assets/images/4.jpg';

// Main App Component
const App = () => {
  // State to manage the active section for navigation highlighting
  const [activeSection, setActiveSection] = useState('home');

  // Refs for each section to determine scroll position
  const homeRef = useRef(null);
  const aboutRef = useRef(null);
  const skillsRef = useRef(null);
  const projectsRef = useRef(null);
  const contactRef = useRef(null);

  // State for the Project Description Enhancer feature
  const [inputDescription, setInputDescription] = useState('');
  const [generatedDescription, setGeneratedDescription] = useState('');
  const [isGeneratingDescription, setIsGeneratingDescription] = useState(false);
  const [generationError, setGenerationError] = useState('');

  // State for Contact Form
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  // State for project display
  const [currentProjectIndex, setCurrentProjectIndex] = useState(0);
  const autoScrollIntervalRef = useRef(null); 
  const projectCards = [
    {
      title: 'DEPED-Antique Portal',
      description: 'The DEPED-Antique Portal is a centralized document and records management system designed for educational institutions in Antique. It features secure access control, organized folder navigation, and streamlined file uploads. Built using Python and Sql Server, with a user-friendly interface powered by HTML, CSS, JavaScript.',
      image: depedPortalImage,
      githubLink: 'https://github.com/Inkmate/adminportal.git',
      demoLink: '',
    },
    {
      title: 'EXCEL to DTR Converter',
      description: 'A streamlined tool that converts biometric Excel logs into Daily Time Records (DTR) with accurate calculations of hours worked and undertime. This project highlights my skills in backend processing and data formatting, using JavaScript, Node.js, and Excel parsing libraries to automate and simplify HR workflows.',
      image: dtrConverterImage,
      githubLink: 'https://github.com/Inkmate/dtr-new.git',
      demoLink: '',
    },
    {
      title: 'Tabulation for Judging',
      description: 'Developed a full-stack e-commerce platform featuring user authentication, product catalog, shopping cart, and checkout process. Utilized React for the frontend, Node.js/Express for the backend, and MongoDB for the database.',
      image: tabulationImage,
      githubLink: 'https://github.com/yourusername/ecommerce-platform',
      demoLink: 'https://yourecommercedemo.com',
    },
    {
      title: 'Watering System(Android Application)',
      description: 'Created a simple 2D mobile game using a game development framework. Focused on intuitive controls, engaging gameplay mechanics, and responsive design for various mobile devices.',
      image: iotSystemImage,
      githubLink: 'https://github.com/yourusername/mobile-game',
      demoLink: 'https://yourgamedemo.com',
    },
  ];

  // Effect to handle scroll events and update active section
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.7,
    };

    const observerCallback = (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    // Observe each section
    if (homeRef.current) observer.observe(homeRef.current);
    if (aboutRef.current) observer.observe(aboutRef.current);
    if (skillsRef.current) observer.observe(skillsRef.current);
    if (projectsRef.current) observer.observe(projectsRef.current);
    if (contactRef.current) observer.observe(contactRef.current);

    // Clean up observer on unmount
    return () => {
      if (homeRef.current) observer.unobserve(homeRef.current);
      if (aboutRef.current) observer.unobserve(aboutRef.current);
      if (skillsRef.current) observer.unobserve(skillsRef.current);
      if (projectsRef.current) observer.unobserve(projectsRef.current);
      if (contactRef.current) observer.unobserve(contactRef.current);
    };
  }, []);

  // Effect for auto-scrolling projects
  useEffect(() => {
    startAutoScroll();
    return () => clearInterval(autoScrollIntervalRef.current);
  }, [projectCards.length]);

  const startAutoScroll = () => {
    clearInterval(autoScrollIntervalRef.current);
    autoScrollIntervalRef.current = setInterval(() => {
      setCurrentProjectIndex(prevIndex => {
        return (prevIndex + 1) % projectCards.length;
      });
    }, 3000); 
  };

  const pauseAutoScroll = () => {
    clearInterval(autoScrollIntervalRef.current);
  };

  // Function to smoothly scroll to a section
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setActiveSection(id);
    }
  };

  // Handle manual navigation for projects
  const handlePrevProject = () => {
    pauseAutoScroll();
    setCurrentProjectIndex(prevIndex =>
      (prevIndex - 1 + projectCards.length) % projectCards.length
    );
  };

  const handleNextProject = () => {
    pauseAutoScroll();
    setCurrentProjectIndex(prevIndex =>
      (prevIndex + 1) % projectCards.length
    );
  };

  // Function to call Gemini API for project description enhancement
  const handleGenerateEnhancedDescription = async () => {
    if (!inputDescription.trim()) {
      setGenerationError("Please enter a brief project description to enhance.");
      return;
    }

    setIsGeneratingDescription(true);
    setGeneratedDescription('');
    setGenerationError('');

    try {
      let chatHistory = [];
      const prompt = `Expand and refine the following brief project description into a more detailed and professional paragraph, highlighting key features, technologies, and impact. Make it sound engaging and suitable for a portfolio: "${inputDescription}"`;
      chatHistory.push({ role: "user", parts: [{ text: prompt }] });
      const payload = { contents: chatHistory };
      const apiKey = process.env.REACT_APP_GEMINI_API_KEY || "AIzaSyAh8aZfjil6IS3MVnXB3WCMyHhuZSmpyMo"; // Fallback for local dev if not set

      if (!apiKey) {
        setGenerationError("API Key is not configured. Please set REACT_APP_GEMINI_API_KEY in Vercel environment variables.");
        setIsGeneratingDescription(false);
        return;
      }

      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
      const response = await fetch(apiUrl, {
                 method: 'POST',
                 headers: { 'Content-Type': 'application/json' },
                 body: JSON.stringify(payload)
             });

      const result = await response.json();

      if (result.candidates && result.candidates.length > 0 &&
          result.candidates[0].content && result.candidates[0].content.parts &&
          result.candidates[0].content.parts.length > 0) {
        const text = result.candidates[0].content.parts[0].text;
        setGeneratedDescription(text);
      } else {
        setGenerationError('Failed to generate description. Please try again.');
        console.error('Gemini API response structure unexpected:', result);
      }
    } catch (error) {
      setGenerationError(`Error generating description: ${error.message}`);
      console.error('Error calling Gemini API:', error);
    } finally {
      setIsGeneratingDescription(false);
    }
  };

  // Handle form input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle contact form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage('');
    setIsSuccess(false);

    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        setSubmitMessage('Message sent successfully!');
        setIsSuccess(true);
        setFormData({ name: '', email: '', message: '' });
      } else {
        setSubmitMessage(result.message || 'Failed to send message. Please try again.');
        setIsSuccess(false);
      }
    } catch (error) {
      setSubmitMessage('An error occurred. Please try again later.');
      setIsSuccess(false);
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Function to get the appropriate icon based on skill name
  const getSkillIcon = (skillName) => {
    switch (skillName) {
      case 'React':
        return Atom;
      case 'JavaScript':
        return Code;
      case 'Tailwind CSS':
        return Palette;
      case 'Node.js':
        return Server;
      case 'Express':
        return Server;
      case 'MongoDB':
        return Database;
      case 'Python':
        return Cpu;
      case 'Git':
        return GitBranch;
      case 'REST APIs':
        return Code;
      case 'SQL Server':
        return Database;
      case 'SQL/MySQL':
        return Database;
      case 'Internet of Things':
        return Code;
      case 'XAMPP':
        return Database;
      case '.NET':
        return HardDrive;
      case 'C++':
        return Cpu;
      case 'Arduino':
        return CircuitBoard;
      default:
        return Lightbulb;
    }
  };

  const currentProject = projectCards[currentProjectIndex];

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 antialiased">
      {/* Navigation Bar */}
      <nav className="fixed top-0 left-0 w-full bg-gray-900 bg-opacity-95 shadow-lg z-50 p-4 md:px-8">
        <div className="container mx-auto flex justify-between items-center">
          <a href="#" onClick={() => scrollToSection('home')} className="text-2xl font-bold text-gray-100 rounded-lg px-2 py-1 transition duration-300 hover:bg-gray-800">
            [Winefred Malones]
          </a>
          <div className="hidden md:flex space-x-6">
            <NavItem icon={Home} label="Home" sectionId="home" active={activeSection === 'home'} onClick={scrollToSection} />
            <NavItem icon={User} label="About" sectionId="about" active={activeSection === 'about'} onClick={scrollToSection} />
            <NavItem icon={Lightbulb} label="Skills" sectionId="skills" active={activeSection === 'skills'} onClick={scrollToSection} />
            <NavItem icon={Briefcase} label="Projects" sectionId="projects" active={activeSection === 'projects'} onClick={scrollToSection} />
            <NavItem icon={Mail} label="Contact" sectionId="contact" active={activeSection === 'contact'} onClick={scrollToSection} />
          </div>
          {/* Mobile menu button - Add functionality if needed */}
          <button className="md:hidden p-2 rounded-md text-gray-300 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
            </svg>
          </button>
        </div>
      </nav>

      <main className="pt-20"> {/* Add padding-top to account for fixed navbar */}

        {/* Hero Section */}
        <section id="home" ref={homeRef} className="h-screen flex items-center justify-center bg-gradient-to-br from-gray-800 to-black text-white px-4">
          <div className="text-center max-w-4xl p-8 bg-white bg-opacity-10 rounded-2xl shadow-xl backdrop-blur-sm transform transition-all duration-500 ease-in-out hover:scale-105">
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold mb-4 animate-fade-in-up">
              Hi, I'm <span className="text-gray-300">[Winefred Davo Malones]</span>
            </h1>
            <p className="text-xl sm:text-2xl lg:text-3xl font-medium mb-6 animate-fade-in-up delay-200">
              A passionate <span className="font-semibold text-gray-400">[Software Developer and Application Developer]</span>
            </p>
            <p className="text-lg sm:text-xl mb-8 leading-relaxed animate-fade-in-up delay-400">
              Crafting engaging and efficient solutions through code. Welcome to my digital space!
            </p>
            <div className="flex justify-center space-x-4 animate-fade-in-up delay-600">
              <button
                onClick={() => scrollToSection('projects')}
                className="bg-gray-300 hover:bg-gray-400 text-gray-900 font-semibold py-3 px-8 rounded-full shadow-lg transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-300"
              >
                View My Work
              </button>
              <button
                onClick={() => scrollToSection('contact')}
                className="bg-transparent border-2 border-gray-300 hover:border-gray-500 hover:text-gray-500 text-gray-300 font-semibold py-3 px-8 rounded-full shadow-lg transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white"
              >
                Get In Touch
              </button>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" ref={aboutRef} className="py-20 px-4 bg-gray-50 flex items-center justify-center">
          <div className="container mx-auto max-w-4xl text-center md:text-left">
            <h2 className="text-4xl font-bold text-gray-800 mb-8 pb-2 border-b-4 border-gray-400 inline-block">About Me</h2>
            <div className="flex flex-col md:flex-row items-center md:items-start space-y-8 md:space-y-0 md:space-x-12">
              <div className="flex-shrink-0">
                <img
                  src="https://scontent.fceb1-3.fna.fbcdn.net/v/t39.30808-6/473078761_1690961551836914_6418561073548240781_n.jpg?_nc_cat=103&ccb=1-7&_nc_sid=a5f93a&_nc_eui2=AeH1zzhlA4ltwyjPBy_qvxrP7HCliszks2XscKWKzOSzZZozgVWZzwsez0UkakB6Yhf7PwnTk5RSTA9YE96Ek0X4&_nc_ohc=zRYE73CRyU0Q7kNvwH33VNR&_nc_oc=AdlhtKVvwMPVxzsSGlLkcqWAXUEOw34Zp-FASsxTNuoeSk2zEFkUW3dkr7ar0_IxykM&_nc_zt=23&_nc_ht=scontent.fceb1-3.fna&_nc_gid=VdrzQqtjGdAN8GO3lYw62A&oh=00_AfQ8BGIKQEY3Zp23TlVbWKnnKhAWKUHa5DMdXeKzufhLNw&oe=686FCDEA"
                  alt="No Photo"
                  className="w-64 h-64 rounded-full object-cover shadow-xl border-4 border-gray-300"
                />
              </div>
              <div className="flex-grow">
                <p className="text-lg leading-relaxed mb-4">
                  Hello! I'm [Winefred Malones], a Software Developer and Application Developer.
                  I specialize in building scalable web applications android applications, designing intuitive user interfaces, optimizing database performance.
                </p>
                <p className="text-lg leading-relaxed mb-4">
                  My journey into tech began with a fascination for how websites are built, problem-solving with code.
                  Since then, I've had the opportunity to work on diverse projects, from Web Application to Android Application,
                  each challenging me to grow and expand my skillset.
                </p>
                <p className="text-lg leading-relaxed">
                  I am passionate about continuous learning and always eager to explore new technologies and best practices.
                  When I'm not coding, you can find me playing online games.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Skills Section */}
        <section id="skills" ref={skillsRef} className="py-20 px-4 bg-gray-200 flex items-center justify-center">
          <div className="container mx-auto max-w-4xl text-center">
            <h2 className="text-4xl font-bold text-gray-800 mb-12 pb-2 border-b-4 border-gray-400 inline-block">My Skills</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-8">
              {[
                'React', 'JavaScript', 'Tailwind CSS', 'Node.js', 'Express',
                'SQL Server', 'Python', 'Git', 'Arduino', 'SQL/MySQL', 'C++', '.NET', 'IoT', 'XAMPP'
              ].map((skill, index) => {
                const IconComponent = getSkillIcon(skill);
                return (
                  <div key={index} className="p-6 bg-gray-50 rounded-xl shadow-md transition duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg flex flex-col items-center justify-center group">
                    <IconComponent className="w-10 h-10 text-gray-600 mb-3 transition-colors duration-300 group-hover:text-gray-800" />
                    <p className="text-xl font-semibold text-gray-700">{skill}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Projects Section */}
        <section id="projects" ref={projectsRef} className="py-20 px-4 bg-gray-50 flex items-center justify-center">
          <div className="container mx-auto max-w-5xl text-center">
            <h2 className="text-4xl font-bold text-gray-800 mb-12 pb-2 border-b-4 border-gray-400 inline-block">My Projects</h2>

            {/* Project Description Enhancer Tool */}
            <div className="bg-gray-100 rounded-2xl shadow-xl p-8 mb-12 border-l-4 border-gray-600 text-left">
                <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                    <Sparkle className="w-6 h-6 mr-2 text-gray-600" /> Project Description Enhancer
                </h3>
                <p className="text-gray-700 mb-4">
                    Paste a brief description of your project below, and I'll help you generate a more detailed, portfolio-ready version using AI.
                </p>
                <textarea
                    className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent transition duration-200 resize-y mb-4"
                    rows="5"
                    placeholder="E.g., 'A simple to-do list app built with React and a local storage backend. Users can add, delete, and mark tasks as complete.'"
                    value={inputDescription}
                    onChange={(e) => setInputDescription(e.target.value)}
                ></textarea>
                <button
                    onClick={handleGenerateEnhancedDescription}
                    disabled={isGeneratingDescription}
                    className="w-full bg-gray-700 hover:bg-gray-800 text-white font-bold py-3 px-6 rounded-full shadow-lg transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-500 flex items-center justify-center"
                >
                    {isGeneratingDescription ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Generating...
                        </>
                    ) : (
                        <>
                            <Sparkle className="w-5 h-5 mr-2" /> Generate Enhanced Description
                        </>
                    )}
                </button>

                {generationError && (
                    <p className="text-red-600 mt-4 text-center">{generationError}</p>
                )}

                {generatedDescription && (
                    <div className="mt-6 p-4 bg-gray-100 border border-gray-300 rounded-lg shadow-md">
                        <h4 className="font-semibold text-gray-800 mb-2">Generated Description:</h4>
                        <p className="text-gray-700 whitespace-pre-wrap">{generatedDescription}</p>
                    </div>
                )}
            </div>
            {/* End Project Description Enhancer Tool */}

            {/* Project Display Container */}
            <div
              className="relative flex justify-center items-center py-4 group"
              onMouseEnter={pauseAutoScroll} 
              onMouseLeave={startAutoScroll}
            >
              {/* Navigation Buttons */}
              <button
                onClick={handlePrevProject}
                className="absolute left-0 top-1/2 -translate-y-1/2 bg-gray-800 text-white p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
                aria-label="Previous Project"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              {/* Display Current Project Card */}
              {currentProject && (
                <div
                  key={currentProjectIndex}
                  className="w-full max-w-xl bg-gray-100 rounded-2xl shadow-xl p-8 transform transition duration-300 flex flex-col items-center"
                >
                  <img
                    src={currentProject.image}
                    alt={currentProject.title}
                    className="rounded-lg mb-6 w-full object-cover shadow-md"
                  />
                  <h3 className="text-2xl font-semibold text-gray-800 mb-3">
                    {currentProject.title}
                  </h3>
                  <p className="text-gray-700 text-lg mb-6 text-center">
                    {currentProject.description}
                  </p>
                  <div className="flex space-x-4">
                    {currentProject.githubLink && (
                      <a
                        href={currentProject.githubLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-5 rounded-full transition duration-300 shadow-md"
                      >
                        <Github className="w-5 h-5 mr-2" /> GitHub
                      </a>
                    )}
                    {currentProject.demoLink && (
                      <a
                        href={currentProject.demoLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center bg-gray-700 hover:bg-gray-800 text-white font-medium py-2 px-5 rounded-full transition duration-300 shadow-md"
                      >
                        <ExternalLink className="w-5 h-5 mr-2" /> Demo
                      </a>
                    )}
                  </div>
                </div>
              )}

              <button
                onClick={handleNextProject}
                className="absolute right-0 top-1/2 -translate-y-1/2 bg-gray-800 text-white p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
                aria-label="Next Project"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
            {/* End Project Display Container */}
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" ref={contactRef} className="py-20 px-4 bg-gray-100 flex items-center justify-center">
          <div className="container mx-auto max-w-3xl text-center">
            <h2 className="text-4xl font-bold text-gray-800 mb-12 pb-2 border-b-4 border-gray-400 inline-block">Get In Touch</h2>
            <p className="text-lg text-gray-700 mb-8 leading-relaxed">
              Have a project in mind, a question, or just want to say hello? Feel free to reach out!
              I'm always open to new opportunities and collaborations.
            </p>

            {/* Simple Contact Form - Placeholder, ideally use a backend service */}
            <form className="bg-gray-100 p-8 rounded-2xl shadow-xl space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="name" className="block text-left text-gray-700 text-sm font-semibold mb-2">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Your Name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent transition duration-200"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-left text-gray-700 text-sm font-semibold mb-2">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="your.email@example.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent transition duration-200"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-left text-gray-700 text-sm font-semibold mb-2">Message</label>
                <textarea
                  id="message"
                  name="message"
                  rows="6"
                  placeholder="Your message..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent transition duration-200 resize-y"
                  value={formData.message}
                  onChange={handleChange}
                  required
                ></textarea>
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gray-700 hover:bg-gray-800 text-white font-bold py-3 px-6 rounded-full shadow-lg transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-500 flex items-center justify-center"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending...
                  </>
                ) : (
                  'Send Message'
                )}
              </button>
              {submitMessage && (
                <p className={`mt-4 text-center ${isSuccess ? 'text-green-600' : 'text-red-600'}`}>
                  {submitMessage}
                </p>
              )}
            </form>

            <div className="mt-10">
              <p className="text-xl font-semibold text-gray-800 mb-4">Or find me on:</p>
              <div className="flex justify-center space-x-6">
                <a
                  href="https://github.com/Inkmate"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-500 hover:text-gray-700 transition duration-300 transform hover:scale-110"
                >
                  <Github className="w-8 h-8" />
                </a>
                <a
                  href="https://linkedin.com/in/yourprofile"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-500 hover:text-gray-700 transition duration-300 transform hover:scale-110"
                >
                  <Instagram className="w-8 h-8" />
                </a>
                <a
                  href="https://www.facebook.com/fred.Senolam.19"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-500 hover:text-gray-700 transition duration-300 transform hover:scale-110"
                >
                  <Facebook className="w-8 h-8" />
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 px-4 text-center">
        <div className="container mx-auto">
          <p className="text-lg mb-4">
            Designed and Developed by [Winefred D Malones]
          </p>
          <p className="text-sm">
            &copy; {new Date().getFullYear()} All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

// Navigation Item Component
const NavItem = ({ icon: Icon, label, sectionId, active, onClick }) => (
  <button
    onClick={() => onClick(sectionId)}
    className={`flex items-center px-3 py-2 rounded-lg text-lg font-medium transition duration-300 ease-in-out
      ${active ? 'bg-gray-700 text-white' : 'text-gray-300 hover:text-white hover:bg-gray-800'}`}
  >
    <Icon className="w-5 h-5 mr-2" />
    {label}
  </button>
);

export default App;

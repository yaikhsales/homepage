import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, FileText } from "lucide-react";
import ImageViewer from "./ImageViewer";
import DocumentViewer from "./DocumentViewer";

const AboutUs = ({ onClose }) => {
  const navigate = useNavigate();
  const [selectedCertificate, setSelectedCertificate] = useState(null);
  const [selectedDocument, setSelectedDocument] = useState(null);

  const aboutUsContent = [
    {
      language: "ខ្មែរ",
      text: "Yaikh គឺជាវេទិកាដំណោះស្រាយសម្រាប់ការផលិតដែលត្រូវបានរចនាជាពិសេសសម្រាប់ការផលិតសម្លៀកបំពាក់ ស្បែកជើង កាបូប និងផលិតផល ក្រណាត់ស្រាលទន់ៗ ផ្សេងៗ។ ជាកម្មសិទ្ធិរបស់ TexLink Technologies ដែលបានចុះបញ្ជីនៅកម្ពុជា វេទិកានេះដំណើរការលើប្រព័ន្ធ Windows, iOS, និង Android។",
    },
    {
      language: "English",
      text: "Yaikh is a manufacturing solution platform specially designed for garment, footwear, bags, and softgoods manufacturing. Owned by TexLink Technologies registered in Cambodia, the platform operates on Windows, iOS, and Android platforms.",
    },
    {
      language: "中文",
      text: "Yaikh 是一个专门为服装、鞋类、箱包和软质品制造业设计的生产解决方案平台。该平台归属在柬埔寨注册的 TexLink Technologies 公司所有，并支持 Windows、iOS和Android 操作系统",
    },
  ];

  const teamMembers = [
    {
      name: "Arnold",
      title: "Team Member",
      contact: "",
      email: "",
      image: "/assets/about-us/teams/Mr-Arnold.png",
      skills: [],
      projects: [],
    },
    {
      name: "Gamini K",
      title: "Manager YAI",
      contact: "+855 92 973 194",
      email: "gamini@yalkh.com",
      image: "/assets/about-us/teams/gamini.png",
      skills: [],
      projects: [],
    },
    {
      name: "Peang Sereysothirich",
      title: "Full-Stack Developer & DevOps Engineer",
      contact: "+855 10 460 407",
      email: "sothirich.p@yorkmars.com",
      image: "/assets/about-us/teams/rich.png",
      skills: [
        "Laravel",
        "PHP",
        "NodeJS",
        "MongoDB",
        "Java & JavaFX",
        "Discord Bot",
        "Flutter",
        "React Native",
        "Huawei Cloud",
        "AWS",
        "Cyber Security",
        "Splunk BOTS",
        "AI",
        "Telegram Bot",
        "Sketch 3D",
        "DevOps",
        "RESTful API",
        "GraphQL",
        "Machine Learning",
      ],
      projects: [
        "Jan 2025 - Present: Project Manager & Full-Stack Developer on Myelin Technologies (UK)",
        "May 2024 - Present: Full-Stack Developer & DevOps Engineer on YalKH",
        "May 2024 - Present: Full-Stack Developer on G ACC",
        "Nov 2024 - Mar 2025: Full-Stack Developer on COC2025",
        "Feb - Mar 2024: Full-Stack Developer Freelance on Boxify",
        "Jan - Mar 2024: Telegram Bot & API Developer on RetroCompConnect Ecosystem",
        "Oct - Nov 2023: Assembly & Coding on Mini Wheel Robot",
        "Feb - Jun 2023: Project manager & QA Tester on Kasek Digital",
        "May 2022: Project manager on Coffee Shop Management System",
        "Aug - Nov 2022: Mobile App Developer on Derham",
        "Jan 2022: Risk Handler on Student Management System",
      ],
    },
    {
      name: "Van Virot",
      title: "Full-stack developer",
      contact: "+855 71 651 6791",
      email: "bongloyfo@gmail.com",
      image: "/assets/about-us/teams/virot.jpg",
      skills: [
        "Laravel",
        "PHP",
        "Java",
        "Javascript and Jquery",
        "PostgreSQL",
        "MySQL",
        "MongoDB",
        "Firmware Development",
        "Communication",
        "Problem-solving",
        "Teamwork",
        "Quick learner",
      ],
      projects: [
        "Stock management system",
        "Hospital management system",
        "SmartPage Builder",
        "Official website",
      ],
    },
    {
      name: "Samnang Keo",
      title: "Lead Mobile Developer",
      contact: "+855 96 798 9019",
      email: "samnangkeo.lo.23@gmail.com",
      image: "/assets/about-us/teams/samnang.png",
      skills: [
        "Flutter & Dart",
        "Firebase",
        "RESTful APIs",
        "Git",
        "Github/GitLab",
        "Android & iOS app deployment",
      ],
      projects: [
        "Yal App (Yorkmars Cambodia)",
        "Anakut Digital (Anakut Digital)",
      ],
    },

    {
      name: "Dilan Lakmal",
      title: "Lead Data Engineer",
      contact: "+855 75 891 3639",
      email: "dilan@yorkmars.com",
      image: "/assets/about-us/teams/dilan.jpg",
      skills: [
        "Full-Stack Web Developer",
        "Data Engineer",
        "Power BI Specialist",
      ],
      projects: [
        "YQMS (Start in 2024.12.1 to continue) - Include 20+ sub systems",
        "YQMS Visualization (Phase 2 of YQMS)",
        "YQMS AI (Phase 3 of YQMS)",
        "Power BI Data Analysis and other Data Analysis works (2022.8.6-2024.11.30) - Includes all of YM, YY, CA",
      ],
    },
    {
      name: "Samipath Yasomi",
      title: "Data Analytics",
      contact: "+855 75 201 2316",
      email: "payasomi@gmail.com",
      image: "/assets/about-us/teams/yasomi.png",
      skills: [
        "HTML",
        "Python",
        "C++/C#",
        "JavaScript",
        "VS Code",
        "React",
        "Hard Working",
        "Team Managing",
        "Sinhala",
      ],
      projects: [],
    },
    {
      name: "Pich Daly",
      title: "Digital Development Supervisor",
      contact: "+855 78 255 700",
      email: "dalypich100@gmail.com",
      image: "/assets/about-us/teams/daly.png",
      skills: [
        "Computer",
        "Organized",
        "Communication",
        "Teamwork",
        "Meeting deadlines",
        "Critical thinking",
      ],
      projects: [],
    },
    {
      name: "Chhang Mengchhay",
      title: "Mobile Developer",
      contact: "+855 85 807492",
      email: "chhayhighlay1232@gmail.com",
      image: "/assets/about-us/teams/chhay.png",
      skills: [
        "Flutter",
        "API-LARAVEL",
        "DB management",
        "AWS",
        "JAVA",
        "Chinese Calligraphy",
        "Chinese Painting",
      ],
      projects: [],
    },
    {
      name: "Chhim Seangleng",
      title: "Web Developer",
      contact: "+855 98 594 600",
      email: "chhimseangleng123@gmail.com",
      image: "/assets/about-us/teams/seangleng.jpg",
      skills: [
        "HTML",
        "CSS",
        "Bootstrap",
        "JavaScript",
        "Java",
        "SQL Server & Project",
        "Communication",
        "Problem Solving",
        "Comprehension",
        "Decision Making",
      ],
      projects: [],
    },

    {
      name: "Koem Chichhong",
      title: "Software Engineering",
      contact: "+855 61 361 239",
      email: "chichhorng.koem@student.cadt.edu.kh",
      image: "/assets/about-us/teams/chhorng.jpg",
      skills: [
        "Flutter",
        "HTML",
        "CSS",
        "JavaScript",
        "MySQL & Database Management",
        "C/C++",
        "Deployment with DigitalOcean",
      ],
      projects: [],
    },

    {
      name: "Yeom Chetra",
      title: "Team Member",
      contact: "",
      email: "",
      image: "/assets/about-us/teams/Yeom-Chetra.jpeg",
      skills: [],
      projects: [],
    },

    {
      name: "Sobon Menghorng",
      title: "Team Member",
      contact: "",
      email: "",
      image: "/assets/about-us/teams/Sobon-Menghorng.jpg",
      skills: [],
      projects: [],
    },
    {
      name: "Sin Khun",
      title: "Team Member",
      contact: "",
      email: "",
      image: "/assets/about-us/teams/Sin-Khun.jpeg",
      skills: [],
      projects: [],
    },
    {
      name: "Proeurng Sokhim",
      title: "Team Member",
      contact: "",
      email: "",
      image: "/assets/about-us/teams/Proeurng-Sokhim.png",
      skills: [],
      projects: [],
    },

    {
      name: "Voun Thida",
      title: "Team Member",
      contact: "",
      email: "",
      image: "/assets/about-us/teams/Voun-Thida.png",
      skills: [],
      projects: [],
    },
    {
      name: "Dot Sreynoch",
      title: "Team Member",
      contact: "",
      email: "",
      image: "/assets/about-us/teams/Dot-Sreynoch.jpeg",
      skills: [],
      projects: [],
    },
    {
      name: "Ton Noeun",
      title: "Team Member",
      contact: "",
      email: "",
      image: "/assets/about-us/teams/Ton-Noeun.jpeg",
      skills: [],
      projects: [],
    },
    {
      name: "Young Sengheang",
      title: "Team Member",
      contact: "",
      email: "",
      image: "/assets/about-us/teams/Young-Sengheang.jpeg",
      skills: [],
      projects: [],
    },
    {
      name: "Van Phanith",
      title: "Team Member",
      contact: "",
      email: "",
      image: "/assets/about-us/teams/Van-Phanith.jpeg",
      skills: [],
      projects: [],
    },
    {
      name: "Koem Phanny",
      title: "Team Member",
      contact: "",
      email: "",
      image: "/assets/about-us/teams/Koem-Phanny.jpeg",
      skills: [],
      projects: [],
    },
  ];

  const certificates = [
    { name: "MOC", image: "/assets/about-us/certificates/moc.png" },
    {
      name: "ICT Certificate",
      image: "/assets/about-us/certificates/ict-certificate.jpg",
    },

    { name: "TAFTAC", image: "/assets/about-us/certificates/taftac.png" },
    { name: "QIP CDC", image: "/assets/about-us/certificates/qip-cdc.png" },
  ];

  const technologies = [
    {
      name: "Laravel",
      logo: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/laravel.svg",
    },
    {
      name: "MongoDB",
      logo: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/mongodb.svg",
    },
    {
      name: "React",
      logo: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/react.svg",
    },
    {
      name: "Node.js",
      logo: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/nodedotjs.svg",
    },
    {
      name: "Express",
      logo: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/express.svg",
    },

    {
      name: "Gemini",
      logo: "https://cdn.simpleicons.org/googlegemini?v=1",
    },
    {
      name: "DeepSeek",
      logo: "assets/about-us/deepseek.png?v=1",
    },
    { name: "Claude", logo: "https://cdn.simpleicons.org/claude" },
    {
      name: "Nvidia",
      logo: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/nvidia.svg",
    },
    {
      name: "AMD",
      logo: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/amd.svg",
    },
    {
      name: "GitHub",
      logo: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/github.svg",
    },
  ];
  return (
    <div className="fixed inset-0 z-[300] bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col animate-in fade-in duration-300 overflow-hidden">
      {/* Header with Back Button and Home Button */}
      <div className="bg-white shadow-md px-3 sm:px-6 py-2 sm:py-3 flex items-center justify-between flex-shrink-0 relative">
        {/* Left: Empty space for balance */}
        <div className="flex-1"></div>

        {/* Center: Back Button and Home Button */}
        <div className="flex items-center gap-2 sm:gap-3 justify-center flex-1">
          <button
            onClick={onClose}
            className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-1 sm:py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors text-sm sm:text-base"
            aria-label="Back"
          >
            <ArrowLeft size={16} className="sm:w-5 sm:h-5" />
            <span className="font-medium hidden sm:inline">Back</span>
          </button>
          <button
            onClick={() => navigate("/")}
            className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full overflow-hidden border-2 border-gray-300 hover:border-gray-400 transition-all hover:scale-110 cursor-pointer flex-shrink-0"
            title="Home"
          >
            <img
              src="/logo.jpg"
              alt="Home"
              className="w-full h-full object-cover"
            />
          </button>
        </div>

        {/* Right: Empty space for balance */}
        <div className="flex-1"></div>
      </div>

      {/* Main Content Area - No Scroll, Everything in One Screen */}
      <div className="flex-1 overflow-hidden p-2 sm:p-3 md:p-4">
        <div className="h-full max-w-[100vw] mx-auto">
          {/* Desktop Layout: 3 columns */}
          <div className="hidden lg:grid grid-cols-12 gap-2 sm:gap-3 md:gap-4 h-full">
            {/* Left Side - Logo, Text, and Certificates */}
            <div className="col-span-3 flex flex-col h-full">
              {/* Logo and Text */}
              <div className="mb-2 flex-shrink-0">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 flex-shrink-0 flex items-center justify-center bg-white border border-gray-200 rounded">
                    <img
                      src="/logo.jpg"
                      alt="Yai Logo"
                      className="w-full h-full object-contain rounded"
                    />
                  </div>
                  <div className="text-xs sm:text-sm md:text-base lg:text-lg font-bold text-gray-800">
                    <p
                      className="mb-0"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      YaiKh
                    </p>
                    <p
                      className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-2xl"
                      style={{
                        fontFamily: "'Khmer OS Battambang', sans-serif",
                      }}
                    >
                      តិចលីង តិចណូឡូជី ឯ.ក
                    </p>
                    <p
                      className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-xl"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      TexLink Technologies Co., Ltd.
                    </p>
                  </div>
                </div>
              </div>

              {/* Certificates */}
              <div className="flex-1 space-y-0.5 sm:space-y-1 overflow-hidden flex flex-col justify-center">
                {certificates.map((cert, index) => (
                  <div
                    key={index}
                    className="cursor-pointer hover:opacity-80 transition-opacity flex-shrink"
                    onClick={() => {
                      if (cert.image.endsWith(".pdf")) {
                        setSelectedDocument(cert.image);
                      } else {
                        setSelectedCertificate(cert.image);
                      }
                    }}
                  >
                    {cert.image.endsWith(".pdf") ? (
                      <div className="w-full h-24 sm:h-32 bg-gray-100 border-2 border-dashed border-gray-300 rounded flex flex-col items-center justify-center text-gray-500 hover:text-blue-600 hover:border-blue-400 transition-colors">
                        <FileText size={32} />
                        <span className="text-xs font-semibold mt-2">
                          {cert.name}
                        </span>
                      </div>
                    ) : (
                      <img
                        src={cert.image}
                        alt={cert.name}
                        className="w-full h-auto max-h-[calc(25vh-50px)] object-contain rounded"
                        onError={(e) => {
                          e.target.style.display = "none";
                        }}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Center - Flags, Description, and Technologies */}
            <div className="col-span-6 flex flex-col h-full">
              {/* Flags Section */}
              <div className="flex items-start justify-center gap-2 sm:gap-3 md:gap-4 mb-1 flex-shrink-0">
                <div
                  className="flex flex-col items-center"
                  style={{ marginTop: "4px" }}
                >
                  <img
                    // src="https://flagcdn.com/w80/hk.png"
                    src="/assets/about-us/flags/Hongkong.svg"
                    alt="Hong Kong"
                    className="h-8 sm:h-10 md:h-12 lg:h-14 w-auto"
                    style={{ width: "99%", objectFit: "contain" }}
                  />
                  <span className="text-[9px] sm:text-[10px] text-gray-600 mt-0.5">
                    Hong Kong
                  </span>
                </div>
                <div className="flex flex-col items-center">
                  <img
                    // src="https://flagcdn.com/w80/kh.png"
                    src="/assets/about-us/flags/cambodia-4k.png"
                    alt="Cambodia"
                    className="h-8 sm:h-10 md:h-12 lg:h-14 w-auto"
                    style={{ objectFit: "contain" }}
                  />
                  <span className="text-[9px] sm:text-[10px] font-semibold text-gray-700 mt-0.5">
                    Cambodia
                  </span>
                </div>
                <div
                  className="flex flex-col items-center"
                  style={{ marginTop: "4px" }}
                >
                  <img
                    // src="https://flagcdn.com/w80/sg.png"
                    src="/assets/about-us/flags/Singapore-4k.png"
                    alt="Singapore"
                    className="h-8 sm:h-10 md:h-12 lg:h-14 w-auto"
                    style={{ width: "99%", objectFit: "contain" }}
                  />
                  <span className="text-[9px] sm:text-[10px] text-gray-600 mt-0.5">
                    Singapore
                  </span>
                </div>
              </div>

              {/* Description Boxes - No Frames, Big Font */}
              <div className="space-y-1 sm:space-y-1.5 mb-1.5 flex-shrink-0 py-2">
                {aboutUsContent.map((content, index) => {
                  const isKhmer = content.language === "ខ្មែរ";
                  return (
                    <div key={index} className="text-center">
                      <h4
                        className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold text-gray-800 mb-0.5 sm:mb-1"
                        style={{
                          fontFamily: isKhmer
                            ? "'Khmer OS Battambang', sans-serif"
                            : "'Inter', sans-serif",
                        }}
                      >
                        {content.language}
                      </h4>
                      <p
                        className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl text-gray-700 leading-relaxed break-words"
                        style={{
                          fontFamily: isKhmer
                            ? "'Khmer OS Battambang', sans-serif"
                            : "'Inter', sans-serif",
                        }}
                      >
                        {content.text}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Technologies Section - No Boxes, Just Logos and Text */}
              <div className="flex-shrink-0">
                <h3 className="text-xs sm:text-sm md:text-base lg:text-lg font-bold text-gray-800 mb-0.5 sm:mb-1 md:mb-1.5 text-center">
                  Technologies
                </h3>
                <div className="grid grid-cols-4 gap-0.5 sm:gap-1 md:gap-2">
                  {technologies.map((tech, index) => (
                    <div
                      key={index}
                      className="flex flex-col items-center justify-center"
                    >
                      <div className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 xl:w-9 xl:h-9 mb-0.5 flex items-center justify-center">
                        <img
                          src={tech.logo}
                          alt={tech.name}
                          className="w-full h-full object-contain"
                          style={{
                            filter:
                              tech.name === "Claude" || tech.name === "Gemini"
                                ? "none"
                                : "brightness(0) saturate(100%) invert(27%) sepia(51%) saturate(2878%) hue-rotate(222deg) brightness(104%) contrast(97%)",
                          }}
                          onError={(e) => {
                            e.target.style.filter = "none";
                            e.target.src = `https://via.placeholder.com/48x48/4F46E5/FFFFFF?text=${tech.name.charAt(0)}`;
                          }}
                        />
                      </div>
                      <span className="text-[9px] sm:text-[10px] md:text-xs lg:text-sm font-semibold text-gray-700 text-center">
                        {tech.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Side - Team Members - 5 per row, no frames */}
            <div className="col-span-3 flex flex-col h-full">
              <h3 className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl font-bold text-gray-800 mb-1 sm:mb-2 md:mb-3 text-center flex-shrink-0">
                Team Members
              </h3>
              <div className="flex-1 overflow-hidden">
                <div className="grid grid-cols-5 gap-1 sm:gap-2 md:gap-3 h-full content-start">
                  {teamMembers.map((member, index) => (
                    <div key={index} className="flex flex-col items-center">
                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 rounded-full object-cover mb-0.5 sm:mb-1"
                        onError={(e) => {
                          e.target.src =
                            "https://via.placeholder.com/64x64?text=" +
                            member.name.charAt(0);
                        }}
                      />
                      <p className="text-[8px] sm:text-[10px] md:text-xs font-medium text-gray-800 text-center leading-tight">
                        {member.name}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Tablet/Mobile Layout: Stacked */}
          <div className="lg:hidden grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-3 h-full overflow-y-auto">
            {/* Mobile: Single Column, Tablet: 2 Columns */}

            {/* Left Section - Logo and Certificates */}
            <div className="flex flex-col space-y-2 sm:space-y-3">
              {/* Logo and Text */}
              <div className="flex-shrink-0">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 flex-shrink-0 flex items-center justify-center bg-white border border-gray-200 rounded">
                    <img
                      src="/logo.jpg"
                      alt="Yai Logo"
                      className="w-full h-full object-contain rounded"
                    />
                  </div>
                  <div className="text-sm sm:text-base md:text-lg font-bold text-gray-800">
                    <p
                      className="mb-0"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      YaiKh
                    </p>
                    <p
                      className="text-sm sm:text-base md:text-lg lg:text-xl"
                      style={{
                        fontFamily: "'Khmer OS Battambang', sans-serif",
                      }}
                    >
                      តិចលីង តិចណូឡូជី ឯ.ក
                    </p>
                    <p
                      className="text-base sm:text-lg md:text-xl lg:text-xl"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      TexLink Technologies Co., Ltd.
                    </p>
                  </div>
                </div>
              </div>

              {/* Certificates */}
              <div className="space-y-2">
                {certificates.map((cert, index) => (
                  <div
                    key={index}
                    className="cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={() => {
                      if (cert.image.endsWith(".pdf")) {
                        setSelectedDocument(cert.image);
                      } else {
                        setSelectedCertificate(cert.image);
                      }
                    }}
                  >
                    {cert.image.endsWith(".pdf") ? (
                      <div className="w-full h-24 sm:h-32 bg-gray-100 border-2 border-dashed border-gray-300 rounded flex flex-col items-center justify-center text-gray-500 hover:text-blue-600 hover:border-blue-400 transition-colors">
                        <FileText size={32} />
                        <span className="text-xs font-semibold mt-2">
                          {cert.name}
                        </span>
                      </div>
                    ) : (
                      <img
                        src={cert.image}
                        alt={cert.name}
                        className="w-full h-auto max-h-32 sm:max-h-40 object-contain rounded"
                        onError={(e) => {
                          e.target.style.display = "none";
                        }}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Center Section - Flags, Description, Technologies */}
            <div className="flex flex-col space-y-2 sm:space-y-3">
              {/* Flags */}
              <div className="flex items-start justify-center gap-2 sm:gap-3 md:gap-4">
                <div
                  className="flex flex-col items-center"
                  style={{ marginTop: "4px" }}
                >
                  <img
                    src="https://flagcdn.com/w80/hk.png"
                    alt="Hong Kong"
                    className="h-12 sm:h-14 md:h-16 w-auto"
                    style={{ width: "99%", objectFit: "contain" }}
                  />
                  <span className="text-xs text-gray-600 mt-0.5">
                    Hong Kong
                  </span>
                </div>
                <div className="flex flex-col items-center">
                  <img
                    src="https://flagcdn.com/w80/kh.png"
                    alt="Cambodia"
                    className="h-12 sm:h-14 md:h-16 w-auto"
                    style={{ objectFit: "contain" }}
                  />
                  <span className="text-xs font-semibold text-gray-700 mt-0.5">
                    Cambodia
                  </span>
                </div>
                <div
                  className="flex flex-col items-center"
                  style={{ marginTop: "4px" }}
                >
                  <img
                    src="https://flagcdn.com/w80/sg.png"
                    alt="Singapore"
                    className="h-12 sm:h-14 md:h-16 w-auto"
                    style={{ width: "99%", objectFit: "contain" }}
                  />
                  <span className="text-xs text-gray-600 mt-0.5">
                    Singapore
                  </span>
                </div>
              </div>

              {/* Description Boxes */}
              <div className="space-y-2">
                {aboutUsContent.map((content, index) => {
                  const isKhmer = content.language === "ខ្មែរ";
                  return (
                    <div key={index} className="text-center">
                      <h4
                        className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-1"
                        style={{
                          fontFamily: isKhmer
                            ? "'Khmer OS Battambang', sans-serif"
                            : "'Inter', sans-serif",
                        }}
                      >
                        {content.language}
                      </h4>
                      <p
                        className="text-base sm:text-lg md:text-xl text-gray-700 leading-relaxed break-words"
                        style={{
                          fontFamily: isKhmer
                            ? "'Khmer OS Battambang', sans-serif"
                            : "'Inter', sans-serif",
                        }}
                      >
                        {content.text}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Technologies */}
              <div>
                <h3 className="text-sm sm:text-base md:text-lg font-bold text-gray-800 mb-1.5 text-center">
                  Technologies
                </h3>
                <div className="grid grid-cols-4 gap-1 sm:gap-2">
                  {technologies.map((tech, index) => (
                    <div
                      key={index}
                      className="flex flex-col items-center justify-center"
                    >
                      <div className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 lg:w-9 lg:h-9 xl:w-10 xl:h-10 mb-0.5 flex items-center justify-center">
                        <img
                          src={tech.logo}
                          alt={tech.name}
                          className="w-full h-full object-contain"
                          style={{
                            filter:
                              tech.name === "Claude" || tech.name === "Gemini"
                                ? "none"
                                : "brightness(0) saturate(100%) invert(27%) sepia(51%) saturate(2878%) hue-rotate(222deg) brightness(104%) contrast(97%)",
                          }}
                          onError={(e) => {
                            e.target.style.filter = "none";
                            e.target.src = `https://via.placeholder.com/48x48/4F46E5/FFFFFF?text=${tech.name.charAt(0)}`;
                          }}
                        />
                      </div>
                      <span className="text-[10px] sm:text-xs md:text-sm font-semibold text-gray-700 text-center">
                        {tech.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Team Members - Mobile/Tablet */}
              <div>
                <h3 className="text-sm sm:text-base md:text-lg font-bold text-gray-800 mb-2 text-center">
                  Team Members
                </h3>
                <div className="grid grid-cols-5 gap-2">
                  {teamMembers.map((member, index) => (
                    <div key={index} className="flex flex-col items-center">
                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full object-cover mb-1"
                        onError={(e) => {
                          e.target.src =
                            "https://via.placeholder.com/64x64?text=" +
                            member.name.charAt(0);
                        }}
                      />
                      <p className="text-[10px] sm:text-xs font-medium text-gray-800 text-center leading-tight">
                        {member.name}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Certificate Image Viewer Modal */}
      {selectedCertificate && (
        <ImageViewer
          imagePath={selectedCertificate}
          onClose={() => setSelectedCertificate(null)}
        />
      )}
      {/* Certificate PDF Viewer Modal */}
      {selectedDocument && (
        <DocumentViewer
          documentPath={selectedDocument}
          onClose={() => setSelectedDocument(null)}
        />
      )}
    </div>
  );
};

export default AboutUs;

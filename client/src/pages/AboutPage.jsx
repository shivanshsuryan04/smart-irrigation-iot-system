import React from "react";
import {
  Activity,
  Users,
  Award,
  Cpu,
  Github,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Target,
  Lightbulb,
  Zap,
  Droplets,
  Leaf,
  Shield,
  Globe,
} from "lucide-react";
import Layout from "../components/Layout";

const AboutPage = () => {
  // Team members data
  const teamMembers = [
    {
      name: "Krish Mutreja",
      id: "03511502822",
      role: "Project Lead & IoT Developer",
      avatar: "👨‍💻",
      skills: ["NodeMCU", "Arduino", "IoT", "React"],
      contribution: "System architecture and hardware integration",
    },
    {
      name: "Manav Manhas",
      id: "05011502822",
      role: "Frontend Developer",
      avatar: "👨‍🎨",
      skills: ["React", "JavaScript", "UI/UX", "Tailwind"],
      contribution: "User interface and dashboard development",
    },
    {
      name: "Shivansh Suryan",
      id: "00611502822",
      role: "Backend Developer",
      avatar: "👨‍💼",
      skills: ["Node.js", "APIs", "Database", "ThingSpeak"],
      contribution: "Data management and API integration",
    },
    {
      name: "Naman Sachdeva",
      id: "0161502822",
      role: "Hardware Specialist",
      avatar: "👨‍🔧",
      skills: ["Electronics", "Sensors", "Circuits", "Testing"],
      contribution: "Sensor calibration and hardware optimization",
    },
  ];

  // Hardware components
  const hardwareComponents = [
    {
      name: "NodeMCU ESP8266",
      description: "Main microcontroller with WiFi capability",
      icon: Cpu,
      specs: "32-bit, 80MHz, 4MB Flash",
    },
    {
      name: "DHT11 Sensor",
      description: "Temperature and humidity monitoring",
      icon: Activity,
      specs: "±2°C accuracy, 20-80% RH",
    },
    {
      name: "Capacitive Soil Moisture Sensor",
      description: "Corrosion-resistant soil moisture detection",
      icon: Droplets,
      specs: "Analog output, 3.3-5V operation",
    },
    {
      name: "DC Submersible Water Pump",
      description: "Automated irrigation water delivery",
      icon: Zap,
      specs: "3-6V, 120L/hr flow rate",
    },
    {
      name: "2-Channel Relay Module",
      description: "Pump and valve control switching",
      icon: Shield,
      specs: "5V, 10A switching capacity",
    },
    {
      name: "16x2 I2C LCD Display",
      description: "Local system status display",
      icon: Globe,
      specs: "Blue backlight, I2C interface",
    },
  ];

  // Project features
  const features = [
    {
      icon: Lightbulb,
      title: "Smart Automation",
      description:
        "Intelligent irrigation based on real-time soil moisture and environmental conditions",
    },
    {
      icon: Globe,
      title: "Remote Monitoring",
      description:
        "Access system data and controls from anywhere via web dashboard",
    },
    {
      icon: Droplets,
      title: "Water Conservation",
      description:
        "Optimize water usage with precise timing and threshold-based irrigation",
    },
    {
      icon: Activity,
      title: "Real-time Analytics",
      description:
        "Live sensor data visualization and historical trend analysis",
    },
    {
      icon: Shield,
      title: "Reliable Operation",
      description:
        "Robust hardware design with fail-safe mechanisms and error handling",
    },
    {
      icon: Zap,
      title: "Energy Efficient",
      description:
        "Low-power design with smart scheduling to minimize energy consumption",
    },
  ];

  // Project timeline
  const timeline = [
    { phase: "Research & Planning", duration: "2 weeks", status: "completed" },
    { phase: "Hardware Assembly", duration: "3 weeks", status: "completed" },
    { phase: "Software Development", duration: "4 weeks", status: "completed" },
    {
      phase: "Testing & Calibration",
      duration: "2 weeks",
      status: "completed",
    },
    { phase: "Web Dashboard", duration: "3 weeks", status: "completed" },
    { phase: "Documentation", duration: "1 week", status: "in-progress" },
  ];

  const TeamMemberCard = ({ member }) => (
    <div className="bg-white/70 backdrop-blur-md rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-white/20">
      <div className="text-center mb-4">
        <div className="text-4xl mb-3">{member.avatar}</div>
        <h3 className="text-xl font-bold text-gray-900">{member.name}</h3>
        <p className="text-sm text-gray-600 font-medium">{member.id}</p>
        <p className="text-blue-600 font-medium mt-1">{member.role}</p>
      </div>

      <div className="mb-4">
        <h4 className="text-sm font-semibold text-gray-700 mb-2">Skills</h4>
        <div className="flex flex-wrap gap-2">
          {member.skills.map((skill, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-sm font-semibold text-gray-700 mb-1">
          Contribution
        </h4>
        <p className="text-sm text-gray-600">{member.contribution}</p>
      </div>
    </div>
  );

  const HardwareCard = ({ component }) => (
    <div className="bg-white/70 backdrop-blur-md rounded-xl p-4 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300">
      <div className="flex items-start space-x-3">
        <div className="p-2 bg-gradient-to-r from-stone-600 to-amber-900 rounded-lg shadow-md">
          <component.icon className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-gray-900 text-sm">
            {component.name}
          </h4>
          <p className="text-xs text-gray-600 mb-2">{component.description}</p>
          <p className="text-xs text-blue-600 font-medium">{component.specs}</p>
        </div>
      </div>
    </div>
  );

  const FeatureCard = ({ feature }) => (
    <div className="bg-white/70 backdrop-blur-md rounded-xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300">
      <div className="flex items-center mb-3">
        <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg mr-3">
          <feature.icon className="w-5 h-5 text-white" />
        </div>
        <h3 className="font-semibold text-gray-900">{feature.title}</h3>
      </div>
      <p className="text-sm text-gray-600">{feature.description}</p>
    </div>
  );

  return (
    <Layout>
      <div className="space-y-8">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center mb-4">
              <Leaf className="w-8 h-8 mr-3" />
              <h1 className="text-3xl font-bold">Smart Irrigation System</h1>
            </div>
            <p className="text-blue-100 mb-6 text-lg leading-relaxed">
              An IoT-powered agricultural solution that revolutionizes
              traditional farming through intelligent automation, real-time
              monitoring, and sustainable water management practices.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
                <div className="text-2xl font-bold">4</div>
                <div className="text-sm text-blue-100">Sensors</div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
                <div className="text-2xl font-bold">99.6%</div>
                <div className="text-sm text-blue-100">Uptime</div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
                <div className="text-2xl font-bold">30%</div>
                <div className="text-sm text-blue-100">Water Saved</div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
                <div className="text-2xl font-bold">24/7</div>
                <div className="text-sm text-blue-100">Monitoring</div>
              </div>
            </div>
          </div>

          {/* Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-green-900 to-emerald-900"></div>

          {/* Decorations */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -translate-y-32 translate-x-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-green-400/10 rounded-full blur-3xl translate-y-24 -translate-x-24"></div>
        </div>

        {/* Team Section */}
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              Meet Our Team
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              A dedicated team of engineers and developers working together to
              create innovative IoT solutions for modern agriculture.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {teamMembers.map((member, index) => (
              <TeamMemberCard key={index} member={member} />
            ))}
          </div>
        </div>

        {/* Mentor Section */}
        <div className="bg-white/70 backdrop-blur-md rounded-2xl p-8 shadow-lg border border-white/20">
          <div className="flex items-center justify-center mb-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-700 to-emerald-800 rounded-full flex items-center justify-center mx-auto mb-3">
                <Award className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">
                Project Mentor
              </h3>
              <p className="text-lg text-gray-700 font-semibold">
                Dr. Monica Gupta
              </p>
              <p className="text-sm text-gray-600">
                Faculty Advisor & Research Supervisor
              </p>
            </div>
          </div>

          <div className="text-center max-w-2xl mx-auto">
            <p className="text-gray-600 italic">
              "This project demonstrates excellent integration of IoT
              technologies with practical agricultural applications. The team
              has shown remarkable innovation in creating a sustainable and
              scalable solution."
            </p>
          </div>
        </div>

        {/* Project Features */}
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-3">
              Key Features
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Advanced capabilities that make our irrigation system smart,
              efficient, and user-friendly.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <FeatureCard key={index} feature={feature} />
            ))}
          </div>
        </div>

        {/* Hardware Components */}
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-amber-900 mb-3">
              Hardware Components
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Carefully selected components that ensure reliability, accuracy,
              and optimal performance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {hardwareComponents.map((component, index) => (
              <HardwareCard key={index} component={component} />
            ))}
          </div>
        </div>

        {/* Project Timeline */}
        <div className="bg-white/70 backdrop-blur-md rounded-2xl p-8 shadow-lg border border-white/20">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-3 flex items-center justify-center">
              <Calendar className="w-6 h-6 mr-2 text-blue-600" />
              Project Timeline
            </h2>
            <p className="text-gray-600">
              Development phases and milestones achieved throughout the project
              lifecycle.
            </p>
          </div>

          <div className="space-y-4">
            {timeline.map((phase, index) => (
              <div
                key={index}
                className="flex items-center space-x-4 p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-200"
              >
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-white ${
                    phase.status === "completed"
                      ? "bg-green-500"
                      : phase.status === "in-progress"
                      ? "bg-blue-500"
                      : "bg-gray-400"
                  }`}
                >
                  {index + 1}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{phase.phase}</h3>
                  <p className="text-sm text-gray-600">
                    Duration: {phase.duration}
                  </p>
                </div>
                <div
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    phase.status === "completed"
                      ? "bg-green-100 text-green-800"
                      : phase.status === "in-progress"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {phase.status === "completed"
                    ? "Completed"
                    : phase.status === "in-progress"
                    ? "In Progress"
                    : "Pending"}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Technical Specifications */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white/70 backdrop-blur-md rounded-2xl p-8 shadow-lg border border-white/20">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <Cpu className="w-6 h-6 mr-2 text-blue-600" />
              Technical Specifications
            </h3>

            <div className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold text-blue-900">
                    Microcontroller
                  </h4>
                  <p className="text-blue-700">ESP8266 32-bit</p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <h4 className="font-semibold text-green-900">Connectivity</h4>
                  <p className="text-green-700">WiFi 802.11 b/g/n</p>
                </div>
                <div className="p-3 bg-purple-50 rounded-lg">
                  <h4 className="font-semibold text-purple-900">
                    Power Supply
                  </h4>
                  <p className="text-purple-700">5V DC Adapter</p>
                </div>
                <div className="p-3 bg-amber-50 rounded-lg">
                  <h4 className="font-semibold text-amber-900">
                    Operating Range
                  </h4>
                  <p className="text-amber-700">-10°C to 50°C</p>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <h4 className="font-semibold text-gray-700 mb-2">
                  Sensor Specifications
                </h4>
                <ul className="space-y-1 text-gray-600">
                  <li>• Temperature: ±2°C accuracy</li>
                  <li>• Humidity: ±5% RH accuracy</li>
                  <li>• Soil Moisture: 0-100% range</li>
                  <li>• Response Time: 5 seconds</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-md rounded-2xl p-8 shadow-lg border border-white/20">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <Target className="w-6 h-6 mr-2 text-green-600" />
              Project Objectives
            </h3>

            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">
                    Water Conservation
                  </h4>
                  <p className="text-sm text-gray-600">
                    Reduce water wastage by up to 30% through precision
                    irrigation
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Automation</h4>
                  <p className="text-sm text-gray-600">
                    Eliminate manual irrigation scheduling and monitoring
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">
                    Remote Monitoring
                  </h4>
                  <p className="text-sm text-gray-600">
                    Enable farmers to monitor crops from anywhere, anytime
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-gradient-to-r from-stone-600 to-amber-900 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Scalability</h4>
                  <p className="text-sm text-gray-600">
                    Design a system that can be adapted for various farm sizes
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact & Social */}
        <div className="bg-white/70 backdrop-blur-md rounded-2xl p-8 shadow-lg border border-white/20">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Get In Touch
            </h2>
            <p className="text-gray-600">
              Have questions about our project? We'd love to hear from you!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="p-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-700 to-emerald-800 rounded-full flex items-center justify-center mx-auto mb-3">
                <Mail className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Email Us</h3>
              <p className="text-sm text-gray-600">
                smartirrigation@project.edu
              </p>
            </div>

            <div className="p-4">
              <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <Github className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">GitHub</h3>
              <p className="text-sm text-gray-600">
                github.com/smart-irrigation
              </p>
            </div>

            <div className="p-4">
              <div className="w-12 h-12 bg-gradient-to-r from-stone-600 to-amber-900 rounded-full flex items-center justify-center mx-auto mb-3">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Location</h3>
              <p className="text-sm text-gray-600">
                Engineering College, India
              </p>
            </div>
          </div>
        </div>

        {/* Acknowledgments */}
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-8 text-center">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            Acknowledgments
          </h3>
          <p className="text-gray-600 max-w-3xl mx-auto leading-relaxed">
            We extend our heartfelt gratitude to our mentor{" "}
            <strong>Dr. Monica Gupta</strong> for her invaluable guidance, our
            institution for providing the necessary resources, and the
            open-source community for the tools and libraries that made this
            project possible. Special thanks to ThingSpeak for their IoT
            platform and the Arduino community for their extensive documentation
            and support.
          </p>

          <div className="flex justify-center items-center mt-6 space-x-2 text-gray-500">
            <span className="text-sm">Built with</span>
            <div className="w-4 h-4 bg-red-500 rounded-full"></div>
            <span className="text-sm">by Team Smart Irrigation</span>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AboutPage;

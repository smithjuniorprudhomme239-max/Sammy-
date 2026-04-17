'use client';
import Link from 'next/link';
import { ArrowRight, Mail, Phone, MapPin } from 'lucide-react';
import Button from '@/components/ui/Button';

const MEMBERS = [
  { name: 'Alex Johnson', role: 'CEO & Founder', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop', bio: 'Tech visionary with 15+ years in enterprise solutions', expertise: ['Strategy', 'Leadership', 'Innovation'] },
  { name: 'Sarah Chen', role: 'CTO', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop', bio: 'Full-stack architect specializing in cloud infrastructure', expertise: ['Cloud', 'DevOps', 'Architecture'] },
  { name: 'Marcus Williams', role: 'Lead Designer', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop', bio: 'UX/UI expert focused on user-centric design', expertise: ['Design', 'UX/UI', 'Branding'] },
  { name: 'Emma Rodriguez', role: 'VP Product', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop', bio: 'Product strategist with proven track record in scaling', expertise: ['Product', 'Growth', 'Analytics'] },
];

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-500 to-blue-900 text-white h-[90vh] flex items-center px-4 relative overflow-hidden">
        <div className="absolute inset-0" style={{ backgroundImage: "url('https://i.postimg.cc/zXy6zYJL/futuristic-smart-city-with-5g-global-network-technology.jpg')", backgroundSize: 'cover', backgroundPosition: 'center', filter: 'blur(1px) brightness(0.4)', transform: 'scale(1.02)' }} />
        <div className="relative max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight text-white">
            UNIDEV ENTERPRISE
          </h1>
          <p className="text-lg text-gray-200 mb-8 max-w-2xl mx-auto">
  Lorem ipsum dolor sit amet consectetur adipisicing elit. Similique fugiat deserunt quas. Sint ipsa harum quam saepe nisi.          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/products">
              <Button size="lg" className="w-full sm:w-auto">
                Login <ArrowRight size={18} />
              </Button>
            </Link>
            <Link href="#about">
              <Button size="lg" variant="outline" className="w-full sm:w-auto border-white text-white hover:bg-white/10">
                read more
              </Button>
            </Link>
          </div>
        </div>
        {/* Help Desk Button */}
        <div className="absolute right-6 bottom-6 z-10">
          <button className="bg-green-500 hover:bg-green-600 w-24 h-24 rounded-full flex flex-col items-center justify-center shadow-lg transition-all duration-300 hover:scale-110 border-2 border-green-700">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white mb-1">
              <path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3"/>
              <path d="M17 14h3a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2h-3"/>
              <path d="M12 19v-8a3 3 0 0 0-3-3H5a3 3 0 0 0-3 3v8"/>
              <path d="M12 19v-8a3 3 0 0 1 3-3h4a3 3 0 0 1 3 3v8"/>
            </svg>
            <span className="text-white text-xs font-bold">HELP DESK</span>
          </button>
        </div>
      </section>

      {/* About */}
      <section id="about" className="py-20 h-screen max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-8 md:gap-16">
          <div className="p-4 md:p-8">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">About UNIDEV</h2>
            <p className="text-lg text-gray-600 mb-6">
              UNIDEV is a leading technology company dedicated to providing innovative solutions for businesses and individuals. With a team of experts in various fields, we strive to deliver cutting-edge products and services that meet the evolving needs of our clients.
            </p>
            <p className="text-lg text-gray-600 mb-8">
              Our mission is to empower organizations through technology, helping them achieve their goals and stay ahead in today's competitive landscape. We believe in the power of innovation and collaboration to drive positive change.
            </p>
            <Link href="#about">
              <Button size="lg" variant="outline">Learn More <ArrowRight size={18} /></Button>
            </Link>
          </div>
          <div className="space-y-6">
            <h3 className="text-3xl font-bold text-gray-900 mb-6 text-center">Our Projects</h3>
            <div className="space-y-4">
              {[
                {
                  title: 'Smart City Infrastructure',
                  description: 'Revolutionary 5G-enabled smart city solutions for urban development and IoT integration.',
                  status: 'In Progress',
                  tech: ['React', 'Node.js', 'IoT']
                },
                {
                  title: 'AI-Powered Analytics',
                  description: 'Machine learning platform for business intelligence and predictive analytics.',
                  status: 'Completed',
                  tech: ['Python', 'TensorFlow', 'AWS']
                },
                {
                  title: 'Cloud Migration Services',
                  description: 'Enterprise-grade cloud migration and modernization solutions.',
                  status: 'Completed',
                  tech: ['AWS', 'Docker', 'Kubernetes']
                }
              ].map((project, index) => (
                <div key={index} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="text-lg font-semibold text-gray-900">{project.title}</h4>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      project.status === 'Completed'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {project.status}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-4">{project.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {project.tech.map((tech) => (
                      <span key={tech} className="px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-xs font-medium">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Members */}
      <section id="members" className="py-20 bg-white px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Leadership Team</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">Experienced professionals driving innovation and excellence at UNIDEV ENTERPRISE</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {MEMBERS.map(({ name, role, image, bio, expertise }) => (
              <div key={name} className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300">
                <div className="relative h-80 overflow-hidden bg-gray-200">
                  <img src={image} alt={name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                </div>
                <div className="px-6 py-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-1">{name}</h3>
                  <p className="text-sm font-semibold text-blue-600 mb-3">{role}</p>
                  <p className="text-sm text-gray-600 mb-4">{bio}</p>
                  <div className="flex flex-wrap gap-2">
                    {expertise.map((skill) => (
                      <span key={skill} className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="py-20 bg-gradient-to-br from-gray-50 to-gray-100 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5"></div>
        <div className="relative max-w-7xl mx-auto w-full">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">Get in Touch</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">Have questions or want to work with us? Reach out and we'll get back to you as soon as possible.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 md:gap-16">
            <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-2xl font-semibold text-gray-900 mb-6">Contact Information</h3>
              <div className="space-y-6">
                {[
                  { icon: Mail, label: 'Email', value: 'contact@unidev.com' },
                  { icon: Phone, label: 'Phone', value: '+1 (555) 123-4567' },
                  { icon: MapPin, label: 'Address', value: '123 Innovation Drive, Tech City, CA 90210' },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
                      <Icon className="text-blue-600" size={24} />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{label}</p>
                      <p className="text-base text-gray-600">{value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-2xl font-semibold text-gray-900 mb-6">Send us a Message</h3>
              <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                <input type="text" placeholder="Your Name" className="w-full border border-gray-200 rounded-lg px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500" />
                <input type="email" placeholder="Your Email" className="w-full border border-gray-200 rounded-lg px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500" />
                <textarea rows={5} placeholder="Your Message" className="w-full border border-gray-200 rounded-lg px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white">Send Message</Button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
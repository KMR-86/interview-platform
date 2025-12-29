import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Users, Calendar, Award, Star, ArrowRight } from 'lucide-react'; // Ensure you have lucide-react or use text icons

const Home = () => {
  const navigate = useNavigate();

  // Handle flow differentiation
  const handleSignUp = (role) => {
    // 1. Save Intent
    localStorage.setItem('role_preference', role);
    // 2. Navigate to Login (which triggers the Google Flow)
    navigate('/login');
  };

  return (
    <div className="bg-white font-sans text-slate-800">
      
      {/* --- NAVBAR --- */}
      <nav className="fixed w-full bg-white/90 backdrop-blur-md z-50 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">M</div>
                <span className="text-xl font-bold tracking-tight text-slate-900">MockMaster</span>
            </div>
            <div className="hidden md:flex space-x-8">
              <a href="#how-it-works" className="text-slate-600 hover:text-blue-600 transition">How it Works</a>
              <a href="#mentors" className="text-slate-600 hover:text-blue-600 transition">Mentors</a>
              <a href="#testimonials" className="text-slate-600 hover:text-blue-600 transition">Stories</a>
            </div>
            <div className="flex space-x-4">
              <button 
                onClick={() => navigate('/login')} 
                className="text-slate-600 hover:text-blue-600 font-medium px-3 py-2"
              >
                Log in
              </button>
              <button 
                onClick={() => handleSignUp('interviewee')} 
                className="bg-blue-600 text-white px-5 py-2 rounded-full font-medium hover:bg-blue-700 transition shadow-lg shadow-blue-600/20"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <section className="pt-32 pb-20 px-4 bg-gradient-to-br from-blue-50 via-white to-slate-50">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-block bg-blue-100 text-blue-700 px-4 py-1.5 rounded-full text-sm font-semibold mb-6">
            🚀 Launching Version 1.1 MVP
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 leading-tight mb-8">
            Master Your Next <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              Tech Interview
            </span>
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed">
            Practice with engineers from FAANG and top-tier tech companies. 
            Get real-time feedback, improve your system design skills, and land your dream job.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <button 
              onClick={() => handleSignUp('interviewee')}
              className="w-full sm:w-auto px-8 py-4 bg-blue-600 text-white rounded-xl font-bold text-lg hover:bg-blue-700 transition shadow-xl shadow-blue-600/20 flex items-center justify-center gap-2"
            >
              Book a Mock Interview <ArrowRight className="w-5 h-5"/>
            </button>
            <button 
              onClick={() => handleSignUp('interviewer')}
              className="w-full sm:w-auto px-8 py-4 bg-white border-2 border-slate-200 text-slate-700 rounded-xl font-bold text-lg hover:border-blue-600 hover:text-blue-600 transition"
            >
              Become a Mentor
            </button>
          </div>

          <div className="mt-12 flex justify-center items-center gap-8 text-slate-400 grayscale opacity-70">
            <span className="font-bold text-xl">Google</span>
            <span className="font-bold text-xl">Meta</span>
            <span className="font-bold text-xl">Amazon</span>
            <span className="font-bold text-xl">Netflix</span>
            <span className="font-bold text-xl">Stripe</span>
          </div>
        </div>
      </section>

      {/* --- STATS SECTION --- */}
      <section className="py-12 bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { label: 'Interviews Completed', value: '12,500+' },
            { label: 'Active Mentors', value: '850+' },
            { label: 'Offers Landed', value: '9,200+' },
            { label: 'User Rating', value: '4.9/5' },
          ].map((stat, idx) => (
            <div key={idx}>
              <h3 className="text-4xl font-bold text-slate-900 mb-1">{stat.value}</h3>
              <p className="text-slate-500 font-medium">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* --- HOW IT WORKS --- */}
      <section id="how-it-works" className="py-24 px-4 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">How It Works</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Our platform simplifies the process of finding the right mentor and getting the feedback you need to succeed.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            {[
              { 
                icon: <Users className="w-10 h-10 text-blue-600" />, 
                title: "1. Choose a Mentor", 
                desc: "Browse profiles of verified engineers. Filter by company, role (Frontend, Backend), and price." 
              },
              { 
                icon: <Calendar className="w-10 h-10 text-blue-600" />, 
                title: "2. Schedule Session", 
                desc: "Pick a time that works for you. We handle the calendar sync and meeting link generation." 
              },
              { 
                icon: <CheckCircle className="w-10 h-10 text-blue-600" />, 
                title: "3. Get Feedback", 
                desc: "Receive a detailed scorecard after your interview highlighting your strengths and areas for improvement." 
              }
            ].map((step, i) => (
              <div key={i} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition">
                <div className="mb-6 bg-blue-50 w-16 h-16 rounded-xl flex items-center justify-center">
                  {step.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{step.title}</h3>
                <p className="text-slate-600 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- TESTIMONIALS (Lorem Ipsum Data) --- */}
      <section id="testimonials" className="py-24 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
                <h2 className="text-3xl font-bold text-slate-900 mb-4">Loved by Engineers</h2>
                <p className="text-slate-600">Don't just take our word for it. Here is what our community has to say.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
                {[
                    {
                        name: "Sarah Jenkins",
                        role: "Software Engineer at Google",
                        text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam."
                    },
                    {
                        name: "Michael Chen",
                        role: "Backend Dev at Amazon",
                        text: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident."
                    },
                    {
                        name: "David Smith",
                        role: "Frontend Lead at Meta",
                        text: "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt."
                    }
                ].map((t, i) => (
                    <div key={i} className="bg-slate-50 p-8 rounded-2xl relative">
                        <div className="flex gap-1 mb-4">
                            {[1,2,3,4,5].map(s => <Star key={s} className="w-4 h-4 text-yellow-400 fill-yellow-400"/>)}
                        </div>
                        <p className="text-slate-700 italic mb-6">"{t.text}"</p>
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-slate-300 rounded-full"></div>
                            <div>
                                <h4 className="font-bold text-slate-900 text-sm">{t.name}</h4>
                                <p className="text-slate-500 text-xs">{t.role}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </section>

      {/* --- CTA BOTTOM --- */}
      <section className="py-20 px-4 bg-blue-600 text-white text-center">
        <h2 className="text-3xl font-bold mb-6">Ready to Ace Your Interview?</h2>
        <p className="text-blue-100 mb-8 max-w-xl mx-auto">Join thousands of developers who are stepping up their career game today.</p>
        <button 
            onClick={() => handleSignUp('interviewee')}
            className="bg-white text-blue-600 px-10 py-4 rounded-full font-bold text-lg hover:bg-blue-50 transition shadow-xl"
        >
            Get Started for Free
        </button>
      </section>

      {/* --- FOOTER --- */}
      <footer className="bg-slate-900 text-slate-400 py-12 px-4 border-t border-slate-800">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-8 text-sm">
            <div>
                <div className="text-white font-bold text-xl mb-4">MockMaster</div>
                <p>Empowering developers to reach their full potential through peer-to-peer learning.</p>
            </div>
            <div>
                <h4 className="text-white font-bold mb-4">Platform</h4>
                <ul className="space-y-2">
                    <li><a href="#" className="hover:text-white">Browse Mentors</a></li>
                    <li><a href="#" className="hover:text-white">How it Works</a></li>
                    <li><a href="#" className="hover:text-white">Pricing</a></li>
                </ul>
            </div>
            <div>
                <h4 className="text-white font-bold mb-4">Company</h4>
                <ul className="space-y-2">
                    <li><a href="#" className="hover:text-white">About Us</a></li>
                    <li><a href="#" className="hover:text-white">Careers</a></li>
                    <li><a href="#" className="hover:text-white">Blog</a></li>
                </ul>
            </div>
            <div>
                <h4 className="text-white font-bold mb-4">Legal</h4>
                <ul className="space-y-2">
                    <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
                    <li><a href="#" className="hover:text-white">Terms of Service</a></li>
                </ul>
            </div>
        </div>
        <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-slate-800 text-center">
            &copy; 2025 Mock Interview Platform. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Home;
import { Navbar } from '@/components/Navbar';
import Link from 'next/link';
import { ShieldCheck, Zap, HeartPulse, ArrowRight, Droplet, Clock, MapPin, Phone } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 lg:pt-32 lg:pb-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
            <div className="max-w-xl mx-auto text-center lg:text-left">
              <div className="inline-flex items-center space-x-2 bg-blue-50 text-blue-600 px-4 py-1.5 rounded-full text-[10px] md:text-sm font-black uppercase tracking-widest mb-8 animate-fade-in shadow-sm">
                <ShieldCheck className="w-4 h-4" />
                <span>Trusted by 10k+ households</span>
              </div>
              <h1 className="mb-8">
                Pure Water,<br />
                <span className="text-blue-600">Pure Peace of Mind</span>
              </h1>
              <p className="mb-10 lg:text-left">
                Expert RO installation, repair, and maintenance services at your doorstep.
                Experience premium water purification with reliable support.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <Link
                  href="/products"
                  className="w-full sm:w-auto px-10 py-5 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 transition transform hover:-translate-y-1 shadow-2xl shadow-blue-200 flex items-center justify-center space-x-2 active:scale-95"
                >
                  <span>Shop Systems</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  href="/auth/register"
                  className="w-full sm:w-auto px-10 py-5 bg-white text-slate-900 font-bold rounded-2xl border-2 border-slate-100 hover:bg-slate-50 transition flex items-center justify-center active:scale-95"
                >
                  Book Service
                </Link>
              </div>

              <div className="mt-12 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-slate-400">
                <div className="flex items-center space-x-2">
                  <Clock className="w-5 h-5 text-blue-500" />
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">24/7 Support</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="w-5 h-5 text-blue-500" />
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">India Wide</span>
                </div>
              </div>
            </div>

            <div className="mt-16 lg:mt-0 relative px-4">
              <div className="absolute -inset-4 bg-gradient-to-tr from-blue-600/10 to-transparent rounded-[3rem] blur-3xl transform -rotate-6"></div>
              <div className="relative rounded-[2.5rem] md:rounded-[3rem] bg-slate-900/5 border border-slate-100 shadow-2xl overflow-hidden aspect-[4/3] glass-morphism">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-transparent"></div>
                <div className="w-full h-full flex flex-col items-center justify-center p-6 md:p-8 text-center">
                  <Droplet className="w-20 h-20 md:w-32 md:h-32 mb-4 md:mb-6 animate-float text-blue-500 drop-shadow-2xl" />
                  <span className="text-[10px] md:text-sm font-black tracking-[0.3em] uppercase text-blue-600 opacity-50">High Performance</span>
                  <p className="mt-2 text-slate-900 font-black text-lg md:text-xl italic tracking-tighter">Premium RO Technology</p>
                </div>
              </div>

              {/* iOS Install Prompt Hint */}
              <div className="mt-8 p-6 bg-blue-600 text-white rounded-[2rem] shadow-xl md:hidden animate-bounce-slow">
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-white/20 rounded-xl">
                    <Zap className="w-5 h-5" />
                  </div>
                  <p className="text-[10px] font-bold uppercase tracking-widest leading-tight">
                    Install ROCare App: <br />
                    Tap Share + "Add to Home Screen"
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 md:py-32 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center mb-16 md:mb-24">
          <h2 className="mb-6">Why Choose ROCare?</h2>
          <p className="max-w-xl mx-auto italic">Advanced purification for your family's health and wellness.</p>
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {[
              { title: "Advanced Filtration", desc: "Multistage purification removes 99.9% of impurities, heavy metals, and viruses.", icon: Zap, bg: "bg-blue-50", text: "text-blue-600" },
              { title: "Expert Care", desc: "Certified technicians install your RO system correctly, ensuring hygienic setup.", icon: HeartPulse, bg: "bg-red-50", text: "text-red-600" },
              { title: "Swift Response", desc: "Get qualified technicians at your doorstep within 4 hours of registration.", icon: Clock, bg: "bg-amber-50", text: "text-amber-600" }
            ].map((feature, i) => (
              <div key={i} className="bg-white p-10 md:p-12 rounded-[2.5rem] md:rounded-[3.5rem] shadow-xl border border-slate-100 group hover:-translate-y-2 transition-all duration-500">
                <div className={`w-16 h-16 md:w-20 md:h-20 ${feature.bg} rounded-[1.5rem] md:rounded-[2rem] flex items-center justify-center mb-8 md:mb-10 group-hover:scale-110 transition duration-500 shadow-inner`}>
                  <feature.icon className={`w-8 h-8 md:w-10 md:h-10 ${feature.text}`} />
                </div>
                <h3 className="mb-4 text-slate-900 leading-tight tracking-tight">{feature.title}</h3>
                <p className="text-sm md:text-base leading-relaxed italic">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16 md:py-24">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12 md:gap-20">

            <div className="flex items-center space-x-4 group">
              <div className="bg-blue-600 p-3 rounded-2xl group-hover:bg-blue-500 transition shadow-lg shadow-blue-500/20">
                <Droplet className="w-8 h-8 text-white" />
              </div>
              <span className="text-3xl font-black tracking-tighter">ROCare</span>
            </div>

            <div className="text-center relative">
              <div className="absolute -inset-8 bg-blue-500/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition duration-500"></div>
              <p className="text-white/40 text-[10px] uppercase tracking-[0.3em] font-black mb-4">Platform Architecture By</p>
              <p className="text-2xl font-black tracking-tighter mb-6 relative z-10">✦ Vishal Saini</p>
              <a
                href="tel:+916367839332"
                className="inline-flex items-center space-x-3 px-8 py-4 bg-blue-600 hover:bg-blue-500 rounded-2xl text-base font-black transition-all active:scale-95 group shadow-2xl shadow-blue-900/40"
              >
                <Phone className="w-5 h-5 group-hover:rotate-12 transition" />
                <span>+91 63678 39332</span>
              </a>
            </div>

            <div className="text-center md:text-right">
              <p className="text-white/30 text-xs font-black uppercase tracking-[0.2em]">© {new Date().getFullYear()} ROCare India</p>
              <p className="text-white/10 text-[10px] font-bold uppercase tracking-widest mt-2">{nowIST()}</p>
            </div>

          </div>
        </div>
      </footer>
    </div>
  );
}

function nowIST() {
  return new Date().toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  }).toUpperCase();
}

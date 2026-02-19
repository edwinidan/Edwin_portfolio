import React, { useState, useEffect, useRef } from "react";
import { createRoot } from "react-dom/client";
import {
  ArrowRight,
  Code2,
  Smartphone,
  Zap,
  ShieldCheck,
  Mail,
  Download,
  MessageCircle,
  Github,
  Linkedin,
  Terminal,
  Cpu,
  Layers,
  ExternalLink,
  Menu,
  X,
  ShoppingCart,
  Palette,
  Lock,
  Moon,
  Sun
} from "lucide-react";

// --- Types ---

type View = "home" | "work" | "about" | "contact" | "project-odoo12";

interface Project {
  id: string;
  title: string;
  category: string;
  description: string;
  tags: string[];
  image: string; // Using placeholders for now
}

// --- Data ---

const projects: Project[] = [
  {
    id: "1",
    title: "Odoo12",
    category: "Hospital Management System",
    description: "A comprehensive hospital management system built on Odoo 12, streamlining patient records, appointments, billing, and staff coordination.",
    tags: ["Odoo", "Python", "PostgreSQL"],
    image: "https://images.unsplash.com/photo-1538108149393-fbbd81895907?auto=format&fit=crop&q=80&w=800&ixlib=rb-4.0.3"
  },
  {
    id: "2",
    title: "Apex Finance",
    category: "Fintech Dashboard",
    description: "Secure and responsive dashboard for a boutique financial advisory firm. Focus on data visualization and client security.",
    tags: ["React", "D3.js", "Node.js"],
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800&ixlib=rb-4.0.3"
  },
  {
    id: "3",
    title: "Urban Architecture",
    category: "Portfolio Site",
    description: "Minimalist portfolio for an award-winning architecture firm. Smooth transitions and gallery-focused layout.",
    tags: ["Astro", "Motion", "CMS"],
    image: "https://images.unsplash.com/photo-1600607686527-6fb886090705?auto=format&fit=crop&q=80&w=800&ixlib=rb-4.0.3"
  },
  {
    id: "4",
    title: "Uncolonized Society",
    category: "E-commerce / Clothing Brand",
    description: "A bold, culture-driven e-commerce website for Uncolonized Society — a clothing brand rooted in identity and self-expression.",
    tags: ["React", "Vite", "Tailwind"],
    image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&q=80&w=800&ixlib=rb-4.0.3"
  }
];

const techStack = [
  "Next.js", "React", "TypeScript", "Tailwind CSS", "Node.js", "PostgreSQL", "Git", "Figma"
];

// --- Components ---

const Button = ({
  children,
  variant = "primary",
  icon: Icon,
  className = "",
  onClick
}: {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  icon?: any;
  className?: string;
  onClick?: () => void;
}) => {
  const baseStyles = "inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-300 ease-out active:scale-95";

  const variants = {
    primary: "bg-[#3E3832] text-white hover:bg-[#2D2926] shadow-md hover:shadow-lg",
    secondary: "bg-[#CA7A60] text-white hover:bg-[#B56850] shadow-md hover:shadow-lg",
    outline: "border border-[#3E3832] text-[#3E3832] hover:bg-[#3E3832] hover:text-white",
    ghost: "text-[#6B635B] hover:text-[#3E3832] hover:bg-black/5"
  };

  return (
    <button onClick={onClick} className={`${baseStyles} ${variants[variant]} ${className}`}>
      {children}
      {Icon && <Icon size={18} />}
    </button>
  );
};

const SectionHeading = ({ title, subtitle }: { title: string; subtitle?: string }) => (
  <div className="mb-12">
    {subtitle && <span className="text-[#CA7A60] font-medium tracking-wide text-sm uppercase mb-2 block">{subtitle}</span>}
    <h2 className="text-3xl md:text-4xl text-[#3E3832] leading-tight font-serif">{title}</h2>
  </div>
);

const Card = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`bg-white border border-[#EBE8E4] p-8 rounded-xl hover-lift ${className}`}>
    {children}
  </div>
);

// --- Views ---

const HomeView = ({ setView }: { setView: (v: View) => void }) => {
  const [activePopup, setActivePopup] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let time = 0;

    const resize = () => {
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight;
      }
    };
    resize();
    window.addEventListener('resize', resize);

    const ropes = [
      { speed: 0.015, amplitude: 25, wavelength: 8, color: 'rgba(202,122,96,', opacity: 0.18, width: 2.5, offset: 0 },
      { speed: 0.012, amplitude: 18, wavelength: 10, color: 'rgba(138,154,138,', opacity: 0.14, width: 2, offset: 2 },
      { speed: 0.018, amplitude: 20, wavelength: 6, color: 'rgba(62,56,50,', opacity: 0.10, width: 1.5, offset: 4 },
    ];

    // Get a point along the perimeter (0 to 1 maps to the full edge loop)
    const getPerimeterPoint = (t: number, w: number, h: number) => {
      t = ((t % 1) + 1) % 1; // normalize to 0-1
      const perimeter = 2 * (w + h);
      const dist = t * perimeter;

      if (dist < w) {
        // Top edge: left to right
        return { x: dist, y: 0, nx: 0, ny: 1 };
      } else if (dist < w + h) {
        // Right edge: top to bottom
        return { x: w, y: dist - w, nx: -1, ny: 0 };
      } else if (dist < 2 * w + h) {
        // Bottom edge: right to left
        return { x: w - (dist - w - h), y: h, nx: 0, ny: -1 };
      } else {
        // Left edge: bottom to top
        return { x: 0, y: h - (dist - 2 * w - h), nx: 1, ny: 0 };
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const w = canvas.width;
      const h = canvas.height;

      // Slow down on mobile — scale speed relative to screen size
      const speedScale = Math.min(w / 1200, 1) * 0.14;

      ropes.forEach(rope => {
        ctx.beginPath();
        ctx.strokeStyle = rope.color + rope.opacity + ')';
        ctx.lineWidth = rope.width;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        const steps = 400;
        const loopLength = 0.6; // how much of the perimeter each rope covers

        for (let i = 0; i <= steps; i++) {
          const t = i / steps;
          const perimT = (t * loopLength + time * rope.speed * speedScale + rope.offset * 0.15) % 1;
          const pt = getPerimeterPoint(perimT, w, h);

          // Sine wobble pushed inward from edges using normal direction
          const wobble = Math.sin(t * rope.wavelength * Math.PI + time * rope.speed * speedScale * 50) * rope.amplitude
            + Math.sin(t * rope.wavelength * 1.5 * Math.PI + time * rope.speed * speedScale * 30) * (rope.amplitude * 0.4);

          const x = pt.x + pt.nx * wobble;
          const y = pt.y + pt.ny * wobble;

          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.stroke();
      });

      time++;
      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <>
      {/* Hero Section */}
      <section className="min-h-[90vh] flex flex-col justify-center pt-24 pb-12 px-6 relative overflow-hidden bg-gradient-drift">
        {/* Flowing rope animation */}
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-0" />

        {/* Soft Spotlight effect */}
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-[#CA7A60]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-[#8A9A8A]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto w-full z-10 text-center md:text-left">
          <div className="inline-block px-3 py-1 mb-6 rounded-full bg-[#3E3832]/5 text-[#3E3832] text-sm font-medium animate-fade-in">
            Available for new projects
          </div>

          <h1 className="text-5xl md:text-7xl font-serif text-[#3E3832] leading-[1.1] mb-6 animate-fade-in delay-100">
            Crafting premium <br className="hidden md:block" /> digital experiences.
          </h1>

          <p className="text-xl md:text-2xl text-[#6B635B] max-w-2xl mx-auto md:mx-0 mb-10 leading-relaxed font-light animate-fade-in delay-200">
            Computer Engineering Graduate • Web Developer • IT Support.
            Helping small businesses build trust through calm, reliable, and high-performance websites.
          </p>

          <div className="flex flex-wrap gap-4 justify-center md:justify-start animate-fade-in delay-300">
            <Button onClick={() => window.open('mailto:edwinidan07@gmail.com')} icon={Mail}>Email Me</Button>
            <Button variant="outline" onClick={() => window.open('https://wa.me/233500610780', '_blank')} icon={MessageCircle}>WhatsApp</Button>
            <Button icon={Download} onClick={() => { const a = document.createElement('a'); a.href = '/Edwin_Idan_CV.pdf'; a.download = 'Edwin_Idan_CV.pdf'; a.click(); }} className="!bg-[#CA7A60] !text-white !border-[#CA7A60] hover:!bg-[#b56a52]">Download CV</Button>
          </div>
        </div>
      </section>

      {/* Trust Strip */}
      <section className="py-12 border-y border-[#EBE8E4] bg-white/50 backdrop-blur-sm relative overflow-hidden">
        {/* Desktop: static grid */}
        <div className="hidden md:block max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-4 gap-8">
            {[
              { icon: Zap, label: "Fast Delivery", desc: "Fast turnaround, clear timelines — no unnecessary delays." },
              { icon: Smartphone, label: "Mobile First", desc: "Every site is designed for phones first, then scaled up beautifully." },
              { icon: Layers, label: "Clean UI", desc: "Minimal, intuitive interfaces that your users will love." },
              { icon: ShieldCheck, label: "Reliable Support", desc: "Ongoing maintenance and quick responses when you need help." }
            ].map((item, i) => (
              <div
                key={i}
                onClick={() => setActivePopup(activePopup === i ? null : i)}
                className="flex items-center gap-3 text-[#6B635B] justify-center cursor-pointer hover:text-[#3E3832] transition-colors"
              >
                <div className="p-2 bg-[#F9F8F6] rounded-full text-[#CA7A60]">
                  <item.icon size={20} />
                </div>
                <span className="font-medium whitespace-nowrap">{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile: manual swipe with loop */}
        <div
          ref={scrollRef}
          onScroll={() => {
            const el = scrollRef.current;
            if (!el) return;
            const halfScroll = el.scrollWidth / 2;
            if (el.scrollLeft >= halfScroll) {
              el.scrollLeft -= halfScroll;
            } else if (el.scrollLeft <= 0) {
              el.scrollLeft += halfScroll;
            }
          }}
          className="md:hidden flex gap-6 overflow-x-auto scrollbar-hide px-6 py-1"
        >
          {[...Array(3)].map((_, setIdx) => (
            <React.Fragment key={setIdx}>
              {[
                { icon: Zap, label: "Fast Delivery", desc: "Fast turnaround, clear timelines — no unnecessary delays." },
                { icon: Smartphone, label: "Mobile First", desc: "Every site is designed for phones first, then scaled up beautifully." },
                { icon: Layers, label: "Clean UI", desc: "Minimal, intuitive interfaces that your users will love." },
                { icon: ShieldCheck, label: "Reliable Support", desc: "Ongoing maintenance and quick responses when you need help." }
              ].map((item, i) => (
                <div
                  key={`${setIdx}-${i}`}
                  onClick={() => setActivePopup(activePopup === i ? null : i)}
                  className="flex items-center gap-3 text-[#6B635B] shrink-0 bg-white/80 px-5 py-3 rounded-full border border-[#EBE8E4] shadow-sm cursor-pointer hover:text-[#3E3832] transition-colors"
                >
                  <div className="p-2 bg-[#F9F8F6] rounded-full text-[#CA7A60]">
                    <item.icon size={20} />
                  </div>
                  <span className="font-medium whitespace-nowrap">{item.label}</span>
                </div>
              ))}
            </React.Fragment>
          ))}
        </div>
      </section>

      {/* Popup Overlay - rendered outside section for full-screen coverage */}
      {activePopup !== null && (() => {
        const items = [
          { icon: Zap, label: "Fast Delivery", desc: "Fast turnaround, clear timelines — no unnecessary delays." },
          { icon: Smartphone, label: "Mobile First", desc: "Every site is designed for phones first, then scaled up beautifully." },
          { icon: Layers, label: "Clean UI", desc: "Minimal, intuitive interfaces that your users will love." },
          { icon: ShieldCheck, label: "Reliable Support", desc: "Ongoing maintenance and quick responses when you need help." }
        ];
        const item = items[activePopup];
        const Icon = item.icon;
        return (
          <div
            className="fixed inset-0 z-[999] flex items-center justify-center px-6"
            onClick={() => setActivePopup(null)}
            onTouchEnd={() => setActivePopup(null)}
          >
            <div className="absolute inset-0 bg-black/20 backdrop-blur-[0.5px]" />
            <div className="relative bg-white rounded-2xl p-8 max-w-sm w-full shadow-xl text-center animate-pop-in">
              <div className="w-14 h-14 bg-[#F9F8F6] rounded-full flex items-center justify-center text-[#CA7A60] mx-auto mb-4">
                <Icon size={28} />
              </div>
              <h3 className="text-xl font-serif text-[#3E3832] mb-3">{item.label}</h3>
              <p className="text-[#6B635B] leading-relaxed">{item.desc}</p>
            </div>
          </div>
        );
      })()}

      {/* Services */}
      <section className="py-24 px-6 bg-[#F9F8F6]">
        <div className="max-w-6xl mx-auto">
          <SectionHeading title="What I Build" subtitle="What I Do" />

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="!border-[#3E3832]">
              <div className="w-12 h-12 bg-[#3E3832] rounded-lg flex items-center justify-center text-white mb-6">
                <Code2 size={24} />
              </div>
              <h3 className="text-xl font-serif mb-3 text-[#3E3832]">Business & Startup Websites</h3>
              <p className="text-[#6B635B] leading-relaxed">
                Clean, modern, and mobile-responsive websites built for businesses, startups, and professionals who need a strong online presence.
              </p>
            </Card>

            <Card className="!border-[#3E3832]">
              <div className="w-12 h-12 bg-[#CA7A60] rounded-lg flex items-center justify-center text-white mb-6">
                <ShoppingCart size={24} />
              </div>
              <h3 className="text-xl font-serif mb-3 text-[#3E3832]">E-commerce Websites</h3>
              <p className="text-[#6B635B] leading-relaxed">
                User-friendly online stores designed for clarity, performance, and ease of use — ideal for small to growing businesses.
              </p>
            </Card>

            <Card className="!border-[#3E3832]">
              <div className="w-12 h-12 bg-[#3E3832] rounded-lg flex items-center justify-center text-white mb-6">
                <Smartphone size={24} />
              </div>
              <h3 className="text-xl font-serif mb-3 text-[#3E3832]">Mobile App Development</h3>
              <p className="text-[#6B635B] leading-relaxed">
                Design and development of mobile applications focused on usability, clean interfaces, and real-world functionality.
              </p>
            </Card>

            <Card className="!border-[#3E3832]">
              <div className="w-12 h-12 bg-[#3E3832] rounded-lg flex items-center justify-center text-white mb-6">
                <Palette size={24} />
              </div>
              <h3 className="text-xl font-serif mb-3 text-[#3E3832]">UI & Product Design</h3>
              <p className="text-[#6B635B] leading-relaxed">
                Thoughtful interface and layout design for digital products, focusing on clarity, structure, and user experience.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Work Preview */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <SectionHeading title="Selected Projects" subtitle="Portfolio" />
            <div className="mb-12 md:mb-0">
              <Button variant="ghost" onClick={() => setView('work')} icon={ArrowRight}>View All Projects</Button>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {projects.map((project) => (
              <div key={project.id} className={`group ${project.id === '1' ? 'cursor-pointer' : 'cursor-default'}`} onClick={() => project.id === '1' ? setView('project-odoo12') : null}>
                <div className="aspect-[4/3] bg-[#F2EFE9] rounded-xl overflow-hidden mb-4 relative">
                  <img src={project.image} alt={project.title} className={`w-full h-full object-cover transition-transform duration-700 ${project.id === '1' ? 'group-hover:scale-105' : 'grayscale opacity-60 blur-md'}`} />
                  {project.id !== '1' && (
                    <div className="absolute inset-0 bg-black/30 flex flex-col items-center justify-center gap-2">
                      <Lock size={32} className="text-white" />
                      <span className="text-white text-sm font-medium">Under Construction</span>
                    </div>
                  )}
                  {project.id === '1' && <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />}
                </div>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className={`text-lg font-medium ${project.id !== '1' ? 'text-[#6B635B]' : 'text-[#3E3832] group-hover:text-[#CA7A60]'} transition-colors`}>{project.title}</h3>
                    <p className="text-[#6B635B] text-sm">{project.category}</p>
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0 transform duration-300">
                    <ArrowRight size={18} className="text-[#CA7A60]" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-24 px-6 bg-[#F9F8F6] border-y border-[#EBE8E4]">
        <div className="max-w-4xl mx-auto">
          <SectionHeading title="My Process" subtitle="How I Work" />

          <div className="space-y-8 relative before:absolute before:left-[19px] before:top-2 before:h-full before:w-[2px] before:bg-[#EBE8E4]">
            {[
              { step: "01", title: "Discovery", desc: "Understanding your goals, audience, and brand requirements." },
              { step: "02", title: "Design", desc: "Creating visual concepts and layouts that align with your vision." },
              { step: "03", title: "Build", desc: "Developing the website using modern, clean, and efficient code." },
              { step: "04", title: "Launch", desc: "Testing, optimization, and finally pushing your site live." },
              { step: "05", title: "Support", desc: "Ongoing maintenance to ensure your site stays fast and secure." }
            ].map((phase, idx) => (
              <div key={idx} className="flex gap-6 relative animate-fade-in" style={{ animationDelay: `${idx * 100}ms` }}>
                <div className="w-10 h-10 rounded-full bg-white border border-[#EBE8E4] flex items-center justify-center font-serif font-medium text-[#CA7A60] shadow-sm z-10 shrink-0">
                  {phase.step}
                </div>
                <div>
                  <h4 className="text-lg font-medium text-[#3E3832] mb-1">{phase.title}</h4>
                  <p className="text-[#6B635B] leading-relaxed">{phase.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="py-16 px-6 bg-white text-center">
        <p className="text-[#6B635B] uppercase tracking-widest text-xs mb-8">Technologies Used</p>
        <div className="flex flex-wrap justify-center gap-4 max-w-2xl mx-auto">
          {techStack.map(tech => (
            <span key={tech} className="px-4 py-2 bg-[#F9F8F6] text-[#3E3832] rounded-md text-sm font-medium border border-[#EBE8E4]">
              {tech}
            </span>
          ))}
        </div>
      </section>

      {/* Mini About */}
      <section className="py-24 px-6 bg-[#3E3832] dark:!bg-gradient-to-b dark:!from-[#26221E] dark:!to-[#1E1B18] text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#CA7A60]/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <h2 className="text-3xl md:text-5xl font-serif mb-6">Reliable. Professional. Calm.</h2>
          <p className="text-lg md:text-xl text-white/80 leading-relaxed mb-10">
            I bridge the gap between complex engineering and elegant design.
            Whether you need a simple landing page or a complex web application,
            I bring a steady, professional approach to every project.
          </p>
          <Button variant="secondary" onClick={() => setView('about')}>More About Me</Button>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 bg-[#F9F8F6]">
        <div className="max-w-2xl mx-auto text-center">
          <SectionHeading title="Let's build something great." subtitle="Get In Touch" />
          <p className="text-[#6B635B] mb-10">Ready to start your project? Contact me today for a free consultation.</p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={() => window.open('mailto:edwinidan07@gmail.com')} icon={Mail} className="w-full sm:w-auto">Send Email</Button>
            <Button variant="outline" onClick={() => window.open('https://wa.me/233500610780', '_blank')} icon={MessageCircle} className="w-full sm:w-auto">WhatsApp Me</Button>
          </div>
        </div>
      </section>
    </>
  );
};

const Odoo12DetailView = ({ setView }: { setView: (v: View) => void }) => (
  <section className="pt-32 pb-24 px-6 min-h-screen bg-[#F9F8F6]">
    <div className="max-w-4xl mx-auto animate-fade-in">
      {/* Back Button */}
      <button
        onClick={() => setView('work')}
        className="flex items-center gap-2 text-[#6B635B] hover:text-[#3E3832] transition-colors mb-8 group"
      >
        <ArrowRight size={18} className="rotate-180 group-hover:-translate-x-1 transition-transform" />
        <span className="font-medium">Back to Projects</span>
      </button>

      {/* Hero Image */}
      <div className="aspect-video rounded-2xl overflow-hidden mb-10 shadow-lg">
        <img
          src="https://images.unsplash.com/photo-1538108149393-fbbd81895907?auto=format&fit=crop&q=80&w=1200&ixlib=rb-4.0.3"
          alt="Odoo12 Hospital Management System"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Title & Meta */}
      <div className="mb-10">
        <span className="text-[#CA7A60] font-medium tracking-wide text-sm uppercase mb-2 block">Technical Case Study</span>
        <h1 className="text-3xl md:text-5xl font-serif text-[#3E3832] mb-4">Hospital Management Systems in Odoo 12</h1>
        <div className="flex flex-wrap gap-3 mb-4">
          <span className="text-sm text-[#6B635B]"><strong className="text-[#3E3832]">Framework:</strong> Odoo 12 (Python-based ERP)</span>
          <span className="text-[#EBE8E4]">•</span>
          <span className="text-sm text-[#6B635B]"><strong className="text-[#3E3832]">Database:</strong> PostgreSQL</span>
          <span className="text-[#EBE8E4]">•</span>
          <span className="text-sm text-[#6B635B]"><strong className="text-[#3E3832]">OS:</strong> Ubuntu 20.04</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {["Odoo 12", "Python", "PostgreSQL", "XML", "QWeb", "Ubuntu"].map(tag => (
            <span key={tag} className="text-xs font-medium px-3 py-1 bg-white text-[#6B635B] rounded-full border border-[#EBE8E4]">
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Project Objective */}
      <div className="bg-white rounded-2xl border border-[#EBE8E4] p-8 md:p-10 mb-8">
        <h2 className="text-2xl font-serif text-[#3E3832] mb-4">Project Objective</h2>
        <p className="text-[#6B635B] leading-relaxed">
          The primary objective was the digital transformation of a physiotherapy clinical workflow. This required translating high-density, non-standardized medical assessments into a structured, relational database environment. The resulting module, <code className="bg-[#F9F8F6] px-2 py-0.5 rounded text-[#CA7A60] text-sm font-mono">hms_physiotherapy</code>, serves as a centralized hub for patient management, clinical testing, and facility operations.
        </p>
      </div>

      {/* System Architecture */}
      <div className="bg-white rounded-2xl border border-[#EBE8E4] p-8 md:p-10 mb-8">
        <h2 className="text-2xl font-serif text-[#3E3832] mb-6">System Architecture & Data Modeling</h2>
        <p className="text-[#6B635B] leading-relaxed mb-6">
          The core of this project involved designing a schema capable of handling both static patient data and dynamic clinical observations.
        </p>

        <div className="space-y-6">
          <div className="p-5 bg-[#F9F8F6] rounded-xl">
            <h4 className="font-medium text-[#3E3832] mb-2">Relational Data Mapping</h4>
            <p className="text-sm text-[#6B635B] leading-relaxed">
              To maintain medical precision, I utilized Odoo's <strong>One2many</strong> and <strong>Many2many</strong> fields. This allowed for the granular tracking of recurring assessments like Manual Muscle Testing (MMT) and Reflex Integrity without cluttering the primary patient record.
            </p>
          </div>

          <div className="p-5 bg-[#F9F8F6] rounded-xl">
            <h4 className="font-medium text-[#3E3832] mb-2">Specialized Clinical Subsystems</h4>
            <p className="text-sm text-[#6B635B] leading-relaxed mb-3">
              Engineered specific logic for regional orthopedic tests, including specialized data blocks for:
            </p>
            <div className="grid sm:grid-cols-2 gap-3">
              {[
                { title: "Neurological Metrics", desc: "Tracking Spasticity and Rigidity scales." },
                { title: "Regional Diagnostics", desc: "Dedicated interfaces for Cervical, Lumbar, Shoulder, and Knee assessments." }
              ].map((item, i) => (
                <div key={i} className="bg-white p-3 rounded-lg border border-[#EBE8E4]">
                  <h5 className="text-sm font-medium text-[#CA7A60] mb-1">{item.title}</h5>
                  <p className="text-xs text-[#6B635B]">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="p-5 bg-[#F9F8F6] rounded-xl">
            <h4 className="font-medium text-[#3E3832] mb-2">Functional Assessment Logic</h4>
            <p className="text-sm text-[#6B635B] leading-relaxed">
              Designed modules to quantify patient recovery through Activity of Daily Living (ADL) tracking and standardized Pain Score metrics.
            </p>
          </div>
        </div>
      </div>

      {/* Operational Logic */}
      <div className="bg-white rounded-2xl border border-[#EBE8E4] p-8 md:p-10 mb-8">
        <h2 className="text-2xl font-serif text-[#3E3832] mb-4">Operational & Configuration Logic</h2>
        <p className="text-[#6B635B] leading-relaxed mb-6">
          Beyond the clinical assessment, I developed an administrative backend to manage the logistics of a physiotherapy practice:
        </p>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="p-5 bg-[#F9F8F6] rounded-xl">
            <h4 className="font-medium text-[#3E3832] mb-2">Resource Management</h4>
            <p className="text-sm text-[#6B635B] leading-relaxed">
              Developed the <code className="bg-white px-1.5 py-0.5 rounded text-[#CA7A60] text-xs font-mono">physio.room</code> model to handle clinical space allocation.
            </p>
          </div>
          <div className="p-5 bg-[#F9F8F6] rounded-xl">
            <h4 className="font-medium text-[#3E3832] mb-2">Inventory & SOP Integration</h4>
            <p className="text-sm text-[#6B635B] leading-relaxed">
              Created the <code className="bg-white px-1.5 py-0.5 rounded text-[#CA7A60] text-xs font-mono">physio.modality</code> model. This linked specific treatments to their corresponding SOPs and consumable inventory, ensuring clinical staff have immediate access to protocol guidelines and supply requirements.
            </p>
          </div>
        </div>
      </div>

      {/* Technical Review */}
      <div className="bg-white rounded-2xl border border-[#EBE8E4] p-8 md:p-10 mb-8">
        <h2 className="text-2xl font-serif text-[#3E3832] mb-6">Technical Review</h2>
        <p className="text-[#6B635B] leading-relaxed mb-6">
          From a development standpoint, this project demonstrates proficiency in:
        </p>
        <div className="space-y-4">
          {[
            { title: "Custom Model Inheritance", desc: "Extending Odoo's base capabilities to fit a niche vertical (Healthcare)." },
            { title: "UI/UX for Specialized Workflows", desc: "Creating multi-tabbed, highly organized XML views that reduce cognitive load for clinicians during patient intake." },
            { title: "Backend Robustness", desc: "Ensuring data integrity across complex clinical forms and specialized medical data points." }
          ].map((item, i) => (
            <div key={i} className="flex gap-4 items-start p-4 bg-[#F9F8F6] rounded-xl">
              <div className="w-8 h-8 rounded-full bg-[#CA7A60]/10 flex items-center justify-center text-[#CA7A60] shrink-0 mt-0.5">
                <ShieldCheck size={16} />
              </div>
              <div>
                <h4 className="font-medium text-[#3E3832] mb-1">{item.title}</h4>
                <p className="text-sm text-[#6B635B] leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Portfolio Summary */}
      <div className="bg-[#3E3832] rounded-2xl p-8 md:p-10 mb-8">
        <h2 className="text-2xl font-serif text-white mb-4">Portfolio Summary</h2>
        <p className="text-white/80 leading-relaxed">
          This project serves as a primary example of the ability to handle complex requirements. It proves competence in analyzing a specialized industry — physiotherapy — and building a custom ERP solution that manages both its clinical data and its operational logistics.
        </p>
      </div>

      {/* CTA */}
      <div className="text-center mt-12">
        <p className="text-[#6B635B] mb-4">Interested in a similar project?</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={() => setView('contact')} icon={Mail}>Get in Touch</Button>
          <Button variant="outline" onClick={() => window.open('https://wa.me/233500610780', '_blank')} icon={MessageCircle}>WhatsApp Me</Button>
        </div>
      </div>
    </div>
  </section>
);

const WorkView = ({ setView }: { setView: (v: View) => void }) => (
  <section className="pt-32 pb-24 px-6 min-h-screen bg-[#F9F8F6]">
    <div className="max-w-6xl mx-auto animate-fade-in">
      <div className="mb-16">
        <h1 className="text-4xl md:text-6xl font-serif text-[#3E3832] mb-6">Selected Work</h1>
        <p className="text-xl text-[#6B635B] max-w-2xl">
          A collection of projects showcasing web development, technical precision, and user-centric design.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-10">
        {projects.map((project, idx) => (
          <div key={project.id} onClick={() => project.id === '1' ? setView('project-odoo12') : null} className={`group bg-white rounded-xl overflow-hidden border border-[#EBE8E4] animate-fade-in ${project.id === '1' ? 'cursor-pointer hover-lift' : ''}`} style={{ animationDelay: `${idx * 100}ms` }}>
            <div className="aspect-video bg-[#F2EFE9] overflow-hidden relative">
              <img src={project.image} alt={project.title} className={`w-full h-full object-cover transition-transform duration-700 ${project.id === '1' ? 'group-hover:scale-105' : 'grayscale opacity-60 blur-md'}`} />
              {project.id !== '1' && (
                <div className="absolute inset-0 bg-black/30 flex flex-col items-center justify-center gap-2">
                  <Lock size={36} className="text-white" />
                  <span className="text-white text-sm font-medium">Under Construction</span>
                </div>
              )}
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-[#3E3832]">
                {project.category}
              </div>
            </div>
            <div className="p-8">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-2xl font-serif text-[#3E3832]">{project.title}</h3>
                <a href="#" className="p-2 bg-[#F9F8F6] rounded-full text-[#3E3832] hover:bg-[#3E3832] hover:text-white transition-colors">
                  <ExternalLink size={18} />
                </a>
              </div>
              <p className="text-[#6B635B] mb-6 leading-relaxed">
                {project.description}
              </p>
              <div className="flex flex-wrap gap-2">
                {project.tags.map(tag => (
                  <span key={tag} className="text-xs font-medium px-2 py-1 bg-[#F9F8F6] text-[#6B635B] rounded border border-[#EBE8E4]">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const AboutView = () => (
  <section className="pt-32 pb-24 px-6 min-h-screen bg-[#F9F8F6]">
    <div className="max-w-4xl mx-auto animate-fade-in">
      <div className="grid md:grid-cols-[2fr_1fr] gap-12 items-start">
        <div>
          <h1 className="text-4xl md:text-6xl font-serif text-[#3E3832] mb-8">
            Computer Engineer. <br />
            <span className="text-[#CA7A60]">Problem Solver.</span>
          </h1>

          <div className="prose prose-lg text-[#6B635B] mb-12">
            <p className="mb-6">
              Hello! I'm Edwin Idan. I hold a degree in Computer Engineering and have a passion for building digital tools that work seamlessly.
            </p>
            <p className="mb-6">
              My journey started with a fascination for how things work under the hood. This led me to explore not just software development, but the hardware and systems that support it. Today, I combine that technical depth with a love for clean, accessible design.
            </p>
            <p>
              I specialize in creating websites for small businesses and professionals who need a reliable digital presence without the complexity. When I'm not coding, I provide IT support, ensuring systems stay running smoothly.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6 mb-12">
            <div className="p-6 bg-white border border-[#EBE8E4] rounded-xl">
              <Cpu className="text-[#CA7A60] mb-4" size={28} />
              <h3 className="text-lg font-serif mb-2 text-[#3E3832]">Engineering Background</h3>
              <p className="text-sm text-[#6B635B]">Solid understanding of algorithms, system architecture, and optimization.</p>
            </div>
            <div className="p-6 bg-white border border-[#EBE8E4] rounded-xl">
              <Terminal className="text-[#CA7A60] mb-4" size={28} />
              <h3 className="text-lg font-serif mb-2 text-[#3E3832]">Full-Stack Capable</h3>
              <p className="text-sm text-[#6B635B]">From database design to frontend animations, I handle the full lifecycle.</p>
            </div>
          </div>

          <Button icon={Download} variant="outline" onClick={() => { const a = document.createElement('a'); a.href = '/Edwin_Idan_CV.pdf'; a.download = 'Edwin_Idan_CV.pdf'; a.click(); }}>Download My Resume</Button>
        </div>

        {/* Sidebar / Stats */}
        <div className="bg-white p-6 rounded-xl border border-[#EBE8E4] md:sticky md:top-32">
          <h3 className="font-serif text-xl mb-6 text-[#3E3832]">Quick Facts</h3>
          <ul className="space-y-4 text-[#6B635B]">
            <li className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-[#CA7A60]" />
              <span>Based in [Your City]</span>
            </li>
            <li className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-[#CA7A60]" />
              <span>Comp. Eng. Graduate</span>
            </li>
            <li className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-[#CA7A60]" />
              <span>2+ Years Experience</span>
            </li>
            <li className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span>Open to Work</span>
            </li>
          </ul>

          <div className="mt-8 pt-8 border-t border-[#EBE8E4] flex gap-4 justify-center">
            <a href="#" className="text-[#6B635B] hover:text-[#CA7A60] transition-colors"><Github /></a>
            <a href="#" className="text-[#6B635B] hover:text-[#CA7A60] transition-colors"><Linkedin /></a>
            <a href="mailto:edwinidan07@gmail.com" className="text-[#6B635B] hover:text-[#CA7A60] transition-colors"><Mail /></a>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const ContactView = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'New Website Project',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { name, email, subject, message } = formData;
    const mailtoLink = `mailto:edwinidan07@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`)}`;
    window.location.href = mailtoLink;
  };

  return (
    <section className="pt-32 pb-24 px-6 min-h-screen bg-[#F9F8F6] flex flex-col justify-center">
      <div className="max-w-2xl mx-auto w-full animate-fade-in">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-serif text-[#3E3832] mb-4">Get in Touch</h1>
          <p className="text-[#6B635B]">Have a project in mind or a job opportunity? I'd love to hear from you.</p>
        </div>

        <div className="bg-white p-8 md:p-12 rounded-2xl border border-[#EBE8E4] shadow-sm">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-[#3E3832]">Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg bg-[#F9F8F6] border border-[#EBE8E4] focus:border-[#CA7A60] focus:ring-1 focus:ring-[#CA7A60] outline-none transition-all"
                  placeholder="John Doe"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-[#3E3832]">Email</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg bg-[#F9F8F6] border border-[#EBE8E4] focus:border-[#CA7A60] focus:ring-1 focus:ring-[#CA7A60] outline-none transition-all"
                  placeholder="john@example.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-[#3E3832]">Subject</label>
              <select
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="w-full px-4 py-3 rounded-lg bg-[#F9F8F6] border border-[#EBE8E4] focus:border-[#CA7A60] focus:ring-1 focus:ring-[#CA7A60] outline-none transition-all"
              >
                <option>New Website Project</option>
                <option>IT Support Inquiry</option>
                <option>Job / Internship Opportunity</option>
                <option>Other</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-[#3E3832]">Message</label>
              <textarea
                rows={5}
                required
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full px-4 py-3 rounded-lg bg-[#F9F8F6] border border-[#EBE8E4] focus:border-[#CA7A60] focus:ring-1 focus:ring-[#CA7A60] outline-none transition-all resize-none"
                placeholder="Tell me about your project..."
              ></textarea>
            </div>

            <Button className="w-full">Send Message</Button>
          </form>

          <div className="mt-8 pt-8 border-t border-[#EBE8E4] flex flex-col items-center gap-4">
            <p className="text-sm text-[#6B635B]">Or connect directly via</p>
            <Button variant="outline" onClick={() => window.open('https://wa.me/233500610780', '_blank')} icon={MessageCircle} className="w-full">Chat on WhatsApp</Button>
          </div>
        </div>
      </div>
    </section>
  );
};

const Footer = ({ setView }: { setView: (v: View) => void }) => (
  <footer className="bg-white border-t border-[#EBE8E4] py-12 px-6">
    <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
      <div className="text-center md:text-left">
        <h4 className="font-serif text-lg font-medium text-[#3E3832]">Edwin Idan</h4>
        <p className="text-sm text-[#6B635B]">© {new Date().getFullYear()}. Built with React & Tailwind.</p>
      </div>

      <div className="flex gap-8 text-sm font-medium text-[#6B635B]">
        <button onClick={() => setView('home')} className="hover:text-[#CA7A60] transition-colors">Home</button>
        <button onClick={() => setView('work')} className="hover:text-[#CA7A60] transition-colors">Work</button>
        <button onClick={() => setView('about')} className="hover:text-[#CA7A60] transition-colors">About</button>
        <button onClick={() => setView('contact')} className="hover:text-[#CA7A60] transition-colors">Contact</button>
      </div>

      <div className="flex gap-4">
        <a href="#" className="w-10 h-10 flex items-center justify-center rounded-full bg-[#F9F8F6] text-[#3E3832] hover:bg-[#CA7A60] hover:text-white transition-all">
          <Github size={18} />
        </a>
        <a href="#" className="w-10 h-10 flex items-center justify-center rounded-full bg-[#F9F8F6] text-[#3E3832] hover:bg-[#CA7A60] hover:text-white transition-all">
          <Linkedin size={18} />
        </a>
      </div>
    </div>
  </footer>
);

const Navbar = ({ view, setView }: { view: View; setView: (v: View) => void }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // Check local storage or system preference
    if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      setDarkMode(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    if (darkMode) {
      document.documentElement.classList.remove('dark');
      localStorage.theme = 'light';
      setDarkMode(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.theme = 'dark';
      setDarkMode(true);
    }
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks: { id: View; label: string }[] = [
    { id: "home", label: "Home" },
    { id: "work", label: "Work" },
    { id: "about", label: "About" },
    { id: "contact", label: "Contact" }
  ];

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${scrolled ? "bg-white/80 backdrop-blur-md border-b border-[#EBE8E4] py-3" : "bg-transparent py-6"}`}>
      <div className="relative z-50 max-w-6xl mx-auto px-6 flex justify-between items-center">
        <div
          onClick={() => setView('home')}
          className="font-serif text-xl font-bold text-[#3E3832] cursor-pointer tracking-tight"
        >
          Edwin Idan
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map(link => (
            <button
              key={link.id}
              onClick={() => setView(link.id)}
              className={`text-sm font-medium transition-colors ${view === link.id ? "text-[#CA7A60]" : "text-[#6B635B] hover:text-[#3E3832]"}`}
            >
              {link.label}
            </button>
          ))}
          <button
            onClick={toggleDarkMode}
            className="p-2 text-[#6B635B] hover:text-[#3E3832] transition-colors rounded-full hover:bg-black/5"
            aria-label="Toggle Dark Mode"
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <Button onClick={() => setView('contact')} className="!py-2 !px-4 text-sm">Hire Me</Button>
        </div>

        {/* Mobile Toggle */}
        <div className="flex items-center gap-4 md:hidden">
          <button
            onClick={toggleDarkMode}
            className="text-[#3E3832] p-1"
            aria-label="Toggle Dark Mode"
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button className="text-[#3E3832]" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 z-40 md:hidden"
            onClick={() => setMobileMenuOpen(false)}
            onTouchStart={() => setMobileMenuOpen(false)}
          />
          <div className="absolute top-full right-4 z-50 w-64 bg-white border border-[#EBE8E4] rounded-xl p-5 md:hidden flex flex-col gap-3 shadow-xl">
            {navLinks.map(link => (
              <button
                key={link.id}
                onClick={() => {
                  setView(link.id);
                  setMobileMenuOpen(false);
                }}
                className={`text-left text-lg font-medium pl-4 ${view === link.id ? "text-[#CA7A60]" : "text-[#3E3832]"}`}
              >
                {link.label}
              </button>
            ))}
            <button
              onClick={() => { setView('contact'); setMobileMenuOpen(false); }}
              className="text-left text-lg font-medium text-white bg-[#3E3832] px-4 py-2 rounded-lg"
            >
              Hire Me
            </button>
          </div>
        </>
      )}
    </nav>
  );
};

// --- Main App ---

const App = () => {
  const [view, setView] = useState<View>("home");

  // Scroll to top on view change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [view]);

  return (
    <div className="min-h-screen flex flex-col selection:bg-[#CA7A60] selection:text-white">
      <Navbar view={view} setView={setView} />

      <main className="flex-grow">
        {view === "home" && <HomeView setView={setView} />}
        {view === "work" && <WorkView setView={setView} />}
        {view === "about" && <AboutView />}
        {view === "contact" && <ContactView />}
        {view === "project-odoo12" && <Odoo12DetailView setView={setView} />}
      </main>

      <Footer setView={setView} />
    </div>
  );
};

const root = createRoot(document.getElementById("root")!);
root.render(<App />);

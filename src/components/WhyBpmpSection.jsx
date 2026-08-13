import React, { useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

const defaultSteps = [
  {
    num: "01",
    title: "Turn Ideas into Profitable Projects",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
    paragraphs: [
      "Helping businesses turn their ideas into profitable projects."
    ]
  },
  {
    num: "02",
    title: "Customized Solutions & Support",
    image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1200&q=80",
    paragraphs: [
      "As every situation is unique, we focus on first understanding your particular situation.",
    ]
  },
  {
    num: "03",
    title: "Capital Deployment & Execution",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&q=80",
    paragraphs: [
      "Our typical clients are companies that are ready to deploy capital for expansion or improvement projects but need help turning their ideas into executable projects."
    ]
  },
  {
    num: "04",
    title: "Operational Execution & Governance",
    image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80",
    paragraphs: [
      "Streamlining operational execution through dedicated project governance and milestone tracking."
    ]
  },
  {
    num: "05",
    title: "Sustainable Long-Term Value",
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80",
    paragraphs: [
      "Ensuring sustainable long-term value delivery and continuous optimization for every client asset."
    ]
  }
];

export default function WhyBpmpSection({
  title = "WHY BPMP",
  subhead = "CUSTOM SOLUTIONS FOR YOUR CAPITAL PROJECTS",
  steps = defaultSteps
}) {
  const sectionRef = useRef(null);
  const stickyImageRef = useRef(null);
  const imgRefs = useRef([]);
  const stepRefs = useRef([]);

  const [activeIndex, setActiveIndex] = useState(1); // Default active index set to 1 (02) as in reference image

  const isScrollingRef = useRef(false);

  // 1. GSAP ScrollTrigger for pinning sticky image and scroll step activation
  useGSAP(() => {
    const section = sectionRef.current;
    const stickyContainer = stickyImageRef.current;
    const stepElements = stepRefs.current;

    if (!section || !stickyContainer || !stepElements.length) return;

    const mm = gsap.matchMedia();

    // Pin left image column on desktop viewports
    mm.add("(min-width: 768px)", () => {
      ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: 'bottom bottom',
        pin: stickyContainer,
        pinSpacing: false,
      });
    });

    // ScrollTriggers for each step panel on the right with onToggle for responsive activation
    stepElements.forEach((stepEl, i) => {
      if (!stepEl) return;
      ScrollTrigger.create({
        trigger: stepEl,
        start: 'top 50%',
        end: 'bottom 50%',
        onToggle: (self) => {
          if (self.isActive && !isScrollingRef.current) {
            setActiveIndex(i);
          }
        },
      });
    });

    return () => mm.revert();
  }, { scope: sectionRef, dependencies: [steps] });

  // 2. Animate image opacity & scale when activeIndex changes
  useGSAP(() => {
    imgRefs.current.forEach((img, i) => {
      if (!img) return;
      if (i === activeIndex) {
        gsap.to(img, {
          opacity: 1,
          scale: 1,
          duration: 0.5,
          ease: 'power2.out',
          overwrite: 'auto',
        });
      } else {
        gsap.to(img, {
          opacity: 0,
          scale: 1.05,
          duration: 0.5,
          ease: 'power2.out',
          overwrite: 'auto',
        });
      }
    });
  }, { scope: sectionRef, dependencies: [activeIndex] });

  // 3. Handle card click & keyboard activation with smooth scroll
  const handleCardClick = (index) => {
    isScrollingRef.current = true;
    setActiveIndex(index);
    const targetStep = stepRefs.current[index];
    if (targetStep) {
      gsap.killTweensOf(window);
      gsap.to(window, {
        duration: 0.7,
        ease: 'power2.inOut',
        scrollTo: { y: targetStep, offsetY: window.innerHeight * 0.2, autoKill: true },
        onComplete: () => {
          isScrollingRef.current = false;
          ScrollTrigger.refresh();
        },
        onInterrupt: () => {
          isScrollingRef.current = false;
        },
      });
    } else {
      isScrollingRef.current = false;
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleCardClick(index);
    }
  };

  return (
    <div
      ref={sectionRef}
      className="why-bpmp flex flex-col md:flex-row items-start bg-[#a4e500] min-h-screen text-[#101744] font-['Plus_Jakarta_Sans',sans-serif] relative w-full overflow-hidden"
    >
      {/* LEFT: Full Cover Sticky Image Column (100vh) */}
      <div
        ref={stickyImageRef}
        className="sticky-image sticky top-0 h-screen min-h-screen w-full md:w-1/2 overflow-hidden shrink-0 z-10 bg-slate-900"
        aria-hidden="true"
      >
        {steps.map((step, i) => (
          <img
            key={i}
            ref={(el) => (imgRefs.current[i] = el)}
            src={step.image}
            alt=""
            className="absolute inset-0 w-full h-full min-w-full min-h-full object-cover object-center will-change-transform opacity-0 scale-105"
          />
        ))}
      </div>

      {/* RIGHT: Compact Panels Content */}
      <div className="panels w-full md:w-1/2 px-6 sm:px-12 md:px-16 py-12 md:py-20 z-20 flex flex-col gap-6">
        <div className="mb-4 sm:mb-6">
          <h2
            className="eyebrow m-0 mb-3 font-black tracking-wider text-[clamp(2.5rem,5vw,5rem)] leading-tight uppercase text-[#101744]"
            style={{ fontFamily: "'Michroma', 'Orbitron', sans-serif", letterSpacing: '0.04em' }}
          >
            {title}
          </h2>
          <p className="subhead m-0 font-extrabold text-xs sm:text-sm tracking-wider uppercase text-[#101744]">
            {subhead}
          </p>
        </div>

        <div className="flex flex-col gap-5 sm:gap-6">
          {steps.map((step, i) => {
            const isActive = i === activeIndex;
            const stepTitle = step.title || step.heading;
            return (
              <div
                key={i}
                ref={(el) => (stepRefs.current[i] = el)}
                className="step flex items-center"
              >
                <div
                  onClick={() => handleCardClick(i)}
                  onKeyDown={(e) => handleKeyDown(e, i)}
                  tabIndex={0}
                  role="button"
                  aria-pressed={isActive}
                  className={`panel-card w-full flex gap-5 sm:gap-7 items-start p-6 sm:p-8 rounded-2xl cursor-pointer transition-all duration-300 ${isActive
                    ? 'bg-white shadow-[0_12px_32px_rgba(16,23,68,0.08)]'
                    : 'bg-[#b6f414]/90 hover:bg-[#bbfa18]'
                    }`}
                >
                  <span
                    className={`panel-num font-extrabold text-xl sm:text-2xl leading-none min-w-[2.2ch] ${isActive ? 'text-[#101744]' : 'text-[#3f5413]'
                      }`}
                    style={{ fontFamily: "'Michroma', 'Orbitron', sans-serif" }}
                  >
                    {step.num}
                  </span>
                  <div className="panel-body flex-1">
                    {stepTitle && (
                      <h4
                        className={`m-0 mb-1 text-base sm:text-lg font-extrabold leading-snug ${isActive ? 'text-[#101744]' : 'text-[#3f5413]'
                          }`}
                      >
                        {stepTitle}
                      </h4>
                    )}
                    {step.paragraphs.map((pText, pIdx) => (
                      <p
                        key={pIdx}
                        className={`m-0 ${pIdx > 0 || stepTitle ? 'mt-2' : ''} text-sm sm:text-base leading-relaxed ${isActive
                          ? 'text-[#101744] font-bold'
                          : 'text-[#3f5413] font-semibold opacity-90'
                          }`}
                      >
                        {pText}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

import React, { useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

const defaultSlides = [
  {
    counter: "01 - 04",
    title: "Online Talk\nTherapy",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1920&q=80",
    lede: "Our therapists help individuals work through issues related to:",
    tags: "Depression and Anxiety | LGBTQ +\nCouples Counseling | Grief Counseling |\nWork and Career Issues | Stress\nManagement | Conflict Resolution |\nFinding Purpose and Direction | Gender\nIdentity Issues",
  },
  {
    counter: "02 - 04",
    title: "Couples\nCounseling",
    image: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=1920&q=80",
    lede: "Our therapists help couples work through issues related to:",
    tags: "Communication Breakdown | Trust and Infidelity |\nPre-Marital Counseling | Life Transitions |\nParenting Conflicts | Intimacy Issues |\nFinancial Stress | Long-Distance Relationships",
  },
  {
    counter: "03 - 04",
    title: "Family\nTherapy",
    image: "https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=1920&q=80",
    lede: "Our therapists help families work through issues related to:",
    tags: "Parent-Child Conflict | Blended Family Dynamics |\nSibling Rivalry | Major Life Changes |\nCaregiver Stress | Communication Patterns |\nBehavioral Concerns | Grief and Loss",
  },
  {
    counter: "04 - 04",
    title: "Group\nTherapy",
    image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1920&q=80",
    lede: "Our therapists lead groups working through shared experiences like:",
    tags: "Grief Support | Anxiety and Stress |\nAddiction Recovery | Young Adult Support |\nLGBTQ+ Community Circles | Chronic Illness |\nDivorce Support | New Parent Groups",
  },
];

export default function TherapySection({ slides = defaultSlides }) {
  const containerRef = useRef(null);
  const bgPhotosRef = useRef([]);
  const thumbPhotosRef = useRef([]);
  const headerTextsRef = useRef([]);
  const bodyTextsRef = useRef([]);

  const [activeIndex, setActiveIndex] = useState(0);

  useGSAP(() => {
    const section = containerRef.current;
    if (!section) return;

    // Refresh ScrollTrigger positions after page layout calculates
    ScrollTrigger.refresh();

    const total = slides.length;

    // 1. Set initial positions for Cover Reveal (slide 0 visible, future slides stacked below at yPercent: 100)
    slides.forEach((_, i) => {
      if (i === 0) {
        gsap.set(bgPhotosRef.current[i], { yPercent: 0 });
        gsap.set(thumbPhotosRef.current[i], { yPercent: 0 });
        gsap.set(headerTextsRef.current[i], { yPercent: 0, opacity: 1 });
        gsap.set(bodyTextsRef.current[i], { yPercent: 0, opacity: 1 });
      } else {
        gsap.set(bgPhotosRef.current[i], { yPercent: 100 });
        gsap.set(thumbPhotosRef.current[i], { yPercent: 100 });
        gsap.set(headerTextsRef.current[i], { yPercent: 40, opacity: 0 });
        gsap.set(bodyTextsRef.current[i], { yPercent: 40, opacity: 0 });
      }
    });

    // 2. Main scrubbed timeline (1:1 direct scroll scrub)
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: () => '+=' + (total - 1) * window.innerHeight,
        pin: true,
        scrub: true,
        onUpdate: (self) => {
          const idx = Math.min(total - 1, Math.floor(self.progress * total));
          setActiveIndex(idx);
        },
      },
    });

    // 3. Synchronized Cover Reveal & Text Transitions
    for (let i = 1; i < total; i++) {
      const startTime = i - 1; // 1 step = 1 unit on timeline

      // A) Background Photo Cover Reveal (Linear 1:1 scroll)
      tl.to(
        bgPhotosRef.current[i],
        {
          yPercent: 0,
          ease: 'none',
          duration: 1,
        },
        startTime
      );

      // B) Thumbnail Cover Reveal (Synchronized 1:1 with Background Photo)
      tl.to(
        thumbPhotosRef.current[i],
        {
          yPercent: 0,
          ease: 'none',
          duration: 1,
        },
        startTime
      );

      // C) Content Text Transition (Starts after image covers 40% threshold)
      // Exit previous text
      tl.to(
        headerTextsRef.current[i - 1],
        {
          yPercent: -40,
          opacity: 0,
          ease: 'power1.in',
          duration: 0.25,
        },
        startTime + 0.4
      );
      tl.to(
        bodyTextsRef.current[i - 1],
        {
          yPercent: -40,
          opacity: 0,
          ease: 'power1.in',
          duration: 0.25,
        },
        startTime + 0.4
      );

      // Enter new text
      tl.to(
        headerTextsRef.current[i],
        {
          yPercent: 0,
          opacity: 1,
          ease: 'power1.out',
          duration: 0.25,
        },
        startTime + 0.65
      );
      tl.to(
        bodyTextsRef.current[i],
        {
          yPercent: 0,
          opacity: 1,
          ease: 'power1.out',
          duration: 0.25,
        },
        startTime + 0.65
      );
    }
  }, { scope: containerRef, dependencies: [slides] });

  return (
    <div className="w-full font-['Jost',sans-serif] bg-[#0d1330] text-[#1f1f1f] overflow-hidden">
      {/* Pinned Full-Screen Therapy Section */}
      <div
        ref={containerRef}
        className="therapy-section relative h-screen w-full overflow-hidden bg-[#e8e4db]"
      >
        {/* Full-bleed Background Photos (Stacked in zIndex 1..total for Cover Reveal) */}
        {slides.map((slide, i) => (
          <img
            key={i}
            ref={(el) => (bgPhotosRef.current[i] = el)}
            src={slide.image}
            alt=""
            className="absolute inset-0 w-full h-full object-cover filter brightness-[0.92] contrast-[0.98] will-change-transform"
            style={{ zIndex: i + 1 }}
          />
        ))}

        {/* Soft Vignette Overlay */}
        <div className="absolute inset-0 bg-black/15 z-10 pointer-events-none" />

        {/* Center Cream Panel */}
        <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-full sm:w-115 md:w-120 bg-[#f6f5ee] z-20 shadow-[0_0_50px_rgba(0,0,0,0.2)] overflow-hidden flex flex-col items-center justify-between px-6 sm:px-10 py-10 sm:py-14">

          {/* 1. TOP HEADER VIEWPORT (Counter & Title) */}
          <div className="relative w-full h-30 sm:h-33.75 overflow-hidden flex items-center justify-center">
            {slides.map((slide, i) => (
              <div
                key={i}
                ref={(el) => (headerTextsRef.current[i] = el)}
                className="absolute inset-0 w-full h-full flex flex-col items-center justify-center text-center will-change-transform"
              >
                <span className="text-[12px] tracking-[0.25em] text-[#8a857b] uppercase mb-3 font-normal">
                  {slide.counter}
                </span>
                <h2 className="font-['Cormorant_Garamond',serif] font-normal text-[30px] sm:text-[36px] text-[#1f1f1f] leading-[1.18] whitespace-pre-line">
                  {slide.title}
                </h2>
              </div>
            ))}
          </div>

          {/* 2. MIDDLE THUMBNAIL VIEWPORT (Strictly Clipped Synchronized Cover Reveal) */}
          <div
            className="relative w-full max-w-85 aspect-16/10 overflow-hidden my-3 rounded-none shadow-none bg-[#f6f5ee]"
            style={{ clipPath: 'inset(0 0 0 0)' }}
          >
            {slides.map((slide, i) => (
              <img
                key={i}
                ref={(el) => (thumbPhotosRef.current[i] = el)}
                src={slide.image}
                alt={slide.title}
                className="absolute inset-0 w-full h-full object-cover block rounded-none will-change-transform pointer-events-none"
                style={{ zIndex: i + 1 }}
              />
            ))}
          </div>

          {/* 3. BOTTOM FOOTER VIEWPORT (Lede, Tags & Explore Link) */}
          <div className="relative w-full h-52.5 sm:h-57.5 overflow-hidden flex items-center justify-center">
            {slides.map((slide, i) => (
              <div
                key={i}
                ref={(el) => (bodyTextsRef.current[i] = el)}
                className="absolute inset-0 w-full h-full flex flex-col items-center justify-between text-center will-change-transform"
              >
                <p className="text-[12px] text-[#928e85] tracking-wide mb-2 max-w-[320px] leading-relaxed">
                  {slide.lede}
                </p>

                <p className="text-[13px] sm:text-[14px] text-[#4a463d] font-medium leading-[1.7] max-w-85 mb-4 whitespace-pre-line">
                  {slide.tags}
                </p>

                <a
                  href="#"
                  className="font-['Jost',sans-serif] font-semibold text-[14px] tracking-wide text-[#111111] hover:text-black inline-flex items-center gap-1.5 transition-colors"
                >
                  Explore <span className="text-[16px] leading-none">↗</span>
                </a>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}

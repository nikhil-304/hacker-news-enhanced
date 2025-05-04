
import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import NewsList from '../components/NewsList';
import Footer from '../components/Footer';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useSmoothScroll } from '../hooks/useSmoothScroll';

gsap.registerPlugin(ScrollTrigger);

const Index = () => {
  useSmoothScroll();
  const [search, setSearch] = useState("");
  
  useEffect(() => {
    // Hero section animation with enhanced timeline
    const tl = gsap.timeline();
    
    tl.fromTo(
      '.hero-title',
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 1.2, ease: 'power3.out' }
    );
    
    tl.fromTo(
      '.hero-subtitle',
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 1, ease: 'power3.out' },
      "-=0.8" // Overlap with previous animation
    );
    
    // Add entrance animation for the search bar
    tl.fromTo(
      '.hero-searchbar',
      { opacity: 0, scale: 0.95, y: 20 },
      { opacity: 1, scale: 1, y: 0, duration: 0.8, ease: 'back.out(1.7)' },
      "-=0.7" // Overlap with subtitle
    );
    
    // Add ScrollTrigger for hero section parallax effect
    ScrollTrigger.create({
      trigger: '.hero-section',
      start: 'top top',
      end: 'bottom top',
      scrub: true,
      onUpdate: (self) => {
        gsap.to('.hero-content', {
          y: self.progress * 50,
          ease: 'none'
        });
      }
    });

    return () => {
      // Clean up all ScrollTriggers when component unmounts
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24">
        {/* Hero Section */}
        <section className="hero-section py-10 md:py-16 px-4 sm:px-6 lg:px-8 mb-2 bg-gradient-to-b from-background to-secondary/30 overflow-hidden">
          <div className="hero-content max-w-3xl mx-auto text-center">
            <h1 className="hero-title text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              Discover the <span className="text-hn-orange font-bold">Best</span> of <span className="text-hn-orange font-bold">Tech</span>
            </h1>
            <p className="hero-subtitle text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
              Explore the top stories from the technology world, curated and voted on by the community.
            </p>
            <input
              type="text"
              placeholder="Search articles..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="hero-searchbar w-full max-w-md px-4 py-2 rounded-md border border-[#6F7378] bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-hn-orange focus:border-hn-orange transition mb-2"
            />
          </div>
        </section>
        {/* News List */}
        <NewsList search={search} />
        {/* Footer */}
        <Footer />
      </main>
    </div>
  );
};

export default Index;

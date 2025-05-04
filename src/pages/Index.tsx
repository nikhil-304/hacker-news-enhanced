
import React, { useEffect } from 'react';
import Header from '../components/Header';
import NewsList from '../components/NewsList';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useSmoothScroll } from '../hooks/useSmoothScroll';

gsap.registerPlugin(ScrollTrigger);

const Index = () => {
  useSmoothScroll();
  
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
      
      <main className="pt-24 lg:pl-56">
        <Sidebar />
        
        {/* Hero Section */}
        <section className="hero-section py-10 md:py-16 px-4 sm:px-6 lg:px-8 mb-4 bg-gradient-to-b from-background to-secondary/30 overflow-hidden">
          <div className="hero-content max-w-3xl mx-auto text-center">
            <h1 className="hero-title text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              Discover the Best of Tech
            </h1>
            <p className="hero-subtitle text-lg text-muted-foreground max-w-2xl mx-auto">
              Explore the top stories from the technology world, curated and voted on by the community.
            </p>
          </div>
        </section>
        
        {/* News List */}
        <NewsList />
        
        {/* Footer */}
        <Footer />
      </main>
    </div>
  );
};

export default Index;


import React, { useState, useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { gsap } from 'gsap';
import { Link } from 'react-router-dom';
import { Menu } from 'lucide-react';

const Header = () => {
  const { theme, toggleTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', onScroll);
    // Enhanced header animation
    const tl = gsap.timeline();
    tl.from('.header-logo', {
      y: -30,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out'
    });
    tl.from('.header-nav-item', {
      y: -20,
      opacity: 0,
      stagger: 0.1,
      duration: 0.5,
      ease: 'power3.out'
    }, "-=0.4");
    tl.from('.header-actions', {
      opacity: 0,
      duration: 0.5,
      ease: 'power3.out'
    }, "-=0.3");
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navItems = ['Top', 'New', 'Best', 'Ask', 'Show', 'Jobs'];

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-background dark:bg-[#080c14] border-b border-border shadow-sm">
      <div className="header-container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-4 w-full">
          {/* Hamburger for Mobile - now on the extreme left */}
          <button
            className="md:hidden mr-2 p-2 rounded hover:bg-muted focus:outline-none"
            onClick={() => setMobileNavOpen(true)}
            aria-label="Open navigation menu"
          >
            <Menu className="h-6 w-6 text-foreground" />
          </button>
          <div className="header-logo flex items-center">
            <div className="w-8 h-8 rounded-md bg-hn-orange flex items-center justify-center">
              <span className="text-white font-bold">Y</span>
            </div>
            <h1 className="ml-2 font-bold text-xl">
              <span className="text-foreground">Hacker</span>
              <span className="text-hn-orange">News</span>
            </h1>
          </div>
          {/* Desktop Nav */}
          <nav className="hidden md:flex space-x-6 ml-6">
            {navItems.map((item, index) => (
              <button
                key={index}
                type="button"
                className="header-nav-item hn-link text-foreground/90 hover:text-foreground transition-colors bg-transparent border-none cursor-pointer"
                onClick={() => {
                  const section = document.getElementById('all-stories');
                  if (section) {
                    section.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
              >
                {item}
              </button>
            ))}
          </nav>
        </div>

        <div className="header-actions flex items-center space-x-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="rounded-full transition-all duration-300 hover:bg-hn-orange/10"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>
          <Button
            variant="ghost"
            className="hidden md:inline-flex hover:bg-hn-orange/10 hover:text-hn-orange transition-colors"
          >
            Sign In
          </Button>
        </div>
      </div>

      {/* Mobile Nav Drawer with slide-in animation */}
      {mobileNavOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 flex md:hidden">
          <div className="w-2/3 max-w-xs bg-background h-full shadow-lg p-6 flex flex-col transform -translate-x-full animate-slide-in-left">
            <button
              className="self-end mb-6 p-2 rounded hover:bg-muted"
              onClick={() => setMobileNavOpen(false)}
              aria-label="Close navigation menu"
            >
              <span className="text-2xl">&times;</span>
            </button>
            <nav className="flex flex-col space-y-4">
              {navItems.map((item, index) => (
                <button
                  key={index}
                  type="button"
                  className="text-lg text-foreground/90 hover:text-hn-orange transition-colors text-left"
                  onClick={() => {
                    setMobileNavOpen(false);
                    const section = document.getElementById('all-stories');
                    if (section) {
                      section.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                >
                  {item}
                </button>
              ))}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;

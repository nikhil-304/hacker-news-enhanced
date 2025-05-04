
import React, { useState, useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { gsap } from 'gsap';

const Header = () => {
  const { theme, toggleTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);

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

  return (
    <header className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300 w-full",
      scrolled ?
        "bg-background/95 backdrop-blur-md shadow-sm border-b" :
        "bg-transparent"
    )}>
      <div className="header-container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="header-logo flex items-center">
            <div className="w-8 h-8 rounded-md bg-hn-orange flex items-center justify-center">
              <span className="text-white font-bold">Y</span>
            </div>
            <h1 className="ml-2 font-bold text-xl hidden sm:block">
              <span className="text-foreground">Hacker</span>
              <span className="text-hn-orange">News</span>
            </h1>
          </div>

          <nav className="hidden md:flex space-x-6">
            {['Top', 'New', 'Best', 'Ask', 'Show', 'Jobs'].map((item, index) => (
              <a
                key={index}
                href="#"
                className="header-nav-item hn-link text-foreground/90 hover:text-foreground transition-colors"
              >
                {item}
              </a>
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
    </header>
  );
};

export default Header;

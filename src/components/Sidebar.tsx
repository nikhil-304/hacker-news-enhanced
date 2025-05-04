
import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const categories = [
  { name: 'Top', url: '#', active: true },
  { name: 'New', url: '#', active: false },
  { name: 'Best', url: '#', active: false },
  { name: 'Ask', url: '#', active: false },
  { name: 'Show', url: '#', active: false },
  { name: 'Jobs', url: '#', active: false },
];

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ open, onClose }) => {
  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sidebar = sidebarRef.current;
    if (!sidebar) return;

    // Clear any existing animations
    gsap.killTweensOf(".sidebar-item");
    
    // Initial animation for sidebar items with staggered effect
    gsap.fromTo(
      '.sidebar-item',
      { 
        opacity: 0, 
        x: -20 
      },
      { 
        opacity: 1, 
        x: 0, 
        duration: 0.5, 
        stagger: 0.1,
        ease: 'power3.out',
        delay: 0.3
      }
    );

    // Create scroll-based animations for sidebar
    ScrollTrigger.create({
      trigger: document.body,
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (self) => {
        // Subtle parallax effect for sidebar content
        gsap.to(sidebar, {
          y: self.progress * 15,
          duration: 0.5,
          ease: 'power1.out'
        });

        // Highlight effect for sidebar items based on scroll position
        const items = document.querySelectorAll('.sidebar-item a');
        const scrollProgress = self.progress;
        
        items.forEach((item, index) => {
          // Determine if this item should be highlighted based on scroll position
          const sectionSize = 1 / items.length;
          const itemProgress = index * sectionSize;
          const nextThreshold = (index + 1) * sectionSize;
          let opacity = 0.7;
          let scale = 1;
          
          // If scroll is in this section's range
          if (scrollProgress >= itemProgress && scrollProgress < nextThreshold) {
            opacity = 1;
            scale = 1.05;
          }
          
          // Apply the subtle animation
          gsap.to(item, {
            opacity: item.classList.contains('bg-hn-orange') ? 1 : opacity,
            scale: item.classList.contains('bg-hn-orange') ? 1 : scale,
            duration: 0.3
          });
        });
      }
    });

    return () => {
      // Clean up all animations and scroll triggers
      gsap.killTweensOf(".sidebar-item");
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [open]); // Add open as a dependency to re-run animations when sidebar opens

  return (
    <>
      {/* Overlay for mobile and tablet */}
      <div
        className={`fixed inset-0 bg-black/40 z-40 transition-opacity duration-300 lg:hidden ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />
      <aside
        ref={sidebarRef}
        className={`fixed top-16 left-0 h-[calc(100vh-4rem)] w-64 md:w-72 bg-background/95 backdrop-blur-sm border-r shadow-sm z-50 transform transition-all duration-300 ease-in-out ${open ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:w-56 xl:w-64`}
      >
        {/* Close button - visible only on mobile/tablet */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-full hover:bg-muted lg:hidden"
          aria-label="Close sidebar"
        >
          <X className="h-5 w-5 text-muted-foreground" />
        </button>
        
        <div className="px-4 py-6 overflow-y-auto h-full">
          <h2 className="text-lg font-medium mb-4">Categories</h2>
          
          <nav>
            <ul className="space-y-1">
              {categories.map((category, index) => (
                <li key={index} className="sidebar-item">
                  <a 
                    href={category.url}
                    className={`flex items-center px-3 py-2 rounded-md text-sm transition-all duration-300 ${category.active ? 'bg-hn-orange text-white shadow-md' : 'hover:bg-hn-orange/10 hover:text-hn-orange'}`}
                  >
                    {category.name}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          
          <div className="mt-8 px-3">
            <h3 className="text-sm font-medium text-foreground/80 mb-2">About</h3>
            <p className="text-xs text-muted-foreground mb-4">
              Hacker News is a social news website focusing on computer science and entrepreneurship.
            </p>
            
            <Button variant="outline" className="w-full text-xs" size="sm">
              Sign Up / Login
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;

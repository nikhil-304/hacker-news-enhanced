import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Story } from './StoryCard';
import { ExternalLink, Clock, MessageSquare, TrendingUp, Award, Star } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';

gsap.registerPlugin(ScrollTrigger);

interface EnhancedBentoGridProps {
  stories: Story[];
}

const EnhancedBentoGrid: React.FC<EnhancedBentoGridProps> = ({ stories }) => {
  const firstRowRef = useRef<HTMLDivElement>(null);
  const secondRowRef = useRef<HTMLDivElement>(null);
  const firstRowAnimationRef = useRef<gsap.core.Tween | null>(null);
  const secondRowAnimationRef = useRef<gsap.core.Tween | null>(null);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  // Use a ref to track if animations have been initialized
  const animationsInitialized = useRef(false);

  useEffect(() => {
    if (stories.length === 0) return;
    
    // Wait for DOM to be fully rendered and images loaded
    const initializeAnimations = () => {
      if (!firstRowRef.current || !secondRowRef.current) return;
      
      // Clear any existing animations
      if (firstRowAnimationRef.current) firstRowAnimationRef.current.kill();
      if (secondRowAnimationRef.current) secondRowAnimationRef.current.kill();
      
      // Get the actual widths after rendering
      const firstRowWidth = firstRowRef.current.scrollWidth;
      const secondRowWidth = secondRowRef.current.scrollWidth;
      
      // Only proceed if we have valid widths
      if (firstRowWidth <= 0 || secondRowWidth <= 0) return;
      
      // First row animation (left to right)
      firstRowAnimationRef.current = gsap.fromTo(
        firstRowRef.current, 
        { x: -firstRowWidth / 2 }, 
        {
          x: 0,
          duration: 60, // Moderate speed (60 seconds instead of 90)
          repeat: -1,
          ease: "linear",
          paused: false,
        }
      );
      
      // Second row animation (right to left)
      secondRowAnimationRef.current = gsap.fromTo(
        secondRowRef.current,
        { x: 0 },
        {
          x: -secondRowWidth / 2,
          duration: 60, // Moderate speed (60 seconds instead of 90)
          repeat: -1,
          ease: "linear",
          paused: false,
        }
      );
      
      // Mark animations as initialized
      animationsInitialized.current = true;
    };
    
    // Initial animation for the grid
    const cards = document.querySelectorAll('.bento-card');
    gsap.set(cards, { opacity: 0, y: 30 });
    
    ScrollTrigger.create({
      trigger: document.querySelector('.bento-grid-container'),
      start: 'top bottom-=100',
      onEnter: () => {
        gsap.to(cards, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.05,
          ease: 'power3.out',
          onComplete: () => {
            // Initialize carousel animations after cards are visible
            setTimeout(initializeAnimations, 300); // Increased delay for better initialization
          }
        });
      },
      once: true
    });
    
    // Also try to initialize on component mount after a delay
    if (!animationsInitialized.current) {
      setTimeout(initializeAnimations, 1500); // Increased delay for better initialization
    }
    
    // Clean up
    return () => {
      if (firstRowAnimationRef.current) firstRowAnimationRef.current.kill();
      if (secondRowAnimationRef.current) secondRowAnimationRef.current.kill();
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [stories]);

  const handleMouseEnter = (rowRef: React.RefObject<gsap.core.Tween>) => {
    rowRef.current?.pause();
  };

  const handleMouseLeave = (rowRef: React.RefObject<gsap.core.Tween>) => {
    rowRef.current?.play();
  };

  if (stories.length === 0) return null;

  // Split stories into rows with better distribution
  const firstRowStories = stories.slice(0, Math.min(10, stories.length));
  const secondRowStories = stories.slice(Math.min(10, stories.length), Math.min(20, stories.length));
  // If second row has fewer than 5 items, add some from first row to ensure enough items
  if (secondRowStories.length < 5 && firstRowStories.length > 5) {
    secondRowStories.push(...firstRowStories.slice(0, 5 - secondRowStories.length));
  }

  return (
    <div className="bento-grid-container w-full overflow-hidden rounded-lg bg-background/50 p-4">
      <h3 className="text-xl font-semibold mb-4 text-foreground/90">Trending Stories</h3>
      <div className="space-y-8"> {/* Increased space between rows */}
        {/* First Row - Left to Right */}
        <div className="relative overflow-hidden py-2 rounded-lg">
          <div
            ref={firstRowRef}
            className="flex flex-nowrap w-full justify-start items-center gap-3"
            onMouseEnter={() => handleMouseEnter(firstRowAnimationRef)}
            onMouseLeave={() => handleMouseLeave(firstRowAnimationRef)}
          >
            {/* Duplicate cards for infinite scroll effect */}
            {[...firstRowStories, ...firstRowStories].map((story, index) => (
              <div key={`first-${story.id}-${index}`} className="flex-shrink-0 flex-grow-0"> 
                <BentoCard 
                  story={story} 
                  size="medium" 
                  isHovered={hoveredCard === story.id}
                  onHover={setHoveredCard}
                  index={index % firstRowStories.length}
                />
              </div>
            ))}
          </div>
          
          {/* Gradient overlays for seamless effect */}
          <div className="absolute top-0 left-0 w-20 h-full bg-gradient-to-r from-background to-transparent z-10"></div>
          <div className="absolute top-0 right-0 w-20 h-full bg-gradient-to-l from-background to-transparent z-10"></div>
        </div>
        
        {/* Second Row - Right to Left */}
        <div className="relative overflow-hidden py-2 rounded-lg">
          <div
            ref={secondRowRef}
            className="flex flex-nowrap w-full justify-start items-center gap-3"
            onMouseEnter={() => handleMouseEnter(secondRowAnimationRef)}
            onMouseLeave={() => handleMouseLeave(secondRowAnimationRef)}
          >
            {/* Duplicate cards for infinite scroll effect */}
            {[...secondRowStories, ...secondRowStories].map((story, index) => (
              <div key={`second-${story.id}-${index}`} className="flex-shrink-0 flex-grow-0"> 
                <BentoCard 
                  story={story} 
                  size="small" 
                  isHovered={hoveredCard === story.id}
                  onHover={setHoveredCard}
                  index={(index % secondRowStories.length) + firstRowStories.length}
                />
              </div>
            ))}
          </div>
          
          {/* Gradient overlays for seamless effect */}
          <div className="absolute top-0 left-0 w-20 h-full bg-gradient-to-r from-background to-transparent z-10"></div>
          <div className="absolute top-0 right-0 w-20 h-full bg-gradient-to-l from-background to-transparent z-10"></div>
        </div>
      </div>
    </div>
  );
};

type CardSize = 'large' | 'medium' | 'small' | 'xs';

interface BentoCardProps {
  story: Story;
  size: CardSize;
  isHovered: boolean;
  onHover: (id: number | null) => void;
  index: number;
}

const BentoCard: React.FC<BentoCardProps> = ({ story, size, isHovered, onHover, index }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const domain = story.url ? new URL(story.url).hostname.replace('www.', '') : '';
  const timeAgo = formatDistanceToNow(new Date(story.time * 1000), { addSuffix: true });
  
  // Determine if story is trending based on score
  const isTrending = story.score > 100; // Threshold for trending

  // Size-specific styles - Increased sizes for better visibility
  const sizeStyles = {
    large: "h-[250px] w-[360px]",
    medium: "h-[210px] w-[320px]",
    small: "h-[190px] w-[280px]",
    xs: "h-[170px] w-[240px]"
  };
  
  // Title font sizes - Improved hierarchy
  const titleStyles = {
    large: "text-xl font-bold line-clamp-2",
    medium: "text-lg font-semibold line-clamp-2",
    small: "text-base font-medium line-clamp-2",
    xs: "text-sm font-medium line-clamp-2"
  };

  // Enhanced hover animations with useEffect
  useEffect(() => {
    if (!cardRef.current) return;
    
    if (isHovered) {
      // Apply hover animations
      gsap.to(cardRef.current, {
        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
        scale: 1.03,
        borderColor: "var(--hn-orange)", // Add brand-colored border
        borderWidth: "2px",
        duration: 0.3,
        ease: "power2.out"
      });
      
      // Animate the title slightly
      const title = cardRef.current.querySelector('h3');
      if (title) {
        gsap.to(title, {
          y: -3,
          color: "var(--hn-orange)",
          duration: 0.3
        });
      }
    } else {
      // Reset animations
      gsap.to(cardRef.current, {
        boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
        scale: 1,
        borderColor: "var(--border)", // Reset border color
        borderWidth: "1px",
        duration: 0.3,
        ease: "power2.out"
      });
      
      // Reset title
      const title = cardRef.current.querySelector('h3');
      if (title) {
        gsap.to(title, {
          y: 0,
          color: "var(--foreground)",
          duration: 0.3
        });
      }
    }
  }, [isHovered]);

  return (
    <div 
      ref={cardRef}
      className={cn(
        "bento-card relative rounded-xl bg-card border overflow-hidden transition-all duration-300 flex-shrink-0",
        sizeStyles[size]
      )}
      onMouseEnter={() => onHover(story.id)}
      onMouseLeave={() => onHover(null)}
    >
      {/* Trending tag - positioned in top right corner */}
      {isTrending && (
        <div className="absolute top-2 right-2 bg-hn-orange text-white text-xs px-2 py-1 rounded-full flex items-center gap-1 z-10 shadow-sm transform transition-transform duration-300 hover:scale-105">
          <TrendingUp className="w-3 h-3" />
          <span>Trending</span>
        </div>
      )}
      
      <a 
        href={story.url || `#/item/${story.id}`} 
        target={story.url ? "_blank" : undefined}
        rel={story.url ? "noopener noreferrer" : undefined}
        className="block h-full p-4"
      >
        {/* Clean, minimal layout with proper spacing */}
        <div className="flex flex-col h-full">
          {/* Domain - Simple text */}
          {domain && (
            <div className="text-xs text-muted-foreground mb-2">
              {domain}
            </div>
          )}
          
          {/* Title - Clean and prominent */}
          <h3 className={cn("mb-auto", titleStyles[size])}>
            {story.title}
          </h3>
          
          {/* Footer with only author and time */}
          <div className="flex items-center justify-between mt-3 pt-2 text-xs text-muted-foreground">
            <span>by {story.by}</span>
            <span>{timeAgo}</span>
          </div>
        </div>
      </a>
    </div>
  );
};

export default EnhancedBentoGrid;
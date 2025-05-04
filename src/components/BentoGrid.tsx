
import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Story } from './StoryCard';
import { ExternalLink, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface BentoGridProps {
  stories: Story[];
}

const BentoGrid: React.FC<BentoGridProps> = ({ stories }) => {
  const firstRowRef = useRef<HTMLDivElement>(null);
  const secondRowRef = useRef<HTMLDivElement>(null);
  const firstRowAnimationRef = useRef<gsap.core.Tween | null>(null);
  const secondRowAnimationRef = useRef<gsap.core.Tween | null>(null);

  useEffect(() => {
    if (stories.length === 0 || !firstRowRef.current || !secondRowRef.current) return;

    const firstRowWidth = firstRowRef.current.scrollWidth;
    const secondRowWidth = secondRowRef.current.scrollWidth;
    
    // First row animation (right to left) - slower speed
    firstRowAnimationRef.current = gsap.to(firstRowRef.current, {
      x: -firstRowWidth / 2,
      duration: 60, // Much slower animation (60 seconds)
      repeat: -1,
      ease: "none",
      paused: false,
    });
    
    // Second row animation (left to right) - slower speed
    secondRowAnimationRef.current = gsap.fromTo(
      secondRowRef.current, 
      { x: -secondRowWidth / 2 }, 
      {
        x: 0,
        duration: 60, // Much slower animation
        repeat: -1,
        ease: "none",
        paused: false,
      }
    );
    
    // Clean up
    return () => {
      firstRowAnimationRef.current?.kill();
      secondRowAnimationRef.current?.kill();
    };
  }, [stories]);

  const handleMouseEnter = (rowRef: React.RefObject<gsap.core.Tween>) => {
    rowRef.current?.pause();
  };

  const handleMouseLeave = (rowRef: React.RefObject<gsap.core.Tween>) => {
    rowRef.current?.play();
  };

  // Split stories into two rows
  const firstRowStories = stories.slice(0, Math.min(10, stories.length));
  const secondRowStories = stories.slice(Math.min(10, stories.length), Math.min(20, stories.length));

  return (
    <div className="bento-grid max-w-full overflow-hidden py-12">
      <h2 className="text-2xl font-bold mb-8 text-center">Trending Stories</h2>
      
      {/* First Row - Right to Left */}
      <div className="relative overflow-hidden mb-6">
        <div
          ref={firstRowRef}
          className="flex"
          onMouseEnter={() => handleMouseEnter(firstRowAnimationRef)}
          onMouseLeave={() => handleMouseLeave(firstRowAnimationRef)}
        >
          {/* Duplicate cards for infinite scroll effect */}
          {[...firstRowStories, ...firstRowStories].map((story, index) => (
            <BentoCard key={`${story.id}-${index}`} story={story} />
          ))}
        </div>
      </div>
      
      {/* Second Row - Left to Right */}
      <div className="relative overflow-hidden mb-12">
        <div
          ref={secondRowRef}
          className="flex"
          onMouseEnter={() => handleMouseEnter(secondRowAnimationRef)}
          onMouseLeave={() => handleMouseLeave(secondRowAnimationRef)}
        >
          {/* Duplicate cards for infinite scroll effect */}
          {[...secondRowStories, ...secondRowStories].map((story, index) => (
            <BentoCard key={`${story.id}-${index}`} story={story} />
          ))}
        </div>
      </div>
    </div>
  );
};

const BentoCard: React.FC<{ story: Story }> = ({ story }) => {
  const domain = story.url ? new URL(story.url).hostname.replace('www.', '') : '';
  const timeAgo = formatDistanceToNow(new Date(story.time * 1000), { addSuffix: true });

  return (
    <a 
      href={story.url || `#/item/${story.id}`} 
      target={story.url ? "_blank" : undefined}
      rel={story.url ? "noopener noreferrer" : undefined}
      className="bento-card flex-shrink-0 w-[280px] h-[200px] bg-card border border-border rounded-lg p-4 m-2 overflow-hidden hover:bg-secondary/20 transition-all duration-200 hover:shadow-md cursor-pointer transform hover:scale-105"
    >
      <h3 className="text-md font-medium mb-2 line-clamp-2 h-12">{story.title}</h3>
      
      {domain && (
        <div className="flex items-center text-xs text-muted-foreground mb-2">
          <ExternalLink className="w-3 h-3 mr-1" />
          <span>{domain}</span>
        </div>
      )}
      
      <div className="mt-auto flex justify-between items-end text-xs text-muted-foreground">
        <span>by {story.by}</span>
        <div className="flex items-center">
          <Clock className="w-3 h-3 mr-1" />
          <span>{timeAgo}</span>
        </div>
      </div>
      
      <div className="absolute top-2 right-2 bg-primary text-white text-xs px-2 py-1 rounded-full">
        {story.score} points
      </div>
    </a>
  );
};

export default BentoGrid;

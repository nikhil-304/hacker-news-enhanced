
import React, { useState, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import StoryCard, { Story } from './StoryCard';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import axios from 'axios';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

gsap.registerPlugin(ScrollTrigger);

const STORIES_PER_PAGE = 10;

const fetchTopStoryIds = async () => {
  const response = await axios.get('https://hacker-news.firebaseio.com/v0/topstories.json');
  return response.data;
};

const fetchStory = async (id: number): Promise<Story> => {
  const response = await axios.get(`https://hacker-news.firebaseio.com/v0/item/${id}.json`);
  return response.data;
};

const NewsList = () => {
  const [page, setPage] = useState(1);
  const [stories, setStories] = useState<Story[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  
  const { data: storyIds, isLoading: isLoadingIds, error: idsError } = useQuery({
    queryKey: ['topStoryIds'],
    queryFn: fetchTopStoryIds,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
  
  const { data: pageStories, isLoading: isLoadingStories } = 
    useQuery({
      queryKey: ['stories', page],
      queryFn: async () => {
        if (!storyIds) return [];
        
        const start = (page - 1) * STORIES_PER_PAGE;
        const end = start + STORIES_PER_PAGE;
        const pageStoryIds = storyIds.slice(start, end);
        
        const fetchedStories = await Promise.all(pageStoryIds.map((id: number) => fetchStory(id)));
        return fetchedStories;
      },
      enabled: !!storyIds,
      staleTime: 5 * 60 * 1000, // 5 minutes
    });
  
  // Update stories when page stories change
  useEffect(() => {
    if (pageStories) {
      setStories(prev => {
        // Filter out duplicates when adding new stories
        const newStories = pageStories.filter(
          newStory => !prev.some(existingStory => existingStory.id === newStory.id)
        );
        return [...prev, ...newStories];
      });
    }
  }, [pageStories]);
    
  const loadMore = () => {
    setPage((prevPage) => prevPage + 1);
  };
  
  // Enhanced ScrollTrigger animations for list view with viewport-based reveal
  useEffect(() => {
    if (!containerRef.current) return;
    
    // Clear any existing ScrollTrigger instances
    ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    
    // First, make the section visible but with initial transform
    if (sectionRef.current) {
      gsap.set(sectionRef.current, { 
        opacity: 1, 
        y: 0 
      });
    }
    
    // Create smooth scroll-driven animations for story cards
    const storyCards = containerRef.current.querySelectorAll('.story-card');
    
    // Hide all cards initially
    gsap.set(storyCards, { 
      opacity: 0, 
      y: 50,
      scale: 0.95
    });
    
    // Create individual scroll triggers for each card with viewport-based reveal
    storyCards.forEach((card, index) => {
      // Only show cards when they enter the viewport
      ScrollTrigger.create({
        trigger: card,
        start: 'top bottom-=20', // Start animation when card is about to enter viewport
        end: 'bottom top+=20', // End animation when card leaves viewport
        toggleActions: 'play none none reverse', // Play when enters, reverse when leaves
        onEnter: () => {
          // Animate card when it enters viewport
          gsap.to(card, {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.6,
            ease: 'back.out(1.2)',
            clearProps: 'scale' // Clear scale after animation to prevent conflicts
          });
        },
        onLeave: () => {
          // Hide card when it leaves viewport (optional, remove if you want cards to stay visible)
          gsap.to(card, {
            opacity: 0,
            y: -30,
            duration: 0.3,
            ease: 'power1.in'
          });
        },
        onEnterBack: () => {
          // Show card again when scrolling back up
          gsap.to(card, {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.6,
            ease: 'back.out(1.2)',
            clearProps: 'scale'
          });
        },
        onLeaveBack: () => {
          // Hide card when scrolling back up and it leaves viewport
          gsap.to(card, {
            opacity: 0,
            y: 50,
            scale: 0.95,
            duration: 0.3,
            ease: 'power1.in'
          });
        }
      });
      
      // Add hover effect for each card
      card.addEventListener('mouseenter', () => {
        gsap.to(card, {
          y: -5,
          scale: 1.02,
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
          duration: 0.3,
          ease: 'power2.out'
        });
      });
      
      card.addEventListener('mouseleave', () => {
        gsap.to(card, {
          y: 0,
          scale: 1,
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
          duration: 0.3,
          ease: 'power2.out'
        });
      });
    });

    // Add scroll animation for section title with parallax
    if (sectionRef.current) {
      const title = sectionRef.current.querySelector('h2');
      if (title) {
        ScrollTrigger.create({
          trigger: sectionRef.current,
          start: 'top bottom-=100',
          end: 'top center',
          scrub: 0.3, // Smoother scrub
          onUpdate: (self) => {
            // Parallax effect for the title
            gsap.to(title, {
              y: -30 * self.progress, // More pronounced movement
              duration: 0.1,
              ease: 'none'
            });
          }
        });
      }
    }
    
    // Animate the "Load More" button
    if (loadMoreRef.current) {
      ScrollTrigger.create({
        trigger: loadMoreRef.current,
        start: 'top bottom-=50',
        toggleActions: 'play none none none', // Only play when enters
        onEnter: () => {
          gsap.fromTo(
            loadMoreRef.current,
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 0.6, ease: 'back.out(1.7)' }
          );
        }
      });
    }
    
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [stories]);
  
  if (isLoadingIds) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-hn-orange" />
      </div>
    );
  }
  
  if (idsError) {
    return (
      <div className="text-center py-10">
        <p className="text-destructive mb-4">Failed to load stories. Please try again.</p>
        <Button onClick={() => window.location.reload()}>Refresh</Button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* List View Section */}
      <section 
        ref={sectionRef} 
        className="opacity-0" // Will be set to visible by GSAP
      >
        <h2 className="text-2xl font-bold mb-6 inline-block relative after:content-[''] after:absolute after:w-full after:h-1 after:bg-hn-orange/30 after:bottom-0 after:left-0">
          All Stories
        </h2>
        <div ref={containerRef} className="stories-container space-y-6">
          {stories.map((story: Story, index: number) => (
            <StoryCard key={story.id} story={story} index={index} />
          ))}
        </div>
      </section>
      
      <div ref={loadMoreRef} className="flex justify-center py-8 opacity-0"> {/* Set initially invisible */}
        {isLoadingStories ? (
          <Loader2 className="w-6 h-6 animate-spin text-hn-orange" />
        ) : (
          <Button 
            onClick={loadMore} 
            variant="outline"
            className="border-hn-orange text-hn-orange hover:bg-hn-orange/10 transform transition-all duration-300 hover:scale-105"
          >
            Load More Stories
          </Button>
        )}
      </div>
    </div>
  );
};

export default NewsList;

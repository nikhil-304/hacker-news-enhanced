
import React, { useState, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import StoryCard, { Story } from './StoryCard';
import BentoGrid from './BentoGrid';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import axios from 'axios';
import { Loader2, Grid2x2, Grid3x3 } from 'lucide-react';
import { Button } from '@/components/ui/button';

gsap.registerPlugin(ScrollTrigger);

const STORIES_PER_PAGE = 10;

type ViewMode = 'list' | 'bento';

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
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const containerRef = useRef<HTMLDivElement>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  
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
  
  // Set up ScrollTrigger animations
  useEffect(() => {
    if (!containerRef.current || viewMode !== 'list') return;
    
    // Clear any existing ScrollTrigger instances
    ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    
    // Animate the container itself
    gsap.fromTo(
      '.stories-container',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }
    );
    
    // Create stagger effect for story cards
    const storyCards = containerRef.current.querySelectorAll('.story-card');
    storyCards.forEach((card, index) => {
      gsap.set(card, { opacity: 0, y: 50 });
      
      ScrollTrigger.create({
        trigger: card,
        start: 'top bottom-=100',
        onEnter: () => {
          gsap.to(card, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            delay: Math.min(index * 0.1, 0.5),
            ease: 'power3.out'
          });
        },
        once: false
      });
    });
    
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [stories, viewMode]);
  
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
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Top Stories</h2>
        <div className="flex space-x-2">
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('list')}
            aria-label="List view"
            className={viewMode === 'list' ? 'bg-hn-orange hover:bg-hn-orange/90' : ''}
          >
            <Grid3x3 className="w-4 h-4 mr-1" /> List
          </Button>
          <Button
            variant={viewMode === 'bento' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('bento')}
            aria-label="Bento view"
            className={viewMode === 'bento' ? 'bg-hn-orange hover:bg-hn-orange/90' : ''}
          >
            <Grid2x2 className="w-4 h-4 mr-1" /> Bento
          </Button>
        </div>
      </div>
      
      {viewMode === 'bento' ? (
        <BentoGrid stories={stories} />
      ) : (
        <div ref={containerRef} className="stories-container">
          {stories.map((story: Story, index: number) => (
            <StoryCard key={story.id} story={story} index={index} />
          ))}
        </div>
      )}
      
      <div ref={loadMoreRef} className="flex justify-center py-8">
        {isLoadingStories ? (
          <Loader2 className="w-6 h-6 animate-spin text-hn-orange" />
        ) : (
          <Button 
            onClick={loadMore} 
            variant="outline"
            className="border-hn-orange text-hn-orange hover:bg-hn-orange/10"
          >
            Load More Stories
          </Button>
        )}
      </div>
    </div>
  );
};

export default NewsList;

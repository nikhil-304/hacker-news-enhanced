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

interface NewsListProps {
  search?: string;
}

const NewsList = ({ search = "" }: NewsListProps) => {
  const [page, setPage] = useState(1);
  const [stories, setStories] = useState<Story[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  const { data: storyIds, isLoading: isLoadingIds, error: idsError } = useQuery({
    queryKey: ['topStoryIds'],
    queryFn: fetchTopStoryIds,
    staleTime: 5 * 60 * 1000,
  });

  const { data: pageStories, isLoading: isLoadingStories } = useQuery({
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
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (pageStories) {
      setStories(prev => {
        const newStories = pageStories.filter(
          newStory => !prev.some(existingStory => existingStory.id === newStory.id)
        );
        return [...prev, ...newStories];
      });
    }
  }, [pageStories]);

  const loadMore = () => {
    setPage(prevPage => prevPage + 1);
  };

  // Modern entrance animation for All Stories
  useEffect(() => {
    if (!containerRef.current || !sectionRef.current) return;
    ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    gsap.set(sectionRef.current, { opacity: 1, y: 0 });
    const storyCards = containerRef.current.querySelectorAll('.story-card');
    gsap.set(storyCards, { opacity: 0, y: 40 });
    ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top 80%',
      once: true,
      onEnter: () => {
        gsap.to(storyCards, {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.13,
          ease: 'power2.out',
          overwrite: 'auto',
          clearProps: 'all'
        });
      }
    });
    const title = sectionRef.current.querySelector('h2');
    if (title) {
      gsap.fromTo(title, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' });
    }
    if (loadMoreRef.current) {
      gsap.set(loadMoreRef.current, { opacity: 0, y: 30 });
      ScrollTrigger.create({
        trigger: loadMoreRef.current,
        start: 'top 90%',
        once: true,
        onEnter: () => {
          gsap.to(loadMoreRef.current, { opacity: 1, y: 0, duration: 0.7, ease: 'back.out(1.7)' });
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
      <section ref={sectionRef} id="all-stories" className="opacity-0">
        <h2 className="text-2xl font-bold mb-6 inline-block relative after:content-[''] after:absolute after:w-full after:h-1 after:bg-hn-orange/30 after:bottom-0 after:left-0">
          All Stories
        </h2>
        <div ref={containerRef} className="stories-container space-y-6">
          {stories
            .filter((story: Story) =>
              story.title.toLowerCase().includes(search.toLowerCase())
            )
            .map((story: Story, index: number) => (
              <StoryCard key={story.id} story={story} index={index} />
            ))}
        </div>
      </section>
      <div ref={loadMoreRef} className="flex justify-center py-8 opacity-0">
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
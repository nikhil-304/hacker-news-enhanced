
import React, { useEffect, useRef } from 'react';
import { ExternalLink, MessageSquare, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';
import { gsap } from 'gsap';
import { useVote } from '@/hooks/useVote';

export interface Story {
  id: number;
  title: string;
  url?: string;
  score: number;
  by: string;
  time: number;
  descendants: number;
  voted?: 'up' | null;
}

interface StoryCardProps {
  story: Story;
  index: number;
}

const StoryCard = ({ story, index }: StoryCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const { vote, voted, score } = useVote(story.id, story.score, story.voted);
  
  useEffect(() => {
    gsap.fromTo(
      cardRef.current,
      { 
        opacity: 0,
        y: 20,
      },
      { 
        opacity: 1,
        y: 0,
        duration: 0.5,
        delay: index * 0.1,
        ease: 'power3.out'
      }
    );
  }, [index]);

  const domain = story.url ? new URL(story.url).hostname.replace('www.', '') : '';
  const timeAgo = formatDistanceToNow(new Date(story.time * 1000), { addSuffix: true });

  return (
    <div 
      ref={cardRef}
      className="story-card rounded-lg bg-card border p-4 mb-4 relative"
    >
      <div className="flex items-start">
        <div className="mr-4 flex flex-col items-center space-y-1 pt-1 min-w-[40px]">
          <Button 
            variant="ghost" 
            size="sm" 
            className={cn(
              "p-0 h-6 w-6 rounded-full hover:bg-hn-orange/10",
              voted === 'up' && "text-hn-orange"
            )}
            onClick={() => vote('up')}
            aria-label="Upvote"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="16" 
              height="16" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              className="lucide lucide-thumbs-up"
            >
              <path d="M7 10v12" />
              <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z" />
            </svg>
          </Button>
          
          <span className="text-center font-medium text-sm">
            {score}
          </span>
        </div>
        
        <div className="flex-1">
          <h2 className="text-lg font-medium mb-1">
            <a 
              href={story.url || `#/item/${story.id}`} 
              className="hover:text-hn-orange transition-colors"
              target={story.url ? "_blank" : undefined}
              rel={story.url ? "noopener noreferrer" : undefined}
            >
              {story.title}
            </a>
          </h2>
          
          {domain && (
            <div className="flex items-center text-xs text-muted-foreground mb-2">
              <ExternalLink className="w-3 h-3 mr-1" />
              <span>{domain}</span>
            </div>
          )}
          
          <div className="flex flex-wrap items-center text-sm text-muted-foreground space-x-3">
            <span className="flex items-center">
              <span className="text-xs">by</span>
              <a href={`#/user/${story.by}`} className="ml-1 text-foreground hover:text-hn-orange">
                {story.by}
              </a>
            </span>
            
            <span className="flex items-center">
              <Clock className="w-3 h-3 mr-1" />
              <span>{timeAgo}</span>
            </span>
            
            <a href={`#/item/${story.id}`} className="flex items-center hover:text-hn-orange">
              <MessageSquare className="w-3 h-3 mr-1" />
              <span>{story.descendants || 0} comments</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoryCard;

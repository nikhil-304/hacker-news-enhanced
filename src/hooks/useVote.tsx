
import { useState, useEffect } from 'react';
import { toast } from '@/components/ui/sonner';

export function useVote(
  storyId: number, 
  initialScore: number,
  initialVote?: 'up' | null
) {
  const [voted, setVoted] = useState<'up' | null>(null);
  const [score, setScore] = useState(initialScore);
  
  // Load saved vote from localStorage on mount
  useEffect(() => {
    const savedVote = localStorage.getItem(`vote-${storyId}`);
    if (savedVote) {
      setVoted(savedVote as 'up');
    } else if (initialVote) {
      setVoted(initialVote);
    }
  }, [storyId, initialVote]);
  
  const vote = (direction: 'up') => {
    // If already voted in the same direction, remove vote
    if (voted === direction) {
      localStorage.removeItem(`vote-${storyId}`);
      setVoted(null);
      setScore(initialScore);
      toast('Vote removed');
      return;
    }
    
    // New vote
    setScore(initialScore + 1);
    setVoted(direction);
    localStorage.setItem(`vote-${storyId}`, direction);
    
    toast('Upvoted!', {
      icon: '👍',
    });
  };
  
  return { vote, voted, score };
}

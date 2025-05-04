
import { useEffect } from 'react';
import Lenis from '@studio-freight/lenis';

export function useSmoothScroll() {
  useEffect(() => {
    // Create a new Lenis smooth scroll instance
    const lenis = new Lenis({
      duration: 1.8, // Increased for smoother scrolling 
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Ease out expo
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.8, // Reduced for smoother scrolling
      touchMultiplier: 1.5,
      infinite: false,
    });

    // Link the scroll animation to the requestAnimationFrame
    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    // Start the animation frame
    requestAnimationFrame(raf);

    // Add a class to html for smooth scrolling styles
    document.documentElement.classList.add('has-scroll-smooth');

    // Cleanup function
    return () => {
      lenis.destroy();
      document.documentElement.classList.remove('has-scroll-smooth');
    };
  }, []);
}

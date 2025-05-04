import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { gsap } from "gsap";
import Header from "@/components/Header";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
    
    // Animate the 404 elements
    gsap.fromTo(
      ".not-found-title",
      { opacity: 0, y: -50 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }
    );
    
    gsap.fromTo(
      ".not-found-message",
      { opacity: 0 },
      { opacity: 1, duration: 0.8, delay: 0.3, ease: "power3.out" }
    );
    
    gsap.fromTo(
      ".not-found-button",
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.8, delay: 0.6, ease: "power3.out" }
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="flex flex-col items-center justify-center min-h-[80vh] px-4">
        <h1 className="not-found-title text-8xl font-bold text-hn-orange mb-6">404</h1>
        <p className="not-found-message text-xl text-foreground mb-8 text-center max-w-md">
          Oops! The page you're looking for doesn't exist or has been moved.
        </p>
        <Button 
          asChild 
          className="not-found-button bg-hn-orange hover:bg-hn-orange/90"
        >
          <a href="/">Return to Home</a>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;

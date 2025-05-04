
import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-card border-t mt-10 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="md:flex md:justify-between">
          <div className="mb-6 md:mb-0">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 rounded-md bg-hn-orange flex items-center justify-center">
                <span className="text-white font-bold">Y</span>
              </div>
              <h2 className="ml-2 font-bold text-lg">
                <span className="text-foreground">Hacker</span>
                <span className="text-hn-orange">News</span>
              </h2>
            </div>
            <p className="text-sm text-muted-foreground max-w-md">
              A redesigned version of Hacker News with modern UI/UX and interactive features.
              This is a demo project showcasing GSAP animations and smooth scrolling.
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-8 sm:gap-12">
            <div>
              <h3 className="text-sm font-semibold mb-4">Links</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-muted-foreground hover:text-hn-orange">Top</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-hn-orange">New</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-hn-orange">Best</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-hn-orange">Ask</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold mb-4">More</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-muted-foreground hover:text-hn-orange">Guidelines</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-hn-orange">FAQ</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-hn-orange">API</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-hn-orange">Legal</a></li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-border/70">
          <p className="text-sm text-muted-foreground text-center">
            &copy; {new Date().getFullYear()} Hacker News Redesigned. This is a concept demo.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;


import { useEffect } from "react";

export function useSmoothScroll() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    const html = document.documentElement;
    // Remove any smooth scroll classes and restore native scrolling
    html.classList.remove("has-scroll-smooth", "has-locomotive-scroll");
    html.style.overflow = "auto";
    html.style.scrollBehavior = "auto";
    return () => {
      html.classList.remove("has-scroll-smooth", "has-locomotive-scroll");
      html.style.overflow = "auto";
      html.style.scrollBehavior = "auto";
    };
  }, []);
}

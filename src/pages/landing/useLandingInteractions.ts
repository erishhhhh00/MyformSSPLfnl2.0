import { useEffect } from 'react';

export const useLandingInteractions = () => {
  useEffect(() => {
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    const toggleMenu = () => navLinks?.classList.toggle('active');
    mobileBtn?.addEventListener('click', toggleMenu);

    const checkVisibility = () => {
      const elements = document.querySelectorAll('.service-card, .project-card');
      elements.forEach((element) => {
        const elementTop = (element as HTMLElement).getBoundingClientRect().top;
        const elementVisible = 150;
        if (elementTop < window.innerHeight - elementVisible) {
          element.classList.add('visible');
        }
      });
    };

    checkVisibility();
    window.addEventListener('scroll', checkVisibility);

    const anchorHandler = (e: Event) => {
      e.preventDefault();
      const target = e.currentTarget as HTMLAnchorElement;
      const targetId = target.getAttribute('href');
      if (!targetId || targetId === '#') return;
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        window.scrollTo({ top: (targetElement as HTMLElement).offsetTop - 80, behavior: 'smooth' });
        navLinks?.classList.remove('active');
      }
    };

    const anchors = document.querySelectorAll('a[href^="#"]');
    anchors.forEach((a) => a.addEventListener('click', anchorHandler));

    const header = document.querySelector('header') as HTMLElement | null;
    const onScrollHeader = () => {
      if (!header) return;
      if (window.scrollY > 100) {
        header.style.padding = '15px 5%';
        header.style.background = 'rgba(0, 0, 0, 0.95)';
      } else {
        header.style.padding = '20px 5%';
        header.style.background = 'rgba(0, 0, 0, 0.9)';
      }
    };

    window.addEventListener('scroll', onScrollHeader);

    return () => {
      mobileBtn?.removeEventListener('click', toggleMenu);
      window.removeEventListener('scroll', checkVisibility);
      anchors.forEach((a) => a.removeEventListener('click', anchorHandler));
      window.removeEventListener('scroll', onScrollHeader);
    };
  }, []);
};



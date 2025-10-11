"use strict";

document.addEventListener("DOMContentLoaded", function () {
  document.body.classList.remove("preloader");
  
  const pageType = document.body.getAttribute('data-bc-page-type');
  switch(pageType) {
    case 'home':
      const featuredCategoriesContainerSelector = '.category-list';
      const featuredCategoriesContainer = document.querySelector(featuredCategoriesContainerSelector);
      const categoryCollagesEnabled = featuredCategoriesContainer?.dataset.categoryCollagesEnabled === 'true';
  
      if (categoryCollagesEnabled) {
        setupCategoryCollages({ 
          collage: { 
            width: 960, 
            height: 960 
          } 
        });
      }

      // Handle homepage slideshow link functionality
      const homepageSlideshowLink = themeOptions.homepageSlideshowLink && themeOptions.homepageSlideshowLink.trim() !== '' ? themeOptions.homepageSlideshowLink : null;
      if (homepageSlideshowLink) {
        const slideshow = document.querySelector(".home-slideshow");
        if (slideshow) {
          // Use event delegation - single listener on the slideshow container
          slideshow.addEventListener("click", function(event) {
            // CRITICAL: Protect carousel controls from triggering navigation
            if (!event.target.closest('.splide__arrow, .splide__pagination')) {
              // Check if the click occurred within a slide
              const clickedSlide = event.target.closest('.splide__slide');
              if (clickedSlide) {
                event.preventDefault();
                event.stopPropagation();
                if (isExternalLink(homepageSlideshowLink)) {
                  window.open(homepageSlideshowLink, '_blank', 'noopener,noreferrer');
                } else {
                  window.location.href = homepageSlideshowLink;
                }
              }
            }
          });

          // Add accessibility attributes and visual feedback to all slides
          const slides = slideshow.querySelectorAll('.splide__slide');
          slides.forEach(slide => {
            slide.classList.add('hero-clickable');
            slide.setAttribute('role', 'button');
            slide.setAttribute('aria-label', "Navigate to " + homepageSlideshowLink);
          });
        }
      }

      // Handle welcome image link functionality
      const welcomeImageLink = themeOptions.welcomeImageLink && themeOptions.welcomeImageLink.trim() !== '' ? themeOptions.welcomeImageLink : null;
      if (welcomeImageLink) {
        // More robust selector that works with or without pattern
        const welcomeImage = document.querySelector('#pattern.welcome-image img, #pattern img[alt="Welcome image"]');
        if (welcomeImage) {
          welcomeImage.classList.add('hero-clickable');
          welcomeImage.setAttribute('role', 'button');
          welcomeImage.setAttribute('aria-label', 'Navigate to ' + welcomeImageLink);
          welcomeImage.style.position = 'relative';
          welcomeImage.style.zIndex = '1';
          welcomeImage.addEventListener("click", function(event) {
            event.preventDefault();
            event.stopPropagation();
            if (isExternalLink(welcomeImageLink)) {
              window.open(welcomeImageLink, '_blank', 'noopener,noreferrer');
            } else {
              window.location.href = welcomeImageLink;
            }
          });
        }
      }
      break;
    case 'contact':
      let contactFields = document.querySelectorAll(".contact-form input, .contact-form textarea");
      contactFields.forEach(function (contactField) {
        contactField.removeAttribute("tabindex");
      });
      break;
  }

  const numShades = 5;

  let cssProperties = [];

  for (const themeColor in themeColors) {
    const hexValue = themeColors[themeColor];
    var hsl = tinycolor(hexValue).toHsl();
    for (var i = numShades - 1; i >= 0; i -= 1) {
      hsl.l = (i + 0.5) / numShades;
      cssProperties.push(`--${camelCaseToDash(themeColor)}-${((i * 100) / 1000) * 200}: ${tinycolor(hsl).toRgbString()};`);
    }
    numColor = tinycolor(hexValue).toRgb();
    cssProperties.push(`--${camelCaseToDash(themeColor)}-rgb: ${numColor["r"]}, ${numColor["g"]}, ${numColor["b"]};`);
  }

  const headTag = document.getElementsByTagName("head")[0];
  const styleTag = document.createElement("style");

  styleTag.innerHTML = `
    :root {
      ${cssProperties.join("\n")}
    }
  `;
  headTag.appendChild(styleTag);

  drawPattern();

  const menu = document.querySelector('.header');
  const mainContent = document.querySelector('#main');
  const originalStyle = mainContent.getAttribute('style') || '';
  const scrolledClass = 'page-head-scrolled';
  let menuHeight, headerHeight;

  const updateHeights = () => {
    menuHeight = menu.offsetHeight;
    const announcementMessage = document.querySelector('.announcement-message.visible');
    headerHeight = (announcementMessage) ? announcementMessage.offsetHeight : 0;
  }

  const handleScroll = () => {
    if (window.innerWidth < 668) {
      return;
    }
    if (window.pageYOffset > headerHeight) {
      menu.classList.add(scrolledClass);
      menuHeight = menu.offsetHeight;
      mainContent.style.marginTop = `${menuHeight}px`;
    } else {
      menu.classList.remove(scrolledClass);
      mainContent.setAttribute('style', originalStyle);
    }
  }

  window.addEventListener('resize', () => {
    drawPattern();
    updateHeights();
  });

  window.dispatchEvent(new Event('resize'));

  window.addEventListener('scroll', handleScroll);
});

window.addEventListener("load", () => {
  document.body.classList.remove("transition-preloader");
});

function drawPattern() {
  const patternStyle = themeOptions.pattern_style;
  const storeNameLength = themeOptions.store_name.length;
  const canvasElement = document.getElementById('repeating-pattern');
  const primaryColor = themeColors.accentBackgroundColor.toLowerCase();
  const secondaryColor = themeColors.accentPatternColor.toLowerCase();
  let patternWidth = (window.innerWidth > 0) ? window.innerWidth : screen.width;

  if (themeOptions.page === 'home') {
    const patternElement = document.getElementById('pattern');
    const headerElement = document.querySelector('.header');
    const announcementMessage = document.querySelector('.announcement-message.visible');
    const announceHeight = (announcementMessage) ? announcementMessage.offsetHeight : 0;
    const patternCalc = announceHeight + headerElement.offsetHeight;

    if (patternWidth < 668 || patternElement.classList.contains('hide-featured')) {
      patternElement.style.height = `calc(100vh - ${patternCalc}px)`;
    } else {
      patternElement.style.height = null;
    }
  }
  else {
    // we only want a pattern when the page width is larger than 668px
    if (patternWidth < 668) {
      canvasElement.style.width = '100%';
      return;
    }

  }

  // Draw pattern for small and large triangles
  if (patternStyle === 'small-triangles' || patternStyle === 'large-triangles') {
    const patternElement = document.getElementById('pattern');
    const patternHeight = patternElement.offsetHeight;


    if (primaryColor !== 'transparent' && secondaryColor !== 'transparent' && patternHeight > 0) {
      canvasElement.style.width = `${patternWidth}px`;

      let cellSize;
      if (patternStyle === 'small-triangles') {
        cellSize = storeNameLength * 5;
      }
      if (patternStyle === 'large-triangles') {
        cellSize = storeNameLength * 35;
      }

      const pattern = Trianglify({
        width: patternWidth,
        height: patternHeight,
        cell_size: cellSize,
        seed: 1,
        variance: 1,
        x_colors: [primaryColor, secondaryColor, primaryColor]
      });

      pattern.canvas(canvasElement);
    }
  }
}

// Hybrid announcement pause: hover on desktop, tap-to-toggle on mobile, focus for keyboard
document.addEventListener('DOMContentLoaded', () => {
  const announcement = document.querySelector('.announcement-message--scrolling');

  if (!announcement) return;

  let isPaused = false;

  announcement.addEventListener('click', (e) => {
    // Don't toggle if user clicked a link - let the link work normally
    if (e.target.closest('a')) return;

    // Toggle pause state
    isPaused = !isPaused;
    announcement.classList.toggle('is-paused', isPaused);
  });
});

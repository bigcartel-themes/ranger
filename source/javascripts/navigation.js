const navHeadings = document.querySelectorAll('.nav-heading');
const dropdowns = document.querySelectorAll('.nav-dropdown');

// Function to close all dropdowns
function closeAllDropdowns() {
  navHeadings.forEach(heading => {
    heading.setAttribute('aria-expanded', 'false');
  });
  
  dropdowns.forEach(dropdown => {
    dropdown.setAttribute('aria-hidden', 'true');
  });
}

// Create one escape key handler for the document
function handleEscapeKey(e) {
  if (e.key === 'Escape') {
    closeAllDropdowns();
    document.removeEventListener('keydown', handleEscapeKey);
  }
}

navHeadings.forEach(function(navHeading) {
  navHeading.addEventListener('click', function(e) {
    e.stopPropagation();

    const thisButton = e.currentTarget;
    const dropdownId = thisButton.getAttribute('aria-controls');
    const dropdown = document.getElementById(dropdownId);
    
    if (!dropdown) {
      console.warn(`Dropdown with ID "${dropdownId}" not found`);
      return;
    }
    
    const isExpanded = thisButton.getAttribute('aria-expanded') === 'true';

    // First close all dropdowns
    closeAllDropdowns();
    
    // If this dropdown wasn't already open, open it
    if (!isExpanded) {
      navHeading.setAttribute('aria-expanded', 'true');
      dropdown.setAttribute('aria-hidden', 'false');
      
      // Set up a single escape key handler
      document.removeEventListener('keydown', handleEscapeKey);
      document.addEventListener('keydown', handleEscapeKey);
    }
  });
});

// Close dropdowns when clicking outside
document.addEventListener('click', function(e) {
  const target = e.target;
  const isDropdown = target.classList.contains('nav-dropdown') || 
                     target.closest('.nav-dropdown') || 
                     target.classList.contains('nav-heading') ||
                     target.closest('.nav-heading');

  if (!isDropdown) {
    closeAllDropdowns();
  }
});

function setHeaderBottomPosition() {
  const headerBottomPosition = document.querySelector('header').getBoundingClientRect().bottom;
  document.documentElement.style.setProperty('--header-bottom-position', `${headerBottomPosition}px`);
}

const toggleMenuButton = document.querySelector('.open-mobile-navigation');
const sidebarNavigation = document.getElementById('mobile-navigation');

function toggleSidebarNavigation() {
  setHeaderBottomPosition();
  document.body.classList.toggle('no-scroll');
  const isButtonExpanded = toggleMenuButton.getAttribute('aria-expanded') === 'true';
  const isMenuHidden = sidebarNavigation.getAttribute('aria-hidden') === 'true';
  toggleMenuButton.setAttribute('aria-expanded', isButtonExpanded ? 'false' : 'true');
  sidebarNavigation.setAttribute('aria-hidden', isMenuHidden ? 'false' : 'true');
}

toggleMenuButton.addEventListener('click', toggleSidebarNavigation);

const adjustDropdownHeights = () => {
  dropdowns.forEach((dropdown) => {
    const dropdownRect = dropdown.getBoundingClientRect();
    const availableSpace = window.innerHeight - dropdownRect.top - 20;
    dropdown.style.maxHeight = `${availableSpace}px`;
  });
};

adjustDropdownHeights();

window.addEventListener('resize', adjustDropdownHeights);
// navigation.js - Dedicated file for handling navigation functionality

document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle functionality
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const navigationMenu = document.getElementById('main-navigation');
    
    if (mobileMenuToggle && navigationMenu) {
      mobileMenuToggle.addEventListener('click', function() {
        navigationMenu.classList.toggle('active');
        mobileMenuToggle.setAttribute('aria-expanded', 
          mobileMenuToggle.getAttribute('aria-expanded') === 'true' ? 'false' : 'true'
        );
      });
    }
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
      if (navigationMenu && navigationMenu.classList.contains('active')) {
        if (!navigationMenu.contains(event.target) && event.target !== mobileMenuToggle) {
          navigationMenu.classList.remove('active');
          mobileMenuToggle.setAttribute('aria-expanded', 'false');
        }
      }
    });
    
    // Handle dropdown menus on mobile
    const dropdownLinks = document.querySelectorAll('.has-dropdown > a');
    
    dropdownLinks.forEach(function(link) {
      // NEW: Add dropdown toggle button for mobile
      if (window.innerWidth <= 768) {
        const toggleBtn = document.createElement('button');
        toggleBtn.className = 'dropdown-toggle';
        toggleBtn.innerHTML = '▼';
        toggleBtn.setAttribute('aria-label', 'Toggle dropdown menu');
        link.parentNode.insertBefore(toggleBtn, link.nextSibling);
        
        toggleBtn.addEventListener('click', function(e) {
          e.preventDefault();
          e.stopPropagation();
          link.parentNode.classList.toggle('open');
        });
      }
      
      // Handle dropdown click on mobile
      link.addEventListener('click', function(e) {
        if (window.innerWidth <= 768) {
          e.preventDefault();
          link.parentNode.classList.toggle('open');
        }
      });
    });
    
    // HIGHLIGHT: Set active nav item based on current page
    const currentPage = window.location.pathname.split('/').pop();
    const navLinks = document.querySelectorAll('.nav-links li');
    
    navLinks.forEach(function(navItem) {
      const navLink = navItem.querySelector('a');
      if (navLink && navLink.getAttribute('href') === currentPage) {
        navItem.classList.add('active');
      } else if (currentPage === '' && navLink && navLink.getAttribute('href') === 'index.html') {
        // Handle root URL case
        navItem.classList.add('active');
      }
    });
    
    // Breadcrumb generation based on page URL
    generateBreadcrumbs();
  });
  
  // Function to generate breadcrumbs based on current page URL
  function generateBreadcrumbs() {
    const breadcrumbContainer = document.getElementById('breadcrumb-container');
    if (!breadcrumbContainer) return;
    
    const currentPath = window.location.pathname;
    const pathSegments = currentPath.split('/').filter(segment => segment !== '');
    
    // If we're on the homepage, don't show breadcrumbs
    if (pathSegments.length === 0 || 
        (pathSegments.length === 1 && (pathSegments[0] === 'index.html' || pathSegments[0] === ''))) {
      breadcrumbContainer.style.display = 'none';
      return;
    }
    
    // Create home link
    const homeLink = document.createElement('a');
    homeLink.href = '/';
    homeLink.textContent = 'Accueil';
    breadcrumbContainer.appendChild(homeLink);
    
    // HIGHLIGHT: Add icon to home breadcrumb
    const homeIcon = document.createElement('span');
    homeIcon.innerHTML = '🏠 ';
    homeIcon.className = 'breadcrumb-icon';
    homeLink.prepend(homeIcon);
    
    // Generate path structure based on URL segments
    let currentUrl = '';
    pathSegments.forEach((segment, index) => {
      // Add separator
      const separator = document.createElement('span');
      separator.textContent = ' > ';
      separator.className = 'breadcrumb-separator';
      breadcrumbContainer.appendChild(separator);
      
      // Format the segment for display (replace hyphens with spaces, capitalize)
      let displayName = segment
        .replace(/-/g, ' ')
        .replace('.html', '')
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      
      // Custom page names mapping
      const pageNameMapping = {
        'bandlettes-50': 'Bandelettes (50)',
        'product-detail': 'Moniteur de Glycémie Premium',
        'products': 'Tous les Produits',
        'about': 'À Propos',
        'contact': 'Contact'
      };
      
      // Use custom name if available
      if (pageNameMapping[segment.replace('.html', '')]) {
        displayName = pageNameMapping[segment.replace('.html', '')];
      }
      
      currentUrl += '/' + segment;
      
      // Create segment link
      const segmentLink = document.createElement(index === pathSegments.length - 1 ? 'span' : 'a');
      if (index !== pathSegments.length - 1) {
        segmentLink.href = currentUrl;
      } else {
        segmentLink.className = 'breadcrumb-current';
      }
      segmentLink.textContent = displayName;
      breadcrumbContainer.appendChild(segmentLink);
    });
    
    // HIGHLIGHT: Add structured data for SEO
    const scriptTag = document.createElement('script');
    scriptTag.type = 'application/ld+json';
    
    const breadcrumbList = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      'itemListElement': [
        {
          '@type': 'ListItem',
          'position': 1,
          'name': 'Accueil',
          'item': window.location.origin + '/'
        }
      ]
    };
    
    let position = 2;
    let currPath = '';
    
    pathSegments.forEach((segment, index) => {
      if (index < pathSegments.length - 1) {
        currPath += '/' + segment;
        breadcrumbList.itemListElement.push({
          '@type': 'ListItem',
          'position': position,
          'name': segment.replace(/-/g, ' ').replace('.html', ''),
          'item': window.location.origin + currPath
        });
        position++;
      } else {
        breadcrumbList.itemListElement.push({
          '@type': 'ListItem',
          'position': position,
          'name': segment.replace(/-/g, ' ').replace('.html', '')
        });
      }
    });
    
    scriptTag.textContent = JSON.stringify(breadcrumbList);
    document.head.appendChild(scriptTag);
  }
  
  // Update breadcrumbs when navigating with History API
  window.addEventListener('popstate', generateBreadcrumbs);
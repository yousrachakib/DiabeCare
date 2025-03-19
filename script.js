// // Simple JavaScript functionality for the shopping cart
// document.addEventListener('DOMContentLoaded', function() {
//     // Cart functionality
//     const cartCount = document.querySelector('.cart-count');
//     const addToCartButtons = document.querySelectorAll('.add-to-cart');
//     let itemsInCart = 0;
    
//     addToCartButtons.forEach(button => {
//         button.addEventListener('click', function() {
//             itemsInCart++;
//             cartCount.textContent = itemsInCart;
            
//             // Get product info
//             const productCard = this.closest('.product-card');
//             const productName = productCard.querySelector('h3').textContent;
//             const productPrice = productCard.querySelector('.price').textContent;
            
//             // Show success message
//             alert(`Added to cart: ${productName} (${productPrice})`);
//         });
//     });
    
//     // Basic form validation for newsletter
//     const newsletterForm = document.querySelector('.newsletter-form');
    
//     newsletterForm.addEventListener('submit', function(e) {
//         e.preventDefault();
//         const emailInput = this.querySelector('input[type="email"]');
//         const email = emailInput.value.trim();
        
//         if (!email) {
//             alert('Please enter your email address');
//             return;
//         }
        
//         if (!isValidEmail(email)) {
//             alert('Please enter a valid email address');
//             return;
//         }
        
//         alert('Thank you for subscribing to our newsletter!');
//         emailInput.value = '';
//     });
    
//     // Email validation helper
//     function isValidEmail(email) {
//         const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//         return emailRegex.test(email);
//     }
    
//     // Search functionality
//     const searchForm = document.querySelector('.search-form');
    
//     searchForm.addEventListener('submit', function(e) {
//         e.preventDefault();
//         const searchInput = this.querySelector('input').value.trim();
        
//         if (!searchInput) {
//             alert('Please enter a search term');
//             return;
//         }
        
//         alert(`Searching for: ${searchInput}`);
//         // In a real application, this would redirect to search results page
//     });
// });

// Enhanced cart functionality with local storage
document.addEventListener('DOMContentLoaded', function() {
    // Cart functionality
    const cartCount = document.querySelector('.cart-count');
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    let cart = JSON.parse(localStorage.getItem('diabeCareCart')) || [];
    
    // Update cart count display
    function updateCartCount() {
        cartCount.textContent = cart.length;
    }
    
    // Initialize cart count
    updateCartCount();
    
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault(); // Prevent navigation if inside an <a> tag
            
            // Get product info
            const productCard = this.closest('.product-card');
            const productName = productCard.querySelector('h3').textContent;
            const productPrice = productCard.querySelector('.price').textContent;
            const productImage = productCard.querySelector('img').src;
            
            // Add to cart
            const product = {
                name: productName,
                price: productPrice,
                image: productImage,
                quantity: 1
            };
            
            // Check if product already exists in cart
            const existingProductIndex = cart.findIndex(item => item.name === productName);
            
            if (existingProductIndex > -1) {
                cart[existingProductIndex].quantity += 1;
            } else {
                cart.push(product);
            }
            
            // Save to local storage
            localStorage.setItem('diabeCareCart', JSON.stringify(cart));
            
            // Update UI
            updateCartCount();
            
            // Show success message
            alert(`Added to cart: ${productName} (${productPrice})`);
        });
    });
    
    // Add cart icon click handler to show mini cart
    const cartIcon = document.querySelector('.cart-icon');
    cartIcon.addEventListener('click', function() {
        // Here you would either show a dropdown or navigate to cart page
        if (cart.length === 0) {
            alert('Your cart is empty');
        } else {
            // For now, just show what's in the cart
            let cartItems = 'Cart Items:\n';
            cart.forEach(item => {
                cartItems += `${item.name} - ${item.price} × ${item.quantity}\n`;
            });
            alert(cartItems);
            
            // In a real implementation, you would redirect to cart page
            // window.location.href = 'cart.html';
        }
    });
});

document.addEventListener('DOMContentLoaded', function() {
  const cartButtons = document.querySelectorAll('.btn-add-cart');
  const cartCount = document.querySelector('.cart-count');
  
  // Initialize cart from localStorage
  let cart = JSON.parse(localStorage.getItem('diabeCareCart')) || [];
  updateCartCount();
  
  // Add click event to all "Add to cart" buttons
  cartButtons.forEach(button => {
    button.addEventListener('click', function(e) {
      e.preventDefault();
      
      // Get product info from parent element
      const productCard = this.closest('.product-card');
      const productLink = productCard.querySelector('a');
      const productName = productCard.querySelector('h3').textContent;
      const productPrice = productCard.querySelector('.product-price').textContent;
      const productImage = productCard.querySelector('img').src;
      const productUrl = productLink.getAttribute('href');
      
      // Create product object
      const product = {
        id: generateProductId(productName),
        name: productName,
        price: productPrice,
        image: productImage,
        url: productUrl,
        quantity: 1
      };
      
      // Check if product already exists in cart
      const existingProductIndex = cart.findIndex(item => item.id === product.id);
      
      if (existingProductIndex > -1) {
        // Update quantity if product exists
        cart[existingProductIndex].quantity += 1;
      } else {
        // Add new product to cart
        cart.push(product);
      }
      
      // Save to localStorage
      localStorage.setItem('diabeCareCart', JSON.stringify(cart));
      updateCartCount();
      
      // Show success message
      showNotification('Produit ajouté au panier');
    });
  });
  
  // Helper functions
  function generateProductId(name) {
    return name.toLowerCase().replace(/[^a-z0-9]/g, '-');
  }
  
  function updateCartCount() {
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    cartCount.textContent = totalItems;
  }
  
  function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Show and remove after timeout
    setTimeout(() => {
      notification.classList.add('show');
    }, 10);
    
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 300);
    }, 3000);
  }
  
  // Handle cart icon click to show mini cart
  const cartIcon = document.querySelector('.cart');
  if (cartIcon) {
    cartIcon.addEventListener('click', function(e) {
      e.preventDefault();
      showMiniCart();
    });
  }
  
  function showMiniCart() {
    // Remove existing mini cart if present
    const existingMiniCart = document.querySelector('.mini-cart');
    if (existingMiniCart) {
      document.body.removeChild(existingMiniCart);
      return;
    }
    
    // Create mini cart element
    const miniCart = document.createElement('div');
    miniCart.className = 'mini-cart';
    
    // Create header
    const header = document.createElement('div');
    header.className = 'mini-cart-header';
    header.innerHTML = `
      <h3>Votre Panier</h3>
      <button class="mini-cart-close">&times;</button>
    `;
    miniCart.appendChild(header);
    
    // Create content
    const content = document.createElement('div');
    content.className = 'mini-cart-content';
    
    if (cart.length === 0) {
      content.innerHTML = '<p>Votre panier est vide</p>';
    } else {
      const productList = document.createElement('ul');
      
      cart.forEach(item => {
        const li = document.createElement('li');
        li.innerHTML = `
          <div class="mini-cart-item">
            <img src="${item.image}" alt="${item.name}">
            <div class="mini-cart-item-details">
              <h4>${item.name}</h4>
              <p>${item.price} x ${item.quantity}</p>
            </div>
            <button class="remove-item" data-id="${item.id}">&times;</button>
          </div>
        `;
        productList.appendChild(li);
      });
      
      content.appendChild(productList);
      
      // Calculate total
      const total = cart.reduce((sum, item) => {
        const price = parseFloat(item.price.replace('€', '').replace(',', '.').trim());
        return sum + (price * item.quantity);
      }, 0);
      
      const totalElement = document.createElement('div');
      totalElement.className = 'mini-cart-total';
      totalElement.innerHTML = `<p>Total: ${total.toFixed(2)} €</p>`;
      content.appendChild(totalElement);
    }
    
    miniCart.appendChild(content);
    
    // Create footer with checkout button
    const footer = document.createElement('div');
    footer.className = 'mini-cart-footer';
    footer.innerHTML = `
      <a href="#" class="btn btn-primary checkout-btn">Passer la commande</a>
      <button class="btn btn-outline continue-shopping">Continuer les achats</button>
    `;
    miniCart.appendChild(footer);
    
    // Add to DOM
    document.body.appendChild(miniCart);
    
    // Add event listeners
    document.querySelector('.mini-cart-close').addEventListener('click', function() {
      document.body.removeChild(miniCart);
    });
    
    document.querySelector('.continue-shopping').addEventListener('click', function() {
      document.body.removeChild(miniCart);
    });
    
    const removeButtons = document.querySelectorAll('.remove-item');
    removeButtons.forEach(button => {
      button.addEventListener('click', function() {
        const productId = this.getAttribute('data-id');
        removeFromCart(productId);
        document.body.removeChild(miniCart);
        showMiniCart();
      });
    });
  }
  
  function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem('diabeCareCart', JSON.stringify(cart));
    updateCartCount();
  }
});

// Enhanced product filter functionality
// Add this to product-page.js
document.addEventListener('DOMContentLoaded', function() {
  const filterForm = document.querySelector('.product-filters');
  
  if (filterForm) {
    const filterInputs = filterForm.querySelectorAll('input[type="checkbox"], input[type="radio"]');
    const productItems = document.querySelectorAll('.product-card');
    
    filterInputs.forEach(input => {
      input.addEventListener('change', function() {
        filterProducts();
      });
    });
    
    function filterProducts() {
      // Get selected categories
      const selectedCategories = Array.from(
        filterForm.querySelectorAll('input[name="category"]:checked')
      ).map(input => input.value);
      
      // Get selected price range
      const selectedPriceRange = filterForm.querySelector('input[name="price"]:checked')?.value;
      
      // Get selected availability
      const inStockOnly = filterForm.querySelector('input[name="stock"]')?.checked;
      
      productItems.forEach(product => {
        const productCategory = product.dataset.category;
        const productPrice = parseFloat(product.dataset.price || 0);
        const productInStock = product.dataset.stock === 'true';
        
        let categoryMatch = selectedCategories.length === 0 || selectedCategories.includes(productCategory);
        let priceMatch = true;
        let stockMatch = !inStockOnly || productInStock;
        
        // Check price match
        if (selectedPriceRange) {
          const [min, max] = selectedPriceRange.split('-').map(Number);
          priceMatch = (!min || productPrice >= min) && (!max || productPrice <= max);
        }
        
        // Show or hide product based on filters
        if (categoryMatch && priceMatch && stockMatch) {
          product.style.display = '';
        } else {
          product.style.display = 'none';
        }
      });
      
      // Show "no products found" message if needed
      const visibleProducts = document.querySelectorAll('.product-card[style="display: none;"]');
      const noProductsMessage = document.querySelector('.no-products-found');
      
      if (visibleProducts.length === productItems.length && noProductsMessage) {
        noProductsMessage.style.display = 'block';
      } else if (noProductsMessage) {
        noProductsMessage.style.display = 'none';
      }
    }
  }
});

// Enhanced search functionality
// Add this to navigation.js
document.addEventListener('DOMContentLoaded', function() {
  const searchToggle = document.querySelector('.search-toggle');
  const searchContainer = document.querySelector('.search-container');
  const searchForm = document.querySelector('.search-container form');
  const searchInput = document.querySelector('.search-container input[name="search"]');
  
  if (searchToggle && searchContainer) {
    // Toggle search form visibility
    searchToggle.addEventListener('click', function(e) {
      e.preventDefault();
      searchContainer.classList.toggle('active');
      if (searchContainer.classList.contains('active')) {
        searchInput.focus();
      }
    });
    
    // Close search when clicking outside
    document.addEventListener('click', function(e) {
      if (!searchContainer.contains(e.target) && !searchToggle.contains(e.target)) {
        searchContainer.classList.remove('active');
      }
    });
    
    // Live search functionality
    if (searchInput) {
      const productsData = [];
      
      // Fetch products data from an endpoint or use existing data
      // For demo, populate with visible products on the page
      document.querySelectorAll('.product-card').forEach(product => {
        const productName = product.querySelector('h3')?.textContent;
        const productDescription = product.querySelector('.product-description')?.textContent;
        const productUrl = product.querySelector('a')?.getAttribute('href');
        
        if (productName) {
          productsData.push({
            name: productName,
            description: productDescription || '',
            url: productUrl || '#'
          });
        }
      });
      
      // Create search results container
      const searchResults = document.createElement('div');
      searchResults.className = 'search-results';
      searchContainer.appendChild(searchResults);
      
      // Add live search functionality
      searchInput.addEventListener('input', function() {
        const query = this.value.toLowerCase().trim();
        
        if (query.length < 2) {
          searchResults.innerHTML = '';
          searchResults.style.display = 'none';
          return;
        }
        
        // Filter products based on query
        const matchedProducts = productsData.filter(product => {
          return product.name.toLowerCase().includes(query) || 
                 product.description.toLowerCase().includes(query);
        }).slice(0, 5); // Limit to 5 results
        
        // Display results
        searchResults.innerHTML = '';
        
        if (matchedProducts.length === 0) {
          searchResults.innerHTML = '<p>Aucun produit trouvé</p>';
        } else {
          const resultsList = document.createElement('ul');
          
          matchedProducts.forEach(product => {
            const li = document.createElement('li');
            li.innerHTML = `<a href="${product.url}">${product.name}</a>`;
            resultsList.appendChild(li);
          });
          
          searchResults.appendChild(resultsList);
        }
        
        searchResults.style.display = 'block';
      });
      
      // Handle form submission
      searchForm.addEventListener('submit', function(e) {
        const query = searchInput.value.trim();
        if (query.length < 2) {
          e.preventDefault();
        }
      });
    }
  }
});

// Product image gallery functionality
// Add this to product.js
document.addEventListener('DOMContentLoaded', function() {
  const productGallery = document.querySelector('.product-gallery');
  
  if (productGallery) {
    const mainImage = productGallery.querySelector('.main-image img');
    const thumbnails = productGallery.querySelectorAll('.thumbnails img');
    
    thumbnails.forEach(thumbnail => {
      thumbnail.addEventListener('click', function() {
        // Update main image src
        const newSrc = this.getAttribute('data-large') || this.src;
        mainImage.src = newSrc;
        
        // Update active state
        thumbnails.forEach(thumb => thumb.classList.remove('active'));
        this.classList.add('active');
      });
    });
    
    // Add zoom functionality to main image
    if (mainImage) {
      mainImage.addEventListener('mousemove', function(e) {
        const x = e.clientX - this.getBoundingClientRect().left;
        const y = e.clientY - this.getBoundingClientRect().top;
        
        const width = this.offsetWidth;
        const height = this.offsetHeight;
        
        const xPercent = Math.round(100 / (width / x));
        const yPercent = Math.round(100 / (height / y));
        
        this.style.transformOrigin = `${xPercent}% ${yPercent}%`;
      });
      
      mainImage.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.5)';
      });
      
      mainImage.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1)';
        this.style.transformOrigin = 'center center';
      });
    }
  }
});
document.addEventListener('DOMContentLoaded', function() {
    const productsContainer = document.getElementById('products-container');
    const searchInput = document.getElementById('search');
    const characterFilter = document.getElementById('character-filter');
    const rarityFilter = document.getElementById('rarity-filter');
    const colorFilter = document.getElementById('color-filter');
    const sortSelect = document.getElementById('sort');
    let products = [];
    let filteredProducts = [];
    let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    
    async function initCatalog() {
        try {
            products = await API.getProducts();
            filteredProducts = [...products];
            updateCartCount();
            initFilters();
            renderProducts();
            addEventListeners();
        } catch (error) {
            console.error('Erreur lors de l\'initialisation du catalogue:', error);
            productsContainer.innerHTML = `
                <div class="error">
                    Une erreur est survenue lors du chargement des produits.
                    Veuillez réessayer ultérieurement.
                </div>
            `;
        }
    }
    
    function initFilters() {
        const characters = [...new Set(products.map(p => p.characteristics.character))].sort();
        const rarities = [...new Set(products.map(p => p.characteristics.rarity))].sort();
        const colors = [...new Set(products.flatMap(p => p.characteristics.colors))].sort();
        characters.forEach(character => {
            const option = document.createElement('option');
            option.value = character;
            option.textContent = character;
            characterFilter.appendChild(option);
        });
        
        rarities.forEach(rarity => {
            const option = document.createElement('option');
            option.value = rarity;
            option.textContent = rarity;
            rarityFilter.appendChild(option);
        });
        
        colors.forEach(color => {
            const option = document.createElement('option');
            option.value = color;
            option.textContent = color;
            colorFilter.appendChild(option);
        });
    }
    
    function addEventListeners() {
        searchInput.addEventListener('input', applyFilters);
        characterFilter.addEventListener('change', applyFilters);
        rarityFilter.addEventListener('change', applyFilters);
        colorFilter.addEventListener('change', applyFilters);
        sortSelect.addEventListener('change', applyFilters);
    }
    
    function applyFilters() {
        const searchTerm = searchInput.value.toLowerCase().trim();
        const selectedCharacter = characterFilter.value;
        const selectedRarity = rarityFilter.value;
        const selectedColor = colorFilter.value;
        const sortOption = sortSelect.value;
        filteredProducts = products.filter(product => {
            const matchesSearch = product.name.toLowerCase().includes(searchTerm) || 
                                  product.description.toLowerCase().includes(searchTerm);
            const matchesCharacter = !selectedCharacter || product.characteristics.character === selectedCharacter;
            const matchesRarity = !selectedRarity || product.characteristics.rarity === selectedRarity;
            const matchesColor = !selectedColor || product.characteristics.colors.includes(selectedColor);
            
            return matchesSearch && matchesCharacter && matchesRarity && matchesColor;
        });
        sortProducts(sortOption);
        renderProducts();
    }
    
    function sortProducts(sortOption) {
        switch (sortOption) {
            case 'price-asc':
                filteredProducts.sort((a, b) => getDiscountedPrice(a) - getDiscountedPrice(b));
                break;
            case 'price-desc':
                filteredProducts.sort((a, b) => getDiscountedPrice(b) - getDiscountedPrice(a));
                break;
            default:
                break;
        }
    }
    
    function getDiscountedPrice(product) {
        return product.price * (1 - product.reduction / 100);
    }
    function renderProducts() {
        if (filteredProducts.length === 0) {
            productsContainer.innerHTML = `
                <div class="no-results">
                    <p>Aucun produit ne correspond à votre recherche.</p>
                    <button class="btn" onclick="location.reload()">Réinitialiser les filtres</button>
                </div>
            `;
            return;
        }
        
        let html = '';
        
        filteredProducts.forEach(product => {
            const discountedPrice = getDiscountedPrice(product);
            const isInWishlist = wishlist.includes(product.id);
            
            html += `
                <div class="product-card">
                    <div class="product-image">
                        <img src="${product.images[0]}" alt="${product.name}" class="main-image">
                        <img src="${product.images[1]}" alt="${product.name}" class="hover-image">
                        ${product.reduction > 0 ? `<div class="product-badge">-${product.reduction}%</div>` : ''}
                    </div>
                    <div class="product-info">
                        <h3 class="product-name">${product.name}</h3>
                        <div class="product-price">
                            <span class="current-price">${discountedPrice.toFixed(2)} ${product.currency}</span>
                            ${product.reduction > 0 ? `<span class="original-price">${product.price.toFixed(2)} ${product.currency}</span>` : ''}
                        </div>
                        <div class="product-actions">
                            <button class="btn wishlist-btn ${isInWishlist ? 'active' : ''}" data-id="${product.id}">
                                <i class="fas fa-heart"></i>
                            </button>
                            <a href="/product/${product.id}" class="btn">Voir</a>
                        </div>
                    </div>
                </div>
            `;
        });
        
        productsContainer.innerHTML = html;
        document.querySelectorAll('.wishlist-btn').forEach(button => {
            button.addEventListener('click', toggleWishlist);
        });
    }
    function toggleWishlist(event) {
        event.preventDefault();
        const button = event.currentTarget;
        const productId = button.dataset.id;
        const index = wishlist.indexOf(productId);
        
        if (index === -1) {
            wishlist.push(productId);
            button.classList.add('active');
        } else {
            wishlist.splice(index, 1);
            button.classList.remove('active');
        }
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
    }
    function updateCartCount() {
        const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
        const cartCount = document.getElementById('cart-count');
        const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
        
        cartCount.textContent = totalItems;
    }
    initCatalog();
});
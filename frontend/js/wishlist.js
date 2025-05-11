document.addEventListener('DOMContentLoaded', function() {
    const wishlistContainer = document.getElementById('wishlist-container');
    const wishlistEmpty = document.getElementById('wishlist-empty');
    const wishlistItems = document.getElementById('wishlist-items');
    const wishlistSort = document.getElementById('wishlist-sort');
    const cartCount = document.getElementById('cart-count');
    let wishlistIds = JSON.parse(localStorage.getItem('wishlist')) || [];
    let wishlistProducts = [];
    let wishlistPriorities = JSON.parse(localStorage.getItem('wishlistPriorities')) || {};
    async function initWishlistPage() {
        try {
            if (wishlistIds.length === 0) {
                wishlistEmpty.style.display = 'block';
                wishlistItems.style.display = 'none';
                return;
            }
            const allProducts = await API.getProducts();
            wishlistProducts = allProducts.filter(product => wishlistIds.includes(product.id));
            wishlistIds.forEach(id => {
                if (wishlistPriorities[id] === undefined) {
                    wishlistPriorities[id] = 3;
                }
            });
            savePriorities();
            renderWishlist();
            updateCartCount();
            addWishlistEventListeners();
        } catch (error) {
            console.error('Erreur lors de l\'initialisation de la liste de souhaits:', error);
            wishlistContainer.innerHTML = `
                <div class="error">
                    <p>Une erreur est survenue lors du chargement de la liste de souhaits.</p>
                    <a href="/" class="btn">Retour à l'accueil</a>
                </div>
            `;
        }
    }
    
    function addWishlistEventListeners() {
        wishlistSort.addEventListener('change', sortWishlist);
    }
    
    function renderWishlist() {
        if (wishlistProducts.length === 0) {
            wishlistEmpty.style.display = 'block';
            wishlistItems.style.display = 'none';
            return;
        }
        
        wishlistEmpty.style.display = 'none';
        wishlistItems.style.display = 'grid';
        
        let html = '';
        
        wishlistProducts.forEach(product => {
            const discountedPrice = product.price * (1 - product.reduction / 100);
            const priority = wishlistPriorities[product.id] || 3;
            let starsHtml = '';
            for (let i = 1; i <= 5; i++) {
                starsHtml += `
                    <span class="priority-star ${i <= priority ? '' : 'inactive'}" 
                          data-product-id="${product.id}" data-priority="${i}">
                        <i class="fas fa-star"></i>
                    </span>
                `;
            }
            
            html += `
                <div class="wishlist-item">
                    <div class="wishlist-item-image">
                        <img src="${product.images[0]}" alt="${product.name}">
                        ${product.reduction > 0 ? `<div class="product-badge">-${product.reduction}%</div>` : ''}
                    </div>
                    <div class="wishlist-item-info">
                        <h3 class="wishlist-item-name">${product.name}</h3>
                        <div class="wishlist-item-price">
                            <span class="wishlist-item-current-price">${discountedPrice.toFixed(2)} ${product.currency}</span>
                            ${product.reduction > 0 ? 
                                `<span class="wishlist-item-original-price">${product.price.toFixed(2)} ${product.currency}</span>` : ''}
                        </div>
                        <div class="wishlist-item-priority">
                            <p>Priorité:</p>
                            <div class="priority-stars">
                                ${starsHtml}
                            </div>
                        </div>
                        <div class="wishlist-item-actions">
                            <a href="/product/${product.id}" class="btn">Voir le produit</a>
                            <button class="btn wishlist-remove-btn" data-product-id="${product.id}">Supprimer</button>
                        </div>
                    </div>
                </div>
            `;
        });
        
        wishlistItems.innerHTML = html;
        document.querySelectorAll('.priority-star').forEach(star => {
            star.addEventListener('click', updatePriority);
        });
        
        document.querySelectorAll('.wishlist-remove-btn').forEach(btn => {
            btn.addEventListener('click', removeFromWishlist);
        });
    }
    function sortWishlist() {
        const sortOption = wishlistSort.value;
        
        switch (sortOption) {
            case 'priority-desc':
                wishlistProducts.sort((a, b) => 
                    (wishlistPriorities[b.id] || 0) - (wishlistPriorities[a.id] || 0)
                );
                break;
            case 'priority-asc':
                wishlistProducts.sort((a, b) => 
                    (wishlistPriorities[a.id] || 0) - (wishlistPriorities[b.id] || 0)
                );
                break;
            case 'price-asc':
                wishlistProducts.sort((a, b) => 
                    a.price * (1 - a.reduction / 100) - b.price * (1 - b.reduction / 100)
                );
                break;
            case 'price-desc':
                wishlistProducts.sort((a, b) => 
                    b.price * (1 - b.reduction / 100) - a.price * (1 - a.reduction / 100)
                );
                break;
            default:
                break;
        }
        
        renderWishlist();
    }
    
    function updatePriority(event) {
        const productId = event.currentTarget.dataset.productId;
        const priority = parseInt(event.currentTarget.dataset.priority);
        
        wishlistPriorities[productId] = priority;
        savePriorities();
        renderWishlist();
    }

    function removeFromWishlist(event) {
        const productId = event.currentTarget.dataset.productId;
        const index = wishlistIds.indexOf(productId);
        if (index !== -1) {
            wishlistIds.splice(index, 1);
        }
        
        delete wishlistPriorities[productId];
        wishlistProducts = wishlistProducts.filter(product => product.id !== productId);
        saveWishlist();
        savePriorities();
        renderWishlist();
    }
    
    function saveWishlist() {
        localStorage.setItem('wishlist', JSON.stringify(wishlistIds));
    }
    
    function savePriorities() {
        localStorage.setItem('wishlistPriorities', JSON.stringify(wishlistPriorities));
    }
    
    function updateCartCount() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        
        cartCount.textContent = totalItems;
    }
    initWishlistPage();
});
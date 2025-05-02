const API = {
    baseURL: '/api',
    
    getProducts: async function() {
        try {
            const response = await fetch(`${this.baseURL}/products`);
            if (!response.ok) {
                throw new Error('Erreur lors de la récupération des produits');
            }
            return await response.json();
        } catch (error) {
            console.error('Erreur API getProducts:', error);
            return [];
        }
    },
    
    getProductById: async function(id) {
        try {
            const response = await fetch(`${this.baseURL}/products/${id}`);
            if (!response.ok) {
                throw new Error('Erreur lors de la récupération du produit');
            }
            return await response.json();
        } catch (error) {
            console.error('Erreur API getProductById:', error);
            return null;
        }
    },
    
    updateProductStock: async function(id, quantity) {
        try {
            const response = await fetch(`${this.baseURL}/products/${id}/stock`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ quantity })
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Erreur lors de la mise à jour du stock');
            }
            
            return await response.json();
        } catch (error) {
            console.error('Erreur API updateProductStock:', error);
            return { success: false, error: error.message };
        }
    },
    
    searchAddresses: async function(query) {
        try {
            if (!query || query.length < 3) {
                return [];
            }
            
            const response = await fetch(`${this.baseURL}/address/${encodeURIComponent(query)}`);
            if (!response.ok) {
                throw new Error('Erreur lors de la recherche d\'adresses');
            }
            
            return await response.json();
        } catch (error) {
            console.error('Erreur API searchAddresses:', error);
            return [];
        }
    }
};
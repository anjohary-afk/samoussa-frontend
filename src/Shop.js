// src/Shop.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function Shop() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState([]); // État pour le panier
  const [customerName, setCustomerName] = useState('');

  const fetchProducts = async () => {
    try {
      const response = await axios.get('https://samoussa-app.onrender.com/api/products');
      setProducts(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Erreur lors de la récupération des produits:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const addToCart = (product) => {
    setCart((prevCart) => {
      const existingProduct = prevCart.find(item => item.productId === product._id);
      if (existingProduct) {
        // Si le produit existe déjà, on augmente la quantité
        return prevCart.map(item =>
          item.productId === product._id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        // Sinon, on ajoute le produit au panier avec une quantité de 1
        return [...prevCart, { productId: product._id, quantity: 1, name: product.name, price: product.price }];
      }
    });
  };

  const handleOrderSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('https://samoussa-app.onrender.com/api/orders', {
        customerName,
        products: cart.map(item => ({ productId: item.productId, quantity: item.quantity }))
      });
      alert('Commande passée avec succès !');
      setCart([]); // Réinitialise le panier
      setCustomerName(''); // Réinitialise le nom du client
    } catch (error) {
      console.error('Erreur lors de la soumission de la commande:', error);
      alert('Erreur lors de la soumission de la commande.');
    }
  };

  const total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Notre Menu de Samoussas</h1>
        {loading ? (
          <p>Chargement du menu...</p>
        ) : (
          <div className="products-list">
            {products.map((product) => (
              <div key={product._id} className="product-card">
                <h2>{product.name}</h2>
                <p>{product.description}</p>
                <p>Prix : {product.price.toLocaleString('mg', { style: 'currency', currency: 'MGA' })}</p>
                <p>Stock : {product.stock}</p>
                <button onClick={() => addToCart(product)}>Ajouter au panier</button>
              </div>
            ))}
          </div>
        )}

        {/* Section du panier et du formulaire de commande */}
        <div className="cart-container">
          <h2>Mon Panier</h2>
          {cart.length === 0 ? (
            <p>Le panier est vide.</p>
          ) : (
            <>
              <ul>
                {cart.map((item) => (
                  <li key={item.productId}>
                    {item.quantity} x {item.name} - ({item.price.toLocaleString('mg', { style: 'currency', currency: 'MGA' })})
                  </li>
                ))}
              </ul>
              <h3>Total : {total.toLocaleString('mg', { style: 'currency', currency: 'MGA' })}</h3>
              <form onSubmit={handleOrderSubmit}>
                <input
                  type="text"
                  placeholder="Votre nom"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  required
                />
                <button type="submit">Passer la commande</button>
              </form>
            </>
          )}
        </div>
      </header>
    </div>
  );
}

export default Shop;
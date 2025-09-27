// src/App.js

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import axios from 'axios';
import Orders from './Orders';
import './App.css';
import Shop from './Shop';

// Reste du code du composant App.js
function AppContent() {
  // Ton code existant pour la page des produits
  // ... (tout le code de l'étape 13 et 14 se trouve ici)
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newProduct, setNewProduct] = useState({ name: '', description: '', price: '', stock: '' });

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct({ ...newProduct, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (newProduct._id) {
        await axios.put(`https://samoussa-app.onrender.com/api/products/${newProduct._id}`, newProduct);
      } else {
        await axios.post('https://samoussa-app.onrender.com/api/products', newProduct);
      }
      setNewProduct({ name: '', description: '', price: '', stock: '' });
      fetchProducts();
    } catch (error) {
      console.error('Erreur lors de la gestion du produit:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://samoussa-app.onrender.com/api/products/${id}`);
      fetchProducts();
    } catch (error) {
      console.error('Erreur lors de la suppression du produit:', error);
    }
  };

  const handleEdit = (product) => {
    setNewProduct(product);
  };

  return (
    <div className="App-content">
      <header className="App-header">
        <h1>Menu des Samoussas</h1>
        <form onSubmit={handleSubmit} className="product-form">
          <h2>{newProduct._id ? 'Modifier un produit' : 'Ajouter un nouveau produit'}</h2>
          <input type="text" name="name" placeholder="Nom du samoussa" value={newProduct.name} onChange={handleInputChange} required />
          <input type="text" name="description" placeholder="Description" value={newProduct.description} onChange={handleInputChange} required />
          <input type="number" name="price" placeholder="Prix" value={newProduct.price} onChange={handleInputChange} required />
          <input type="number" name="stock" placeholder="Stock" value={newProduct.stock} onChange={handleInputChange} required />
          <button type="submit">{newProduct._id ? 'Modifier' : 'Ajouter'}</button>
        </form>
        <div className="products-list">
          {loading ? (
            <p>Chargement du menu...</p>
          ) : (
            products.map((product) => (
              <div key={product._id} className="product-card">
                <h2>{product.name}</h2>
                <p>{product.description}</p>
                <p>Prix : {product.price.toLocaleString('mg', { style: 'currency', currency: 'MGA' })}</p>
                <p>Stock : {product.stock}</p>
                <div className="product-actions">
                  <button onClick={() => handleEdit(product)}>Modifier</button>
                  <button onClick={() => handleDelete(product._id)}>Supprimer</button>
                </div>
              </div>
            ))
          )}
        </div>
      </header>
    </div>
  );
}

function App() {
  return (
    <Router>
      <div className="App">
        <nav>
          <ul>
            <li>
              <Link to="/">Back-office</Link>
            </li>
            <li>
              <Link to="/shop">Boutique</Link>
            </li>
            <li>
              <Link to="/orders">Commandes</Link>
            </li>
          </ul>
        </nav>
        <Routes>
          <Route path="/" element={<Shop />} />
          <Route path="/admin" element={<AppContent />} />
          <Route path="/orders" element={<Orders />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

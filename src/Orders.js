// src/Orders.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const response = await axios.get('https://samoussa-app.onrender.com/api/orders');
      setOrders(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Erreur lors de la récupération des commandes:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const formatOrderDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await axios.put(`https://samoussa-app.onrender.com/api/orders/${id}`, { status: newStatus });
      fetchOrders(); // Rafraîchit la liste des commandes après la mise à jour
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut:', error);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Gestion des Commandes</h1>
        {loading ? (
          <p>Chargement des commandes...</p>
        ) : (
          <div className="orders-list">
            {orders.map((order) => {
              const total = order.products.reduce((acc, item) => acc + (item.productId.price * item.quantity), 0);
              return (
                <div key={order._id} className="order-card">
                  <h2>Commande de {order.customerName}</h2>
                  <p>Date : {formatOrderDate(order.orderDate)}</p>
                  <h3>Détails des produits :</h3>
                  <ul>
                    {order.products.map((item) => (
                      <li key={item._id}>
                        {item.quantity} x {item.productId.name} ({item.productId.price.toLocaleString('mg', { style: 'currency', currency: 'MGA' })})
                      </li>
                    ))}
                  </ul>
                  <p><strong>Total : {total.toLocaleString('mg', { style: 'currency', currency: 'MGA' })}</strong></p>
                  <p>Statut : 
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order._id, e.target.value)}
                    >
                      <option value="pending">En attente</option>
                      <option value="in production">En production</option>
                      <option value="completed">Terminée</option>
                    </select>
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </header>
    </div>
  );
}

export default Orders;
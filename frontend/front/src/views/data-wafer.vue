<template>
    <div class="container mt-4">
      <h2 >Liste des Données Wafer</h2>
  
      <table class="table table-striped">
        <thead class="table-striped">
          <tr>
            <th>ID</th>
            <th>Activity</th>
            <th>Choix Wafer</th>
            <th>Nombre de Pièces</th>
            <th>Ref Printer</th>
            <th>Date</th>
            <th>Printing</th>
            <th>Commentaire</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in dataWafer" :key="item.id">
            <td>{{ item.id }}</td>
            <td>{{ item.activity }}</td>
            <td>{{ item.choixWafer }}</td>
            <td>{{ item.numberOfParts }}</td>
            <td>{{ item.refPrinter }}</td>
            <td>{{ formatDate(item.Date) }}</td>
            <td>{{ item.printing2 }}</td>
            <td>{{ item.comment || '-' }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import axios from 'axios';
  
  // Stockage des données
  const dataWafer = ref([]);
  
  // Fonction pour récupérer les données depuis l'API
  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/data-wafer');
      dataWafer.value = response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des données', error);
    }
  };
  
  // Fonction pour formater la date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };
  
  // Charger les données au montage du composant
  onMounted(fetchData);
  </script>
  
  <style scoped>
  .container {
    max-width: 900px;
  }
  .table {
    text-align: center;
  }
  </style>
  
<template>
  <div class="container mt-4">
    <h2>Liste des données CHIP</h2>
    
    <!-- Tableau -->
    <table class="table table-striped">
      <thead>
        <tr>
          <th scope="col">#</th>
          <th scope="col">Activity</th>
          <th scope="col">Qty Launch</th>
          <th scope="col">ID Nozzle</th>
          <th scope="col">ID Body</th>
          <th scope="col">ASM Date</th>
          <th scope="col">ASM User</th>
          <th scope="col">Commentaire</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(data, index) in techopsData" :key="index">
          <td>{{ index + 1 }}</td>
          <td>{{ data.activity }}</td>
          <td>{{ data.qtyLaunch }}</td>
          <td>{{ data.idNozzle }}</td>
          <td>{{ data.idBody }}</td>
          <td>{{ data.asmDate }}</td>
          <td>{{ data.asmUser }}</td>
          <td>{{ data.comment }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

// Data
const techopsData = ref([]);

// Fetch data from backend
const fetchData = async () => {
  try {
    const response = await axios.get('http://localhost:3000/api/get-techops-data');
    techopsData.value = response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des données', error);
  }
};

// Fetch data when the component is mounted
onMounted(() => {
  fetchData();
});
</script>

<style scoped>
/* Ajouter des styles personnalisés si nécessaire */
</style>

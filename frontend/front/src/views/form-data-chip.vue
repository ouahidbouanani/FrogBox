<template>
  <Navbar/>
    <div class="container mt-4">
      <form @submit.prevent="submitForm">
        
        <!-- Activity -->
        <div class="mb-3">
          <label class="form-label">Activity </label>
          <div>
            <div v-for="option in activityOptions" :key="option.value" class="form-check form-check-inline">
              <input class="form-check-input" type="radio" :value="option.value" v-model="form.activity" required>
              <label class="form-check-label">{{ option.text }}</label>
            </div>
          </div>
        </div>
  
        <!-- Qty Launch -->
        <div class="mb-3">
          <label class="form-label">Qty Launch </label>
          <select class="form-select" v-model="form.qtyLaunch" required>
            <option v-for="option in qtyOptions" :key="option.value" :value="option.value">{{ option.text }}</option>
          </select>
        </div>
  
        <!-- ID Nozzle -->
        <div class="mb-3">
          <label class="form-label">ID Nozzle </label>
          <input type="text" class="form-control" v-model="form.idNozzle" placeholder="Enter ID Nozzle" required>
        </div>
  
        <!-- ID Body -->
        <div class="mb-3">
          <label class="form-label">ID Body </label>
          <input type="text" class="form-control" v-model="form.idBody" placeholder="Enter ID Body" required>
        </div>
  
        <!-- ASM Calendar -->
        <div class="mb-3">
          <label class="form-label">ASM - 📅 </label>
          <input type="date" class="form-control" v-model="form.asmDate" required>
        </div>
  
        <!-- ASM User -->
        <div class="mb-3">
          <label class="form-label">ASM - 👤 </label>
          <select class="form-select" v-model="form.asmUser" required>
            <option v-for="option in userOptions" :key="option.value" :value="option.value">{{ option.text }}</option>
          </select>
        </div>
  
        <!-- Commentaire -->
        <div class="mb-3">
          <label class="form-label">Commentaire</label>
          <textarea class="form-control" v-model="form.comment" placeholder="Ajouter un commentaire"></textarea>
        </div>
  
        <!-- Bouton Submit -->
        <button type="submit" class="btn btn-primary">Submit</button>
      </form>
    </div>
</template>
  
<script setup>
  import { ref } from 'vue';
  import axios from 'axios';
  import Navbar from '@/components/Navbar.vue';
  
  const form = ref({
    activity: '',
    qtyLaunch: '',
    idNozzle: '',
    idBody: '',
    asmDate: '',
    asmUser: '',
    comment: ''
  });
  
  // Options pour les champs du formulaire
  const activityOptions = [
    { text: 'PRD', value: 'PRD' },
    { text: 'PQA', value: 'PQA' },
    { text: 'NOS', value: 'NOS' },
    { text: 'DEV', value: 'DEV' }
  ];
  
  const qtyOptions = Array.from({ length: 20 }, (_, i) => ({ text: i + 1, value: i + 1 }));
  
  const userOptions = [
    { text: 'VINCENT GRUSON (vincent.gruson@treefrog.fr)', value: 'vincent.gruson@treefrog.fr' },
    { text: ' NICOLAS BIZ (Nicolas.biz@treefrog.fr)', value: 'Nicolas.biz@treefrog.fr' },
    { text: 'MARINE GARCIA (Marine.garcia@treefrog.fr)', value: 'Marine.garcia@treefrog.fr' },
    { text: 'Estelle PESCHER (estelle.pescher@treefrog.fr)', value: 'thomas.labat@treefrog.fr' }

  ];
  
  const submitForm = async () => {
  try {
    await axios.post('http://localhost:3000/api/data-chip', form.value);
    alert('Données enregistrées avec succès !');
  } catch (error) {
    console.error('Erreur lors de l’envoi du formulaire', error);
  }
};
</script>
  
  
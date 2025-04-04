<template>
  <Navbar/>
    <div class="container mt-4">
      <form @submit.prevent="submitForm">
        
        <!-- Activity -->
        <div class="mb-3">
          <label class="form-label">Activity * </label>
          <div>
            <div v-for="option in activityOptions" :key="option.value" class="form-check form-check-inline">
              <input class="form-check-input" type="radio" :value="option.value" v-model="form.activity" required>
              <label class="form-check-label">{{ option.text }}</label>
            </div>
          </div>
        </div>

        <!-- Choix Wafer -->
        <div class="mb-3">
          <label class="form-label">Choix Wafer * </label>
          <div>
            <div v-for="option in waferOptions" :key="option.value" class="form-check form-check-inline">
              <input class="form-check-input" type="radio" :value="option.value" v-model="form.choixWafer" required>
              <label class="form-check-label">{{ option.text }}</label>
            </div>
          </div>
        </div>

        <!-- Number of Parts -->
        <div class="mb-3">
          <label class="form-label">Number of Parts * </label>
          <input type="number" class="form-control" v-model="form.numberOfParts" required>
        </div>

        <!-- Ref Printer -->
        <div class="mb-3">
          <label class="form-label">Ref Printer * </label>
          <select class="form-select" v-model="form.refPrinter" required>
            <option value="" disabled>Select</option>
            <option v-for="option in printerOptions" :key="option.value" :value="option.value">{{ option.text }}</option>
          </select>
        </div>

        <!-- ASM Calendar -->
        <div class="mb-3">
          <label class="form-label">Date - 📅 </label>
          <input type="date" class="form-control" v-model="form.Date" required>
        </div>

        <!-- Printing 2 -->
        <div class="mb-3">
          <label class="form-label">Printing - 👤 * </label>
          <select class="form-select" v-model="form.printing2" required>
            <option v-for="option in userOptions" :key="option.value" :value="option.value">{{ option.text }}</option>
          </select>
        </div>

        <!-- Commentaires -->
        <div class="mb-3">
          <label class="form-label">Commentaires</label>
          <textarea class="form-control" v-model="form.comment" placeholder="Ajouter un commentaire"></textarea>
        </div>

        <!-- Submit Button -->
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
    choixWafer: '',
    numberOfParts: '',
    refPrinter: '',
    Date: '',
    printing2: '',
    comment: ''
  });

  // Options pour les sélections
  const activityOptions = [
    { text: 'PRD', value: 'PRD' },
    { text: 'PQA', value: 'PQA' },
    { text: 'NOS', value: 'NOS' },
    { text: 'DEV', value: 'DEV' }
  ];

  const waferOptions = [
    { text: 'CSK', value: 'CSK' },
    { text: 'N100', value: 'N100' },
    { text: 'N215', value: 'N215' }
  ];

  const printerOptions = [
  { text: 'VINCENT GRUSON (vincent.gruson@treefrog.fr)', value: 'vincent.gruson@treefrog.fr' },
    { text: ' NICOLAS BIZ (Nicolas.biz@treefrog.fr)', value: 'Nicolas.biz@treefrog.fr' },
    { text: 'MARINE GARCIA (Marine.garcia@treefrog.fr)', value: 'Marine.garcia@treefrog.fr' },
    { text: 'Estelle PESCHER (estelle.pescher@treefrog.fr)', value: 'thomas.labat@treefrog.fr' }
    
  ];

  const userOptions = [
  { text: 'VINCENT GRUSON (vincent.gruson@treefrog.fr)', value: 'vincent.gruson@treefrog.fr' },
    { text: ' NICOLAS BIZ (Nicolas.biz@treefrog.fr)', value: 'Nicolas.biz@treefrog.fr' },
    { text: 'MARINE GARCIA (Marine.garcia@treefrog.fr)', value: 'Marine.garcia@treefrog.fr' },
    { text: 'Estelle PESCHER (estelle.pescher@treefrog.fr)', value: 'thomas.labat@treefrog.fr' }
    
  ];

  // Fonction pour soumettre le formulaire
  const submitForm = async () => {
    try {
      await axios.post('http://localhost:3000/api/data-wafer', form.value);
      alert('Données enregistrées avec succès !');
      // Réinitialisation du formulaire après soumission
      form.value = {
        activity: '',
        choixWafer: '',
        numberOfParts: '',
        refPrinter: '',
        Date: '',
        printing2: '',
        comment: ''
      };
    } catch (error) {
      console.error('Erreur lors de l’envoi du formulaire', error);
    }
  };
</script>

<style scoped>
.container {
  max-width: 600px;
}
</style>

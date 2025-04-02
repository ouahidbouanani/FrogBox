<template>
    <div class="container">
      <h1 class="my-4">Séparer un PDF</h1>
      <input type="file" @change="handleFileUploadForSplit" class="form-control mb-2" />
      
      <div class="form-check mb-2">
        <input type="checkbox" v-model="zipOption" class="form-check-input" id="zipOption" />
        <label class="form-check-label" for="zipOption">Enregistrer les pages dans un fichier ZIP</label>
      </div>
  
      <button @click="splitPDF" class="btn btn-success mb-4" :disabled="!splitFile">Séparer</button>
  
      <div v-if="message" class="alert alert-info mt-4">{{ message }}</div>
      
      <div v-if="downloadLink" class="mt-4">
        <a :href="downloadLink" :download="downloadFilename" class="btn btn-primary">Télécharger le fichier</a>
      </div>
    </div>
  </template>
  
  <script>
  import { ref } from 'vue';
  import axios from 'axios';
  
  export default {
    setup() {
      const splitFile = ref(null);
      const message = ref('');
      const zipOption = ref(false);
      const downloadLink = ref(null);
      const downloadFilename = ref('');
  
      const handleFileUploadForSplit = (event) => {
        splitFile.value = event.target.files[0];
      };
  
      const splitPDF = async () => {
        if (!splitFile.value) {
          message.value = 'Veuillez sélectionner un fichier PDF.';
          return;
        }
  
        const formData = new FormData();
        formData.append('file', splitFile.value);
  
        try {
          const response = await axios.post(zipOption.value ? 'http://localhost:5000/splitzip' : 'http://localhost:5000/split', formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            },
            responseType: 'blob' // Important pour gérer un fichier binaire
          });
  
          // Créer un objet URL pour le téléchargement
          const url = window.URL.createObjectURL(new Blob([response.data]));
          downloadLink.value = url;
  
          // Déterminer le nom du fichier en fonction du type de fichier reçu
          downloadFilename.value = zipOption.value ? 'split_pages.zip' : `${splitFile.value.name.replace('.pdf', '')}_split.zip`;
          message.value = 'PDF séparé avec succès. Vous pouvez télécharger le fichier.';
        } catch (error) {
          console.error('Erreur lors de la séparation du PDF:', error.response ? error.response.data : error.message);
          message.value = 'Erreur lors de la séparation du PDF.';
        }
      };
  
      return {
        splitFile,
        message,
        zipOption,
        downloadLink,
        downloadFilename,
        handleFileUploadForSplit,
        splitPDF
      };
    }
  };
  </script>
  
  <style scoped>
  /* Ajoutez ici vos styles CSS si nécessaire */
  </style>
  
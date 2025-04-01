<template>
    <div class="container mt-5">
      <h2 class="text-center">Convertir PDF en PowerPoint</h2>
  
      <!-- Input pour télécharger le fichier PDF -->
      <div class="mb-3">
        <label for="pdfFile" class="form-label">Choisir un fichier PDF</label>
        <input type="file" id="pdfFile" class="form-control" @change="handleFileUpload" accept="application/pdf" />
      </div>
  
      <!-- Bouton de conversion -->
      <button class="btn btn-primary" @click="convertPdfToPpt" :disabled="!selectedFile || isLoading">
        <span v-if="isLoading" class="spinner-border spinner-border-sm"></span>
        Convertir en PowerPoint
      </button>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import axios from 'axios';
  
  const selectedFile = ref(null);
  const isLoading = ref(false);
  
  // Gérer le fichier sélectionné
  const handleFileUpload = (event) => {
    selectedFile.value = event.target.files[0];
  };
  
  // Envoyer le fichier au backend Flask
  const convertPdfToPpt = async () => {
    if (!selectedFile.value) return;
  
    isLoading.value = true;
  
    const formData = new FormData();
    formData.append("file", selectedFile.value);
  
    try {
      const response = await axios.post("http://127.0.0.1:5000/convert", formData, {
        responseType: "blob",  // On attend un fichier en retour
      });
  
      // Créer un lien de téléchargement
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "converted.pptx");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Erreur lors de la conversion :", error);
      alert("Une erreur s'est produite lors de la conversion.");
    } finally {
      isLoading.value = false;
    }
  };
  </script>
  
  <style scoped>
  .container {
    max-width: 500px;
    margin: auto;
    text-align: center;
  }
  </style>
  
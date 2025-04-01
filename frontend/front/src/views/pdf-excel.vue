<template>
    <div class="container mt-5">
      <h1 class="text-center">Convertir PDF en Excel</h1>
      <p>Extraire les tableaux d'un fichier PDF et les convertir en fichier Excel.</p>
      
      <!-- Formulaire d'upload PDF -->
      <form @submit.prevent="uploadFile" class="mt-4">
        <div class="mb-3">
          <input type="file" ref="fileInput" accept=".pdf" class="form-control" />
        </div>
        <button type="submit" class="btn btn-primary w-100">Convertir en Excel</button>
      </form>
  
      <!-- Lien de téléchargement du fichier Excel -->
      <div v-if="excelUrl" class="mt-4">
        <h3 class="text-center">Le PDF a été converti en Excel</h3>
        <a :href="excelUrl" download="converted.xlsx">
          <button class="btn btn-success w-100">Télécharger</button>
        </a>
      </div>
    </div>
  </template>
  
  <script>
  import { ref } from 'vue';
  
  export default {
    name: 'PdfToExcel',
    setup() {
      const fileInput = ref(null);
      const excelUrl = ref(null);
  
      const uploadFile = async () => {
        const file = fileInput.value.files[0];
        if (!file) return;
  
        const formData = new FormData();
        formData.append('file', file);
  
        try {
          const response = await fetch('http://localhost:5000/convert-excel', {
            method: 'POST',
            body: formData,
          });
  
          if (!response.ok) {
            throw new Error('Erreur lors de la conversion');
          }
  
          // Récupérer le fichier Excel depuis la réponse
          const downloadUrl = URL.createObjectURL(await response.blob());
  
          // Mettre à jour l'URL du fichier Excel
          excelUrl.value = downloadUrl;
        } catch (error) {
          console.error('Erreur:', error);
          alert('Erreur lors de la conversion');
        }
      };
  
      return {
        fileInput,
        excelUrl,
        uploadFile,
      };
    },
  };
  </script>
  
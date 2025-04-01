<template>
    <div class="container mt-5">
      <h1 class="text-center">Convertir PDF en Word</h1>
      <p class="text-center">Téléchargez un fichier PDF et convertissez-le en document Word.</p>
  
      <!-- Formulaire d'upload -->
      <form @submit.prevent="uploadFile" class="mt-4">
        <div class="mb-3">
          <input type="file" ref="fileInput" accept=".pdf" class="form-control" />
        </div>
        <button type="submit" class="btn btn-primary w-100">Convertir en Word</button>
      </form>
  
      <!-- Bouton de téléchargement du fichier Word -->
      <div v-if="wordUrl" class="mt-4 text-center">
        <h3>Conversion réussie !</h3>
        <a :href="wordUrl" download="converted.docx">
          <button class="btn btn-success w-100">Télécharger le fichier Word</button>
        </a>
      </div>
    </div>
  </template>
  
  <script>
  import { ref } from "vue";
  
  export default {
    name: "PdfToWordConverter",
    setup() {
      const fileInput = ref(null); // Référence au champ input
      const wordUrl = ref(null); // Stocke l'URL du fichier Word converti
  
      const uploadFile = async () => {
        const file = fileInput.value.files[0]; // Récupère le fichier sélectionné
        if (!file) {
          alert("Veuillez sélectionner un fichier PDF.");
          return;
        }
  
        const formData = new FormData();
        formData.append("file", file);
  
        try {
          // Envoi du fichier PDF au backend Flask
          const response = await fetch("http://localhost:5000/convert", {
            method: "POST",
            body: formData,
          });
  
          if (!response.ok) {
            throw new Error("Échec de la conversion.");
          }
  
          // Récupérer le fichier Word en réponse
          const downloadUrl = URL.createObjectURL(await response.blob());
          wordUrl.value = downloadUrl;
  
        } catch (error) {
          console.error("Erreur lors de la conversion :", error);
          alert("Une erreur est survenue lors de la conversion.");
        }
      };
  
      return {
        fileInput,
        wordUrl,
        uploadFile,
      };
    },
  };
  </script>
  
  <style scoped>
  /* Ajoute du style si nécessaire */
  </style>
  
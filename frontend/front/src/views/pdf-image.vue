<template>
  <div class="container mt-5">
    <h1 class="text-center">Convertir PDF en JPEG</h1>
    <p class="text-center">Téléchargez un fichier PDF et convertissez-le en images JPEG.</p>

    <!-- Formulaire d'upload -->
    <form @submit.prevent="uploadFile" class="mt-4">
      <div class="mb-3">
        <input type="file" ref="fileInput" accept=".pdf" class="form-control" />
      </div>
      <button type="submit" class="btn btn-primary w-100">Convertir en JPEG</button>
    </form>

    <!-- Bouton de téléchargement du fichier ZIP contenant les images -->
    <div v-if="zipUrl" class="mt-4 text-center">
      <h3>Conversion réussie !</h3>
      <a :href="zipUrl" :download="zipFileName">
        <button class="btn btn-success w-100">Télécharger le fichier ZIP</button>
      </a>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const fileInput = ref(null); // Référence au champ input
const zipUrl = ref(null); // Stocke l'URL du fichier ZIP contenant les images
const zipFileName = ref(''); // Stocke le nom du fichier ZIP

const uploadFile = async () => {
  const file = fileInput.value.files[0]; // Récupère le fichier sélectionné
  if (!file) {
    alert("Veuillez sélectionner un fichier PDF.");
    return;
  }

  const formData = new FormData();
  formData.append("file", file);
  
  // Extraire le nom du fichier sans l'extension
  const fileNameWithoutExt = file.name.replace(/\.[^/.]+$/, "");
  zipFileName.value = `${fileNameWithoutExt}.zip`; // Définir le nom du fichier ZIP

  try {
    // Envoi du fichier PDF au backend Flask
    const response = await fetch("http://localhost:5000/convert-pdf-to-image", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Échec de la conversion.");
    }

    // Récupérer le fichier ZIP en réponse
    const downloadUrl = URL.createObjectURL(await response.blob());
    zipUrl.value = downloadUrl;

  } catch (error) {
    console.error("Erreur lors de la conversion :", error);
    alert("Une erreur est survenue lors de la conversion.");
  }
};
</script>

<style scoped>
/* Ajoute du style si nécessaire */
</style>
<template>
  <Navbar/>
  <div class="container mt-5">
    <h1 class="text-center">Convertir PDF en Word</h1>
    <p class="text-center">Téléchargez un fichier PDF et convertissez-le en document Word.</p>

    <!-- Formulaire d'upload -->
    <form @submit.prevent="uploadFile" class="mt-4">
      <div class="mb-3">
        <input type="file" ref="fileInput" accept=".pdf" class="form-control" />
      </div>
      <button type="submit" class="btn btn-primary w-100" :disabled="isLoading">
        <span v-if="isLoading" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
        <span v-if="!isLoading">Convertir en Word</span>
      </button>
    </form>

    <!-- Message de succès et téléchargement -->
    <div v-if="wordUrl" class="mt-4 text-center">
      <h3>Conversion réussie !</h3>
      <a :href="wordUrl" :download="downloadFileName">
        <button class="btn btn-success w-100">Télécharger le fichier Word</button>
      </a>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import Navbar from '@/components/Navbar.vue';
export default {
  components: {
    Navbar 
  },
  setup() {
    const fileInput = ref(null); // Référence au champ input
    const wordUrl = ref(null); // Stocke l'URL du fichier Word converti
    const downloadFileName = ref(""); // Nom du fichier à télécharger
    const isLoading = ref(false); // Indicateur de chargement

    const uploadFile = async () => {
      const file = fileInput.value.files[0]; // Récupère le fichier sélectionné
      if (!file) {
        alert("Veuillez sélectionner un fichier PDF.");
        return;
      }

      const formData = new FormData();
      formData.append("file", file);

      isLoading.value = true; // Commencer le chargement

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
        downloadFileName.value = file.name.replace(".pdf", ".docx"); // Mettre à jour le nom du fichier à télécharger

      } catch (error) {
        console.error("Erreur lors de la conversion :", error);
        alert("Une erreur est survenue lors de la conversion.");
      } finally {
        isLoading.value = false; // Fin du chargement
      }
    };

    return {
      fileInput,
      wordUrl,
      downloadFileName,
      isLoading,
      uploadFile,
    };
  },
};
</script>

<style scoped>
/* Ajoute du style si nécessaire */
</style>

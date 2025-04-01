<template>
  <div class="container mt-5">
    <h1 class="text-center">Convertisseur PDF → Word</h1>
    <p>Convertissez vos fichiers PDF en Word en conservant la mise en page.</p>

    <!-- Formulaire d'upload -->
    <form @submit.prevent="uploadFile" class="mt-4">
      <div class="mb-3">
        <input type="file" ref="fileInput" accept=".pdf" class="form-control" />
      </div>
      <button type="submit" class="btn btn-primary w-100">Convertir en Word</button>
    </form>

    <!-- Lien de téléchargement du fichier Word -->
    <div v-if="wordUrl" class="mt-4 text-center">
      <h3>Conversion réussie 🎉</h3>
      <a :href="wordUrl" download="converted.docx">
        <button class="btn btn-success w-100">Télécharger le fichier Word</button>
      </a>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";

export default {
  
  setup() {
    const fileInput = ref(null);
    const wordUrl = ref(null); // Stocke l'URL du fichier Word converti

    const uploadFile = async () => {
      const file = fileInput.value.files[0];
      if (!file) return;

      const formData = new FormData();
      formData.append("file", file);

      try {
        // Envoyer le fichier au backend
        const response = await fetch("http://localhost:5000/convert", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error("Échec de l'upload");
        }

        // Récupérer le fichier Word en réponse
        const downloadUrl = URL.createObjectURL(await response.blob());

        // Mettre à jour l'URL du fichier Word
        wordUrl.value = downloadUrl;
      } catch (error) {
        console.error("Erreur lors de la conversion :", error);
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

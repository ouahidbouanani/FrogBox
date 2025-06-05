<template>
  <Layout>
    <div class="container mt-5">
      <h1 class="text-center">Convertir PDF en JPEG</h1>
      <p class="text-center">Déposez un fichier PDF à convertir en images JPEG.</p>

      <!-- Dropzone -->
      <b-form
        class="dropzone my-4"
        id="pdfToImageDropzone"
        v-bind="getRootProps()"
      >
        <div class="fallback">
          <input v-bind="getInputProps()" accept=".pdf" />
        </div>

        <div class="dz-message needsclick">
          <i class="h1 text-muted ri-upload-cloud-2-line"></i>
          <h3>Déposez le fichier ici ou cliquez pour le sélectionner</h3>
          <span class="text-muted fs-13">(Un seul fichier PDF est autorisé)</span>
        </div>
      </b-form>

      <!-- Aperçu du fichier sélectionné -->
      <div v-if="state.file" class="alert alert-secondary d-flex justify-content-between align-items-center">
        <div>
          <strong>Fichier sélectionné :</strong> {{ state.file.name }}
        </div>
        <button class="btn btn-sm btn-danger" @click="removeFile">X</button>
      </div>

      <!-- Bouton pour lancer la conversion -->
      <div class="text-center">
        <button @click="uploadFile" class="btn btn-primary w-100" :disabled="!state.file">Convertir en JPEG</button>
      </div>

      <!-- Téléchargement -->
      <div v-if="zipUrl" class="mt-4 text-center">
        <h3>Conversion réussie !</h3>
        <a :href="zipUrl" :download="zipFileName">
          <button class="btn btn-success w-100">Télécharger le fichier ZIP</button>
        </a>
      </div>
    </div>
  </Layout>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue';
import { useDropzone } from 'vue3-dropzone';
import Layout from '@/components/layouts/layout.vue';

const zipUrl = ref<string | null>(null);
const zipFileName = ref<string>('');

// Etat pour stocker le fichier sélectionné
const state = reactive<{ file: File | null }>({ file: null });

// Configuration de Dropzone
const { getRootProps, getInputProps } = useDropzone({
  multiple: false,
  accept: 'application/pdf', 
  onDrop(acceptedFiles: File[]) {
    if (acceptedFiles.length > 0) {
      state.file = acceptedFiles[0]; // Enregistrer le premier fichier
    }
  },
});

// Fonction pour supprimer un fichier
const removeFile = () => {
  state.file = null; // Retirer le fichier sélectionné
  zipUrl.value = null; // Effacer le lien de téléchargement
};

// Fonction pour envoyer le fichier et lancer la conversion
const uploadFile = async () => {
  if (!state.file) {
    alert("Veuillez sélectionner un fichier PDF.");
    return;
  }

  const formData = new FormData();
  formData.append("file", state.file);

  const fileNameWithoutExt = state.file.name.replace(/\.[^/.]+$/, "");
  zipFileName.value = `${fileNameWithoutExt}.zip`;

  try {
    // Envoi du fichier PDF au backend Flask
    const response = await fetch("http://localhost:5000/convert-pdf-to-image", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Échec de la conversion.");
    }

    const downloadUrl = URL.createObjectURL(await response.blob());
    zipUrl.value = downloadUrl; // Stocker l'URL du fichier ZIP
  } catch (error) {
    console.error("Erreur lors de la conversion :", error);
    alert("Une erreur est survenue lors de la conversion.");
  }
};
</script>

<style scoped>
.dropzone {
  border: 2px dashed #ced4da;
  padding: 30px;
  text-align: center;
  background-color: #f8f9fa;
  border-radius: 8px;
}

.alert {
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>

<template>
  <Layout>
    <div class="container mt-5">
      <h1 class="text-center">Convertir PDF en Word</h1>
      <p class="text-center">Déposez un fichier PDF pour le convertir en document Word.</p>

      <!-- DROPZONE -->
      <b-form class="dropzone" v-bind="getRootProps()">
        <div class="fallback">
          <input v-bind="getInputProps()" />
        </div>

        <div class="dz-message needsclick">
          <i class="h1 text-muted ri-upload-cloud-2-line"></i>
          <h3>Déposez votre fichier PDF ici ou cliquez pour l’importer</h3>
          <span class="text-muted fs-13">Un seul fichier PDF est accepté</span>
        </div>
      </b-form>

      <!-- AFFICHAGE DU FICHIER -->
      <div v-if="selectedFile" class="dropzone-previews mt-3">
        <ul class="list-group mb-4">
          <li class="list-group-item d-flex justify-content-between align-items-center">
            {{ selectedFile.name }} ({{ getSize(selectedFile) }})
            <button @click="removeFile" class="btn btn-danger btn-sm">Supprimer</button>
          </li>
        </ul>
      </div>

      <!-- BOUTON DE CONVERSION -->
      <button
        class="btn btn-primary w-100 mt-4 mb-4"
        @click="convertToWord"
        :disabled="!selectedFile || isLoading"
      >
        <span v-if="isLoading" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
        <span v-if="!isLoading">Convertir en Word</span>
      </button>

      <!-- MESSAGE DE SUCCÈS + LIEN -->
      <div v-if="wordUrl" class="mt-4 text-center">
        <h3>Conversion réussie !</h3>
        <a :href="wordUrl" :download="downloadFileName">
          <button class="btn btn-success w-100">Télécharger le fichier Word</button>
        </a>
      </div>
    </div>
  </Layout>
</template>

<script setup>
import { ref } from 'vue';
import { useDropzone } from 'vue3-dropzone';
import Layout from '@/components/layouts/layout.vue';

const selectedFile = ref(null);
const wordUrl = ref(null);
const downloadFileName = ref('');
const isLoading = ref(false);

const { getRootProps, getInputProps } = useDropzone({
  multiple: false,
  accept: '.pdf',
  onDrop(acceptedFiles) {
    if (acceptedFiles.length > 0) {
      selectedFile.value = acceptedFiles[0];
    }
  },
});

const removeFile = () => {
  selectedFile.value = null;
  wordUrl.value = null;
};

const getSize = (file) => {
  const size = file.size;
  return size >= 1024 * 1024
    ? (size / (1024 * 1024)).toFixed(2) + ' MB'
    : (size / 1024).toFixed(2) + ' KB';
};

const convertToWord = async () => {
  if (!selectedFile.value) {
    alert('Veuillez sélectionner un fichier PDF.');
    return;
  }

  const formData = new FormData();
  formData.append('file', selectedFile.value);

  isLoading.value = true;

  try {
    const response = await fetch('http://localhost:5000/convert', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Échec de la conversion.');
    }

    const blob = await response.blob();
    wordUrl.value = URL.createObjectURL(blob);
    downloadFileName.value = selectedFile.value.name.replace('.pdf', '.docx');
  } catch (error) {
    console.error('Erreur lors de la conversion :', error);
    alert("Une erreur est survenue lors de la conversion.");
  } finally {
    isLoading.value = false;
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
</style>

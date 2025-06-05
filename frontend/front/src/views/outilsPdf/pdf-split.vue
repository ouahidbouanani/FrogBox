<template>
  <Layout>
    <div class="container">
      <h1 class="my-4">Séparer un PDF</h1>

      <!-- DROPZONE -->
      <b-form
        class="dropzone"
        id="pdfSplitDropzone"
        v-bind="getRootProps()"
      >
        <div class="fallback">
          <input v-bind="getInputProps()" />
        </div>

        <div class="dz-message needsclick">
          <i class="h1 text-muted ri-upload-cloud-2-line"></i>
          <h3>Déposez votre fichier PDF ici ou cliquez pour l’importer</h3>
          <span class="text-muted fs-13">Un seul fichier PDF est autorisé</span>
        </div>
      </b-form>

      <!-- AFFICHAGE DU FICHIER -->
      <div v-if="splitFile" class="dropzone-previews mt-3">
        <ul class="list-group mb-4">
          <li class="list-group-item d-flex justify-content-between align-items-center">
            {{ splitFile.name }} ({{ getSize(splitFile) }})
            <button @click="removeFile" class="btn btn-danger btn-sm">Supprimer</button>
          </li>
        </ul>
      </div>

      <!-- OPTION ZIP -->
      <div class="form-check mb-2">
        <input type="checkbox" v-model="zipOption" class="form-check-input" id="zipOption" />
        <label class="form-check-label" for="zipOption">Enregistrer les pages dans un fichier ZIP</label>
      </div>

      <!-- BOUTON -->
      <button @click="splitPDF" class="btn btn-success mb-4" :disabled="!splitFile">Séparer</button>

      <!-- TÉLÉCHARGEMENT -->
      <div v-if="downloadLink" class="mt-4">
        <a :href="downloadLink" :download="downloadFilename" class="btn btn-primary">
          Télécharger le fichier
        </a>
      </div>

      <!-- MESSAGE -->
      <div v-if="message" class="alert alert-info mt-4">{{ message }}</div>
    </div>
  </Layout>
</template>

<script setup >
import { ref } from 'vue';
import { useDropzone } from 'vue3-dropzone';
import axios from 'axios';
import Layout from '@/components/layouts/layout.vue';

const splitFile = ref(null);
const message = ref('');
const zipOption = ref(false);
const downloadLink = ref(null);
const downloadFilename = ref('');

// DROPZONE SETUP
const { getRootProps, getInputProps } = useDropzone({
  multiple: false,
  accept: '.pdf',
  onDrop(acceptedFiles) {
    if (acceptedFiles.length > 0) {
      splitFile.value = acceptedFiles[0];
    }
  },
});

const removeFile = () => {
  splitFile.value = null;
  downloadLink.value = null;
  message.value = '';
};

const getSize = (file) => {
  const size = file.size;
  return size >= 1024 * 1024
    ? (size / (1024 * 1024)).toFixed(2) + ' MB'
    : (size / 1024).toFixed(2) + ' KB';
};

const splitPDF = async () => {
  if (!splitFile.value) {
    message.value = 'Veuillez sélectionner un fichier PDF.';
    return;
  }

  const formData = new FormData();
  formData.append('file', splitFile.value);

  try {
    const endpoint = zipOption.value ? 'http://localhost:5000/splitzip' : 'http://localhost:5000/split';
    const response = await axios.post(endpoint, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      responseType: 'blob',
    });

    const url = window.URL.createObjectURL(new Blob([response.data]));
    downloadLink.value = url;

    downloadFilename.value = zipOption.value
      ? 'split_pages.zip'
      : `${splitFile.value.name.replace('.pdf', '')}_split.zip`;

    message.value = 'PDF séparé avec succès. Vous pouvez le télécharger.';
  } catch (error) {
    console.error('Erreur lors de la séparation du PDF:', error.response ? error.response.data : error.message);
    message.value = 'Erreur lors de la séparation du PDF.';
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

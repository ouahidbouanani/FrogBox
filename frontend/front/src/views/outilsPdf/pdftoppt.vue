<template>
    <Layout>
      <div class="container">
        <h1 class="my-4">Convertir PDF en PowerPoint</h1>
  
        <!-- DROPZONE -->
        <b-form
          class="dropzone"
          id="pdfDropzone"
          v-bind="getRootProps()"
        >
          <div class="fallback">
            <input name="file" v-bind="getInputProps()" @change="onChange" />
          </div>
  
          <div class="dz-message needsclick">
            <i class="h1 text-muted ri-upload-cloud-2-line"></i>
            <h3>Déposez votre fichier PDF ici ou cliquez pour l’importer</h3>
            <span class="text-muted fs-13">Un seul fichier PDF accepté</span>
          </div>
        </b-form>
  
        <!-- LISTE DU FICHIER -->
        <div v-if="state.files.length > 0" class="dropzone-previews mt-3">
          <ul class="list-group mb-4">
            <li
              v-for="(file, index) in state.files"
              :key="index"
              class="list-group-item d-flex justify-content-between align-items-center"
            >
              {{ file.name }} ({{ getSize(file) }})
              <button @click="removeFile(index)" class="btn btn-danger btn-sm">Supprimer</button>
            </li>
          </ul>
        </div>
  
        <!-- BOUTON CONVERTIR -->
        <button
          @click="convertPdfToPpt"
          class="btn btn-primary mt-4 mb-4"
          :disabled="state.files.length === 0 || isLoading"
        >
          <span v-if="isLoading" class="spinner-border spinner-border-sm me-2"></span>
          <span v-if="isLoading">Conversion en cours...</span>
          <span v-else>Convertir en PowerPoint</span>
        </button>
  
        <!-- TÉLÉCHARGEMENT -->
        <div v-if="downloadLink" class="mt-3">
          <a :href="downloadLink" :download="downloadFileName" class="btn btn-success">
            Télécharger le fichier PowerPoint
          </a>
        </div>
  
        <!-- MESSAGE -->
        <div v-if="message" class="alert alert-info mt-4">{{ message }}</div>
      </div>
    </Layout>
  </template>
  
  <script lang="ts" setup>
  import { ref, reactive } from 'vue';
  import axios from 'axios';
  import Layout from "@/components/layouts/layout.vue";
  import { useDropzone } from 'vue3-dropzone';
  
  const state = reactive<{ files: File[] }>({ files: [] });
  const isLoading = ref(false);
  const message = ref('');
  const downloadLink = ref<string | null>(null);
  const downloadFileName = ref('converted.pptx');
  
  const { getRootProps, getInputProps } = useDropzone({
    accept: '.pdf',
    maxFiles: 1,
    onDrop(acceptedFiles: File[]) {
      state.files = [...acceptedFiles]; // remplacer le fichier s’il y en avait déjà un
      message.value = '';
      downloadLink.value = null;
    },
  });
  
  const getSize = (file: File) => {
    const size = file.size;
    return size >= 1024 * 1024
      ? (size / (1024 * 1024)).toFixed(2) + ' MB'
      : (size / 1024).toFixed(2) + ' KB';
  };
  
  const removeFile = (index: number) => {
    state.files.splice(index, 1);
    message.value = '';
    downloadLink.value = null;
  };
  
  const convertPdfToPpt = async () => {
    if (state.files.length === 0) return;
  
    isLoading.value = true;
  
    const formData = new FormData();
    formData.append("file", state.files[0]);
  
    try {
      const response = await axios.post("http://127.0.0.1:5000/convert-pptx", formData, {
        responseType: "blob",
      });
  
      const url = window.URL.createObjectURL(new Blob([response.data]));
      downloadLink.value = url;
      const baseName = state.files[0].name.replace(/\.pdf$/, "");
      downloadFileName.value = `${baseName}.pptx`;
  
      message.value = "Conversion réussie !";
    } catch (error) {
      console.error("Erreur lors de la conversion :", error);
      message.value = "Une erreur s'est produite pendant la conversion.";
    } finally {
      isLoading.value = false;
    }
  };
  
  const onChange = () => {
    // Dropzone gère ça automatiquement
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
  
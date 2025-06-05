<template>
  <Layout>
    <div class="container">
      <h1 class="my-4">Fusionner des PDF</h1>

      <!-- DROPZONE -->
      <b-form
        class="dropzone"
        id="pdfDropzone"
        data-plugin="dropzone"
        data-previews-container="#file-previews"
        data-upload-preview-template="#uploadPreviewTemplate"
        v-bind="getRootProps()"
      >
        <div class="fallback">
          <input
            name="file"
            v-bind="getInputProps()"
            accept=".pdf"
            @change="onChange"
          />
        </div>

        <div class="dz-message needsclick">
          <i class="h1 text-muted ri-upload-cloud-2-line"></i>
          <h3>Déposez vos fichiers PDF ici ou cliquez pour les importer</h3>
          <span class="text-muted fs-13">Les fichiers seront fusionnés dans l’ordre sélectionné</span>
        </div>
      </b-form>

      <!-- LISTE DES FICHIERS -->
      <div v-if="state.files.length > 0" class="dropzone-previews mt-3" id="uploadPreviewTemplate">
        <ul class="list-group mb-4">
          <li
            v-for="(file, index) in state.files"
            :key="index"
            class="list-group-item d-flex justify-content-between align-items-center"
          >
            {{ file.name }} ({{ getSize(file) }})
            <button @click="handleClickDeleteFile(index)" class="btn btn-danger btn-sm">Supprimer</button>
          </li>
        </ul>
      </div>

      <button @click="mergePDFs" class="btn btn-success mt-4 mb-4">Fusionner</button>

      <!-- Téléchargement -->
      <div v-if="downloadLink" class="mt-4">
        <a :href="downloadLink" :download="downloadFileName" class="btn btn-primary">
          Télécharger le fichier fusionné
        </a>
      </div>

      <!-- Message -->
      <div v-if="message" class="alert alert-info mt-4">{{ message }}</div>
    </div>
  </Layout>
</template>

<script lang="ts">
import { ref, reactive } from 'vue';
import axios from 'axios';
import Layout from "@/components/layouts/layout.vue";
import { useDropzone } from 'vue3-dropzone';

export default {
  components: {
    Layout,
  },
  setup() {
    const message = ref('');
    const downloadLink = ref<string | null>(null);
    const downloadFileName = ref('merged.pdf');

    const state = reactive<{ files: File[] }>({
      files: [],
    });

    const { getRootProps, getInputProps } = useDropzone({
      onDrop(acceptedFiles: File[]) {
        state.files.push(...acceptedFiles);
      },
    });

    const handleClickDeleteFile = (index: number) => {
      state.files.splice(index, 1);
    };

    const getSize = (file: File) => {
      if (!file) return '';
      const size = file.size;
      return size >= 1024 * 1024
        ? (size / (1024 * 1024)).toFixed(2) + ' MB'
        : (size / 1024).toFixed(2) + ' KB';
    };

    const mergePDFs = async () => {
      if (state.files.length === 0) {
        message.value = 'Veuillez d’abord sélectionner des fichiers PDF.';
        return;
      }

      const formData = new FormData();
      state.files.forEach((file) => {
        formData.append('files', file);
      });

      try {
        const response = await axios.post('http://localhost:5000/merge', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          responseType: 'blob',
        });

        const url = window.URL.createObjectURL(new Blob([response.data]));
        downloadLink.value = url;

        const baseName = state.files[0].name.split('.')[0];
        downloadFileName.value = `${baseName}_merged.pdf`;

        message.value = 'PDF fusionné avec succès !';
      } catch (error: any) {
        console.error('Erreur lors de la fusion des PDF:', error);
        message.value = 'Erreur lors de la fusion des PDF.';
      }
    };

    const onChange = () => {
      // Géré automatiquement avec dropzone
    };

    return {
      state,
      getRootProps,
      getInputProps,
      handleClickDeleteFile,
      getSize,
      mergePDFs,
      message,
      downloadLink,
      downloadFileName,
      onChange,
    };
  },
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

<template>
  <Layout>
    <div class="container mt-5">
      <h1 class="text-center">Convertir PDF en Excel</h1>
      <p class="text-center">Extraire les tableaux d'un fichier PDF et les convertir en fichier Excel.</p>

      <!-- DROPZONE -->
      <b-form
        class="dropzone mt-4"
        id="excelDropzone"
        v-bind="getRootProps()"
      >
        <div class="fallback">
          <input name="file" v-bind="getInputProps()" @change="onChange" />
        </div>

        <div class="dz-message needsclick">
          <i class="h1 text-muted ri-upload-cloud-2-line"></i>
          <h3>Déposez votre fichier PDF ici ou cliquez pour le sélectionner</h3>
          <span class="text-muted fs-13">Seul un fichier PDF est accepté</span>
        </div>
      </b-form>

      <!-- LISTE DES FICHIERS -->
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
      <button @click="convertToExcel" class="btn btn-primary w-100 mt-3" :disabled="isLoading || state.files.length === 0">
        <span v-if="isLoading" class="spinner-border spinner-border-sm me-2"></span>
        <span v-if="isLoading"> Conversion en cours...</span>
        <span v-else> Convertir en Excel</span>
      </button>

      <!-- TÉLÉCHARGEMENT -->
      <div v-if="excelUrl" class="mt-4 text-center">
        <h4>Conversion réussie !</h4>
        <a :href="excelUrl" :download="downloadFileName">
          <button class="btn btn-success w-100">Télécharger le fichier Excel</button>
        </a>
      </div>

      <!-- MESSAGE -->
      <div v-if="message" class="alert alert-info mt-4">{{ message }}</div>
    </div>
  </Layout>
</template>

<script>
import { ref, reactive } from 'vue';
import Layout from '@/components/layouts/layout.vue';
import { useDropzone } from 'vue3-dropzone';

export default {
  components: { Layout },
  setup() {
    const state = reactive({ files: [] });
    const excelUrl = ref(null);
    const isLoading = ref(false);
    const message = ref('');
    const downloadFileName = ref('converted.xlsx');

    const { getRootProps, getInputProps } = useDropzone({
      accept: '.pdf',
      multiple: false,
      onDrop(acceptedFiles) {
        if (acceptedFiles.length > 0) {
          state.files = acceptedFiles;
          const name = acceptedFiles[0].name.replace('.pdf', '.xlsx');
          downloadFileName.value = name;
        }
      }
    });

    const onChange = () => {
      // Optionnel si géré par dropzone
    };

    const removeFile = (index) => {
      state.files.splice(index, 1);
      excelUrl.value = null;
    };

    const getSize = (file) => {
      const size = file.size;
      return size >= 1024 * 1024
        ? (size / (1024 * 1024)).toFixed(2) + ' MB'
        : (size / 1024).toFixed(2) + ' KB';
    };

    const convertToExcel = async () => {
      if (state.files.length === 0) return;

      const formData = new FormData();
      formData.append('file', state.files[0]);

      isLoading.value = true;
      message.value = '';
      excelUrl.value = null;

      try {
        const response = await fetch('http://localhost:5000/convert-excel', {
          method: 'POST',
          body: formData
        });

        if (!response.ok) throw new Error('Erreur lors de la conversion.');

        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        excelUrl.value = url;
        message.value = 'Le fichier Excel est prêt au téléchargement.';
      } catch (err) {
        console.error('Erreur :', err);
        message.value = 'Erreur lors de la conversion.';
      } finally {
        isLoading.value = false;
      }
    };

    return {
      state,
      getRootProps,
      getInputProps,
      onChange,
      removeFile,
      getSize,
      convertToExcel,
      excelUrl,
      isLoading,
      downloadFileName,
      message
    };
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
.spinner-border {
  margin-right: 5px;
}
</style>

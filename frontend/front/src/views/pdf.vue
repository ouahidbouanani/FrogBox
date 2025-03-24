<template>
  <div class="container">
    <h1 class="my-4">Fusionner des PDF</h1>
    <input type="file" multiple @change="handleFileUpload" class="form-control mb-2" />
    <button @click="mergePDFs" class="btn btn-success mb-4">Fusionner</button>

    <h2>Fichiers sélectionnés :</h2>
    <ul class="list-group mb-4">
      <li v-for="(file, index) in files" :key="index" class="list-group-item d-flex justify-content-between align-items-center">
        {{ file.name }}
        <button @click="removeFile(index)" class="btn btn-danger btn-sm">Supprimer</button>
      </li>
    </ul>

    <h1 class="my-4">Séparer un PDF</h1>
    <input type="file" @change="handleFileUploadForSplit" class="form-control mb-2" />
    
    <div class="form-check mb-2">
      <input type="checkbox" v-model="zipOption" class="form-check-input" id="zipOption" />
      <label class="form-check-label" for="zipOption">Enregistrer les pages dans un fichier ZIP</label>
    </div>

    <button @click="splitPDF" class="btn btn-success mb-4">Séparer</button>

    <div v-if="message" class="alert alert-info mt-4">{{ message }}</div>
  </div>
</template>

<script>
import { ref } from 'vue';
import axios from 'axios';

export default {
  setup() {
    const files = ref([]); // Liste des fichiers sélectionnés
    const splitFile = ref(null);
    const message = ref('');
    const outputFiles = ref([]);
    const zipOption = ref(false); // Nouvelle variable pour l'option ZIP

    const handleFileUpload = (event) => {
      const newFiles = Array.from(event.target.files);
      files.value.push(...newFiles); // Ajoute les nouveaux fichiers au tableau existant
    };

    const handleFileUploadForSplit = (event) => {
      splitFile.value = event.target.files[0];
    };

    const mergePDFs = async () => {
      const formData = new FormData();
      files.value.forEach(file => {
        formData.append('files', file);
      });

      try {
        const response = await axios.post('http://localhost:5000/api/merge', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        message.value = response.data.message; // Affiche le message de succès
        outputFiles.value = [response.data.file]; // Affiche le chemin du fichier généré
      } catch (error) {
        console.error('Erreur lors de la fusion des PDF:', error.response ? error.response.data : error.message);
        message.value = 'Erreur lors de la fusion des PDF.';
      }
    };

    const removeFile = (index) => {
      files.value.splice(index, 1); // Supprime le fichier à l'index spécifié
    };

    const splitPDF = async () => {
      const formData = new FormData();
      formData.append('file', splitFile.value);

      try {
        const response = await axios.post(zipOption.value ? 'http://localhost:5000/api/splitzip' : 'http://localhost:5000/api/split', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        message.value = response.data.message; // Affiche le message de succès
        outputFiles.value = response.data.files; // Affiche les fichiers générés
      } catch (error) {
        console.error('Erreur lors de la séparation du PDF:', error.response ? error.response.data : error.message);
        message.value = 'Erreur lors de la séparation du PDF.';
      }
    };

    return {
      files,
      splitFile,
      message,
      outputFiles,
      zipOption,
      handleFileUpload,
      handleFileUploadForSplit,
      mergePDFs,
      removeFile,
      splitPDF
    };
  }
};
</script>
<style scoped>
/* Ajoutez ici vos styles CSS si nécessaire */
</style>
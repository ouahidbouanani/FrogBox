<template>
  <Navbar/>
  
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

    <!-- Affichage du lien de téléchargement -->
    <div v-if="downloadLink" class="mt-4">
      <a :href="downloadLink" :download="downloadFileName" class="btn btn-primary">Télécharger le fichier fusionné</a>
    </div>

    <!-- Message d'erreur ou de succès -->
    <div v-if="message" class="alert alert-info mt-4">{{ message }}</div>
  </div>
  <Footer/>
</template>

<script>
import { ref } from 'vue';
import axios from 'axios';
import Navbar from '@/components/Navbar.vue';
import Footer from '@/components/Footer.vue'
export default {
  components: {
    Navbar,
    Footer 
  },
  setup() {
    const files = ref([]);
    const message = ref('');
    const downloadLink = ref(null);  // Variable pour stocker le lien de téléchargement
    const downloadFileName = ref('merged.pdf');  // Variable pour le nom du fichier téléchargé

    const handleFileUpload = (event) => {
      const newFiles = Array.from(event.target.files);
      files.value.push(...newFiles);
    };

    const mergePDFs = async () => {
      const formData = new FormData();
      files.value.forEach(file => {
        formData.append('files', file);
      });

      try {
        const response = await axios.post('http://localhost:5000/merge', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          responseType: 'blob',  // Spécifier que la réponse sera binaire
        });

        // Créer un lien pour télécharger le fichier fusionné
        const url = window.URL.createObjectURL(new Blob([response.data]));
        downloadLink.value = url;  // Assigner l'URL pour le téléchargement

        // Utiliser le nom du premier fichier fourni pour le fichier fusionné
        const firstFileName = files.value[0].name;
        const baseName = firstFileName.split('.')[0];  // Extraire le nom sans extension
        downloadFileName.value = `${baseName}_merged.pdf`;  // Définir le nom de téléchargement

        message.value = "PDF fusionné avec succès"; // Affiche un message de succès
      } catch (error) {
        console.error('Erreur lors de la fusion des PDF:', error.response ? error.response.data : error.message);
        message.value = 'Erreur lors de la fusion des PDF.';
      }
    };

    const removeFile = (index) => {
      files.value.splice(index, 1); // Supprimer le fichier de la liste
    };

    return {
      files,
      message,
      downloadLink,
      downloadFileName,
      handleFileUpload,
      mergePDFs,
      removeFile
    };
  }
};
</script>

<style scoped>
/* Ajoutez ici vos styles CSS si nécessaire */
</style>

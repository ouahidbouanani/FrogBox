<template>
  <Navbar/>
  <div class="container mt-5">
    <h1 class="text-center">Convertir PDF en Excel</h1>
    <p>Extraire les tableaux d'un fichier PDF et les convertir en fichier Excel.</p>

    <!-- Formulaire d'upload PDF -->
    <form @submit.prevent="uploadFile" class="mt-4">
      <div class="mb-3">
        <input type="file" ref="fileInput" accept=".pdf" class="form-control" @change="updateFileName" />
      </div>
      <button type="submit" class="btn btn-primary w-100" :disabled="isLoading">
        <span v-if="isLoading" class="spinner-border spinner-border-sm"></span>
        <span v-if="isLoading"> Conversion en cours...</span>
        <span v-else> Convertir en Excel</span>
      </button>
    </form>

    <!-- Lien de téléchargement du fichier Excel -->
    <div v-if="excelUrl" class="mt-4 text-center">
      <h3>Le PDF a été converti en Excel</h3>
      <a :href="excelUrl" :download="downloadFileName">
        <button class="btn btn-success w-100">Télécharger</button>
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
    const fileInput = ref(null);
    const excelUrl = ref(null);
    const isLoading = ref(false);
    const downloadFileName = ref("converted.xlsx"); // Nom par défaut

    const updateFileName = () => {
      const file = fileInput.value.files[0];
      if (file) {
        const originalName = file.name.replace(".pdf", ".xlsx"); // Remplace .pdf par .xlsx
        downloadFileName.value = originalName;
      }
    };

    const uploadFile = async () => {
      const file = fileInput.value.files[0];
      if (!file) {
        alert("Veuillez sélectionner un fichier PDF.");
        return;
      }

      isLoading.value = true; // Active le chargement
      const formData = new FormData();
      formData.append("file", file);

      try {
        const response = await fetch("http://localhost:5000/convert-excel", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error("Erreur lors de la conversion.");
        }

        // Créer un lien de téléchargement avec le bon nom de fichier
        const blob = await response.blob();
        const downloadUrl = URL.createObjectURL(blob);
        excelUrl.value = downloadUrl;
      } catch (error) {
        console.error("Erreur:", error);
        alert("Erreur lors de la conversion.");
      } finally {
        isLoading.value = false; // Désactive le chargement
      }
    };

    return {
      fileInput,
      excelUrl,
      isLoading,
      downloadFileName,
      uploadFile,
      updateFileName,
    };
  },
};
</script>

<style scoped>
/* Ajout d'un spinner */
.spinner-border {
  margin-right: 5px;
}
</style>

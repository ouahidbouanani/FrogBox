<template>
    <div class="container mt-5">
        <h2 class="text-center">Convertir PDF en PowerPoint</h2>

        <!-- Input pour télécharger le fichier PDF -->
        <div class="mb-3">
            <label for="pdfFile" class="form-label">Choisir un fichier PDF</label>
            <input type="file" id="pdfFile" class="form-control" @change="handleFileUpload" accept="application/pdf" />
        </div>

        <!-- Bouton de conversion -->
        <button class="btn btn-primary" @click="convertPdfToPpt" :disabled="!selectedFile || isLoading">
            <span v-if="isLoading" class="spinner-border spinner-border-sm"></span>
            Convertir en PowerPoint
        </button>

        <!-- Message de succès et bouton de téléchargement -->
        <div v-if="conversionSuccess" class="mt-3">
            <div class="alert alert-success" role="alert">
                Conversion réussie ! Cliquez sur le bouton ci-dessous pour télécharger votre fichier.
            </div>
            <button class="btn btn-success" @click="downloadFile">Télécharger le fichier</button>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';

const selectedFile = ref(null);
const isLoading = ref(false);
const conversionSuccess = ref(false);
let downloadUrl = ref('');
const originalFileName = ref("");

const handleFileUpload = (event) => {
    selectedFile.value = event.target.files[0];
    originalFileName.value = selectedFile.value.name.replace(/\.[^/.]+$/, "");
    conversionSuccess.value = false; // Réinitialiser l'état de succès lors d'un nouveau fichier
};

const convertPdfToPpt = async () => {
    if (!selectedFile.value) return;

    isLoading.value = true;

    const formData = new FormData();
    formData.append("file", selectedFile.value);

    try {
        const response = await axios.post("http://127.0.0.1:5000/convert-pptx", formData, {
            responseType: "blob",  // On attend un fichier en retour
        });

        // Créer un lien de téléchargement
        downloadUrl.value = window.URL.createObjectURL(new Blob([response.data]));
        conversionSuccess.value = true; // Indiquer que la conversion a réussi
    } catch (error) {
        console.error("Erreur lors de la conversion :", error);
        alert("Une erreur s'est produite lors de la conversion.");
    } finally {
        isLoading.value = false;
    }
};

const downloadFile = () => {
    const link = document.createElement("a");
    link.href = downloadUrl.value;
    link.setAttribute("download", `${originalFileName.value}.pptx`);   
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};
</script>

<style scoped>
.container {
    max-width: 500px;
    margin: auto;
    text-align: center;
}
</style>

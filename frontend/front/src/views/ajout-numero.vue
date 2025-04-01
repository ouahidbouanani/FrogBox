<template>
    <div class="container mt-5">
        <h2 class="text-center">Ajouter des numéros aux pages PDF</h2>

        <!-- Formulaire pour uploader un fichier -->
        <div class="mb-3">
            <label class="form-label">Sélectionner un fichier PDF</label>
            <input type="file" class="form-control" @change="handleFileUpload" accept="application/pdf" />
        </div>

        <!-- Affichage du schéma de position après le téléchargement -->
        <div v-if="selectedFile && !downloadUrl" class="position-selector">
            <p>Position :</p>
            <div class="grid">
                <button 
                    @click="selectPosition('haut_gauche')" 
                    class="pos-btn" 
                    :class="{'selected': selectedPosition === 'haut_gauche'}"></button>

                <button 
                    @click="selectPosition('haut_centre')" 
                    class="pos-btn" 
                    :class="{'selected': selectedPosition === 'haut_centre'}"></button>

                <button 
                    @click="selectPosition('haut_droit')" 
                    class="pos-btn" 
                    :class="{'selected': selectedPosition === 'haut_droit'}"></button>

                <div class="disabled"></div>
                <div class="disabled"></div>
                <div class="disabled"></div>

                <button 
                    @click="selectPosition('bas_gauche')" 
                    class="pos-btn" 
                    :class="{'selected': selectedPosition === 'bas_gauche'}"></button>

                <button 
                    @click="selectPosition('bas_centre')" 
                    class="pos-btn" 
                    :class="{'selected': selectedPosition === 'bas_centre'}"></button>

                <button 
                    @click="selectPosition('bas_droit')" 
                    class="pos-btn" 
                    :class="{'selected': selectedPosition === 'bas_droit'}"></button>
            </div>
        </div>

        <!-- Affichage de l’emplacement choisi -->
        <p v-if="selectedFile && !downloadUrl">Position choisie : <strong>{{ selectedPosition }}</strong></p>

        <!-- Bouton de conversion avec fonction de chargement -->
        <button v-if="selectedFile && !downloadUrl" class="btn btn-primary" @click="convertPdf">
            Ajouter des numéros
        </button>

        <!-- Message de confirmation -->
        <p v-if="downloadUrl" class="mt-3">Le PDF a désormais des numéros de pages !</p>

        <!-- Bouton pour télécharger le PDF -->
        <button v-if="downloadUrl" class="btn btn-success mt-3" @click="downloadFile">
            Télécharger le PDF numéroté
        </button>
    </div>
</template>

<script setup>
import { ref } from "vue";
import axios from "axios";

const selectedFile = ref(null);
const downloadUrl = ref("");
const selectedPosition = ref("bas_droit"); // Position par défaut
const loading = ref(false);
const loadingMessage = ref("");

const handleFileUpload = (event) => {
    selectedFile.value = event.target.files[0];
};

const selectPosition = (position) => {
    selectedPosition.value = position;
};

const convertPdf = async () => {
    if (!selectedFile.value) return;

    loading.value = true;
    loadingMessage.value = "Chargement en cours...";

    const formData = new FormData();
    formData.append("file", selectedFile.value);
    formData.append("position", selectedPosition.value);

    try {
        const response = await axios.post("http://127.0.0.1:5000/add_numbers", formData, {
            responseType: "blob",
        });

        // Créer un lien pour télécharger le fichier
        downloadUrl.value = window.URL.createObjectURL(new Blob([response.data]));
    } catch (error) {
        console.error("Erreur lors de la conversion :", error);
        alert("Une erreur s'est produite lors de la conversion.");
    } finally {
        loading.value = false;
    }
};

const downloadFile = () => {
    const link = document.createElement("a");
    link.href = downloadUrl.value;

    // Utiliser le nom du fichier d'origine pour le téléchargement
    const originalFileName = selectedFile.value.name.replace(/\.pdf$/, ""); // Enlever l'extension .pdf
    link.setAttribute("download", `${originalFileName}_numéroté.pdf`); // Ajouter "_numbered" au nom

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};
</script>

<style scoped>
.container {
    max-width: 600px;
    margin: auto;
    text-align: center;
}

/* Style du schéma interactif */
.position-selector {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
    max-width: 300px;
    margin: auto;
    padding: 20px;
    background: #f0f0f0;
    border-radius: 10px;
}

.position-selector .grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr); /* Crée 3 colonnes */
    grid-template-rows: auto auto; /* Crée 2 rangées */
    gap: 10px; /* Espacement entre les éléments */
    justify-items: center; /* Centrer les boutons horizontalement */
    align-items: center; /* Centrer les boutons verticalement */
}

.pos-btn {
    width: 50px;
    height: 50px;
    background-color: #3498db; /* Couleur par défaut */
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

.pos-btn.selected {
    background-color: #007bff; /* Couleur bleue pour la position sélectionnée */
}

/* Style des boutons non sélectionnés */
.pos-btn:not(.selected) {
    background-color: #bdbdbd; /* Couleur uniforme pour les boutons non sélectionnés */
}

.disabled {
    width: 50px;
    height: 50px;
    background-color: #ccc; /* Couleur grise pour les éléments désactivés */
}
</style>
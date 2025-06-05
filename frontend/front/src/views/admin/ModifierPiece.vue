<template>
    <Layout>
        <div class="d-flex justify-content-start mt-3 ">
        <button class="btn btn-outline-success" @click="goBack">
          ← Retour
        </button>
      </div>
    <div class="container w-50 bg-white p-4 rounded shadow  mt-3">
        <h2>Modifier la Pièce</h2>
        <form @submit.prevent="modifierPiece">
            <!-- Nom de la pièce -->
            <div class="form-group mb-3">
                <label for="nom_piece">Nom de la pièce</label>
                <input type="text" class="form-control" id="nom_piece" v-model="nom_piece" required />
            </div>

            <!-- Nombre de côtés -->
            <div class="form-group mb-3">
                <label for="nb_cotes">Nombre de côtés</label>
                <input type="number" class="form-control" id="nb_cotes" v-model="nb_cotes" required min="1" />
            </div>

            <!-- Cotes dynamiques -->
            <div v-for="(cote, index) in cotes" :key="index" class="mb-3">
                <h5>Cote {{ index + 1 }}</h5>
                <div class="form-group">
                    <label :for="'nom_cote_' + index">Nom du côté</label>
                    <input type="text" class="form-control" v-model="cote.nom_cote" :id="'nom_cote_' + index"
                        required />
                </div>

                <div class="form-group">
                    <label :for="'tolerance_min_' + index">Tolérance minimale</label>
                    <input type="number" class="form-control" v-model="cote.tolerance_min"
                        :id="'tolerance_min_' + index" required step="0.01" />
                </div>

                <div class="form-group">
                    <label :for="'tolerance_max_' + index">Tolérance maximale</label>
                    <input type="number" class="form-control" v-model="cote.tolerance_max"
                        :id="'tolerance_max_' + index" required step="0.01" />
                </div>
            </div>
            <div class="text-center mt-4">
                <button type="submit" class="btn btn-primary" style="width: 200px; height: 50px;">
                    Mettre à jour la pièce
                </button>
            </div>
        </form>
    </div>
    </Layout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useRoute, useRouter } from 'vue-router'
import Layout from "@/components/layouts/layout.vue";

const router = useRouter()

// Récupération de l'id de la pièce depuis l'URL
const route = useRoute()

const pieceId = route.params.id // l'id de la pièce dans l'URL

// Déclaration des variables pour le formulaire
const nom_piece = ref('')
const nb_cotes = ref(0)
const cotes = ref([])



// Récupérer les informations de la pièce au chargement
onMounted(async () => {
    try {
        const response = await axios.get(`http://localhost:3000/api/pieces/${pieceId}`)
        const piece = response.data

        // Initialiser les champs avec les données récupérées
        nom_piece.value = piece.nom
        nb_cotes.value = piece.nb_cotes

        // Initialiser les cotes
        cotes.value = piece.cotes.map(cote => ({
            nom_cote: cote.nom_cote,
            tolerance_min: cote.tolerance_min,
            tolerance_max: cote.tolerance_max
        }))
    } catch (error) {
        console.error('Erreur lors de la récupération des données:', error)
        alert('Erreur de récupération des données')
    }
})

// Fonction pour modifier la pièce
const modifierPiece = async () => {
    const payload = {
        nom_piece: nom_piece.value,
        nb_cotes: nb_cotes.value,
        cotes: cotes.value
    }

    try {
        const res = await axios.put(`http://localhost:3000/api/pieces/${pieceId}`, payload)

        if (res.status === 200) {
            alert('Pièce mise à jour avec succès !')
            // Rediriger vers la page de détail ou la liste des pièces
            router.push('/pieces') // ou un autre chemin si nécessaire
        }
    } catch (error) {
        console.error('Erreur lors de la modification de la pièce:', error)
        alert('Erreur lors de la mise à jour de la pièce')
    }
}
//funcyion de button retour en arrière
function goBack(){
    router.back()
}
</script>

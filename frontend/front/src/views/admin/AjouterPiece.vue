<template>
    <Layout>
        <div class="d-flex justify-content-start mt-3">
            <button class="btn btn-outline-success" @click="goBack">
                ← Retour
            </button>
        </div>
        <div class="container w-50 bg-white p-4 rounded shadow  mt-3">
            <h2>Ajouter une pièce</h2>

            <form @submit.prevent="ajouterPiece">
                <div class="mb-3">
                    <label class="form-label">Nom de la pièce</label>
                    <input type="text" placeholder="nom " v-model="nom_piece" class="form-control" required />
                </div>
                <div class="mb-3">
                    <label class="form-label">Version</label>
                    
                        <select class="form-select" v-model="version" required>
                            <option disabled value="">Sélectionner</option>
                            <option v-for="version in versions" :key="version.version" :value="version.version">
                                {{ version.version }}
                            </option>
                        </select>
                    
                </div>
                <div class="mb-3">
                    <label class="form-label">Nombre de côtes</label>
                    <input type="number" v-model.number="nb_cotes" class="form-control" min="1"
                        @change="initialiserCotes" required />
                </div>

                <div v-for="(cote, index) in cotes" :key="index" class="border p-3 mb-3 rounded bg-light">
                    <h5>Côté {{ index + 1 }}</h5>
                    <div class="mb-2">
                        <label class="form-label">Nom du côte</label>
                        <input type="text" v-model="cote.nom_cote" class="form-control" required />
                    </div>
                    <div class="mb-2">
                        <label class="form-label">Tolérance min</label>
                        <input type="number" step="0.01" v-model.number="cote.tolerance_min" class="form-control"
                            required />
                    </div>
                    <div class="mb-2">
                        <label class="form-label">Tolérance max</label>
                        <input type="number" step="0.01" v-model.number="cote.tolerance_max" class="form-control"
                            required />
                    </div>
                </div>
                <div class="text-center mt-4">
                    <button type="submit" class="btn btn-primary " style="width: 200px; height: 50px;">
                        Ajouter
                    </button>
                </div>


            </form>
        </div>
    </Layout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Layout from "@/components/layouts/layout.vue";

const router = useRouter()

const nom_piece = ref('')
const nb_cotes = ref(0)
const cotes = ref([])
const version = ref('') // Ajouter la version sélectionnée
const versions = ref([]) // Stocker les versions récupérées
function initialiserCotes() {
    cotes.value = Array.from({ length: nb_cotes.value }, () => ({
        nom_cote: '',
        tolerance_min: 0,
        tolerance_max: 0
    }))
}
async function getVersions() {
    try {
        const res = await fetch('http://localhost:3000/api/versions')
        const data = await res.json()

        if (res.ok) {
            versions.value = data // On stocke les versions dans la variable `versions`
        } else {
            alert('Erreur lors de la récupération des versions')
        }
    } catch (error) {
        console.error('Erreur API :', error)
        alert('Erreur serveur lors de la récupération des versions')
    }
}
async function ajouterPiece() {
    const payload = {
        nom_piece: nom_piece.value,
        nb_cotes: nb_cotes.value,
        version: version.value, 
        cotes: cotes.value
    }

    try {
        const res = await fetch('http://localhost:3000/api/pieces', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        })

        const data = await res.json()

        if (!res.ok) {
            alert('Erreur : ' + data.message)
            return
        }

        // Réinitialiser les champs après un ajout réussi
        nom_piece.value = ''
        nb_cotes.value = 0
        version.value = '' 
        cotes.value = []

        alert('Pièce ajoutée avec succès !')

    } catch (error) {
        console.error('Erreur API :', error)
        alert('Erreur serveur')
    }
}

function goBack() {
    router.back()
}
onMounted(() => {
    getVersions()
})
</script>

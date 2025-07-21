<template>
    <Layout>
        <div class="container bg-white p-4 rounded shadow  mt-4">
            <!--button retour-->
            <div class="d-flex justify-content-start mb-3">
                <button class="btn btn-outline-success" @click="goBack">
                    ← Retour
                </button>
            </div>

            <h4 class="mb-4 text-primary">Formulaire déclaration nouvelle impression</h4>

            <form>
                <!-- Activity -->
                <div class="mb-3 row">
                    <label class="col-sm-3 col-form-label">Activité</label>
                    <div class="col-sm-9">
                        <select class="form-select" v-model="form.activity" required>
                            <option disabled value=""> Sélectionner </option>
                            <option v-for="item in options.activity" :key="item.nom" :value="item.nom">{{ item.nom }}</option>
                        </select>
                    </div>
                </div>

                <!-- Type de pièces -->
                <div class="mb-3 row">
                    <label class="col-sm-3 col-form-label">Type de pièces</label>
                    <div class="col-sm-9">
                        <select class="form-select" v-model="form.typePieces" >
                            <option disabled value=""> Sélectionner </option>
                            <option v-for="item in options.typePieces" :key="item" :value="item">{{ item }}</option>
                        </select>
                    </div>
                </div>
                <!-- Numéro de lot du wafer -->
                <div class="mb-3 row">
                    <label class="col-sm-3 col-form-label">Numéro de lot du wafer</label>
                    <div class="col-sm-9">
                        <input type="text" class="form-control" v-model="form.num_lot_wafer"
                            placeholder="Ex : WAF123456" required />
                    </div>
                </div>

                <!-- Version de pièce -->
                <div class="mb-3 row">
                    <label class="col-sm-3 col-form-label">Version de pièce</label>
                    <div class="col-sm-9">
                        <select class="form-select" v-model="form.versionPiece" required>
                            <option disabled value=""> Sélectionner </option>
                            <option v-for="item in options.versionPiece" :key="item" :value="item">{{ item }}</option>
                        </select>
                    </div>
                </div>

                <!-- Nombre de pièces -->
                <div class="mb-3 row">
                    <label class="col-sm-3 col-form-label">Nombre de pièces</label>
                    <div class="col-sm-9">
                        <input type="number" class="form-control" v-model="form.nbPieces" min="1"
                            placeholder="Entrez le nombre de pièces" />
                    </div>
                </div>

                <!-- Imprimante -->
                <div class="mb-3 row">
                    <label class="col-sm-3 col-form-label">Imprimante</label>
                    <div class="col-sm-9">
                        <select class="form-select" v-model="form.imprimante" required>
                            <option disabled value=""> Sélectionner </option>
                            <option v-for="item in options.imprimante" :key="item.nom" :value="item.nom">{{ item.nom }}</option>
                        </select>
                    </div>
                </div>

                <!-- Date d'impression -->
                <div class="mb-3 row">
                    <label class="col-sm-3 col-form-label">Date d'impression</label>
                    <div class="col-sm-9">
                        <input type="date" class="form-control" v-model="form.dateImpression" required />
                    </div>
                </div>

                <!-- Opérateur -->
                <div class="mb-3 row">
                   <label class="col-sm-3 col-form-label">Opérateur</label>
                  <div class="col-sm-9">
                          <input type="text" class="form-control" v-model="form.operateur" readonly>
                  </div>
                </div>

                <!-- Commentaire -->
                <div class="mb-3 row">
                    <label class="col-sm-3 col-form-label">Commentaire</label>
                    <div class="col-sm-9">
                        <textarea class="form-control" rows="2" v-model="form.commentaire"
                            placeholder="Ajouter un commentaire..."></textarea>
                    </div>
                </div>

                <!-- Boutons -->
                <div class="text-center">
                    <button class="btn btn-primary me-2" @click.prevent="submitForm">FIN DE DÉCLARATION</button>
                    <button class="btn btn-secondary" @click.prevent="resetForm">ANNULER</button>
                </div>
            </form>
        </div>
    </Layout>
</template>

<script setup>
import { reactive, onMounted } from 'vue'
import axios from 'axios'
import Layout from "@/components/layouts/layout.vue";
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

// pour button retour en arrière
const router = useRouter()

// Utilisation du store
const authStore = useAuthStore()


const form = reactive({
    activity: '',
    typePieces: '',
    versionPiece: '',
    num_lot_wafer: '',
    nbPieces: null,
    imprimante: '',
    dateImpression: new Date().toISOString().split('T')[0],
    operateur: authStore.user ? `${authStore.user.prenom.charAt(0).toUpperCase()}${authStore.user.nom.slice(0, 2).toUpperCase()}` : '',
    commentaire: ''
})

const options = reactive({
  activity: [],
  typePieces: [],
  versionPiece: ['A00', 'B01', 'C02'],
  imprimante: [],
})
// récuperer le type de pièce dès que le lot est choisi 
onMounted(() => {
    // Récupérer les types de pièces
    axios.get('http://localhost:3000/api/types')
        .then(response => {
            options.typePieces = response.data
        })
        .catch(error => {
            console.error("Erreur lors du chargement des types de pièces :", error)
            alert("Impossible de charger les types de pièces depuis le serveur.")
        })

    // Récupérer les imprimantes
    axios.get('http://localhost:3000/api/config/imprimantes')
        .then(response => {
            options.imprimante = response.data
        })
        .catch(error => {
            console.error("Erreur lors du chargement des imprimantes :", error)
            alert("Impossible de charger les imprimantes depuis le serveur.")
        })

    // Récupérer les activités
    axios.get('http://localhost:3000/api/config/activites')
        .then(response => {
            options.activity = response.data
        })
        .catch(error => {
            console.error("Erreur lors du chargement des activités :", error)
            alert("Impossible de charger les activités depuis le serveur.")
        })
})


function submitForm() {
    if (!form.nbPieces || form.nbPieces < 1) {
        alert("Veuillez entrer un nombre de pièces valide.")
        return
    }

    const requiredFields = ['activity', 'typePieces', 'versionPiece', 'num_lot_wafer', 'imprimante', 'dateImpression', 'operateur']
    const missingField = requiredFields.find((field) => !form[field])

    if (missingField) {
        alert("Veuillez remplir tous les champs obligatoires.")
        return
    }

    axios.post('http://localhost:3000/api/impression/ajouter', form)
        .then((res) => {
            alert("✅ Formulaire soumis avec succès !")
            console.log('Réponse du serveur :', res.data)
            resetForm()
        })
        .catch((err) => {
            console.error('❌ Erreur lors de l\'envoi :', err)
            alert("Erreur lors de la soumission du formulaire.")
        })
}

function resetForm() {
    form.activity = ''
    form.typePieces = ''
    form.versionPiece = ''
    form.num_lot_wafer = ''
    form.nbPieces = null
    form.imprimante = ''
    form.dateImpression = ''
    form.operateur = ''
    form.commentaire = ''
}

// function button retour en arrière
function goBack() {
    router.back()
}

</script>

<style scoped>
h4 {
    font-weight: bold;
}
</style>

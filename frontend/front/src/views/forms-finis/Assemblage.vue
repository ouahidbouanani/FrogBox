<script setup >
import Layout from "@/components/layouts/layout.vue";
import { reactive, ref, onMounted } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

// Utilisation du store
const authStore = useAuthStore();
const router = useRouter();

function goBack() {
    router.back()
}

const form = reactive({
    activity: '',
    quantite: null,
    id_nozzle: null,
    id_body: null,
    date: new Date().toISOString().split('T')[0],
    operateur: authStore.user ? `${authStore.user.prenom.charAt(0).toUpperCase()}${authStore.user.nom.slice(0, 2).toUpperCase()}` : '',
    commentaire: ''
})
const options = reactive({
    activity: ['PROD', 'PQA', 'NOS', 'DEV'],
})

function submitForm (){
    if (!form.quantite || form.quantite < 1){
        alert("La valeur saisie dans le champ quantité n’est pas valide. Elle doit être supérieure ou égale à 1")
        return
    }
    const requiredFields = ['activity', 'quantite', 'id_nozzle', 'id_body', 'date', 'operateur']
    const missingField = requiredFields.find((field) => !form[field])
    if (missingField) {
        alert("Veuillez remplir tous les champs obligatoires.")
        return
    }
    axios.post('http://localhost:3000/api/assemblage/add', form)
        .then((res) => {
            alert("✅ Formulaire soumis avec succès !")
            console.log('Réponse du serveur :', res.data)
            
        })
        .catch((err) => {
            console.error('❌ Erreur lors de l\'envoi :', err)
            alert("Erreur lors de la soumission du formulaire.")
        })

}

</script>
<template>
    <Layout>
        <div class="container bg-white p-4 rounded shadow mt-4">
            <!--button retour-->
            <div class="d-flex justify-content-start mb-3">
                <button class="btn btn-outline-success" @click="goBack">
                    ← Retour
                </button>
            </div>
            <h4 class="mb-4 text-primary">Formulaire Assemblage</h4>
            <form>
                <!--activité-->
                <div class="mb-3 row">
                    <label class="col-sm-3 col-form-label">Activité</label>
                    <div class="col-sm-9">
                        <select class="form-select" v-model="form.activity" required>
                            <option disabled value=""> Sélectionner </option>
                            <option v-for="item in options.activity" :key="item" :value="item">{{ item }}</option>
                        </select>
                    </div>
                </div>
                <!-- Quantité-->
                <div class="mb-3 row">
                    <label class="col-sm-3 col-form-label">Quantité</label>
                    <div class="col-sm-9">
                        <input type="number" class="form-control" v-model="form.quantite" min="1"
                            placeholder="Entrez le nombre de pièces" />
                    </div>
                </div>
                <!-- id nozzle-->
                <div class="mb-3 row">
                    <label class="col-sm-3 col-form-label">ID Nozzle</label>
                    <div class="col-sm-9">
                        <input type="text" class="form-control" v-model="form.id_nozzle" 
                            placeholder="Entrez le nombre de pièces" />
                    </div>
                </div>
                <!--id Body-->
                <div class ="mb-3 row">
                    <label class="col-sm-3 col-form-label"> ID Body</label>
                    <div class="col-sm-9">
                        <input type="text" class="form-control" v-model="form.id_body" placeholder="ID Body">
                    </div>
                </div>
                <!-- Date  -->
                <div class="mb-3 row">
                    <label class="col-sm-3 col-form-label">Date </label>
                    <div class="col-sm-9">
                        <input type="date" class="form-control" v-model="form.date" required />
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
                    <button class="btn btn-primary me-2" @click.prevent="submitForm">Ajouter</button>
                    
                </div>


            </form>
        </div>
    </Layout>
</template>
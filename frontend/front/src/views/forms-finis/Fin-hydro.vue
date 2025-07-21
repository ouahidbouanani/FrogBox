<template>
  <layout>
  <div class="container mt-5">
    <h1 class="text-center mb-4">Gestion Admin - Activités & Imprimantes</h1>

    <div class="row">
      <!-- Activités -->
      <div class="col-md-6 mb-4">
        <div class="card shadow-sm">
          <div class="card-header bg-primary text-white">Activités</div>
          <div class="card-body">
            <ul class="list-group mb-3">
              <li v-for="act in activites" :key="act.id" class="list-group-item">
                {{ act.nom }}
              </li>
            </ul>
            <form @submit.prevent="ajouterActivite" class="input-group">
              <input
                v-model="nouvelleActivite"
                type="text"
                class="form-control"
                placeholder="Nouvelle activité"
              />
              <button class="btn btn-primary" type="submit">Ajouter</button>
            </form>
          </div>
        </div>
      </div>

      <!-- Imprimantes -->
      <div class="col-md-6 mb-4">
        <div class="card shadow-sm">
          <div class="card-header bg-success text-white">Imprimantes</div>
          <div class="card-body">
            <ul class="list-group mb-3">
              <li v-for="imp in imprimantes" :key="imp.id" class="list-group-item">
                {{ imp.nom }}
              </li>
            </ul>
            <form @submit.prevent="ajouterImprimante" class="input-group">
              <input
                v-model="nouvelleImprimante"
                type="text"
                class="form-control"
                placeholder="Nouvelle imprimante"
              />
              <button class="btn btn-success" type="submit">Ajouter</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
  </layout>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import layout from '@/components/layouts/layout.vue'

// Interfaces
interface Activite {
  id: number
  nom: string
}

interface Imprimante {
  id: number
  nom: string
}

// Références réactives
const activites = ref<Activite[]>([])
const imprimantes = ref<Imprimante[]>([])
const nouvelleActivite = ref('')
const nouvelleImprimante = ref('')

// Chargement initial
const chargerDonnees = async () => {
  try {
    const [resAct, resImp] = await Promise.all([
      axios.get('http://localhost:3000/api/config/activites'),
      axios.get('http://localhost:3000/api/config/imprimantes'),
    ])
    activites.value = resAct.data
    imprimantes.value = resImp.data
    console.log(activites.value);
    console.log(imprimantes.value)
  } catch (error) {
    console.error('Erreur chargement données :', error)
  }
}

// Ajouter une activité
const ajouterActivite = async () => {
  if (!nouvelleActivite.value.trim()) return
  try {
    const res = await axios.post('http://localhost:3000/api/config/activites', { nom: nouvelleActivite.value })
    activites.value.push(res.data)
    nouvelleActivite.value = ''
  } catch (error) {
    console.error('Erreur ajout activité :', error)
  }
}

// Ajouter une imprimante
const ajouterImprimante = async () => {
  if (!nouvelleImprimante.value.trim()) return
  try {
    const res = await axios.post('http://localhost:3000/api/config/imprimantes', { nom: nouvelleImprimante.value })
    imprimantes.value.push(res.data)
    nouvelleImprimante.value = ''
  } catch (error) {
    console.error('Erreur ajout imprimante :', error)
  }
}

onMounted(() => {
  chargerDonnees()
})
</script>

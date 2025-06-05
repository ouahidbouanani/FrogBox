<template>
    <Layout>
  <div class="container  mt-4 ">
    <h2 class="text-center mb-4">Tableau de bord Administrateur</h2>

    <div class="row  mt-5">
      <!-- Gestion des pièces -->
      <div class="col-md-4  mb-4">
        <div class="card text-center shadow h-100">
          <div class="card-body">
            <h5 class="card-title">🔧 Gestion des pièces</h5>
            <p class="card-text">Ajouter, modifier ou supprimer des pièces.</p>
            <button class="btn btn-primary" @click="goToPieces">Accéder</button>
          </div>
        </div>
      </div>

      <!-- Gestion des NC -->
      <div class="col-md-4 mb-4">
        <div class="card text-center shadow h-100">
          <div class="card-body">
            <h5 class="card-title">🛑 Gestion des NC</h5>
            <p class="card-text">Suivre et gérer les non-conformités.</p>
            <button class="btn btn-danger" @click="goToNC">Accéder</button>
          </div>
        </div>
      </div>

    </div>
  </div>
  </Layout>
</template>

<script setup>
import { useRouter } from 'vue-router'
import Layout from "@/components/layouts/layout.vue";

const router = useRouter()

const goToPieces = () => router.push('/detail-piece')
const goToNC = () => router.push('/admin/nc')

</script>

<style scoped>
.card {
  transition: transform 0.2s ease;
}
.card:hover {
  transform: translateY(-5px);
}
</style>

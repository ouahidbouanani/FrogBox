<template> 
    <Layout>
      <div class="container-fluid mt-5">
        <h2 class="mb-4 text-center">📝 Les Formulaires Finis</h2>
  
        <div class="row g-3">
          <div v-for="form in forms" :key="form.name" class="col-md-6 col-lg-4">
            <RouterLink :to="form.path" class="text-decoration-none">
              <div class="card shadow-sm h-100">
                <div class="card-body d-flex align-items-center">
                  <i :class="form.icon" style="font-size: 1.5rem; margin-right: 1rem;"></i>
                  <span class="fw-semibold">{{ form.label }}</span>
                </div>
              </div>
            </RouterLink>
          </div>
        </div>
      </div>
    </Layout>
  </template> 
  
<script setup>
import Layout from "@/components/layouts/layout.vue";

const forms = [
    {
        name: "Assemblage",
        label: "Assemblage",
        path: "/formulaires-finis/assemblage",
        icon: "bi bi-box-seam"
    },
    {
        name: "DebutTomo",
        label: "Début Tomo",
        path: "/formulaires-Finis/debut-tomo",
        icon: "bi bi-camera-reels"
    },
    {
        name: "FinTomo",
        label: "Fin Tomo",
        path: "/formulaires-Finis/fin-tomo",
        icon: "bi bi-camera-reels-fill"
    },
    {
        name: "DebutHydro",
        label: "Début Hydro",
        path: "/DebutHydro",
        icon: "bi bi-droplet"
    },
    {
        name: "FinHydro",
        label: "Fin Hydro",
        path: "/FinHydro",
        icon: "bi bi-droplet-half"
    }
];
</script>

<style scoped>
.card {
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    border: none;
    border-radius: 0.75rem;
}

.card:hover {
    transform: scale(1.02);
    box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.1);
    background-color: aquamarine;
}
</style>

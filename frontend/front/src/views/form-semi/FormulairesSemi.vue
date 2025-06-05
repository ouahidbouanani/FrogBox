<template>
    <Layout>
        <div class="container-fluid mt-5">
            <h2 class="mb-4 text-center">📝 Les Formulaires Semi Finis</h2>

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
        name: "DeclarationWafer",
        label: "Déclaration Wafer",
        path: "/formulaires-finis/DeclarationWafer",
        icon: "bi bi-file-earmark-text"
    },
    {
        name: "FinImpression",
        label: "Fin Impression",
        path: "/formulaires-finis/FinImpression",
        icon: "bi bi-printer"
    },
    {
        name: "DebutEtching",
        label: "Début et suivi de l’etching",
        path: "/formulaires-finis/DebutEtching",
        icon: "bi bi-play-circle"
    },
    {
        name: "PriseCotes",
        label: "Prise de Cotes",
        path: "/formulaires-finis/PriseCotes",
        icon: "bi bi-rulers"
    },
    {
        name: "FinEtching",
        label: "Fin Etching",
        path: "/formulaires-finis/FinEtching",
        icon: "bi bi-check-circle"
    },
    {
        name: "DebutTomo",
        label: "Début Tomo",
        path: "/formulaires-finis/DebutTomo",
        icon: "bi bi-camera-reels"
    },
    {
        name: "FinTomo",
        label: "Fin Tomo",
        path: "/formulaires-finis/FinTomo",
        icon: "bi bi-camera-reels-fill"
    },
    {
    name: "EtchingTable",
    label: "Tableu",
    path: "/Etching-Table",
    icon: "bi bi-table"
    }
]
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
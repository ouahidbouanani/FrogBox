<template>
    <Layout>
    <body>
    <div class="container-fluid px-4 py-5">
        <h2 class="text-center fw-bold mb-3">
            Tous les outils nécessaires pour travailler sur vos PDF, en un seul endroit
        </h2>
        <p class="text-center mb-5">
            Tous les outils dont vous avez besoin pour utiliser les PDF, à portée de main.  Fusionnez, divisez,  convertissez, faites pivoter et
            ajoutez un filigrane à vos PDF en seulement quelques clics.
        </p>

        <div class="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-2">
            <div v-for="outil in outils" :key="outil.nom" class="col">
                <router-link :to="outil.lien" class="text-decoration-none text-dark">
                    <div class="card h-100 shadow-sm card-hover">
                        <div class="card-body d-flex flex-column align-items-start">
                            <div :class="`mb-3 fs-3 ${outil.couleur} icon-hover`">
                                <i :class="outil.icone"></i>
                            </div>
                            <h5 class="card-title fw-bold">{{ outil.nom }}</h5>
                            <p class="card-text">{{ outil.description }}</p>
                            <span v-if="outil.nouveau" class="badge bg-danger mt-auto">Nouveau !</span>
                        </div>
                    </div>
                </router-link>

            </div>
        </div>
    </div>
  </body>
 </Layout>
</template>


<script setup>
import Layout from "@/components/layouts/layout.vue";
const outils = [
    {
        nom: "Fusionner PDF",
        description: "Fusionner et combiner des fichiers PDF et les mettre dans l'ordre que vous voulez.",
        lien: "/outils-pdf/pdf-merge",
        icone: "bi bi-arrow-down-up", couleur: "text-danger"
    },
    {
        nom: "Diviser PDF",
        description: "Sélectionner la portée de pages, séparer une page, ou convertir chaque page.",
        lien: "/outils-pdf/pdf-split",
        icone: "bi bi-scissors", couleur: "text-danger"
    },
    
    {
        nom: "PDF en Word",
        description: "Convertissez facilement vos fichiers PDF en documents DOC et DOCX.",
        lien: "/outils-pdf/pdf-word",
        icone: "bi bi-file-word", couleur: "text-primary"
    },
    {
        nom: "PDF en PowerPoint",
        description: "Transformez vos fichiers PDF en présentations PPT faciles à éditer.",
        lien: "/outils-pdf/pdftoppt",
        icone: "bi bi-file-earmark-slides", couleur: "text-warning"
    },
    {
        nom: "PDF en Excel",
        description: "Convertir vos fichiers PDF en feuilles de calcul Excel éditables.",
        lien: "/outils-pdf/pdf-excel",
        icone: "bi bi-file-earmark-spreadsheet", couleur: "text-success"
    },
    {
    nom: "PDF en JPG",
    description: "Convertir vos pages PDF en images JPG de haute qualité.",
    lien: "/outils-pdf/pdf-image",
    icone: "bi bi-file-image",
    couleur: "text-danger"
  },
  {
    nom: "Faire Pivoter PDF",
    description: "Faire pivoter les pages d’un PDF à 90, 180 ou 270 degrés.",
    lien: "/outils-pdf/rotation-pdf",
    icone: "bi bi-arrow-repeat",
    couleur: "text-info"
  },
  {
    nom: "Ajouter Numéro de Page",
    description: "Numéroter automatiquement les pages de votre fichier PDF.",
    lien: "/outils-pdf/ajout-numero",
    icone: "bi bi-list-ol",
    couleur: "text-secondary"
  }
]
</script>

<style scoped>
.text-purple {
    color: #6f42c1;
}
.card-hover:hover {
  background-color: #aef1b9; /* gris clair */
  transition: background-color 0.3s ease;
}

.card-hover:hover .icon-hover {
  transform: scale(1.2); /* agrandir l’icône */
  transition: transform 0.3s ease;
}



</style>
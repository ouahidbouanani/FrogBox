<template>
    <Layout>
        <b-row class="justify-content-center mt-3">
            <!-- BARRE DE RECHERCHE EN HAUT À DROITE (VISIBLE & BIEN ALIGNÉE) -->
             <div class="d-flex justify-content-end mb-3">
                    <b-form-input v-model="searchTerm" placeholder="Rechercher dans le tableau..." class="w-50"
                        style="max-width: 300px;" />
                    </div>
            <b-col xl="12">
                <CustomSyntax title="Suivi des formulaires - Avancement des lots">
                    <div class="d-flex justify-content-end mb-3">
                    <b-form-input v-model="searchTerm" placeholder="Rechercher dans le tableau..." class="w-50"
                        style="max-width: 300px;" />
                    </div>
                    <template v-slot:sub-text>
                        Affichage dynamique des étapes selon la base de données.
                    </template>

                    <template v-slot:preview>
                        <!-- BARRE DE RECHERCHE EN HAUT À DROITE -->
                        <div class="d-flex justify-content-end mb-3">
                            <b-input v-model="searchTerm" placeholder="Rechercher dans le tableau..." class="w-50" />
                        </div>

                        <!-- TABLEAU -->
                        <b-table-simple responsive class="mb-0">
                            <b-thead head-variant="dark">
                                <b-tr>
                                    <b-th @click="sortByField('id_lot')" style="cursor: pointer">
                                        Lot ID
                                        <span v-if="sortBy === 'id_lot'">{{ sortDesc ? '↓' : '↑' }}</span>
                                    </b-th>
                                    <b-th @click="sortByField('nb_pieces')" style="cursor: pointer">
                                        Nombre de pièces
                                        <span v-if="sortBy === 'nb_pieces'">{{ sortDesc ? '↓' : '↑' }}</span>
                                    </b-th>
                                    <b-th>Avancement</b-th>
                                    <b-th @click="sortByField('current_step')" style="cursor: pointer">
                                        Statut
                                        <span v-if="sortBy === 'current_step'">{{ sortDesc ? '↓' : '↑' }}</span>
                                    </b-th>
                                </b-tr>
                            </b-thead>

                            <b-tbody>
                                <b-tr v-for="lot in paginatedLots" :key="lot.id_lot">
                                    <b-td>{{ lot.id_lot }}</b-td>
                                    <b-td>{{ lot.nb_pieces }}</b-td>
                                    <b-td>
                                        <b-progress :value="getProgressValue(lot.current_step)"
                                            :variant="getProgressVariant(lot.current_step)" height="8px" class="mt-1" />
                                    </b-td>
                                    <b-td>
                                        <i class="mdi mdi-circle" :class="getProgressColor(lot.current_step)"></i>
                                        {{ formatStepName(lot.current_step) }}
                                    </b-td>
                                </b-tr>
                            </b-tbody>
                        </b-table-simple>

                        <!-- PAGINATION -->
                        <b-pagination v-model="currentPage" :total-rows="filteredAndSortedLots.length"
                            :per-page="perPage" align="center" class="mt-3" />
                    </template>
                </CustomSyntax>
            </b-col>
        </b-row>
    </Layout>
</template>

<script lang="ts">
import axios from "axios";
import CustomSyntax from "@/components/custom/custom-syntax.vue";
import Layout from "@/components/layouts/layout.vue";

interface Lot {
    id_lot: number;
    nb_pieces: number;
    current_step: string;
}

export default {
    components: { CustomSyntax, Layout },
    data() {
        return {
            lots: [] as Lot[],
            stepNames: [
                "nouvelle_impression",
                "fin_impression",
                "debut_etching",
                "prise_de_cotes",
                "fin_etching",
                "debut_tomo",
                "fin_tomo",
            ],
            searchTerm: "",
            sortBy: "id_lot" as keyof Lot,
            sortDesc: false,
            currentPage: 1,
            perPage: 10,
        };
    },
    computed: {
        filteredAndSortedLots(): Lot[] {
            const term = this.searchTerm.toLowerCase();

            const filtered = this.lots.filter((lot) => {
                const status = this.formatStepName(lot.current_step).toLowerCase();
                return (
                    lot.id_lot.toString().includes(term) ||
                    lot.nb_pieces.toString().includes(term) ||
                    lot.current_step.toLowerCase().includes(term) ||
                    status.includes(term)
                );
            });

            const sorted = [...filtered].sort((a, b) => {
                let valA = a[this.sortBy];
                let valB = b[this.sortBy];

                if (typeof valA === "string") valA = valA.toLowerCase();
                if (typeof valB === "string") valB = valB.toLowerCase();

                if (valA < valB) return this.sortDesc ? 1 : -1;
                if (valA > valB) return this.sortDesc ? -1 : 1;
                return 0;
            });

            return sorted;
        },
        paginatedLots(): Lot[] {
            const start = (this.currentPage - 1) * this.perPage;
            return this.filteredAndSortedLots.slice(start, start + this.perPage);
        },
    },
    created() {
        this.fetchLots();
    },
    methods: {
        async fetchLots() {
            try {
                const response = await axios.get("http://localhost:3000/api/suivi/lots");
                this.lots = response.data;
            } catch (error) {
                console.error("Erreur lors de la récupération des lots :", error);
            }
        },
        getProgressValue(step: string): number {
            const index = this.stepNames.indexOf(step.toLowerCase());
            return index === -1 ? 0 : ((index + 1) / this.stepNames.length) * 100;
        },
        getProgressVariant(step: string) {
            const index = this.stepNames.indexOf(step.toLowerCase());
            if (index === -1) return "secondary";
            if (index <= 1) return "warning";
            if (index <= 3) return "info";
            if (index <= 5) return "primary";
            return "success";
        },
        getProgressColor(step: string): string {
            const index = this.stepNames.indexOf(step.toLowerCase());
            if (index === -1) return "text-secondary";
            if (index <= 1) return "text-warning";
            if (index <= 3) return "text-info";
            if (index <= 5) return "text-primary";
            return "text-success";
        },
        formatStepName(step: string): string {
            return step
                .split("_")
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" ");
        },
        sortByField(field: keyof Lot) {
            if (this.sortBy === field) {
                this.sortDesc = !this.sortDesc;
            } else {
                this.sortBy = field;
                this.sortDesc = false;
            }
        },
    },
};
</script>

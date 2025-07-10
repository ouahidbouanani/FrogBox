<template>
    <Layout>
        <!-- Boutons haut de page -->
        <div class="d-flex justify-content-between align-items-center my-3">
            <button class="btn btn-outline-success" @click="goBack">
                ← Retour
            </button>
            <button class="btn btn-success" @click="downloadExcel">
                Télécharger Excel
            </button>
        </div>

        <Breadcrumb :title="title" :items="items" />

        <b-row>
            <b-col cols="12">
                <CustomSyntax title="Advanced Table">
                    <template v-slot:preview>
                        <b-row class="mb-md-2">
                            <b-col sm="12" md="6">
                                <label class="d-inline-flex align-items-center">
                                    Show&nbsp;
                                    <b-form-select v-model="perPage" size="sm" :options="pageOptions" />
                                    &nbsp;entries
                                </label>
                            </b-col>
                            <b-col sm="12" md="6">
                                <div class="text-md-end">
                                    <label class="d-inline-flex align-items-center">
                                        Search:
                                        <b-form-input v-model="filter" type="search" placeholder="Search..."
                                            class="form-control form-control-sm ms-2" />
                                    </label>
                                </div>
                            </b-col>
                        </b-row>

                        <div class="table-responsive mb-0">
                            <b-table v-if="etchingData.length > 0" :items="etchingData" :fields="fieldsWithIcons"
                                responsive="sm" striped hover :per-page="perPage" :current-page="currentPage"
                                :sort-by.sync="sortBy" :sort-desc.sync="sortDesc" :filter="filter"
                                :filter-included-fields="filterOn" @filtered="onFiltered" @row-clicked="goToCotes"
                                class="no-borders">
                                <template #cell(operateur)="data">
                                    <button class="btn btn-info btn-sm rounded-pill text-white">
                                        {{ data.item.operateur }}
                                    </button>
                                </template>

                                <template v-for="field in fieldsWithIcons" v-slot:[`head(${field.key})`]="slotProps"
                                    :key="field.key">
                                    <span>
                                        <i :class="field.icon" class="me-1"></i> {{ (slotProps as any).label }}
                                    </span>
                                </template>

                            </b-table>

                            <div v-else class="text-center">
                                <p>Aucune donnée disponible.</p>
                            </div>
                        </div>

                        <b-row>
                            <b-col>
                                <div class="float-end">
                                    <b-pagination v-model="currentPage" :total-rows="rows" :per-page="perPage"
                                        class="pagination-rounded mb-0" />
                                </div>
                            </b-col>
                        </b-row>
                    </template>
                </CustomSyntax>
            </b-col>
        </b-row>
    </Layout>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import Layout from "@/components/layouts/layout.vue";
import Breadcrumb from "@/components/breadcrumb.vue";
import axios from 'axios';
import CustomSyntax from "@/components/custom/custom-syntax.vue";
import * as XLSX from 'xlsx';

const title = 'Advanced Table';
const items = [
    { text: 'Hyper', href: '/' },
    { text: 'Tables', href: '/' },
    { text: 'Advanced Tables', active: true },
];

interface EtchingRow {
    id_lot: number;
    operateur: string;
    nb_passage: number;
    nb_pieces: number;
    date_debut: string;
    heure_debut: string;
    temps_reel: number;
    koh: string;
    bain: string;
    position: number;
    num_lot_wafer: string;
    commentaire: string;
}

const etchingData = ref<EtchingRow[]>([]);
const currentPage = ref(1);
const perPage = ref(10);
const pageOptions = [10, 25, 50, 100];
const filter = ref('');
const filterOn = ref('');
const sortBy = ref('id_lot');
const sortDesc = ref(false);

const rawFields = [
    { key: 'id_lot', label: 'ID Lot', sortable: true, icon: 'bi bi-hash' },
    { key: 'operateur', label: 'Opérateur', sortable: true, icon: 'bi bi-person' },
    { key: 'nb_passage', label: 'Nb Passage', sortable: true, icon: 'bi bi-arrow-repeat' },
    { key: 'nb_pieces', label: 'Nb Pièces', sortable: true, icon: 'bi bi-collection' },
    { key: 'date_debut', label: 'Date Début', sortable: true, icon: 'bi bi-calendar' },
    { key: 'heure_debut', label: 'Heure Début', sortable: true, icon: 'bi bi-clock' },
    { key: 'temps_reel', label: 'Temps Réel', sortable: true, icon: 'bi bi-stopwatch' },
    { key: 'koh', label: 'KOH', sortable: true, icon: 'bi bi-droplet' },
    { key: 'bain', label: 'Bain', sortable: true, icon: 'bi bi-water' },
    { key: 'position', label: 'Position', sortable: true, icon: 'bi bi-geo-alt' },
    { key: 'num_lot_wafer', label: 'Lot KOH', sortable: true, icon: 'bi bi-layers' },
    { key: 'commentaire', label: 'Commentaire', sortable: true, icon: 'bi bi-chat-text' }
];

const fieldsWithIcons = rawFields;

const rows = computed(() => etchingData.value.length);

const fetchData = async () => {
    try {
        const response = await axios.get('http://localhost:3000/api/debut-etching/all');
        etchingData.value = response.data;
    } catch (error) {
        console.error('Erreur lors de la récupération des données :', error);
    }
};

const onFiltered = () => {
    currentPage.value = 1;
};

const router = useRouter();
const goToCotes = (row: any) => {
    const id_lot = row.id_lot;
    const nb_passage = row.nb_passage;
    router.push({ name: 'cotes', params: { id_lot, nb_passage } });
};

const downloadExcel = () => {
    if (!etchingData.value.length) {
        alert("Aucune donnée à exporter.");
        return;
    }

    const dataToExport = etchingData.value.map(item => ({
        ID: item.id_lot,
        Opérateur: item.operateur,
        "Nb passage": item.nb_passage,
        "Nb pièces": item.nb_pieces,
        "Date début": item.date_debut,
        "Heure début": item.heure_debut,
        "Temps réel": item.temps_reel,
        KOH: item.koh,
        Bain: item.bain,
        Position: item.position,
        "Lot KOH": item.num_lot_wafer,
        Commentaire: item.commentaire,
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Etching");

    XLSX.writeFile(workbook, "etching_data.xlsx");
};

function goBack() {
    router.back();
}

onMounted(() => {
    fetchData();
});
</script>

<style scoped>
/* ✅ Supprimer les bordures de table */
.no-borders table,
.no-borders th,
.no-borders td {
    border: none !important;
    box-shadow: none !important;
}

.rounded-pill {
    border-radius: 50rem !important;
}
</style>

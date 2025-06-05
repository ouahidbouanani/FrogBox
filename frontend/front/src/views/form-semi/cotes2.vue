<template>
  <div class="container bg-white p-4 rounded shadow mt-4">
    <div class="d-flex justify-content-start mb-3">
      <button class="btn btn-outline-success" @click="goBack">← Retour</button>
    </div>

    <h2 class="mb-4">Liste des pièces du lot {{ routeId }}</h2>

    <div v-if="tableData.length === 0" class="alert alert-warning" role="alert">
      Les cotes n'ont pas encore été prises pour ce lot.
    </div>

    <table v-if="tableData.length" class="table table-bordered">
      <thead>
        <tr>
          <th>id Pièce</th>
          <th v-for="cote in cotes" :key="cote.nom_cote">
            {{ cote.nom_cote }}<br />
            <small>[{{ cote.tolerance_min }} - {{ cote.tolerance_max }}]</small>
          </th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="row in tableData" :key="row.id_piece_locale">
          <td>{{ row.id_piece_locale }}</td>
          <td
            v-for="cote in cotes"
            :key="cote.nom_cote"
            :class="{ 'text-danger': isOutOfTolerance(row[cote.nom_cote], cote.tolerance_min, cote.tolerance_max) }"
          >
            {{ row[cote.nom_cote] ?? '-' }}
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Section Graphiques -->
    <div v-if="tableData.length" class="mt-5">
      <h3>Graphiques des cotes pour le lot {{ routeId }}</h3>
      <div class="row">
        <div
          v-for="cote in cotes"
          :key="'chart-'+cote.nom_cote"
          class="col-12 col-md-6 col-lg-4 mb-4"
        >
          <div class="chart-container">
            <Line :data="chartData[cote.nom_cote].data" :options="chartData[cote.nom_cote].options" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

// Import Chart.js + plugin annotation + vue-chartjs
import { Line } from 'vue-chartjs';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import annotationPlugin from 'chartjs-plugin-annotation';

ChartJS.register(
  annotationPlugin,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const router = useRouter();
const route = useRoute();

const routeId = ref(parseInt(route.params.id_lot));
const routePassage = ref(parseInt(route.params.nb_passage));

const rawData = ref([]);
const cotes = ref([]);
const tableData = ref([]);
const chartData = ref({});

function goBack() {
  router.back();
}

// Vérifie si valeur hors tolérance
function isOutOfTolerance(value, min, max) {
  if (value === null || value === undefined) return false;
  return value < min || value > max;
}

// Construire données Chart.js pour une cote
function buildChartData(nom_cote, values, toleranceMin, toleranceMax) {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const margin = 0.005;

  const minAdjusted = Math.min(toleranceMin, min) - Math.abs(min) * margin;
  const maxAdjusted = Math.max(toleranceMax, max) + Math.abs(max) * margin;

  const color = '#007bff'; // couleur par défaut bleu

  return {
    data: {
      labels: tableData.value.map(p => p.id_piece_locale.toString()),
      datasets: [
        {
          label: nom_cote,
          data: values,
          borderColor: color,
          fill: false,
          tension: 0.4,
          cubicInterpolationMode: 'monotone',
          pointBackgroundColor: values.map(v =>
            v < toleranceMin || v > toleranceMax ? 'red' : color
          )
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { intersect: false },
      plugins: {
        legend: { display: true, position: 'top' },
        annotation: {
          annotations: {
            toleranceBox: {
              type: 'box',
              yMin: toleranceMin,
              yMax: toleranceMax,
              backgroundColor: 'rgba(0, 255, 0, 0.1)',
              borderWidth: 0
            }
          }
        }
      },
      scales: {
        x: { grid: { display: false }, offset: true },
        y: { grid: { display: false }, min: minAdjusted, max: maxAdjusted }
      }
    }
  };
}

// Récupération des mesures + traitement tableau + graphiques
async function fetchMesures(id_lot, nb_passage) {
  try {
    const res = await fetch(`http://localhost:3000/api/mesures/${id_lot}/${nb_passage}`);
    const data = await res.json();
    rawData.value = data;

    // Extraire les cotes uniques avec tolérances
    const cotesMap = {};
    rawData.value.forEach(d => {
      if (!cotesMap[d.nom_cote]) {
        cotesMap[d.nom_cote] = {
          tolerance_min: d.tolerance_min,
          tolerance_max: d.tolerance_max
        };
      }
    });

    cotes.value = Object.entries(cotesMap).map(([nom_cote, tol]) => ({
      nom_cote,
      tolerance_min: tol.tolerance_min,
      tolerance_max: tol.tolerance_max
    }));

    // Extraire pièces uniques
    const pieces = [...new Set(rawData.value.map(d => d.id_piece_locale))];

    // Construire tableau à double entrée
    tableData.value = pieces.map(id_piece_locale => {
      const row = { id_piece_locale };
      cotes.value.forEach(({ nom_cote }) => {
        const mesure = rawData.value.find(
          d => d.id_piece_locale === id_piece_locale && d.nom_cote === nom_cote
        );
        row[nom_cote] = mesure ? mesure.valeur : null;
      });
      return row;
    });

    // Construire les données des graphiques pour chaque cote
    chartData.value = {};
    for (const cote of cotes.value) {
      const values = tableData.value.map(row => row[cote.nom_cote] ?? null).filter(v => v !== null);
      chartData.value[cote.nom_cote] = buildChartData(
        cote.nom_cote,
        values,
        cote.tolerance_min,
        cote.tolerance_max
      );
    }
  } catch (err) {
    console.error('Erreur lors de la récupération des mesures :', err);
  }
}

onMounted(() => {
  fetchMesures(routeId.value, routePassage.value);
});
</script>

<style scoped>
.text-danger {
  color: red;
}
.chart-container {
  position: relative;
  width: 100%;
  aspect-ratio: 2 / 1;
}
</style>

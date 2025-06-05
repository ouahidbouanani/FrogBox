<template>
  <layout>
    <div class="container bg-white p-4 rounded shadow  mt-4">
      <div class="d-flex justify-content-start mb-3">
        <button class="btn btn-outline-success" @click="goBack">← Retour</button>
      </div>

      <h2 class="mb-4">Liste des pièces du lot {{ routeId }}</h2>

      <div v-if="filteredPieces.length === 0">
        <div class="alert alert-warning" role="alert">
          Les cotes n'ont pas encore été prises pour ce lot.
        </div>
      </div>

      <table v-if="filteredPieces.length" class="table table-bordered">
        <thead>
          <tr>
            <th>id Pièce</th>
            <th>coteA</th>
            <th>coteB</th>
            <th>coteC</th>
          </tr>
          <tr>
            <th>Tolérence
            </th>
            <th>600 ±5µm</th>
            <th>1100 ±10µm</th>
            <th>7790 ±10µm</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="piece in filteredPieces" :key="piece.id_piece">
            <td>{{ piece.id_piece }}</td>

            <td :class="{ 'text-danger': piece.coteA < 595 || piece.coteA > 605 }">
              {{ piece.coteA }}
            </td>

            <td :class="{ 'text-danger': piece.coteB < 1090 || piece.coteB > 1110 }">
              {{ piece.coteB }}
            </td>

            <td :class="{ 'text-danger': piece.coteC < 7780 || piece.coteC > 7800 }">
              {{ piece.coteC }}
            </td>
          </tr>
        </tbody>

      </table>

      <div v-if="filteredPieces.length">
        <h3 class="mt-5">Graphiques pour le lot {{ routeId }}</h3>
        <div class="row">
          <div class="col-12 col-md-6 col-lg-4 mb-4">
            <div class="chart-container">
              <Line :data="dataA.data" :options="dataA.options" />
            </div>
          </div>
          <div class="col-12 col-md-6 col-lg-4 mb-4">
            <div class="chart-container">
              <Line :data="dataB.data" :options="dataB.options" />
            </div>
          </div>
          <div class="col-12 col-md-6 col-lg-4 mb-4">
            <div class="chart-container">
              <Line :data="dataC.data" :options="dataC.options" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </layout>
</template>

<script setup>
import layout from '@/components/layouts/layout.vue';
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
ChartJS.register(annotationPlugin);

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

import { ref, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const router = useRouter();
function goBack() {
  router.back();
}

const route = useRoute();
const routeId = ref(parseInt(route.params.id_lot));
const routePassage = ref(parseInt(route.params.nb_passage));

const filteredPieces = ref([]);

const dataA = ref({});
const dataB = ref({});
const dataC = ref({});

function buildChartData(label, values, color, toleranceMin, toleranceMax) {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const margin = 0.005;

  const minAdjusted = Math.min(toleranceMin, min) - min * margin;
  const maxAdjusted = Math.max(toleranceMax, max) + max * margin;

  return {
    data: {
      labels: filteredPieces.value.map(p => p.id_piece.toString()),
      datasets: [{
        label,
        data: values,
        borderColor: color,
        fill: false,
        tension: 0.4,
        cubicInterpolationMode: "monotone",
        pointBackgroundColor: values.map(v => (v < toleranceMin || v > toleranceMax) ? 'red' : color),
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        intersect: false,
      },
      plugins: {
        legend: {
          display: true,
          position: 'top',
        },
        annotation: {
          annotations: {
            toleranceBox: {
              type: 'box',
              yMin: toleranceMin,
              yMax: toleranceMax,
              backgroundColor: 'rgba(0, 255, 0, 0.1)',
              borderWidth: 0,
            }
          }
        }
      },
      scales: {
        x: {
          grid: { display: false },
          offset: true
        },
        y: {
          grid: { display: false },
          min: minAdjusted,
          max: maxAdjusted
        }
      }
    }
  };
}


async function fetchPiecesByLotId(id_lot, nb_passage) {
  try {
    const res = await fetch(`http://localhost:3000/api/cotes/lot/${id_lot}/${nb_passage}`);
    const data = await res.json();
    filteredPieces.value = data;
    
    const coteA = data.map(p => p.coteA);
    const coteB = data.map(p => p.coteB);
    const coteC = data.map(p => p.coteC);
    
    dataA.value = buildChartData("Cote A", coteA, "#727cf5", 595, 605);     // 600 ± 5µm
    dataB.value = buildChartData("Cote B", coteB, "#0acf97", 1090, 1110);   // 1100 ± 10µm
    dataC.value = buildChartData("Cote C", coteC, "#581845", 7780, 7800);   // 7790 ± 10µm


  } catch (err) {
    console.error("Erreur de récupération des données :", err);
  }
}

onMounted(() => {
  fetchPiecesByLotId(routeId.value, routePassage.value);
});

watch(
  () => [route.params.id_lot, route.params.nb_passage],
  ([newId, newPassage]) => {
    routeId.value = parseInt(newId);
    routePassage.value = parseInt(newPassage);
    fetchPiecesByLotId(routeId.value, routePassage.value);
  }
);
</script>

<style scoped>
.chart-container {
  position: relative;
  width: 100%;
  aspect-ratio: 2 / 1;
}
</style>

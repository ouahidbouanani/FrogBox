<template>
  <div class="container bg-white p-4 rounded shadow mt-4">
    <div class="d-flex justify-content-start mb-3">
      <button class="btn btn-outline-success" @click="goBack">← Retour</button>
    </div>

    <h2 class="mb-4">Liste des pièces du lot {{ routeId }}</h2>

    <div v-if="tableData.length === 0" class="alert alert-warning" role="alert">
      Les cotes n'ont pas encore été prises pour ce lot.
    </div>

    <div class="table-responsive">
      <table v-if="tableData.length" class="table table-bordered table-hover align-middle text-center">
        <thead class="table-light">
          <tr>
            <th>Part ID</th>
            <th v-for="cote in cotes" :key="cote.nom_cote">
              <div class="fw-semibold text-dark">{{ cote.nom_cote }}</div>
              <div class="text-muted small">
                [{{ cote.tolerance_min }} - {{ cote.tolerance_max }}]
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in tableData" :key="row.id_piece_locale">
            <td>
              <span class="badge rounded-pill px-3 py-2 bg-primary text-white">P{{ row.id_piece_locale }}</span>
            </td>
            <td v-for="cote in cotes" :key="cote.nom_cote">
              <template v-if="row[cote.nom_cote] !== null">
                <span class="badge rounded-pill px-3 py-2" :class="'text-black'" :style="{
                  backgroundColor: isOutOfTolerance(row[cote.nom_cote], cote.tolerance_min, cote.tolerance_max)
                    ? '#ff9e9e'
                    : '#bbf7d0'
                }">
                  <i v-if="isOutOfTolerance(row[cote.nom_cote], cote.tolerance_min, cote.tolerance_max)"
                    class="bi bi-exclamation-triangle-fill me-1"></i>
                  {{ row[cote.nom_cote] }}
                </span>
              </template>
              <template v-else>
                <span class="text-muted">-</span>
              </template>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Section Graphiques -->
    <div v-if="rawData.length" class="container mt-5">
      <div class="mb-5">
        <div class="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 class="fw-bold">Quality Control Charts</h2>
            <p class="text-muted">Measurement trends with tolerance limits for Lot {{ routeId }}</p>
          </div>
          <div class="d-flex gap-3">
            <div class="d-flex align-items-center text-muted small">
              <div class="rounded-circle me-2" style="width: 12px; height: 12px; background-color: #bbf7d0;"></div>
              Tolerance Zone
            </div>
            <div class="d-flex align-items-center text-muted small">
              <div class="rounded-circle me-2" style="width: 12px; height: 12px; background-color: #ef4444;"></div>
              Out of Tolerance
            </div>
          </div>
        </div>

        <div class="row">
          <div v-for="cote in cotes" :key="cote.nom_cote" class="col-12  mb-4">
            <div class="card shadow-sm h-100">
              <div class="card-body">
                <div class="d-flex justify-content-between align-items-start mb-3">
                  <div>
                    <h5 class="card-title">{{ cote.nom_cote }}</h5>
                    <p class="text-muted small mb-0">Tolérance: {{ cote.tolerance_min }} - {{ cote.tolerance_max }}</p>
                  </div>
                  <i class="bi bi-graph-up text-primary fs-5"></i>
                </div>

                <div class="row text-center mb-4">
                  <div class="col-6 mb-3">
                    <div class="bg-light rounded p-2">
                      <div class="text-muted small">Conformité</div>
                      <div
                        :class="['fw-semibold', statsMap[cote.nom_cote]?.conformityRate === 100 ? 'text-success' : 'text-danger']">
                        {{ statsMap[cote.nom_cote]?.conformityRate.toFixed(1) }}%
                      </div>
                    </div>
                  </div>
                  <div class="col-6 mb-3">
                    <div class="bg-light rounded p-2">
                      <div class="text-muted small">Non conformes</div>
                      <div
                        :class="['fw-semibold', statsMap[cote.nom_cote]?.outOfTolerance === 0 ? 'text-success' : 'text-danger']">
                        {{ statsMap[cote.nom_cote]?.outOfTolerance }}/{{ statsMap[cote.nom_cote]?.total }}
                      </div>
                    </div>
                  </div>
                  <div class="col-6 mb-3">
                    <div class="bg-light rounded p-2">
                      <div class="text-muted small">Moyenne</div>
                      <div class="fw-semibold">{{ statsMap[cote.nom_cote]?.average }}</div>
                    </div>
                  </div>
                  <div class="col-6 mb-3">
                    <div class="bg-light rounded p-2">
                      <div class="text-muted small">Écart</div>
                      <div class="fw-semibold">{{ statsMap[cote.nom_cote]?.min }} - {{ statsMap[cote.nom_cote]?.max }}
                      </div>
                    </div>
                  </div>
                </div>

                <div style="height: 350px">
                  <Line v-if="chartDataMap[cote.nom_cote]" :data="chartDataMap[cote.nom_cote]"
                    :options="getChartOptions(cote.nom_cote)" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
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

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, annotationPlugin);

const router = useRouter();
const route = useRoute();

const routeId = ref(parseInt(route.params.id_lot));
const routePassage = ref(parseInt(route.params.nb_passage));

const rawData = ref([]);
const cotes = ref([]);
const tableData = ref([]);
const chartDataMap = ref({});
const statsMap = ref({});

function goBack() {
  router.back();
}

function isOutOfTolerance(value, min, max) {
  if (value === null || value === undefined) return false;
  return value < min || value > max;
}

function buildChartData(nom_cote, values, toleranceMin, toleranceMax) {
  const minVal = Math.min(...values);
  const maxVal = Math.max(...values);
  const margin = 0.005;

  const minAdjusted = Math.min(toleranceMin, minVal) - Math.abs(minVal) * margin;
  const maxAdjusted = Math.max(toleranceMax, maxVal) + Math.abs(maxVal) * margin;

  const pointColors = values.map(v =>
    v < toleranceMin || v > toleranceMax ? '#ef4444' : '#bbf7d0'
  );

  return {
    labels: tableData.value.map(p => p.id_piece_locale.toString()),
    datasets: [
      {
        label: nom_cote,
        data: values,
        borderColor: '#3b82f6',
        backgroundColor: '#3b82f6',
        fill: false,
        tension: 0.4,
        pointBackgroundColor: pointColors,
        pointRadius: 5,
        pointHoverRadius: 7,
      }
    ],
    toleranceMin,
    toleranceMax,
    minAdjusted,
    maxAdjusted,
  };
}

function getChartOptions(nom_cote) {
  const data = chartDataMap.value[nom_cote];
  if (!data) return {};

  return {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { intersect: false },
    plugins: {
      legend: { display: true, position: 'top' },
      annotation: {
        annotations: {
          toleranceZone: {
            type: 'box',
            yMin: data.toleranceMin,
            yMax: data.toleranceMax,
            backgroundColor: 'rgba(187, 247, 208, 0.2)',
            borderWidth: 0,
          },
          minLine: {
            type: 'line',
            yMin: data.toleranceMin,
            yMax: data.toleranceMin,
            borderColor: '#ef4444',
            borderWidth: 2,
            borderDash: [6, 6],
            label: {
              enabled: true,
              content: 'Tolérance min',
              position: 'start',
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
              color: '#ef4444'
            }
          },
          maxLine: {
            type: 'line',
            yMin: data.toleranceMax,
            yMax: data.toleranceMax,
            borderColor: '#ef4444',
            borderWidth: 2,
            borderDash: [6, 6],
            label: {
              enabled: true,
              content: 'Tolérance max',
              position: 'start',
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
              color: '#ef4444'
            }
          }
        }
      }
    },
    scales: {
      x: {
        grid: { display: true, drawOnChartArea: false },
        offset: true
      },
      y: {
        grid: { display: true, drawBorder: false, color: '#e5e7eb' }, // gris clair
        min: data.minAdjusted,
        max: data.maxAdjusted,
        ticks: {
          beginAtZero: false,
          color: '#6b7280' // gris moyen
        }
      }
    }
  };
}


async function fetchMesures(id_lot, nb_passage) {
  try {
    const res = await fetch(`http://localhost:3000/api/mesures/${id_lot}/${nb_passage}`);
    const data = await res.json();
    rawData.value = data;

    const cotesMap = new Map();
    const mesureByPiece = new Map();

    data.forEach(mesure => {
      if (!cotesMap.has(mesure.nom_cote)) {
        cotesMap.set(mesure.nom_cote, {
          nom_cote: mesure.nom_cote,
          tolerance_min: mesure.tolerance_min,
          tolerance_max: mesure.tolerance_max
        });
      }

      if (!mesureByPiece.has(mesure.id_piece_locale)) {
        mesureByPiece.set(mesure.id_piece_locale, {
          id_piece_locale: mesure.id_piece_locale
        });
      }

      mesureByPiece.get(mesure.id_piece_locale)[mesure.nom_cote] = mesure.valeur;
    });

    cotes.value = Array.from(cotesMap.values());
    tableData.value = Array.from(mesureByPiece.values());

    // Chart data and stats
    cotes.value.forEach(cote => {
      const values = tableData.value.map(p => p[cote.nom_cote]).filter(v => v !== null && v !== undefined);

      chartDataMap.value[cote.nom_cote] = buildChartData(cote.nom_cote, values, cote.tolerance_min, cote.tolerance_max);

      const out = values.filter(v => v < cote.tolerance_min || v > cote.tolerance_max).length;
      const avg = values.reduce((a, b) => a + b, 0) / values.length;
      const min = Math.min(...values);
      const max = Math.max(...values);

      statsMap.value[cote.nom_cote] = {
        conformityRate: ((values.length - out) / values.length) * 100,
        outOfTolerance: out,
        average: avg,
        min,
        max,
        total: values.length
      };
    });
  } catch (err) {
    console.error('Erreur lors de la récupération des mesures :', err);
  }
}

onMounted(() => {
  fetchMesures(routeId.value, routePassage.value);
});
</script>

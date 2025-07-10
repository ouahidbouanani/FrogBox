<template>
  <Layout>
    <Breadcrumb title="Suivi Non Conformité" />

    <b-row>
      <b-col cols="12">
        <CustomSyntax title="Gestion Non Conformes">
          <template #sub-text></template>

          <template #preview>
            <BaseDataTable id="nc-fixed-columns" class="table table-striped nowrap row-border order-column w-100"
              :data="ncData" :options="fixedColumnsDatatableOptions" :t-head="ncTableHeaders" />
          </template>
        </CustomSyntax>
      </b-col>
    </b-row>

    <!-- Modale d'édition -->
    <b-modal v-model="showEditModal" title="Modifier Non-Conformité" @ok="saveModifications" ok-title="Enregistrer">
      <b-form>
        <!-- Champs non modifiables -->
        <b-form-group label="ID Lot"><b-form-input :model-value="selectedRow[1]" disabled /></b-form-group>
        <b-form-group label="ID Pièce"><b-form-input :model-value="selectedRow[2]" disabled /></b-form-group>
        <b-form-group label="Opérateur"><b-form-input :model-value="selectedRow[3]" disabled /></b-form-group>
        <b-form-group label="Date"><b-form-input :model-value="selectedRow[4]" disabled /></b-form-group>
        <b-form-group label="Dénomination"><b-form-input :model-value="selectedRow[5]" disabled /></b-form-group>
        <b-form-group label="Produit"><b-form-input :model-value="selectedRow[6]" disabled /></b-form-group>
        <b-form-group label="Description"><b-form-input :model-value="selectedRow[7]" disabled /></b-form-group>
        <b-form-group label="Type"><b-form-input :model-value="selectedRow[8]" disabled /></b-form-group>
        <b-form-group label="Proud"><b-form-input :model-value="selectedRow[9]" disabled /></b-form-group>

        <!-- Champs modifiables -->
        <b-form-group label="Action"><b-form-input v-model="editForm.action" /></b-form-group>
        <b-form-group label="Impact"><b-form-input v-model="editForm.impact" /></b-form-group>
        <b-form-group label="Décision">
          <b-form-select v-model="editForm.decision" required>
            <option disabled value="">Choisir une décision</option>
            <option value="Acceptable">Acceptable</option>
            <option value="Rebut">Rebut</option>
            <option value="Isolement">Isolement</option>
          </b-form-select>
        </b-form-group>

        <b-form-group label="Cause Racine"><b-form-input v-model="editForm.cause_racine" /></b-form-group>
        <b-form-group label="Action Corrective"><b-form-input v-model="editForm.action_corrective" /></b-form-group>
        <b-form-group label="Statut">
          <b-form-select v-model="editForm.statut" :options="statutOptions" />
        </b-form-group>
      </b-form>
    </b-modal>
  </Layout>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue"
import axios from "axios"
import Layout from "@/components/layouts/layout.vue"
import Breadcrumb from "@/components/breadcrumb.vue"
import CustomSyntax from "@/components/custom/custom-syntax.vue"
import BaseDataTable from "@/components/base-data-table.vue"

interface NcRow {
  id: number
  id_lot: string
  id_piece: string
  operateur: string
  date: string
  denomination: string
  produit: string
  description: string
  type: string
  proud: string
  action: string
  impact: string
  decision: string
  cause_racine: string
  action_corrective: string
  statut: string
}

const ncData = ref<any[][]>([])

const ncTableHeaders = [
  'ID', 'ID Lot', 'ID Pièce', 'Opérateur', 'Date',
  'Dénomination', 'Produit', 'Description', 'Type', 'Proud',
  'Action', 'Impact', 'Cause Racine', 'Action Corrective', 'Statut', 'Décision'
]

function statutToBadge(statut: string) {
  const lower = (statut || '').toLowerCase()
  if (lower === 'clôturé' || lower === 'traité') {
    return `<span class="badge badge-success">${statut}</span>`
  } else {
    return `<span class="badge badge-warning">${statut}</span>`
  }
}

const fixedColumnsDatatableOptions = ref({
  scrollX: true,
  scrollY: 300,
  scrollCollapse: true,
  paging: false,
  fixedColumns: { leftColumns: 1, rightColumns: 1 },
  order: [[4, 'desc']],
  columnDefs: [
    {
      targets: 14, // colonne Statut
      render: function (data: string) {
        return data
      }
    }
  ],
  language: {
    paginate: {
      previous: "<i class='ri-arrow-left-s-line'>",
      next: "<i class='ri-arrow-right-s-line'>",
    },
  },
  drawCallback: function () {
    $(".dataTables_paginate > .pagination").addClass("pagination-rounded")

    const table = document.getElementById('nc-fixed-columns')
    if (!table) return

    table.querySelectorAll('tbody tr').forEach(row => {
      row.removeEventListener('click', rowClickHandler)
      row.addEventListener('click', rowClickHandler)
    })
  },
})

const showEditModal = ref(false)
const selectedRow = ref<any[]>([])

const editForm = ref({
  action: '',
  impact: '',
  decision: '',
  cause_racine: '',
  action_corrective: '',
  statut: '',
})

const statutOptions = ['En cours', 'Clôturé', 'Traité']

function openEditModal(row: any[]) {
  selectedRow.value = row
  editForm.value.action = row[10]
  editForm.value.impact = row[11]
  editForm.value.decision = row[15]
  editForm.value.cause_racine = row[12]
  editForm.value.action_corrective = row[13]
  editForm.value.statut = row[14]?.replace(/<[^>]+>/g, '') || ''
  showEditModal.value = true
}

function rowClickHandler(this: HTMLTableRowElement) {
  const cells = Array.from(this.querySelectorAll('td')).map(td => td.innerHTML)
  if (cells) openEditModal(cells)
}

async function fetchNcData() {
  try {
    const response = await axios.get('http://localhost:3000/api/nc')
    ncData.value = response.data.map((item: NcRow) => [
      item.id,
      item.id_lot,
      item.id_piece,
      item.operateur,
      new Date(item.date).toLocaleDateString(),
      item.denomination,
      item.produit,
      item.description,
      item.type,
      item.proud,
      item.action || '',
      item.impact || '',
      item.cause_racine || '',
      item.action_corrective || '',
      statutToBadge(item.statut || ''),
      item.decision || '',
    ])
  } catch (error) {
    console.error("Erreur lors de la récupération des NC :", error)
  }
}

async function saveModifications() {
  try {
    const id = selectedRow.value[0]
    await axios.put(`http://localhost:3000/api/nc/${id}`, {
      action: editForm.value.action,
      impact: editForm.value.impact,
      decision: editForm.value.decision,
      cause_racine: editForm.value.cause_racine,
      action_corrective: editForm.value.action_corrective,
      statut: editForm.value.statut,
    })
    showEditModal.value = false
    await fetchNcData()
  } catch (error) {
    console.error("Erreur lors de la mise à jour :", error)
  }
}

onMounted(() => {
  fetchNcData()
})
</script>

<style>
.badge-success {
  background-color: #28a745;
  color: white;
  padding: 0.4em 0.75em;
  border-radius: 999px;
  font-size: 0.75rem;
  display: inline-block;
}

.badge-warning {
  background-color: #ffc107;
  color: black;
  padding: 0.4em 0.75em;
  border-radius: 999px;
  font-size: 0.75rem;
  display: inline-block;
}
</style>

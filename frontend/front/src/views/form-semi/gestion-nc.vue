<template>
  <Layout>
    <Breadcrumb title="Suivi Non Conformité" />

    <b-row>
      <b-col cols="12">
        <CustomSyntax title="Déclarations Non Conformes">
          <template #sub-text></template>

          <template #preview>
            <BaseDataTable
              id="nc-fixed-columns"
              class="table table-striped nowrap row-border order-column w-100"
              :data="ncData"
              :options="fixedColumnsDatatableOptions"
              :t-head="ncTableHeaders"
            />
          </template>
        </CustomSyntax>
      </b-col>
    </b-row>

    <!-- Modale d'édition -->
    <b-modal v-model="showEditModal" title="Modifier Non-Conformité" @ok="saveModifications" ok-title="Enregistrer">
      <b-form>
        <!-- Champs non modifiables -->
        <b-form-group label="ID Lot">
          <b-form-input :model-value="selectedRow[1]" disabled />
        </b-form-group>

        <b-form-group label="ID Pièce">
          <b-form-input :model-value="selectedRow[2]" disabled />
        </b-form-group>

        <b-form-group label="Opérateur">
          <b-form-input :model-value="selectedRow[3]" disabled />
        </b-form-group>

        <b-form-group label="Date">
          <b-form-input :model-value="selectedRow[4]" disabled />
        </b-form-group>

        <b-form-group label="Dénomination">
          <b-form-input :model-value="selectedRow[5]" disabled />
        </b-form-group>

        <b-form-group label="Produit">
          <b-form-input :model-value="selectedRow[6]" disabled />
        </b-form-group>

        <b-form-group label="Description">
          <b-form-input :model-value="selectedRow[7]" disabled />
        </b-form-group>

        <b-form-group label="Type">
          <b-form-input :model-value="selectedRow[8]" disabled />
        </b-form-group>

        <b-form-group label="Proud">
          <b-form-input :model-value="selectedRow[9]" disabled />
        </b-form-group>

        <!-- Champs modifiables -->
        <b-form-group label="Action">
          <b-form-input v-model="editForm.action" />
        </b-form-group>

        <b-form-group label="Impact">
          <b-form-input v-model="editForm.impact" />
        </b-form-group>

        <b-form-group label="Décision">
          <b-form-input v-model="editForm.decision" />
        </b-form-group>

        <b-form-group label="Cause Racine">
          <b-form-input v-model="editForm.cause_racine" />
        </b-form-group>

        <b-form-group label="Action Corrective">
          <b-form-input v-model="editForm.action_corrective" />
        </b-form-group>

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

// Données du tableau, format tableau de tableaux (lignes)
const ncData = ref<any[][]>([])

const ncTableHeaders = [
  'ID',
  'ID Lot',
  'ID Pièce',
  'Opérateur',
  'Date',
  'Dénomination',
  'Produit',
  'Description',
  'Type',
  'Proud',
  'Action',
  'Impact',
  'Décision',
  'Cause Racine',
  'Action Corrective',
  'Statut',
]

// Options DataTable
const fixedColumnsDatatableOptions = ref({
  scrollX: true,
  scrollY: 300,
  scrollCollapse: true,
  paging: false,
  fixedColumns: {
    leftColumns: 1,
    rightColumns: 1,
  },
  order: [[4, 'desc']],
  language: {
    paginate: {
      previous: "<i class='ri-arrow-left-s-line'>",
      next: "<i class='ri-arrow-right-s-line'>",
    },
  },
  drawCallback: () => {
    $(".dataTables_paginate > .pagination").addClass("pagination-rounded")
  },
})

// Pour gérer la modale et les données sélectionnées
const showEditModal = ref(false)
const selectedRow = ref<any[]>([])

// Formulaire d'édition (seulement les champs modifiables)
const editForm = ref({
  action: '',
  impact: '',
  decision: '',
  cause_racine: '',
  action_corrective: '',
  statut: '',
})

const statutOptions = ['Ouvert', 'En cours', 'Clôturé']

function openEditModal(row: any[]) {
  selectedRow.value = row
  editForm.value.action = row[10]
  editForm.value.impact = row[11]
  editForm.value.decision = row[12]
  editForm.value.cause_racine = row[13]
  editForm.value.action_corrective = row[14]
  editForm.value.statut = row[15]
  showEditModal.value = true
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
      item.decision || '',
      item.cause_racine || '',
      item.action_corrective || '',
      item.statut,
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

    setTimeout(() => {
    const table = document.getElementById('nc-fixed-columns')
    if (!table) return
    
    table.querySelectorAll('tbody tr').forEach(row => {
      row.addEventListener('click', () => {
        const cells = Array.from(row.querySelectorAll('td')).map(td => td.textContent)
        if (cells) openEditModal(cells)
      })
    })
  }, 1000) 
})
</script>

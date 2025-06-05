<script setup>
import { ref } from "vue";
import axios from "axios";
import Layout from "@/components/layouts/layout.vue";
const pdfFile = ref(null);
const previewImage = ref(null);
const rotation = ref(0);

const uploadPdf = async (event) => {
  const file = event.target.files[0];
  if (!file) return;
  pdfFile.value = file;

  const formData = new FormData();
  formData.append("pdf", file);

  const response = await axios.post("http://127.0.0.1:5000/upload", formData);
  previewImage.value = response.data.image;
};

const rotatePdf = async (direction) => {
  if (!pdfFile.value) return;
  rotation.value += direction === "right" ? 90 : -90;

  const formData = new FormData();
  formData.append("pdf", pdfFile.value);
  formData.append("rotation", rotation.value);

  const response = await axios.post("http://127.0.0.1:5000/rotate", formData);
  previewImage.value = response.data.image;
};

const downloadPdf = async () => {
  if (!pdfFile.value) return;

  const formData = new FormData();
  formData.append("pdf", pdfFile.value);
  formData.append("rotation", rotation.value);

  const response = await axios.post("http://127.0.0.1:5000/download", formData, {
    responseType: "blob",
  });

  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement("a");
  link.href = url;
  const originalFileName = pdfFile.value.name.replace(/\.pdf$/, ""); // Enlever l'extension .pdf
  link.setAttribute("download", `${originalFileName}_pivoté.pdf`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
</script>

<template>
  <Layout>
    <div class="container mt-5 text-center">
      <h2>PDF Rotate Tool</h2>
      <input type="file" class="form-control my-3" @change="uploadPdf" accept="application/pdf" />

      <div v-if="previewImage" class="mt-3">
        <img :src="previewImage" class="border shadow-sm rounded" width="200" alt="PDF Preview" />
        <div class="mt-2">
          <button class="btn btn-primary mx-1" @click="rotatePdf('left')">↺ Gauche</button>
          <button class="btn btn-primary mx-1" @click="rotatePdf('right')">↻ Droite</button>
        </div>
      </div>

      <button v-if="pdfFile" class="btn btn-success mt-3" @click="downloadPdf">
        Télécharger le PDF
      </button>
    </div>
  </Layout>
</template>

<style>
.container {
  max-width: 500px;
}
</style>

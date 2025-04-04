<template>
  <Navbar/>
    <div class="container">
      <h1 class="text-center">TECHOPS CHIP</h1>
      
      <div class="row">
        <div class="col-md-4">
          <div class="alert alert-success">New</div>
          <button class="btn btn-outline-primary w-100" @click="$router.push('/form-data-wafer')">Wafer</button>
          <button class="btn btn-outline-primary w-100" @click="$router.push('/form-data-chip')">Chip</button>
        </div>
  
        <div class="col-md-6">
          <h5>RAW DATA</h5>
          <router-link to="/data-chip" class="data-link">🗂️ 1 - DATA - TechOps Chip </router-link> <br>
          <router-link to="/data-wafer" class="data-link">🗂️ 2 - DATA - TechOps Wafer</router-link>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import Navbar from '@/components/Navbar.vue';
  </script>
  
  <style scoped>
  .techops-chip {
    padding: 20px;
  }
  .new-title {
    background-color: green;
    color: white;
    padding: 10px;
  }
  .raw-data-title, .prd-title, .stock-title, .dev-title {
    font-weight: bold;
  }
  ul {
    list-style-type: disc;
    padding-left: 20px;
  }
  .date-selection {
    margin-top: 10px;
  }
  </style>
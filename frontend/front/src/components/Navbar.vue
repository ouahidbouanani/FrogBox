<template>
  <nav class="navbar navbar-expand-lg bg-body-tertiary">
    <div class="container-fluid">
      <router-link class="navbar-brand d-flex align-items-center gap-2" to="/">
        <img src="../assets/images/box.png" alt="Frog Logo" width="100" height="50" class="d-inline-block align-text-top" />
      </router-link>


      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarScroll"
        aria-controls="navbarScroll" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarScroll">
        <ul class="navbar-nav me-auto my-2 my-lg-0 navbar-nav-scroll" style="--bs-scroll-height: 100px;">
          <li class="nav-item">
            <router-link class="nav-link active" aria-current="page" to="/smart">Home</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/#">index</router-link>
          </li>
          <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
              Tous les outils PDF
            </a>
            <ul class="dropdown-menu">
              <li><router-link class="dropdown-item" to="/pdf-merge">Fussioner PDF</router-link></li>
              <li><router-link class="dropdown-item" to="/pdf-split">Diviser PDF</router-link></li>
              <li><router-link class="dropdown-item" to="/pdf-word">PDF en Word</router-link></li>
              <li><router-link class="dropdown-item" to="/pdf-image">PDF en JPG</router-link></li>
              <li><router-link class="dropdown-item" to="/pdftoppt">PDF en Excel</router-link></li>
              <li><router-link class="dropdown-item" to="/pdf-excel">PDF en PowerPoint</router-link></li>
              <li><router-link class="dropdown-item" to="/rotation-pdf">Pivoter PDF</router-link></li>
              <li><router-link class="dropdown-item" to="/ajout-numero">Ajouter des numéros de pages</router-link></li>
            </ul>
          </li>
          <li class="nav-item">
            <span class="nav-link disabled" aria-disabled="true">Link</span>
          </li>
        </ul>
        <form class="d-flex" role="search">
          <input class="form-control me-2" type="search" placeholder="Search" aria-label="Search">
          <button class="btn btn-outline-success" type="submit">Search</button>
        </form>
      </div>
    </div>
  </nav>
</template>
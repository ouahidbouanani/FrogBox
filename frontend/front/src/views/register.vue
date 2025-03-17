<template>
    <div class="container mt-5">
      <div class="row justify-content-center">
        <div class="col-md-6">
          <h2>Inscription</h2>
          <form @submit.prevent="register">
            <div class="mb-3">
              <label for="nom" class="form-label">Nom</label>
              <input
                type="text"
                id="nom"
                class="form-control"
                v-model="nom"
                required
              />
            </div>
  
            <div class="mb-3">
              <label for="email" class="form-label">Email</label>
              <input
                type="email"
                id="email"
                class="form-control"
                v-model="email"
                required
              />
            </div>
  
            <div class="mb-3">
              <label for="password" class="form-label">Mot de passe</label>
              <input
                type="password"
                id="password"
                class="form-control"
                v-model="password"
                required
              />
            </div>
  
            <button type="submit" class="btn btn-primary">S'inscrire</button>
          </form>
          <p class="mt-3">
            Vous avez déjà un compte ? <router-link to="/login">Se connecter</router-link>
          </p>
        </div>
      </div>
    </div>
    {{errorMessage}}
  </template>
 <script>
 import axios from 'axios';
 import { ref } from 'vue';
 import { useRouter } from 'vue-router';
 
 export default {
     name: 'register',
     setup() {
         const nom = ref('');
         const email = ref('');
         const password = ref('');
         const errorMessage = ref('');
         const router = useRouter();
 
         const register = () => {
             axios.post('http://localhost:3000/register', {
                 nom: nom.value,
                 email: email.value,
                 mot_de_passe: password.value
             })
             .then((response) => {
                 if (response.status === 200) {
                     alert("Inscription réussie ! Vous pouvez maintenant vous connecter.");
                     router.push('/login'); // Redirige vers la page de connexion
                 } else {
                     errorMessage.value = response.data;
                 }
             })
             .catch((error) => {
                 errorMessage.value = error.response?.data || "Erreur lors de l'inscription.";
             });
         };
 
         return {
             nom,
             email,
             password,
             errorMessage,
             register
         };
     }
 }
 </script>
 
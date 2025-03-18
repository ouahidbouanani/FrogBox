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
    <div  class= "error">
    {{ errorMessage }}
  </div>
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
                 if (response.status === 201) {
                     alert("Inscription réussie ! Vous pouvez maintenant vous connecter.");
                     router.push('/login');
                 } else {
                     errorMessage.value = response.data.error;
                 }
             })
             .catch((error) => {
                 errorMessage.value = error.response?.data.error || "Erreur lors de l'inscription.";
                 setTimeout(() => {
                    errorMessage.value = '';
                }, 5000);
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
  <style scoped>
  .error {
    color: red;
    padding: 10px;
    border-radius: 5px;
    margin-top: 10px;
    text-align: center;
    transition: opacity 0.5s ease-in-out;
  }
  </style>
 
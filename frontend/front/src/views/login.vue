<template>
    <div class="container mt-5">
      <div class="row justify-content-center">
        <div class="col-md-6">
          <h2>Connexion</h2>
          <form @submit.prevent="login">
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
  
            <button type="submit" class="btn btn-primary" >Se connecter</button>
          </form>
          <p class="mt-3" @click="navigateToRegister">
            Pas encore inscrit ? <router-link to="/register">S'inscrire</router-link>
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
    name: 'login',
    setup() {
        const email = ref('');
        const password = ref('');
        const errorMessage = ref('');
        const router = useRouter();

        const login = () => {
            axios.post('http://localhost:3000/login', {
                email: email.value,
                mot_de_passe: password.value
            })
            
            .then((response) => {
                if (response.status === 200) {
                    localStorage.setItem('token', response.data.token);
                    localStorage.setItem('user', response.data.user);
                    router.push('/dash');
                } else if (response.status === 201) {
                    errorMessage.value = response.data;
                }
            })
            .catch((error) => {
                errorMessage.value = error.response?.data || "Erreur lors de la connexion.";
            });
        };

        return {
            email,
            password,
            errorMessage,
            login
        };
    },
    methods: {
        navigateToRegister() {
            this.$router.push('/register');
        },
    },
}
  </script>
  
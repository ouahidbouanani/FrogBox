<template>
  <DefaultLayout body-class="authentication-bg pb-0">
    <div class="auth-fluid">
      <!-- Auth fluid left content -->
      <div class="auth-fluid-form-box">
        <div class="card-body d-flex flex-column h-100 gap-3">

          <!-- Logo -->
          <div class="auth-brand text-center text-lg-start">
            <router-link to="/" class="logo-dark">
              <span><img src="@/assets/images/logo_treefrog_.png" alt="dark logo" height="50"></span>
            </router-link>
            <router-link to="/" class="logo-light">
              <span><img src="@/assets/images/logo_treefrog_.png" alt="logo" height="50"></span>
            </router-link>
          </div>

          <div class="my-auto">
            <!-- title -->
            <h4 class="mt-3">Inscription</h4>
            <p class="text-muted mb-4">Pas de compte ? Créez-en un, cela prend moins d'une minute.</p>

            <!-- form -->
            <b-form @submit.prevent="handleRegister">
              <!-- Prénom -->
              <b-form-group label="Prénom" label-for="firstname" class="mb-3">
                <b-form-input v-model="firstName" type="text" id="firstname" placeholder="Entrez votre prénom" required />
              </b-form-group>

              <!-- Nom -->
              <b-form-group label="Nom" label-for="lastname" class="mb-3">
                <b-form-input v-model="lastName" type="text" id="lastname" placeholder="Entrez votre nom" required />
              </b-form-group>

              <!-- Email -->
              <b-form-group label="Email" label-for="email" class="mb-3">
                <b-form-input v-model="email" type="email" id="email" placeholder="Entrez votre email @treefrog.fr" required />
              </b-form-group>

              <!-- Mot de passe -->
              <b-form-group label="Password" label-for="password" class="mb-3">
                <b-form-input v-model="password" type="password" id="password" placeholder="Entrez votre mpt de passe" required />
              </b-form-group>

              <!-- Confirmer le mot de passe -->
              <b-form-group label="confirmation du mot de passe" label-for="passwordConfirm" class="mb-3">
                <b-form-input v-model="passwordConfirm" type="password" id="passwordConfirm" placeholder="Confirmez votre mot de passe" required />
              </b-form-group>

              <div class="mb-0 d-grid text-center">
                <b-button variant="primary" type="submit"><i class="mdi mdi-account-circle"></i>S'inscrire</b-button>
              </div>
            </b-form>

          </div>

          <!-- Footer-->
          <footer class="footer footer-alt">
            <p class="text-muted">Vous avez déjà un compte ? <router-link to="/login" class="text-muted ms-1"><b>Se connecter</b></router-link>
            </p>
          </footer>

        </div> <!-- end .card-body -->
      </div>
      <!-- end auth-fluid-form-box-->

      <!-- Auth fluid right content -->
      <div class="auth-fluid-right text-center">
        <div class="auth-user-testimonial">
          <h2 class="mb-3">I love the color!</h2>
          <p class="lead"><i class="mdi mdi-format-quote-open"></i> It's an elegant template. I love it very much! <i class="mdi mdi-format-quote-close"></i>
          </p>
          <p>
            - Hyper Admin User
          </p>
        </div> <!-- end auth-user-testimonial-->
      </div>
      <!-- end Auth fluid right content -->
    </div>
    <!-- end auth-fluid-->
  </DefaultLayout>
</template>

<script lang="ts">
import DefaultLayout from '@/components/layouts/default-layout.vue';
import axios from 'axios';

export default {
  components: { DefaultLayout },
  data() {
    return {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      passwordConfirm: ''
    };
  },
  methods: {
    handleRegister() {
      if (this.password !== this.passwordConfirm) {
        alert('Passwords do not match!');
        return;
      }

      // Envoi des données au backend pour l'inscription
      axios.post('http://localhost:3000/api/auth/register', {
        nom: this.lastName,
        prenom: this.firstName,
        email: this.email,
        password: this.password
      })
      .then(response => {
        alert('Inscription réussie!');
        this.$router.push('/login'); // Rediriger vers la page de connexion
      })
      .catch(error => {
        console.error('Erreur d\'inscription:', error);
        alert('Erreur d\'inscription');
      });
    }
  }
};
</script>

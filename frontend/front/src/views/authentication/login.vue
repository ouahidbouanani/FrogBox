<template>
  <DefaultLayout body-class="authentication-bg">
    <div class="position-absolute start-0 end-0 start-0 bottom-0 w-100 h-100">
      <svg xmlns='http://www.w3.org/2000/svg' width='100%' height='100%' viewBox='0 0 800 800'>
        <g fill-opacity='0.22'>
          <circle style="fill: rgba(0, 255, 0, 0.1);" cx='400' cy='400' r='600' />
          <circle style="fill: rgba(0, 255, 0, 0.2);" cx='400' cy='400' r='500' />
          <circle style="fill: rgba(0, 255, 0, 0.3);" cx='400' cy='400' r='300' />
          <circle style="fill: rgba(0, 255, 0, 0.4);" cx='400' cy='400' r='200' />
          <circle style="fill: rgba(0, 255, 0, 0.5);" cx='400' cy='400' r='100' />
        </g>
      </svg>

    </div>

    <div class="account-pages pt-2 pt-sm-5 pb-4 pb-sm-5 position-relative">
      <b-container>
        <b-row class="justify-content-center">
          <b-col xxl="4" lg="5">
            <div class="card">
              <!-- Logo -->
              <div class="card-header py-4 text-center custom-bg">
                <router-link to="/">
                  <span><img src="@/assets/images/logo_treefrog_.jpg" alt="logo" height="102"></span>
                </router-link>
              </div>

              <div class="card-body p-4">
                <div class="text-center w-75 m-auto">
                  <h4 class="text-dark-50 text-center pb-0 fw-bold">Se connecter</h4>
                  <p class="text-muted mb-4">Entrez votre adresse email et votre mot de passe pour accéder</p>
                </div>

                <b-form @submit.prevent="logIn">
                  <div v-if="error" class="text-danger text-center mb-2">Informations de connexion invalides</div>

                  <b-form-group label="Email address" label-for="emailaddress" class="mb-3">
                    <b-form-input type="email" id="emailaddress" v-model="email" placeholder="Enter your email"
                      required />
                  </b-form-group>

                  <div class="mb-3">
                    <router-link to="/recoverpw" class="text-muted float-end">
                      <small>Mot de passe oublié ?</small>
                    </router-link>
                    <label for="password" class="form-label">Mot de passe</label>
                    <div class="input-group input-group-merge">
                      <input :type="showPassword ? 'text' : 'password'" id="password" class="form-control"
                        v-model="password" placeholder="Enter your password" />
                      <button type="button" class="input-group-text bg-seconde border-start-0"
                        @click="togglePassword">
                        <i :class="showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
                      </button>
                    </div>
                  </div>


                  <div class="mb-3 mb-0 text-center">
                    <b-button variant="success" type="submit" class="btn-custom">Connexion
                    </b-button>
                  </div>
                </b-form>
              </div> <!-- end card-body -->
            </div>
            <!-- end card -->

            <b-row class="mt-3">
              <b-col cols="12" class="text-center">
                <p class="text-muted">Vous n'avez pas de compte ?
                  <router-link to="/register-2" class="text-muted ms-1"><b> Inscrivez-vous</b></router-link>
                </p>
              </b-col> <!-- end col -->
            </b-row>
            <!-- end row -->
          </b-col> <!-- end col -->
        </b-row>
        <!-- end row -->
      </b-container>
      <!-- end container -->
    </div>
    <!-- end page -->

    <Footer2 />
  </DefaultLayout>
</template>

<script lang="ts">
import { useAuthStore } from '@/stores/auth';
import router from '@/router';
import DefaultLayout from '@/components/layouts/default-layout.vue';
import Footer2 from '@/components/layouts/partials/footer-2.vue';

export default {
  components: { DefaultLayout, Footer2 },
  data() {
    return {
      email: 'ouahid.bouanani@treefrog.fr',
      password: 'ouahid123',
      error: false,
      showPassword: false, // 👈 visibilité mot de passe
    };
  },
  methods: {
    async logIn() {
      const authStore = useAuthStore();
      const success = await authStore.login(this.email, this.password);
      if (success) {
        console.log('Login successful, redirecting...');
        this.error = false;
        this.$router.push('/');
      } else {
        this.error = true;
      }
    },
    togglePassword() {
      this.showPassword = !this.showPassword;
    },
  },
  mounted() {
    const authStore = useAuthStore();
    authStore.loadUserFromLocalStorage();
  },
};

</script>

<style scoped></style>

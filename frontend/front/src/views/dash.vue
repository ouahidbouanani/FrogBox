<template>
    <h1>Dashboard</h1>
    <p>Bienvenue, {{ user?.nom }} !</p>
    <button @click="logout">Déconnexion</button>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
export default {
  setup() {
      const user = ref(null);
      const router = useRouter();

      onMounted(() => {
          const userData = localStorage.getItem('user');
          if (userData) {
              user.value = JSON.parse(userData);
          }
      });

      const logout = () => {
          localStorage.removeItem('token'); 
          localStorage.removeItem('user');  
          router.push('/login'); 
          setTimeout(() => {
                window.location.reload();
               }, 3000);
      };

      return { user, logout };
  }
};
</script>

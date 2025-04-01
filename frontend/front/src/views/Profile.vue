<template>
    <div v-if="user">
        <h1>Bienvenue, {{ user.name }}</h1>
        <p>Email: {{ user.email }}</p>
        <a href="http://localhost:3000/logout">
            <button>Déconnexion</button>
        </a>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    data() {
        return { user: null };
    },
    async created() {
        try {
            const response = await axios.get('http://localhost:3000/user', { withCredentials: true });
            this.user = response.data;
        } catch (error) {
            this.$router.push('/');
        }
    }
};
</script>

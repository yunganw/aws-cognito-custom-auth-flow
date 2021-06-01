<template>
    <div id="app">
        <router-view />
    </div>
</template>

<script>
import { Auth } from '@aws-amplify/auth';

export default {
    name: 'App',
    methods: {
        async logout() {
            try {
                await Auth.signOut();
            } catch (error) {
                alert(error.message);
            }
        },
    },
};
</script>
<template>
    <div class="container">
        <div class="modal-dialog">
            <div class="modal-content background-customizable modal-content-mobile">
                <div>
                    <div class="banner-customizable">
                        <center>
                        </center>
                    </div>
                </div>
                <div class="modal-body">
                    <h1>Welcome</h1>
                        <form @submit.prevent="register">
                        <label for="email" class="label-customizable">Email</label>
                        <input name="email" id="email" class="form-control inputField-customizable" placeholder="Email address..."
                            autocapitalize="none" required aria-label="email" value="" type="email" v-model="email">
                        <label for="password" class="label-customizable">Password</label>
                        <input name="password" id="password" class="form-control inputField-customizable" placeholder="password..."
                                type="password" v-model="password"
                            />
                        <button class="btn btn-primary submitButton-customizable">Register</button>
                    </form>
                </div>
            </div>
        </div>
    </div>

</template>

<script>
import { Auth } from 'aws-amplify';

export default {
    name: 'Register',
    data() {
        return {
            email: '',
            password: '',
        };
    },
    methods: {
        async register() {
            try {
                await Auth.signUp({
                    username: this.email,
                    password: this.password,
                });
                alert('User successfully registered. Please login');
            } catch (error) {
                alert(error.message);
            }
        },
    },
};
</script>

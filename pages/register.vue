<template>
  <div>
    <div class="flex flex-col h-screen my-auto items-center pt-32">
      <img src="/logo.png" class="w-24">
      <h3 class="font-fira text-4xl pt-6 text-gray-700">
        Braze
      </h3>
      <form v-if="registration" class="flex flex-col" @submit.prevent="doLogin">
        <input
          id="username"
          v-model="login.username"
          maxlength="32"
          type="text"
          name="username"
          placeholder="Username"
          class="font-fira border border-purple-300 placeholder-purple-300 focus:placeholder-opacity-0 rounded-lg w-80 mt-8 px-4 py-3 text-center"
        >
        <input
          id="password"
          v-model="login.password"
          maxlength="64"
          type="password"
          name="password"
          placeholder="Password"
          class="font-fira border border-purple-300 placeholder-purple-300 focus:placeholder-opacity-0 rounded-lg w-80 mt-5 px-4 py-3 text-center"
        >
        <button type="submit" class="font-fira bg-purple-300 hover:bg-purple-600 duration-200 rounded-lg w-80 mt-5 px-4 py-4 tracking-wide">
          LOG IN
        </button>
        <div class="mt-2">
          <input id="remember" checked type="checkbox" name="remember" class="inline-block"> <label for="remember" class="inline-block text-sm pb-2"> Remember me</label>
        </div>
      </form>
      <div v-else class="py-10">
        <h3 class="text-red-800 text-2xl font-fira">
          Registration is disabled
        </h3>
        <p class="text-center pt-5">
          <a href="/" class="text-gray-800 hover:text-purple-500 font-fira duration-200 text-center underline">Take me back!</a>
        </p>
      </div>
      <div class="mt-2">
        <a href="https://github.com/thatsimplekid/Braze" class="text-sm underline">Powered by Braze</a>
        <a :href="'https://github.com/thatsimplekid/Braze/tree/' + commit" target="_blank" class="text-sm underline text-gray-400 font-bold">{{ commit.substring(0,7) }}</a>
      </div>
    </div>
  </div>
</template>

<script>
// import axios from 'axios'
import Swal from 'sweetalert2'
import config from '../config'

export default {
  layout: 'plain',
  data: () => ({
    commit: 'master',
    registration: config.enableRegistration,
    login: {
      username: '',
      password: ''
    }
  }),
  methods: {
    async doLogin () {
      const username = document.getElementById('username').value
      const password = document.getElementById('password').value
      // const remember = document.getElementById('remember').checked
      if (username.length === 0) {
        document.getElementById('username').classList.remove('border-purple-300')
        document.getElementById('username').classList.remove('placeholder-purple-300')
        document.getElementById('username').classList.add('border-red-300')
        document.getElementById('username').classList.add('placeholder-red-300')
      }
      if (password.length === 0) {
        document.getElementById('password').classList.remove('border-purple-300')
        document.getElementById('password').classList.remove('placeholder-purple-300')
        document.getElementById('password').classList.add('border-red-300')
        document.getElementById('password').classList.add('placeholder-red-300')
      }
      if (username.length === 0 || password.length === 0) { return }
      try {
        /* const response = */
        await this.$auth.loginWith('local', { data: this.login })
      } catch (e) {
        Swal.fire({ icon: 'error', title: e.toString().split(': ')[1] })
      }
    },
    test () {
      Swal.fire('Hello world!')
    }
  }
}
</script>

<style>

</style>

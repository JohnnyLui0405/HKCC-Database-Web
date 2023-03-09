<script setup>
import SignIn from './views/SignIn.vue'
import { darkTheme } from 'naive-ui'
</script>

<template>
  <n-config-provider :theme="darkTheme">
    <SignIn />
  </n-config-provider>
</template>

<style scoped>
    html,
    body {
        width: 100%;
        height: 100%;
        background-color: rgb(32, 32, 32);
    }
</style>

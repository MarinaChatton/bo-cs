<template>
  <header>
    <nav>
      <RouterLink to="/">Home</RouterLink>
    </nav>
  </header>

  <RouterView />
</template>

<script setup lang="ts">
  import { RouterLink, RouterView } from 'vue-router'
</script>

<style scoped>
  header {
    margin: 2rem 0;
    font-family: Verdana, Geneva, Tahoma, sans-serif;
    display: none;
  }

  nav a {
    display: inline-block;
    padding: .5rem 1rem;
    background-color: #2c4059;
    color: #fff;
    text-decoration: none;
    transition: background-color .3s ease;
  }

  nav a:hover,
  nav a.router-link-exact-active {
    background-color: #deb857;
  }
</style>

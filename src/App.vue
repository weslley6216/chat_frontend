<script setup>
import { ref, onMounted } from 'vue'

const data = ref(null)

onMounted(async () => {
  try {
    const response = await fetch('http://localhost:3000/teste')
    data.value = await response.json()
  } catch (error) {
    console.error('Erro ao buscar dados:', error)
  }
})
</script>

<template>
  <div>
    <h1>Dados da API</h1>
    <pre v-if="data">{{ data.message }}</pre>
    <p v-else>Carregando...</p>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  hex: Object
})
const emit = defineEmits(['close'])
</script>

<template>
  <div class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
    <div class="bg-white p-6 rounded shadow-lg w-72 relative">
      <button class="absolute top-2 right-2 text-gray-500 hover:text-black" @click="emit('close')">✕</button>
      <h2 class="text-lg font-bold mb-2">Информация о гексе</h2>
      <p><strong>Q:</strong> {{ hex.q }}</p>
      <p><strong>R:</strong> {{ hex.r }}</p>
    </div>
  </div>
</template>

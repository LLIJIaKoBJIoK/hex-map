<script setup>
import { ref, computed } from 'vue'
import HexModal from '@/Components/HexModal.vue'

const radiusOptions = [3, 4, 5]
const selectedRadius = ref(3)
const hexSize = 50
const selectedHex = ref(null)
const modalOpen = ref(false)

// Центр SVG
const viewBoxSize = 1000
const center = { x: viewBoxSize / 2, y: viewBoxSize / 2 }

// Axial to pixel conversion
const axialToPixel = (q, r) => {
  const x = hexSize * Math.sqrt(3) * (q + r / 2)
  const y = hexSize * 1.5 * r
  return { x: x + center.x, y: y + center.y }
}

// Получение углов гекса
const getHexCorners = (q, r) => {
  const center = axialToPixel(q, r)
  const corners = []
  for (let i = 0; i < 6; i++) {
    const angle = Math.PI / 180 * (60 * i - 30)
    const x = center.x + hexSize * Math.cos(angle)
    const y = center.y + hexSize * Math.sin(angle)
    corners.push({ x, y })
  }
  return corners
}

// Генерация гексов в пределах радиуса
const hexes = computed(() => {
  const results = []
  const seenEdges = new Set()

  for (let q = -selectedRadius.value; q <= selectedRadius.value; q++) {
    const r1 = Math.max(-selectedRadius.value, -q - selectedRadius.value)
    const r2 = Math.min(selectedRadius.value, -q + selectedRadius.value)
    for (let r = r1; r <= r2; r++) {
      const corners = getHexCorners(q, r)

      const edges = corners.map((corner, i) => {
        const nextCorner = corners[(i + 1) % 6]
        const key = `${corner.x},${corner.y}-${nextCorner.x},${nextCorner.y}`
        const reverseKey = `${nextCorner.x},${nextCorner.y}-${corner.x},${corner.y}`
        if (!seenEdges.has(key) && !seenEdges.has(reverseKey)) {
          seenEdges.add(key)
          return { x1: corner.x, y1: corner.y, x2: nextCorner.x, y2: nextCorner.y }
        }
        return null
      }).filter(e => e !== null)

      results.push({ q, r, corners, edges })
    }
  }
  return results
})

const openModal = (q, r) => {
  selectedHex.value = { q, r }
  modalOpen.value = true
}
</script>

<template>
  <div class="flex flex-col items-center gap-4">
    <div class="flex gap-2">
      <span class="text-sm">Радиус:</span>
      <button
        v-for="r in radiusOptions"
        :key="r"
        @click="selectedRadius = r"
        class="px-2 py-1 bg-blue-500 text-white rounded"
        :class="{ 'bg-blue-700': selectedRadius === r }"
      >
        {{ r }}
      </button>
    </div>

    <svg :viewBox="`0 0 ${viewBoxSize} ${viewBoxSize}`" class="w-full max-w-4xl h-[90vh] border rounded shadow">
      <g v-for="hex in hexes" :key="`${hex.q},${hex.r}`">
        <!-- Гексагон -->
        <polygon
          :points="hex.corners.map(p => `${p.x},${p.y}`).join(' ')"
          fill="#eee"
          stroke="#999"
          stroke-width="1"
          @click="openModal(hex.q, hex.r)"
          class="cursor-pointer hover:fill-blue-200 transition"
        />

        <!-- Отображаем уникальные рёбра -->
        <line
          v-for="(edge, i) in hex.edges"
          :key="i"
          :x1="edge.x1" :y1="edge.y1"
          :x2="edge.x2" :y2="edge.y2"
          stroke="#999"
          stroke-width="1"
        />
      </g>
    </svg>

    <HexModal v-if="modalOpen" :hex="selectedHex" @close="modalOpen = false" />
  </div>
</template>

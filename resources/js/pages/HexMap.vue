<script setup>
import { ref, computed } from 'vue'
import HexModal from '@/Components/HexModal.vue'

const radius = ref(3)
const selectedHex = ref(null)
const hoverEdgeId = ref(null)

const size = 40
const width = Math.sqrt(3) * size
const height = size * 2
const horizSpacing = width
const vertSpacing = (3 / 4) * height

function axialToPixel(q, r) {
  const x = size * Math.sqrt(3) * (q + r / 2)
  const y = size * (3 / 2) * r
  return { x, y }
}


function getHexPoints(cx, cy) {
  const points = []
  for (let i = 0; i < 6; i++) {
    const angle_deg = 60 * i - 30
    const angle_rad = Math.PI / 180 * angle_deg
    points.push({
      x: cx + size * Math.cos(angle_rad),
      y: cy + size * Math.sin(angle_rad)
    })
  }
  return points
}

function generateHexes(radius) {
  const hexes = []
  for (let r = -radius; r <= radius; r++) {
    for (let q = Math.max(-radius, -r - radius); q <= Math.min(radius, -r + radius); q++) {
      const { x, y } = axialToPixel(q, r)
      const points = getHexPoints(x, y)
      hexes.push({ q, r, x, y, points })
    }
  }
  return hexes
}


const hexes = computed(() => generateHexes(radius.value))

function onHexClick(hex) {
  selectedHex.value = hex
}

function edgeId(p1, p2) {
  const [a, b] = [p1, p2].sort((pA, pB) =>
    pA.x === pB.x ? pA.y - pB.y : pA.x - pB.x
  )
  return `${a.x},${a.y}-${b.x},${b.y}`
}

const edges = computed(() => {
  const set = new Set()
  const result = []

  for (const hex of hexes.value) {
    const pts = hex.points
    for (let i = 0; i < 6; i++) {
      const start = pts[i]
      const end = pts[(i + 1) % 6]
      const id = edgeId(start, end)
      if (!set.has(id)) {
        set.add(id)
        result.push({ id, start, end })
      }
    }
  }

  return result
})

function onEdgeMouseOver(id) {
  hoverEdgeId.value = id
}

function onEdgeMouseOut() {
  hoverEdgeId.value = null
}

// Центровка
const svgWidth = 800
const svgHeight = 600
const offsetX = svgWidth / 2
const offsetY = svgHeight / 2
</script>

<template>
  <div class="flex flex-col items-center gap-4">
    <div class="flex gap-2 mb-4">
      <button
        v-for="r in [3, 4, 5]"
        :key="r"
        class="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400"
        @click="radius = r"
      >
        Радиус {{ r }}
      </button>
    </div>

    <svg
      :width="svgWidth"
      :height="svgHeight"
      :viewBox="`0 0 ${svgWidth} ${svgHeight}`"
      class="border rounded shadow"
    >
      <!-- Edges -->
      <line
        v-for="edge in edges"
        :key="edge.id"
        :x1="edge.start.x + offsetX"
        :y1="edge.start.y + offsetY"
        :x2="edge.end.x + offsetX"
        :y2="edge.end.y + offsetY"
        :class="{ 'edge-hovered': hoverEdgeId === edge.id }"
        stroke="black"
        stroke-width="2"
        @mouseover="onEdgeMouseOver(edge.id)"
        @mouseout="onEdgeMouseOut"
        style="cursor:pointer"
      />

      <!-- Hexes -->
      <polygon
        v-for="hex in hexes"
        :key="`${hex.q},${hex.r}`"
        :points="hex.points.map(p => `${p.x + offsetX},${p.y + offsetY}`).join(' ')"
        class="fill-white stroke-gray-500 hover:fill-blue-100"
        stroke-width="1"
        @click="onHexClick(hex)"
      />
    </svg>

    <HexModal v-if="selectedHex" :hex="selectedHex" @close="selectedHex = null" />
  </div>
</template>

<style scoped>
.edge-hovered {
  stroke: blue !important;
  stroke-width: 4 !important;
}
</style>

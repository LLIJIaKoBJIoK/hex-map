<script setup>
import { ref, computed } from 'vue'
import HexModal from '@/Components/HexModal.vue'
import {
  generateHexes,
  generateEdges
} from '@/utils/hexMapGenerator.js'

const radius = ref(3)
const selectedHex = ref(null)
const hoverEdgeId = ref(null)

const size = 40

const hexes = computed(() => generateHexes(radius.value, size))
const edges = computed(() => generateEdges(hexes.value))

function onHexClick(hex) {
  selectedHex.value = hex
}

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

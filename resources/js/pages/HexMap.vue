<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import { generateHexes, size } from '@/utils/hexMapGenerator'

const radius = ref(3)
const hexes = computed(() => generateHexes(radius.value))

const windowWidth = ref(window.innerWidth)
const windowHeight = ref(window.innerHeight)

// Размеры SVG-контейнера (будем считать без области кнопок)
const buttonsHeight = 50 // примерная высота области с кнопками сверху

const svgWidth = ref(windowWidth.value)
const svgHeight = ref(windowHeight.value - buttonsHeight)

const offsetX = computed(() => svgWidth.value / 2)
const offsetY = computed(() => svgHeight.value / 2)

function updateSize() {
  windowWidth.value = window.innerWidth
  windowHeight.value = window.innerHeight
  svgWidth.value = windowWidth.value
  svgHeight.value = windowHeight.value - buttonsHeight
}

onMounted(() => {
  window.addEventListener('resize', updateSize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateSize)
})

// Рассчитаем viewBox для SVG, чтобы карта полностью умещалась с учётом размера radius

const padding = 20

const viewBox = computed(() => {
  // Максимальный q и r по radius
  // Гексы расположены в axial coords от -radius до radius

  // Примерный расчет размера карты в пикселях по оси X и Y:
  // По X: ширина ~ 2 * radius * sqrt(3) * size
  // По Y: высота ~ 2 * radius * 1.5 * size

  const mapWidth = (Math.sqrt(3) * size * (radius.value * 2 + 1)) + padding * 2
  const mapHeight = (1.5 * size * (radius.value * 2 + 1)) + padding * 2

  // viewBox должен покрывать всю карту с небольшим отступом

  // Центрируем карту: смещаем viewBox так, чтобы центр карты был в центре viewBox
  const minX = -mapWidth / 2
  const minY = -mapHeight / 2

  return `${minX} ${minY} ${mapWidth} ${mapHeight}`
})
</script>

<template>
  <div class="w-screen h-screen flex flex-col items-center bg-white select-none overflow-hidden">
    <div class="flex gap-2 py-2 px-4">
      <button
        v-for="r in [3, 4, 5]"
        :key="r"
        class="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400"
        @click="radius = r"
      >
        Радиус {{ r }}
      </button>
    </div>

    <div class="flex-grow flex justify-center items-center overflow-hidden w-full">
      <svg
        :width="svgWidth"
        :height="svgHeight"
        :viewBox="viewBox"
        class="border border-gray-300 rounded shadow"
        style="max-width: 100%; max-height: 100%;"
      >
        <polygon
          v-for="hex in hexes"
          :key="`${hex.q},${hex.r}`"
          :points="hex.points.map(p => `${p.x},${p.y}`).join(' ')"
          class="fill-white stroke-gray-500"
          stroke-width="1"
        />
      </svg>
    </div>
  </div>
</template>

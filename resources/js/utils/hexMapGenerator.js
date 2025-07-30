// utils/hexMapGenerator.js
const size = 40

function axialToPixel(q, r) {
  const x = size * Math.sqrt(3) * (q + r / 2)
  const y = size * (3 / 2) * r
  return { x, y }
}


function getHexPoints(cx, cy) {
  const points = []
  for (let i = 0; i < 6; i++) {
    const angle_deg = 60 * i - 30
    const angle_rad = (Math.PI / 180) * angle_deg
    points.push({
      x: cx + size * Math.cos(angle_rad),
      y: cy + size * Math.sin(angle_rad),
    })
  }
  return points
}

function generateHexes(radius) {
  const hexes = []
  for (let r = -radius; r <= radius; r++) {
    for (
      let q = Math.max(-radius, -r - radius);
      q <= Math.min(radius, -r + radius);
      q++
    ) {
      const { x, y } = axialToPixel(q, r)
      const points = getHexPoints(x, y)
      hexes.push({ q, r, x, y, points })
    }
  }
  return hexes
}

export { generateHexes, size }

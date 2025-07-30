export function axialToPixel(q, r, size) {
  const x = size * Math.sqrt(3) * (q + r / 2)
  const y = size * (3 / 2) * r
  return { x, y }
}

export function getHexPoints(cx, cy, size) {
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

export function generateHexes(radius, size) {
  const hexes = []
  for (let r = -radius; r <= radius; r++) {
    for (
      let q = Math.max(-radius, -r - radius);
      q <= Math.min(radius, -r + radius);
      q++
    ) {
      const { x, y } = axialToPixel(q, r, size)
      const points = getHexPoints(x, y, size)
      hexes.push({ q, r, x, y, points })
    }
  }
  return hexes
}

export function edgeId(p1, p2) {
  const [a, b] = [p1, p2].sort((pA, pB) =>
    pA.x === pB.x ? pA.y - pB.y : pA.x - pB.x
  )
  return `${a.x},${a.y}-${b.x},${b.y}`
}

export function generateEdges(hexes) {
  const set = new Set()
  const result = []

  for (const hex of hexes) {
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
}

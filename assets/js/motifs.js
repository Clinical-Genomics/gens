// Classes and functions for rendering different genetic motifs

async function drawRect ({ x, y, width, height, drawCtx, color = 'black' }) {
  // Draws a box
  drawCtx.save()
  drawCtx.fillStyle = color
  drawCtx.beginPath()
  drawCtx.rect(x, Math.round(y - height / 2), width, height)
  drawCtx.fill()
  drawCtx.restore()
}

async function drawLine ({ x, y, length, drawCtx, color = 'black', lineWidth = 2 }) {
  // Draw a line from xStart to xStop at yPos
  console.log(`Plot line from: ${x}, to: ${x + length}; width: ${lineWidth}; color: ${color}`)
  if (![x, length, y].every(n => typeof (n) === 'number')) {
    throw `Invalid coordinates start: ${x}, stop: ${x + length}, yPos: ${y}; Cant draw line`
  }
  drawCtx.save()
  drawCtx.strokeStyle = color
  drawCtx.lineWidth = lineWidth
  drawCtx.beginPath()
  drawCtx.moveTo(x, y)
  drawCtx.lineTo(x + length, y)
  drawCtx.stroke()
  drawCtx.restore()
}

async function drawArrow ({ x, y, width, height, drawCtx, direction = 1, lineWidth = 2, color = 'black' }) {
  /* Draw an arrow in desired direction
   * Forward arrow: direction = 1
   * Reverse arrow: direction = -1
   */
  const arrowWidth = direction * width
  drawCtx.save()
  drawCtx.strokeStyle = color
  drawCtx.lineWidth = lineWidth
  drawCtx.beginPath()
  drawCtx.moveTo(x - arrowWidth / 2, y - height / 2)
  drawCtx.lineTo(x + arrowWidth / 2, y)
  drawCtx.moveTo(x + arrowWidth / 2, y)
  drawCtx.lineTo(x - arrowWidth / 2, y + height / 2)
  drawCtx.stroke()
  drawCtx.restore()
}

class BaseElement {
  // Handels logic for bounding boxes and overlapping
  constructor () {
    // location of object
    this.x = null
    this.y = null
  }

  isIntersecting (x, y) {
    // const position = this.getBbox()
  }
}

class Transcript {
  constructor (transcriptInfo) {
    // Initialize rendering functions
    this.heightOrder = transcriptInfo.height_order

    // Store variables from transcript object
    this.chromosome = transcriptInfo.chrom
    this.id = transcriptInfo.transcript_id
    this.name = transcriptInfo.gene_name
    this.start = transcriptInfo.start
    this.end = transcriptInfo.end
    this.strand = transcriptInfo.strand
    this.mane = transcriptInfo.mane
    this.refseqId = transcriptInfo.refseq_id
    this.hgncId = transcriptInfo.hgnc_id
    this.features = transcriptInfo.features

    // Calcuate rendering properties
  }

  draw ({ x, y, height, scale, drawCtx }) {
    // Draw a line to mark gene's length
    // cap lines at offscreen canvas start/end
    const displayedTrStart = Math.round(
      (trStart > this.offscreenPosition.start
        ? scale * (trStart - this.offscreenPosition.start)
        : 0)
    )
    const displayedTrEnd = Math.round(
      (this.offscreenPosition.end > trEnd
        ? scale * (trEnd - this.offscreenPosition.start)
        : this.offscreenPosition.end)
    )
    drawLine({ x: x, y: y, color: this.color })
  }
}

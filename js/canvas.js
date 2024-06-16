const TOUCH_EVS = ['touchstart', 'touchmove', 'touchend']

let gElCanvas
let gCtx
let gStartPos
let gIsDragging = false
let gIsResizing = false

function renderCanvas() {
    gCtx.fillStyle = '#383b42'
    gCtx.fillRect(0, 0, gElCanvas.width, gElCanvas.height)
}

function addListeners() {
    addMouseListeners()
    addTouchListeners()
}

function addMouseListeners() {
    gElCanvas.addEventListener('mousedown', onDown)
    gElCanvas.addEventListener('mousemove', onMove)
    gElCanvas.addEventListener('mouseup', onUp)
}

function addTouchListeners() {
    gElCanvas.addEventListener('touchstart', onDown)
    gElCanvas.addEventListener('touchmove', onMove)
    gElCanvas.addEventListener('touchend', onUp)
}

function onClearCanvas() {
    clearCanvas()
    gCtx.clearRect(0, 0, gElCanvas.width, gElCanvas.height)
    renderCanvas()
}

function resizeCanvas() {
    const elContainer = document.querySelector('.canvas-container')
    gElCanvas.width = elContainer.offsetWidth
    gElCanvas.height = elContainer.offsetHeight
    renderCanvas()
}

function getEvPos(ev) {
    let pos = {
        x: ev.offsetX,
        y: ev.offsetY,
    }

    if (TOUCH_EVS.includes(ev.type)) {
        ev.preventDefault()
        ev = ev.changedTouches[0]
        pos = {
            x: ev.pageX - ev.target.offsetLeft - ev.target.clientLeft,
            y: ev.pageY - ev.target.offsetTop - ev.target.clientTop,
        }
    }
    return pos
}

function onDragStart(ev) {
    ev.dataTransfer.setData('text/plain', ev.target.innerText)
}

function onDragOver(ev) {
    ev.preventDefault()
}

function onDrop(ev) {
    ev.preventDefault()
    const data = ev.dataTransfer.getData('text/plain')
    if (data) {
        const pos = getEvPos(ev)
        addTextLineAtPos(pos.x, pos.y, data)
        renderMeme()
    }
}

function addTextLineAtPos(x, y, text) {
    const newTextLine = _createTextLine(40, x, y, text)
    gMeme.lines.push(newTextLine)
    gMeme.selectedLineIdx = gMeme.lines.length - 1
}

function drawWrappedTextWithBorder(text, x, y, size, fontColor, strokeColor, fontFamily, align, drawBorder = false) {
    const fontFam = fontFamily || 'Impact'
    gCtx.lineWidth = 2
    gCtx.strokeStyle = strokeColor || 'black'
    gCtx.fillStyle = fontColor || 'black'
    gCtx.font = `${size}px ${fontFam}`
    gCtx.textAlign = align

    const maxWidth = gElCanvas.width
    const lineHeight = size * 1.2
    const words = text.split(' ')
    let line = ''
    let currentY = y
    const lines = []

    for (let n = 0; n < words.length; n++) {
        let testLine = line + words[n] + ' '
        let testWidth = gCtx.measureText(testLine).width
        if (testWidth > maxWidth && n > 0) {
            lines.push({ text: line, x, y: currentY })
            line = words[n] + ' '
            currentY += lineHeight
        } else {
            line = testLine
        }
    }

    lines.push({ text: line, x, y: currentY })

    lines.forEach(l => {
        drawText(l.text, x, l.y)
        if (drawBorder) {
            const lineWidth = gCtx.measureText(l.text).width
            let adjustedX
            if (align === 'center') {
                adjustedX = x - lineWidth / 2
            } else if (align === 'right') {
                adjustedX = x - lineWidth
            } else {
                adjustedX = x
            }
            gCtx.save()
            gCtx.strokeStyle = 'lightgrey'
            gCtx.fillStyle = 'rgba(200, 200, 200, 0.2)'
            gCtx.lineWidth = 2
            gCtx.strokeRect(adjustedX, l.y - size, lineWidth, lineHeight)
            gCtx.fillRect(adjustedX, l.y - size, lineWidth, lineHeight)
            gCtx.restore()
        }
    })
}

function drawText(text, x, y) {
    gCtx.fillText(text, x, y)
    gCtx.strokeText(text, x, y)
}

function isLineClicked(clickedPos) {
    const meme = getMeme()
    const memeLines = meme.lines
    let clickedLineIdx = -1

    memeLines.forEach((line, idx) => {
        const { x, y, size, txt, align } = line
        const lineHeight = size * 1.2
        const words = txt.split(' ')

        let currentY = y
        let testLine = ''

        for (let n = 0; n < words.length; n++) {
            let testWidth = gCtx.measureText(testLine + words[n] + ' ').width
            if (testWidth > gElCanvas.width && n > 0) {
                currentY += lineHeight
                testLine = words[n] + ' '
            } else {
                testLine += words[n] + ' '
            }

            const textWidth = gCtx.measureText(testLine).width
            let adjustedX
            if (align === 'center') {
                adjustedX = x - textWidth / 2
            } else if (align === 'right') {
                adjustedX = x - textWidth
            } else {
                adjustedX = x
            }

            if (
                clickedPos.x >= adjustedX &&
                clickedPos.x <= adjustedX + textWidth &&
                clickedPos.y >= currentY - size &&
                clickedPos.y <= currentY
            ) {
                clickedLineIdx = idx
                break
            }
        }
    })

    if (clickedLineIdx === -1) {
        meme.selectedLineIdx = -1
        renderMeme()
        return false
    }

    setSelectedLineIdx(clickedLineIdx)
    const selectedLine = memeLines[clickedLineIdx]
    document.querySelector('input[type=text]').value = selectedLine.txt
    updateFields(
        selectedLine.txt,
        selectedLine.size,
        selectedLine.font,
        selectedLine.fontColor,
        selectedLine.strokeColor
    )
    handleTextClick(selectedLine)

    renderMeme()
    return true
}

function onDown(ev) {
    const pos = getEvPos(ev)
    if (isResizerClicked(pos)) {
        gStartPos = pos
        gIsResizing = true
        document.body.style.cursor = 'nwse-resize'
    } else if (isLineClicked(pos)) {
        gStartPos = pos
        gIsDragging = true
        document.body.style.cursor = 'grabbing'
    }
}

function onMove(ev) {
    const pos = getEvPos(ev)
    if (gIsDragging) {
        const dx = pos.x - gStartPos.x
        const dy = pos.y - gStartPos.y
        moveLine(dx, dy)
        gStartPos = pos
        renderMeme()
    } else if (gIsResizing) {
        const dx = pos.x - gStartPos.x
        const dy = pos.y - gStartPos.y
        resizeLine(dx, dy)
        gStartPos = pos
        renderMeme()
    } else {
        isResizerClicked(pos)
    }
}

function onUp() {
    gIsDragging = false
    gIsResizing = false
    document.body.style.cursor = 'default'
}

function moveLine(dx, dy) {
    const line = getSelectedLine()
    if (!line) return
    line.x += dx
    line.y += dy
}

function resizeLine(dy) {
    const line = getSelectedLine()
    if (!line) return
    line.size += dy / 5
    if (line.size < 10) line.size = 10
}

function getSelectedLine() {
    const selectedLineIdx = gMeme.selectedLineIdx
    return gMeme.lines[selectedLineIdx]
}

function isResizerClicked(clickedPos) {
    const line = getSelectedLine()
    if (!line) return false

    const { x, y, size, txt, align } = line
    const textWidth = gCtx.measureText(txt).width

    let adjustedX
    if (align === 'center') {
        adjustedX = x - textWidth / 2
    } else if (align === 'right') {
        adjustedX = x - textWidth
    } else {
        adjustedX = x
    }

    const resizeRadius = 5

    gCtx.save()
    gCtx.fillStyle = 'rgba(0, 0, 100, 0.2)'
    gCtx.strokeStyle = 'rgba(255, 255, 255, 1)'
    gCtx.lineWidth = 1
    gCtx.beginPath()
    gCtx.arc(adjustedX + textWidth + resizeRadius, y - size / 2, resizeRadius, 0, 2 * Math.PI)
    gCtx.fill()
    gCtx.stroke()
    gCtx.restore()

    const dx = clickedPos.x - (adjustedX + textWidth + resizeRadius)
    const dy = clickedPos.y - (y - size / 2)
    if (Math.sqrt(dx * dx + dy * dy) <= resizeRadius) {
        if (!gIsResizing) {
            document.body.style.cursor = 'nwse-resize'
        }
        return true
    }

    if (!gIsResizing) {
        document.body.style.cursor = 'default'
    }

    return false
}

function setSelectedLineIdx(idx) {
    gMeme.selectedLineIdx = idx
}

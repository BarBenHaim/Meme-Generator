let gElCanvas
let gCtx
let gStartPos
const TOUCH_EVS = ['touchstart', 'touchmove', 'touchend']

function renderCanvas() {
    gCtx.fillStyle = 'grey'
    gCtx.fillRect(0, 0, gElCanvas.width, gElCanvas.height)
}

function addListeners() {
    addMouseListeners()
    addTouchListeners()
    window.addEventListener('resize', () => {
        resizeCanvas()
        renderCanvas()
    })
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

function drawText(text, x, y, size, fontColor, fontFamily) {
    const fontFam = fontFamily || 'Ariel'
    gCtx.lineWidth = 2
    gCtx.strokeStyle = fontColor || 'black'
    gCtx.font = `${size}px ${fontFam}`

    gCtx.textAlign = 'center'
    gCtx.fillText(text, x, y)
    gCtx.strokeText(text, x, y)
}

function drawTextBorder(text, x, y, size) {
    const metrics = gCtx.measureText(text)
    const textWidth = metrics.width
    const textHeight = size

    gCtx.save()
    gCtx.strokeStyle = 'blue'
    gCtx.lineWidth = 2
    gCtx.strokeRect(x - textWidth / 2 - 5, y - textHeight, textWidth + 10, textHeight + 5)
    gCtx.restore()
}

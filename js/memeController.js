'use strict'

function onInit() {
    gElCanvas = document.querySelector('canvas')
    gCtx = gElCanvas.getContext('2d')
    // addListeners()
    resizeCanvas()
    renderCanvas()
    renderMeme()
    onRenderGallery(ev)
}

function onRenderMemeEditor(ev) {
    ev.preventDefault()
    document.querySelector('.imgs-gallery').style.display = 'none'
    document.querySelector('.meme-editor-container').style.display = 'block'
}

function renderMeme() {
    const meme = getMeme()
    const imgs = getMemeImgs()
    const memeLines = meme.lines
    const selectedLineIdx = meme.selectedLineIdx
    const imgUrl = imgs[meme.selectedImgId - 1].url
    renderImg(imgUrl, () => {
        memeLines.forEach((line, idx) => {
            const x = gElCanvas.width / 2
            const y = line.y
            drawText(line.txt, x, y, line.size, line.color, line.font, idx === selectedLineIdx)
            if (idx === selectedLineIdx) {
                drawTextBorder(line.txt, x, y, line.size)
            }
        })
    })
}

function renderImg(url, callback) {
    let img = new Image()
    img.src = url
    img.onload = () => {
        gCtx.drawImage(img, 0, 0, gElCanvas.width, gElCanvas.height)
        if (callback) callback()
    }
}

function onSetLineTxt(txt) {
    setLineTxt(txt)
    renderMeme()
}

function onDownloadImg(elLink) {
    const imgContent = gElCanvas.toDataURL('meme/jpg')
    elLink.href = imgContent
}

function onSetFontColor(color) {
    setFontColor(color)
    renderMeme()
}

function onFontChange(font) {
    setFontFamily(font)
    renderMeme()
}

function onSizeChange(diff) {
    setSize(diff)
    renderMeme()
}

function onAddTextLine() {
    addTextLine()
    renderMeme()
}

function onSwitchTextLine() {
    switchTextLine()
    renderMeme()
}

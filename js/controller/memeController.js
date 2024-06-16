'use strict'

let gFilter = ''
let gUploadedImg = null

function onInit() {
    gElCanvas = document.querySelector('canvas')
    gCtx = gElCanvas.getContext('2d')
    addListeners()
    resizeCanvas()
    renderMeme()
    onRenderGallery()

    gElCanvas.addEventListener('dragover', onDragOver)
    gElCanvas.addEventListener('drop', onDrop)
}

function onRenderMemeEditor(ev) {
    if (ev) ev.preventDefault()
    document.querySelector('.img-gallery-container').style.display = 'none'
    document.querySelector('.saved-memes').style.display = 'none'
    document.querySelector('.meme-editor-container').style.display = 'grid'
    renderMeme()
}

function renderMeme() {
    const meme = getMeme()
    const imgs = getMemeImgs()
    const memeLines = meme.lines

    const selectedLineIdx = meme.selectedLineIdx

    let imgUrl = null
    let img = null

    if (meme.selectedImgId === -1 && gUploadedImg) {
        img = gUploadedImg
    } else {
        img = imgs.find(img => img.id === meme.selectedImgId)
        if (!img) {
            console.error('Selected image is undefined')
            return
        }
        imgUrl = img.url
    }

    if (imgUrl) {
        renderImg(imgUrl, () => {
            renderMemeLines(memeLines, selectedLineIdx)
        })
    } else if (img) {
        renderImg(img, () => {
            renderMemeLines(memeLines, selectedLineIdx)
        })
    }
}

function renderImg(source, callback) {
    let img = new Image()
    img.src = typeof source === 'string' ? source : source.src

    img.onload = () => {
        gCtx.clearRect(0, 0, gElCanvas.width, gElCanvas.height)

        const canvasWidth = gElCanvas.width
        const canvasHeight = gElCanvas.height
        const imageWidth = img.width
        const imageHeight = img.height

        const canvasAspectRatio = canvasWidth / canvasHeight
        const imageAspectRatio = imageWidth / imageHeight

        let drawWidth, drawHeight, offsetX, offsetY

        if (imageAspectRatio > canvasAspectRatio) {
            drawHeight = canvasHeight
            drawWidth = canvasHeight * imageAspectRatio
            offsetX = (canvasWidth - drawWidth) / 2
            offsetY = 0
        } else {
            drawWidth = canvasWidth
            drawHeight = canvasWidth / imageAspectRatio
            offsetX = 0
            offsetY = (canvasHeight - drawHeight) / 2
        }

        gCtx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight)

        if (callback) callback()
    }
}

function renderMemeLines(memeLines, selectedLineIdx) {
    memeLines.forEach((line, idx) => {
        const x = line.x
        const y = line.y
        drawWrappedTextWithBorder(
            line.txt,
            x,
            y,
            line.size,
            line.fontColor,
            line.strokeColor,
            line.font,
            line.align,
            idx === selectedLineIdx
        )
    })
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

function onSetStrokeColor(color) {
    setStrokeColor(color)
    renderMeme()
}

function onFontFamilyChange(font) {
    setFontFamily(font)
    renderMeme()
}

function onFontSizeChange(size) {
    setFontSize(size)
    renderMeme()
}

function onFontSizeUpdate(diff) {
    updateFontSize(diff)
    renderMeme()
}

function onAddTextLine() {
    addTextLine()
    renderMeme()
}

function onAddEmoji(emoji) {
    addEmoji(emoji)
    renderMeme()
}

function onSwitchTextLine() {
    switchTextLine()
    renderMeme()
}

function onSetTextAlign(align) {
    setTextAlign(align)
    renderMeme()
}

function onSetY(diff) {
    setY(diff)
    renderMeme()
}

function onDeleteLine() {
    deleteLine()
    renderMeme()
}

function onFlexible() {
    setFlexibleMeme()
    onRenderMemeEditor()
}

function onSaveMeme() {
    const meme = getMeme()
    const savedMemes = getSavedMemes()

    const dataUrl = gElCanvas.toDataURL()
    const newMeme = {
        ...meme,
        imgDataUrl: dataUrl,
        id: meme.id || makeId(),
    }

    const index = savedMemes.findIndex(m => m.id === newMeme.id)
    if (index === -1) {
        savedMemes.push(newMeme)
    } else {
        savedMemes[index] = newMeme
    }

    saveToStorage('memes', savedMemes)
    showMsgModal('Meme saved successfuly!')
}

function onCanvasClick(ev) {
    const pos = getEvPos(ev)
    isLineClicked(pos)
}

function onSetFilter(txt) {
    gFilter = txt
    onRenderGallery()
    const filteredImgs = getMemeImgs()
    const count = filteredImgs.length
    document.querySelector('.total-results span').innerText = count
}

function onClearFilter() {
    document.querySelector('input[list="keywords"]').value = ''
    onSetFilter('')
}

function updateFields(txt, fontSize, fontFamily, fontColor, strokeColor) {
    document.querySelector('input[type=text]').value = txt
    document.querySelector('input[type=number]').value = fontSize
    document.querySelector('input[type=color]').value = fontColor
    document.querySelector('.border-color-input').value = strokeColor
    document.querySelector('select').value = fontFamily
}

function onRenderSavedMemes(ev) {
    if (ev) ev.preventDefault()
    const savedMemes = getSavedMemes()
    const savedMemesContainer = document.querySelector('.saved-memes')
    document.querySelector('.img-gallery-container').style.display = 'none'
    document.querySelector('.meme-editor-container').style.display = 'none'
    savedMemesContainer.style.display = 'grid'

    if (!savedMemes || !savedMemes.length) {
        savedMemesContainer.innerHTML = '<h2 class="no-saved-memes-txt" >No saved memes yet</h2>'
        return
    }
    savedMemesContainer.innerHTML = ''
    savedMemes.forEach((meme, index) => {
        const memeElement = generateMemeHTML(meme, index)
        savedMemesContainer.appendChild(memeElement)
    })
    applyTranslations()
}

function generateMemeHTML(meme, index) {
    const memeContainer = document.createElement('div')
    memeContainer.classList.add('saved-meme')
    const img = document.createElement('img')
    img.src = meme.imgDataUrl
    img.width = 400
    img.height = 400
    memeContainer.appendChild(img)
    const editButton = document.createElement('button')
    editButton.textContent = 'Edit'
    editButton.onclick = () => onEditMeme(index)
    const deleteButton = document.createElement('button')
    deleteButton.textContent = 'Delete'
    deleteButton.onclick = () => onDeleteMeme(index)
    memeContainer.appendChild(editButton)
    memeContainer.appendChild(deleteButton)
    return memeContainer
}

function renderMemeOnCanvas(meme, canvas) {
    const ctx = canvas.getContext('2d')
    const img = new Image()
    img.src = meme.imgDataUrl
    img.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
        meme.lines.forEach(line => {
            drawTextOnCanvas(ctx, line)
        })
    }
}

function drawTextOnCanvas(ctx, line) {
    ctx.lineWidth = 2
    ctx.strokeStyle = line.strokeColor || '#000000'
    ctx.fillStyle = line.fontColor || '#ffffff'
    ctx.font = `${line.size}px ${line.font}`
    ctx.textAlign = line.align
    const x = line.x
    const y = line.y
    ctx.fillText(line.txt, x, y)
    ctx.strokeText(line.txt, x, y)
}

function handleTextClick(line) {
    const currTextLine = document.querySelector("input[type='text']")
    currTextLine.value = line.txt === 'Enter text' ? '' : line.txt
    currTextLine.focus()
}

function onDeleteMeme(memeIndex) {
    const isConfirm = confirm('Are you sure?')
    if (!isConfirm) return
    deleteMeme(memeIndex)
    onRenderSavedMemes()
    showMsgModal('Meme deleted successfuly!')
}

function onEditMeme(memeIndex) {
    const savedMemes = getSavedMemes()
    const meme = savedMemes[memeIndex]
    gMeme = { ...meme }
    gUploadedImg = new Image()
    gUploadedImg.src = meme.imgDataUrl
    gUploadedImg.onload = () => {
        onRenderMemeEditor()
    }
}

function showMsgModal(msg) {
    const modal = document.querySelector('.msg-modal')
    modal.innerText = msg
    modal.classList.add('show')

    setTimeout(() => {
        modal.classList.remove('show')
    }, 3000)
}

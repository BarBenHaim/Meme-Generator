'use strict'

const gImgs = [
    { id: 1, url: 'img-hard/1.jpg', keywords: ['funny', 'cat', 'smile'] },
    { id: 2, url: 'img-hard/2.jpg', keywords: ['funny', 'cat', 'smile'] },
    { id: 3, url: 'img-hard/3.jpg', keywords: ['funny', 'cat', 'smile'] },
    { id: 4, url: 'img-hard/4.jpg', keywords: ['weird', 'cat', 'baby'] },
    { id: 5, url: 'img-hard/5.jpg', keywords: ['funny', 'cat', 'animal'] },
    { id: 6, url: 'img-hard/6.jpg', keywords: ['weird', 'cat', 'animal'] },
    { id: 7, url: 'img-hard/7.jpg', keywords: ['funny', 'baby', 'weird'] },
    { id: 8, url: 'img-hard/8.jpg', keywords: ['funny', 'cat', 'animal'] },
    { id: 9, url: 'img-hard/9.jpg', keywords: ['funny', 'cat', 'smile'] },
    { id: 10, url: 'img-hard/10.jpg', keywords: ['funny', 'weird'] },
    { id: 11, url: 'img-hard/11.jpg', keywords: ['funny', 'cat', 'animal'] },
    { id: 12, url: 'img-hard/12.jpg', keywords: ['funny', 'cat', 'animal'] },
    { id: 13, url: 'img-hard/13.jpg', keywords: ['funny', 'weird', 'cat'] },
    { id: 14, url: 'img-hard/14.jpg', keywords: ['funny', 'cat', 'animal'] },
    { id: 15, url: 'img-hard/15.jpg', keywords: ['funny', 'cat', 'weird'] },
    { id: 16, url: 'img-hard/16.jpg', keywords: ['funny', 'cat', 'animal'] },
    { id: 17, url: 'img-hard/17.jpg', keywords: ['baby', 'cat', 'funny'] },
    { id: 18, url: 'img-hard/18.jpg', keywords: ['baby', 'animal', 'smile'] },
    { id: 19, url: 'img-hard/19.jpg', keywords: ['animal', 'cat', 'smile'] },
    { id: 20, url: 'img-hard/20.jpg', keywords: ['baby', 'cat', 'animal'] },
    { id: 21, url: 'img-hard/21.jpg', keywords: ['baby', 'cat'] },
    { id: 22, url: 'img-hard/22.jpg', keywords: ['baby', 'cat'] },
    { id: 23, url: 'img-hard/23.jpg', keywords: ['baby', 'cat'] },
    { id: 24, url: 'img-hard/24.jpg', keywords: ['baby', 'cat'] },
    { id: 25, url: 'img-hard/25.jpg', keywords: ['baby', 'cat'] },
]

const gSavedMemes = loadFromStorage('memes') || []

let gMeme = createNewMeme()
let gIsEditing = false

const gKeywordSearchCountMap = { funny: 20, cat: 10, baby: 15, smile: 30, animal: 5 }

function createNewMeme(selectedImgId = 1) {
    return {
        selectedImgURL: null,
        selectedImgId: selectedImgId,
        selectedLineIdx: 0,
        lines: [_createTextLine(40, 200, 50), _createTextLine(40, 200, 375)],
    }
}

function getMemeImgs() {
    return filterMemes(gImgs, gFilter)
}

function getMeme() {
    return gMeme
}

function getSavedMemes() {
    return gSavedMemes
}

function getKeywordsSearchMap() {
    return gKeywordSearchCountMap
}

function updateKeywordSearchCountMap(keyword) {
    if (gKeywordSearchCountMap[keyword]) {
        gKeywordSearchCountMap[keyword]++
    } else {
        gKeywordSearchCountMap[keyword] = 1
    }
}

function setLineTxt(txt) {
    gMeme.lines[gMeme.selectedLineIdx].txt = txt
}

function setKeywords() {}

function setImg(imgId) {
    if (!gIsEditing) {
        gMeme = createNewMeme(imgId)
    } else {
        gMeme.selectedImgId = imgId
    }
}

function setFontColor(color) {
    gMeme.lines[gMeme.selectedLineIdx].fontColor = color
}

function setStrokeColor(color) {
    gMeme.lines[gMeme.selectedLineIdx].strokeColor = color
}

function setFontFamily(font) {
    gMeme.lines[gMeme.selectedLineIdx].font = font
}

function updateFontSize(diff) {
    gMeme.lines[gMeme.selectedLineIdx].size += diff
}

function setFontSize(size) {
    gMeme.lines[gMeme.selectedLineIdx].size = size
}

function addTextLine() {
    const newText = _createTextLine()
    gMeme.lines.push(newText)
    gMeme.selectedLineIdx = gMeme.lines.length - 1
}

function addEmoji(emoji) {
    const newEmoji = _createTextLine(emoji)
    gMeme.lines.push(newEmoji)
    gMeme.selectedLineIdx = gMeme.lines.length - 1
}

function setTextAlign(align) {
    gMeme.lines[gMeme.selectedLineIdx].align = align
}

function setFlexibleMeme() {
    gMeme = {
        selectedImgId: getRandomInt(1, gImgs.length),
        selectedLineIdx: 0,
        lines: [_createTextLine(40, 200, 50, getRandomMemeText(), '#ffffff', '#000000', 'Impact', 'center')],
    }
}

function setY(diff) {
    gMeme.lines[gMeme.selectedLineIdx].y += diff
}

function filterMemes(memes, txtFilter) {
    const regExp = new RegExp(txtFilter, 'i')
    const filteredMemes = memes.filter(meme => meme.keywords.some(keyword => regExp.test(keyword)))
    if (filteredMemes.length === 0) {
        return memes
    }
    return filteredMemes
}

function deleteLine() {
    if (gMeme.selectedLineIdx >= 0 && gMeme.selectedLineIdx < gMeme.lines.length) {
        gMeme.lines.splice(gMeme.selectedLineIdx, 1)
        gMeme.selectedLineIdx = gMeme.lines.length ? 0 : -1
    }
}

function switchTextLine() {
    if (gMeme.selectedLineIdx === gMeme.lines.length - 1) gMeme.selectedLineIdx = 0
    else gMeme.selectedLineIdx++
}

function editMeme(memeIndex) {
    gMeme = JSON.parse(JSON.stringify(gSavedMemes[memeIndex]))
    gIsEditing = true
}

function deleteMeme(memeIndex) {
    gSavedMemes.splice(memeIndex, 1)
    saveToStorage('memes', gSavedMemes)
}

function _createTextLine(size = 20, x = gElCanvas.width / 2, y = gElCanvas.height / 2, txt = 'Enter text') {
    return {
        txt,
        size,
        x,
        y,
        align: 'center',
        font: 'Impact',
        fontColor: '#ffffff',
        strokeColor: '#000000',
        rotation: 0,
    }
}

function saveMeme() {
    const canvas = document.createElement('canvas')
    canvas.width = 400
    canvas.height = 400
    renderMemeOnCanvas(gMeme, canvas)
    const imgDataUrl = canvas.toDataURL()
    gMeme.imgDataUrl = imgDataUrl

    if (gIsEditing) {
        const index = gSavedMemes.findIndex(meme => meme.id === gMeme.id)
        gSavedMemes[index] = JSON.parse(JSON.stringify(gMeme))
        gIsEditing = false
    } else {
        gSavedMemes.push(JSON.parse(JSON.stringify(gMeme)))
    }
    saveToStorage('memes', gSavedMemes)
}

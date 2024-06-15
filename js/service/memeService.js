'use strict'

const gImgs = [
    { id: 1, url: 'img/1.jpg', keywords: ['funny', 'cat'] },
    { id: 2, url: 'img/2.jpg', keywords: ['funny', 'cat'] },
    { id: 3, url: 'img/3.jpg', keywords: ['funny', 'cat'] },
    { id: 4, url: 'img/4.jpg', keywords: ['weird', 'cat'] },
    { id: 5, url: 'img/5.jpg', keywords: ['funny', 'cat'] },
    { id: 6, url: 'img/6.jpg', keywords: ['weird', 'cat'] },
    { id: 7, url: 'img/7.jpg', keywords: ['funny', 'baby'] },
    { id: 8, url: 'img/8.jpg', keywords: ['funny', 'cat'] },
    { id: 9, url: 'img/9.jpg', keywords: ['funny', 'cat'] },
    { id: 10, url: 'img/10.jpg', keywords: ['funny', 'weird'] },
    { id: 11, url: 'img/11.jpg', keywords: ['funny', 'cat'] },
    { id: 12, url: 'img/12.jpg', keywords: ['funny', 'cat'] },
    { id: 13, url: 'img/13.jpg', keywords: ['funny', 'weird'] },
    { id: 14, url: 'img/14.jpg', keywords: ['funny', 'cat'] },
    { id: 15, url: 'img/15.jpg', keywords: ['funny', 'cat'] },
    { id: 16, url: 'img/16.jpg', keywords: ['funny', 'cat'] },
    { id: 17, url: 'img/17.jpg', keywords: ['baby', 'cat'] },
    { id: 18, url: 'img/18.jpg', keywords: ['baby', 'cat'] },
]

const gSavedMemes = loadFromStorage('memes') || []

let gMeme = createNewMeme()
let gIsEditing = false

const gKeywordSearchCountMap = { funny: 20, cat: 10, baby: 15 }

function createNewMeme(selectedImgId = 1) {
    return {
        selectedImgURL: null,
        selectedImgId: selectedImgId,
        selectedLineIdx: 0,
        lines: [_createTextLine(40, 200, 50), _createTextLine(40, 200, 400)],
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
    if (gIsEditing) {
        const index = gSavedMemes.findIndex(meme => meme.id === gMeme.id)
        gSavedMemes[index] = JSON.parse(JSON.stringify(gMeme))
        gIsEditing = false
    } else {
        gSavedMemes.push(JSON.parse(JSON.stringify(gMeme)))
    }
    saveToStorage('memes', gSavedMemes)
}

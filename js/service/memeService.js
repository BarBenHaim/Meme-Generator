'use strict'

var gImgs = [
    { id: 1, url: 'img/1.jpg', keywords: ['funny', 'cat'] },
    { id: 2, url: 'img/2.jpg', keywords: ['funny', 'cat'] },
    { id: 3, url: 'img/3.jpg', keywords: ['funny', 'cat'] },
    // { id: 4, url: 'img/4.jpg', keywords: ['funny', 'cat'] },
    // { id: 5, url: 'img/5.jpg', keywords: ['funny', 'cat'] },
    // { id: 6, url: 'img/6.jpg', keywords: ['funny', 'cat'] },
    // { id: 7, url: 'img/7.jpg', keywords: ['funny', 'cat'] },
    // { id: 8, url: 'img/8.jpg', keywords: ['funny', 'cat'] },
    // { id: 9, url: 'img/9.jpg', keywords: ['funny', 'cat'] },
    // { id: 10, url: 'img/10.jpg', keywords: ['funny', 'cat'] },
    // { id: 11, url: 'img/11.jpg', keywords: ['funny', 'cat'] },
    // { id: 12, url: 'img/12.jpg', keywords: ['funny', 'cat'] },
    // { id: 13, url: 'img/13.jpg', keywords: ['funny', 'cat'] },
    // { id: 14, url: 'img/14.jpg', keywords: ['funny', 'cat'] },
    // { id: 15, url: 'img/15.jpg', keywords: ['funny', 'cat'] },
    // { id: 16, url: 'img/16.jpg', keywords: ['funny', 'cat'] },
    // { id: 17, url: 'img/17.jpg', keywords: ['funny', 'cat'] },
    // { id: 18, url: 'img/18.jpg', keywords: ['funny', 'cat'] },
]

var gMeme = {
    selectedImgId: 1,
    selectedLineIdx: 0,
    lines: [
        { txt: 'I sometimes eat  Falafel', size: 20, color: 'red', font: 'Ariel', x: 150, y: 50 },
        { txt: 'I sometimes eat  Falafel', size: 50, color: 'green', font: 'Ariel', x: 10, y: 100 },
    ],
}

var gKeywordSearchCountMap = { funny: 0, cat: 0, baby: 0 }

function getMemeImgs() {
    return gImgs
}

function getMeme() {
    return gMeme
}

function setLineTxt(txt) {
    gMeme.lines[gMeme.selectedLineIdx].txt = txt
}

function setImg(imgId) {
    gMeme.selectedImgId = imgId
}

function setFontColor(color) {
    gMeme.lines[gMeme.selectedLineIdx].color = color
}

function setFontFamily(font) {
    gMeme.lines[gMeme.selectedLineIdx].font = font
}

function setSize(diff) {
    gMeme.lines[gMeme.selectedLineIdx].size += diff
}

function addTextLine() {
    const newText = _createTextLine()
    gMeme.lines.push(newText)
}

function switchTextLine() {
    if (gMeme.selectedLineIdx === gMeme.lines.length - 1) gMeme.selectedLineIdx = 0
    else gMeme.selectedLineIdx++
}

function _createTextLine(txt, size, color, font, x, y) {
    return {
        txt: txt || 'Enter text',
        size: size || 20,
        color: color || 'black',
        font: font || 'Ariel',
        x: x || gElCanvas.width / 2,
        y: y || gElCanvas.height / 2,
    }
}

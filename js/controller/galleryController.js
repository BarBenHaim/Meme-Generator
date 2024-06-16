'use strict'

function onRenderGallery(ev) {
    if (ev) ev.preventDefault()
    const memeImgs = getMemeImgs()
    renderImages(memeImgs)
    onRenderkeyWordsSearch()
}

function renderImages(images) {
    const strHTMLS = images.map(img => `<img src="${img.url}" onclick="onImgSelect(${img.id})"/>`).join('')
    document.querySelector('.meme-editor-container').style.display = 'none'
    document.querySelector('.saved-memes').style.display = 'none'
    document.querySelector('.imgs-gallery').innerHTML = strHTMLS
    document.querySelector('.img-gallery-container').style.display = 'block'
}

function onRenderkeyWordsSearch() {
    let strHTMLS = ''
    const keywords = Object.keys(gKeywordSearchCountMap)
    keywords.forEach(key => {
        const clickCount = gKeywordSearchCountMap[key] || 0
        const fontSize = 10 + clickCount
        strHTMLS += `<span class='keyword' style="font-size:${fontSize}px;" title="${clickCount} clicks" onclick="onKeywordClick('${key}')">${
            key.charAt(0).toUpperCase() + key.slice(1)
        }</span> `
    })
    document.querySelector('.keywords-search').innerHTML = strHTMLS
}

function onKeywordClick(keyword) {
    updateKeywordSearchCountMap(keyword)
    document.querySelector('.search-bar').value = keyword
    onSetFilter(keyword)
    onRenderkeyWordsSearch()
}

function onImgSelect(id) {
    setImg(id)
    gIsEditing = false
    onRenderMemeEditor()
}

function onRenderGallery() {
    var memeImgs = getMemeImgs()
    const strHTMLS = memeImgs.map(img => `<img src="${img.url}" onclick="onImgSelect(${img.id})"/>`).join('')

    document.querySelector('.meme-editor-container').style.display = 'none'
    document.querySelector('.imgs-gallery').innerHTML = strHTMLS
}

function onImgSelect(id) {
    setImg(id)
    renderMeme()
}

function canvasToBlob(canvas) {
    return new Promise((resolve, reject) => {
        canvas.toBlob(blob => {
            if (blob) {
                resolve(blob)
            } else {
                reject(new Error('Canvas to Blob conversion failed'))
            }
        }, 'image/png')
    })
}

async function shareMeme() {
    const canvas = document.querySelector('canvas')
    if (!canvas) {
        console.error('Canvas element not found')
        return
    }

    try {
        const blob = await canvasToBlob(canvas)
        const file = new File([blob], 'meme.png', { type: 'image/png' })
        const filesArray = [file]

        if (navigator.canShare && navigator.canShare({ files: filesArray })) {
            await navigator.share({
                files: filesArray,
                title: 'Check out my meme!',
                text: 'I created this meme using my awesome meme generator!',
            })
            console.log('Meme shared successfully')
        } else {
            console.error("Your system doesn't support sharing files.")
        }
    } catch (error) {
        console.error('Error sharing meme:', error)
    }
}

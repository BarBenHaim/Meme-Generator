'use strict'

function getRandomIntInclusive(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
}

function getRandomInt(min, max) {
    const minCeiled = Math.ceil(min)
    const maxFloored = Math.floor(max)
    return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled)
}

function makeId(length = 6) {
    var txt = ''
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

    for (var i = 0; i < length; i++) {
        txt += possible.charAt(Math.floor(Math.random() * possible.length))
    }

    return txt
}

function getTime() {
    return new Date().toString().split(' ')[4]
}

function getRandomColor() {
    var letters = '0123456789ABCDEF'
    var color = '#'
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)]
    }
    return color
}

function getRandomMemeText() {
    const memeTexts = [
        'I sometimes eat Falafel',
        'When life gives you lemons, make lemonade',
        'I can haz cheezburger?',
        'That moment when you realize...',
        'Brace yourselves, memes are coming',
        'One does not simply walk into Mordor',
        'Keep calm and carry on',
        "I'm not a cat!",
        'This is fine',
        'Y u no meme?',
        'Doge: Much wow, such amaze',
        'In Soviet Russia, meme creates you',
    ]

    const randomIndex = getRandomInt(0, memeTexts.length)
    return memeTexts[randomIndex]
}

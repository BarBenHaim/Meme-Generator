'use strict'

let currentLang = 'en'

const translations = {
    en: {
        title: 'Meme Generator',
        'nav-gallery': 'Gallery',
        'nav-meme-editor': 'Meme editor',
        'nav-saved-memes': 'Saved memes',
        'filter-placeholder': 'Search',
        'clear-filter': 'Clear Filter',
        'btn-flexible': "I'm flexible",
        'add-text': 'Add text',
        'add-drag-text': 'Add text',

        'switch-line': 'Switch line',
        'delete-line': 'Delete line',
        'font-color': 'Font color',
        'border-color': 'Border color',
        'increase-font': 'Increase font size',
        'decrease-font': 'Decrease font size',
        'align-left': 'Text align-left',
        'align-center': 'Text align-center',
        'align-right': 'Text align-right',
        'font-family': 'Font family',
        'font-size': 'Font size',
        'move-up': 'Move text up',
        'move-down': 'Move text down',
        'clear-canvas': 'Clear',
        upload: 'Upload',
        'share-meme': 'Send',
        save: 'Save',
        share: 'Share',
        download: 'Download',
        'saved-memes': 'Saved memes',
    },
    he: {
        title: 'יוצר הממים',
        'nav-gallery': 'גלריה',
        'nav-meme-editor': 'עורך ממים',
        'nav-saved-memes': 'הממים שלי',
        'filter-placeholder': 'חיפוש לפי מילות מפתח...',
        'clear-filter': 'נקה',
        'btn-flexible': 'אני גמיש',
        'total-results': ':סה"כ תוצאות',
        'add-text': 'הקלד...',
        'add-drag-text': 'הוסף טקסט',
        'add-drag-text': 'הוסף טקסט',
        'font-family': 'סוג גופן',
        'font-size': 'גודל גופן',
        'move-up': 'הזז מעלה',
        'move-down': 'הזז מטה',
        'clear-canvas': 'נקה',
        upload: 'העלה תמונה',
        'share-meme': 'שתף מם',
        share: 'שתף',
        download: 'הורד',
        'saved-memes': 'ממים שמורים',
    },
}

function setLang(lang) {
    currentLang = lang
    document.documentElement.lang = lang
    document.documentElement.dir = lang === 'he' ? 'rtl' : 'ltr'
    applyTranslations()
}

function applyTranslations() {
    const elements = document.querySelectorAll('[data-trans]')
    elements.forEach(el => {
        const key = el.dataset.trans
        const translation = translations[currentLang][key]
        if (el.placeholder !== undefined) el.placeholder = translation
        else el.innerText = translation
    })
}

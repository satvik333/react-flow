/*
 * Passive Text translator
 */

import React, { useCallback, useMemo } from "react"
import { useSelector } from "react-redux"

// import Dictionary from "app/store/constants/lang-constants/"

function translateWord(word, lang) {
    try {
        const selectedLang = lang.type

        // const languageDb = Dictionary(selectedLang)
        const languageDb = 'es'

        // remove trailing and ending spaces, lowercased.
        const cleanedWord = word.toLowerCase().trim()

        if (languageDb?.words && window.has(languageDb.words, cleanedWord)) {
            const translatedWord = languageDb.words[cleanedWord]
            if (translatedWord !== "") {
                return translatedWord
            }
        }

        return word
    } catch (err) {
        return word
    }
}

/**
 *  Translate hook
 *
 * @export
 * @returns {[TranslateFunc]}
 */
export function useTranslate() {
    const lang = useSelector(({ appConfig }) => appConfig?.lang)

    const translateFunc = useCallback(
        word => {
            if (typeof word === "string") {
                return translateWord(word, lang)
            }
        },
        [lang]
    )
    return [translateFunc]
}

/**
 * Translates the string to current language
 *
 * @export
 * @param {string} word
 * @param {string} currentLang
 * @returns {string}
 */
export function translate(word, currentLang) {
    if (typeof word === "string") {
        return translateWord(word, currentLang)
    }
    return word
}

/**
 * Translates the wrapped word to the selected language.
 *
 * @param {{ children: String}} { children }
 * @return
 */
function Translate({ children }) {
    const lang = useSelector(({ appConfig }) => appConfig?.lang)

    const newChildren = useMemo(() => {
        try {
            if (typeof children === "string") {
                return translateWord(children, lang)
            }
            if (typeof children === "object" && Array.isArray(children) && children.every(child => typeof child === "string")) {
                return translateWord(children.join(""), lang)
            }
            return children
        } catch (err) {
            console.log(err)
            return children
        }
    }, [children, lang])

    return <>{newChildren}</>
}

export default Translate

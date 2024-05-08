/* eslint-disable no-undef */
/* eslint-disable no-plusplus */
/* eslint-disable no-underscore-dangle */
/**
 * Custom utility function library
 */
import moment from "moment/moment"
// import { FuseUtils } from "@fuse"
import _ from "lodash"
import { colors } from "./defaultTheme"
// import { DEFAULT_TICKET_LIST_URL, DEV_URL, __DEV__ } from "app/store/constants"
import React from "react"
// import convertTimeZone from "./TimeZoneConverter"

let baseUrl = window.location.origin

// if (__DEV__) {
//     baseUrl = DEV_URL
// }

export function generateUid() {
    if (typeof window?.crypto?.randomUUID === "function") {
        return crypto.randomUUID()
    }
    return `${Math.floor(new Date().getTime() / 1000)}_${Math.random().toString(36).substr(2, 9)}`
}

let flashTitleTimer
export function flashTitle(title, { requireBlur, interval }) {
    let hidden
    let visibilityChange

    if (typeof document.hidden !== "undefined") {
        // Opera 12.10 and Firefox 18 and later support
        hidden = "hidden"
        visibilityChange = "visibilitychange"
    } else if (typeof document.msHidden !== "undefined") {
        hidden = "msHidden"
        visibilityChange = "msvisibilitychange"
    } else if (typeof document.webkitHidden !== "undefined") {
        hidden = "webkitHidden"
        visibilityChange = "webkitvisibilitychange"
    }

    // ----FLASH TITLE

    const old_title = "Ticketing App - Kapture CRM"

    function displayTitle() {
        clearInterval(flashTitleTimer)
        flashTitleTimer = window.setInterval(() => {
            document.title = document.title === old_title ? title : old_title
        }, interval || 1000)
    }

    function handleVisibilityChange() {
        if (document[hidden]) {
            displayTitle()
        } else {
            document.title = old_title
            clearInterval(flashTitleTimer)
            document.removeEventListener(visibilityChange, handleVisibilityChange, false)
        }
    }

    if (requireBlur) {
        // Warn if the browser doesn't support addEventListener or the Page Visibility API
        if (typeof document.addEventListener === "undefined" || hidden === undefined) {
            console.log("flashTitle requires a browser, such as Google Chrome or Firefox, that supports the Page Visibility API.")
        } else {
            document.addEventListener(visibilityChange, handleVisibilityChange, false)
        }
    } else {
        displayTitle()
    }
}

/**
 * Send a desktop notification
 *
 * @export
 * @param {string} title
 * @param {string} body
 *
 */
export function desktopNotification(title, body) {
    try {
        if (!window?.Notification) {
            return false
        }
        if (Notification.permission !== "granted") {
            Notification.requestPermission()
        } else {
            const notification = new Notification(title, {
                icon: "",
                body,
            })

            notification.onclick = () => {
                window.focus()
            }
        }
    } catch (err) {
        console.log(err)
    }
    return false
}
/**
 * This method should be used if you want to programmatically change value of an Input field in react.
 * This triggers the events after changing the value. Note: dispatchEvent should be called after this function.
 * This fixed the bug mentioned in https://github.com/facebook/react/issues/10135
 *
 * @export
 * @param {*} element
 * @param {*} value
 */
export function setNativeValue(element, value) {
    const { set: valueSetter } = Object.getOwnPropertyDescriptor(element, "value") || {}
    const prototype = Object.getPrototypeOf(element)
    const { set: prototypeValueSetter } = Object.getOwnPropertyDescriptor(prototype, "value") || {}

    if (prototypeValueSetter && valueSetter !== prototypeValueSetter) {
        prototypeValueSetter.call(element, value)
    } else if (valueSetter) {
        valueSetter.call(element, value)
    } else {
        throw new Error("The given element does not have a value setter")
    }
}

/**
 *returns values in array
 *
 * @export
 * @param {array} array
 * @param {*} key
 * @param {*} value
 * @returns
 */
export function findArrayByValue(array, key, value) {
    return array.find(_array => _array[key] === value)
}

export function searchInArray(array, key, value) {
    if (Array.isArray(array) && typeof array.find(_array => _array[key] === value) !== "undefined") {
        return true
    }
    return false
}

export function titleCase(string) {
    return string.toLowerCase().replace(/\b\w/g, s => s.toUpperCase())
}

export function getTimeString(time, now) {
    const currentDay = moment(now).dayOfYear()
    const msgDay = moment(time).dayOfYear()

    const currentYear = moment(now).year()
    const msgYear = moment(time).year()
    const dayDiff = currentDay - msgDay

    if (msgYear === currentYear) {
        if (dayDiff < 1) {
            return moment(time).fromNow()
        }
        if (dayDiff >= 1 && dayDiff <= 8) {
            return moment(time).calendar()
        }
        return moment(time).format("MMM Do YY, h:mm:ss a")
    }
    return moment(time).format("MMM Do YY, h:mm:ss a")
}
/**
 * Scroll into a view, element or ref
 *
 * @export
 * @param {HTMLElement|1|0} ref It can be a HTML Element ID, React Ref Object, or a number 1 (to scroll to the footer),0 (to scroll to the header)
 */
export function scrollHere(ref) {
    try {
        if (ref === 0) {
            // Scroll Top
            document.getElementById("progressor").scrollIntoView({
                behavior: "smooth",
                inline: "start",
            })
        } else if (ref === 1) {
            // Scroll to bottom
            document.getElementById("footer").scrollIntoView({
                behavior: "smooth",
                block: "end",
                inline: "center",
            })
        } else if (typeof ref === "string") {
            // Scroll to ID of element
            const el = document.getElementById(ref)
            // Non-chrome browsers support smooth scroll.
            if (
                el.scrollIntoView({
                    behavior: "smooth",
                    block: "end",
                    inline: "center",
                })
            ) {
                // ... scroll happened
            } else {
                el.scrollIntoView({
                    block: "end",
                    inline: "center",
                })
            }
        }
        // Scroll to ref created  by React
        else if (
            // Non-chrome browsers support smooth scroll.
            !ref.current.scrollIntoView({
                behavior: "smooth",
                inline: "center",
                block: "end",
            })
        ) {
            ref.current.scrollIntoView({
                inline: "center",
                block: "end",
            })
        }
    } catch (e) {
        // Fix for IE and other SMOOTH SCROLL non-supported browsers
        // console.log(e);
        if (e.name !== "TypeError") {
            if (ref === 0) {
                // Scroll Top
                document.getElementById("bpcl_header").scrollIntoView()
            } else if (ref === 1) {
                // Scroll to bottom
                document.getElementById("footer").scrollIntoView()
            } else if (typeof ref === "string") {
                document.getElementById(ref).scrollIntoView()
            } else {
                ref.current.scrollIntoView()
            }
        }
    }
}

export function refineString(_string) {
    // Refine the data key to display on the ui
    if (typeof _string === "string") {
        let string = _string
        string = string.replace("_", " ")
        string = string.replace("-", " ")
        string = _.startCase(string)
        return string
    }
    return _string
}

/**
 * Sorting an Array by key
 *
 * @export
 * @param {Array} arr
 * @param {String} sortKey
 * @returns
 */
export function sortArrayByValue(arr, sortKey) {
    return arr.sort((a, b) => {
        return a[sortKey] - b[sortKey]
    })
}

/**
 *
 * Sort an array by a value which is string
 *
 * @export
 * @param {Array} arr
 * @param {string} sortKey
 * @param {"asc"|"desc"} [type="asc"]
 * @return {Array}
 */
export function sortArrayByString(arr, sortKey, type = "asc") {
    return arr.sort((a, b) => {
        const aValue = a[sortKey].toUpperCase() // ignore upper and lowercase
        const bValue = b[sortKey].toUpperCase() // ignore upper and lowercase
        if (aValue < bValue) {
            return type === "asc" ? -1 : 1
        }
        if (aValue > bValue) {
            return type === "asc" ? 1 : -1
        }

        // names must be equal
        return 0
    })
}

export function getRandomNum(min, max) {
    // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min)
}

/**
 * Generate random flat colors
 * @param {"light"|"dark"} variant
 * @param {100|200|300|400|500|600|700|800|900} shade
 * @export
 * @returns
 */
export function getRandomColor(variant = "light", shade = "") {
    let colorList = []
    Object.keys(colors).forEach(_color => {
        if (typeof colors[_color] !== "string") {
            if (shade) {
                colorList = [...colorList, colors[_color][shade]]
            } else {
                Object.keys(colors[_color]).forEach(_shade => {
                    if (variant === "dark" && _shade >= 500 && _shade <= 900) {
                        colorList = [...colorList, colors[_color][_shade]]
                    } else if (variant === "light" && _shade >= 200 && _shade <= 600) {
                        colorList = [...colorList, colors[_color][_shade]]
                    }
                })
            }
        }
    })
    const randomIndex = getRandomNum(0, colorList.length - 1)

    return colorList?.[randomIndex] ?? ""
}

export function getRandomValuesInArray(arr) {
    const result = []
    const _tmp = arr.slice()
    for (let i = 0; i < 1; i++) {
        const index = Math.ceil(Math.random() * 10) % _tmp.length
        result.push(_tmp.splice(index, 1)[0])
    }
    return result
}

export function getTicketEmailTimeString(date, showFullDate = false) {
    // const convertedDate = convertTimeZone(date)
    // const now = convertTimeZone()
    const convertedDate = '2024-06-06'
    const now = "IST"
    if (convertedDate.year() === now.year()) {
        if (convertedDate.isSame(now, "day")) {
            // If same day

            return convertedDate.format("H:mm")
        }
        // If year but different month
        if (showFullDate) {
            return convertedDate.format("MMM DD HH:mm")
        }
        return convertedDate.format("MMM DD")
    }
    return convertedDate.format("DD-MM-YYYY")
}

export function lastOfArray(array) {
    if (Array.isArray(array) && array.length > 0) {
        return array?.[array.length - 1]
    }
    return null
}

/**
 * function to toggle (add/remove) values in arrays.
 *
 * @export
 */
export function handleGenericToggleArray(uid, _this, toggle_key) {
    const indexVal = _this.state[toggle_key].indexOf(uid)
    let newOpened = [..._this.state[toggle_key]]

    if (indexVal > -1) {
        //  Remove indexVal if already opened.
        newOpened.splice(indexVal, 1)
    } else {
        // Indexval doesnt exist so add it to opened

        newOpened = [...newOpened, uid]
    }

    _this.setState({
        [toggle_key]: newOpened,
    })
}
/**
 * Returns a new array by toggling the existence of a value in an array
 *
 * @export
 * @param {Array} arr
 * @param {string|number} value
 * @returns
 */
export function toggleArrayValues(arr, value) {
    if (!Array.isArray(arr)) {
        return arr
    }
    if (arr?.includes(value)) {
        return arr.filter(_val => _val !== value)
    }
    return [...arr, value]
}

/**
 * Generic function to update state.
 *
 * @export
 * @param {object} _this
 * @param {String} _key
 * @param {*} value
 * @returns {Object} Promise
 */
export function generalUpdateState(_this, _key, value) {
    return new Promise(resolve => {
        console.log(_key, value)
        _this.setState(
            {
                [_key]: value,
            },
            () => {
                resolve()
            }
        )
    })
}

/**
 * Generic function to update state.
 *
 * @export
 * @param {object} _this
 * @param {String} _key
 * @param {*} value
 * @returns {Object} Promise
 */
export const generalUpdateStateCurried = (_this, _key) => value => {
    _this.setState({
        [_key]: value,
    })
}
/**
 * Toggles boolean key in an Array Object.
 *
 * @export
 * @param {Array} arr
 * @param {String} toggleKey
 * @param {String} fieldKey To match the element
 * @param {Boolean|String|Number} fieldValue To match the element
 * @returns
 */
export function toggleKeyObjectArray(arr, toggleKey, fieldKey, fieldValue) {
    return arr.map(obj => {
        if (obj[fieldKey] === fieldValue)
            return {
                ...obj,
                [toggleKey]: !obj[toggleKey],
            }
        return obj
    })
}

/**
 * function to toggle (add/remove) object values in arrays.
 *
 * @export
 */
export function handleGenericToggleArrayObject(uid, value, _this, toggle_key) {
    const indexVal = _this.state[toggle_key].indexOf(uid)
    let newOpened = [..._this.state[toggle_key]]

    if (indexVal > -1) {
        //  Remove indexVal if already opened.
        newOpened.splice(indexVal, 1)
    } else {
        // Indexval doesnt exist so add it to opened

        newOpened = [
            ...newOpened,
            {
                [uid]: value,
            },
        ]
    }

    _this.setState({
        [toggle_key]: newOpened,
    })
}

export function handleGenericToggleObj(key, obj, value) {
    const tempObject = { ...obj }

    if (tempObject?.[key]) {
        delete tempObject[key]
        return tempObject
    }
    return {
        ...tempObject,
        [key]: value,
    }
}

/**
 * function to toggle boolean values in state
 *
 * @param {string} uid
 * @param {Object} _this
 * @export
 */
export const handleGenericToggle = (uid, _this) => () => {
    _this.setState(prevState => ({ [uid]: !prevState[uid] }))
    // _this.setState({ uid: !uid })
}

/**
 * Toggles boolean state created by useState hook
 *
 * @param {function} setStateFunc
 * @returns
 */
export const toggleGenericState = setStateFunc => () => {
    setStateFunc(prev => !prev)
    // _this.setState({ uid: !uid })
}

/**
 *
 * function to get the difference between two objects
 * @export
 * @param {*object} object: the first object to compare
 * @param {*object} base: the object to be compared
 * @returns : returns a new object with the difference
 */
export function difference(_object, _base) {
    function changes(object, base) {
        return _.transform(object, (result, value, key) => {
            if (!_.isEqual(value, base[key])) {
                result[key] = _.isObject(value) && _.isObject(base[key]) ? changes(value, base[key]) : value
            }
        })
    }
    return changes(_object, _base)
}

export const getFilteredTicketList = (obj, sortedList, searchText) => {
    if (searchText && (typeof searchText === "string" || typeof searchText === "number")) {
        const filteredObj = FuseUtils.searchInObj(obj, searchText)
        console.log("filteredObj", filteredObj)
        if (filteredObj !== undefined) {
            if (Object.keys(filteredObj).length === 0) {
                return obj
            }
            return filteredObj
        }
    }

    return obj
}

/** */
/**
 *-@export
 * @param {*} arr :array to be compared
 * @param {*} searchText: search value
 * @returns : returns array based on search parameters
 */
export const getFilteredArray = (arr, searchText) => {
    if (searchText !== undefined) {
        if (searchText.length === 0) {
            return arr
        }
        // return FuseUtils.filterArrayByString(arr, searchText)
    }
    return arr
}

/** */
/**
 *-@export
 * @param {*} arr :array to be compared
 * @returns : returns array value and Lable
 */
export const getParentFolderDropDown = folders => {
    let parentFolders = []
    folders.forEach(_val => {
        if (_val?.parentFolderId === 0) {
            parentFolders = [...parentFolders, { value: _val.id, label: _val.name }]
        }
    })
    return parentFolders
}

/**
 * Filter an array of strings
 * @memberof Library
 * @param {Array[String]} arr
 * @param {String} searchText
 *
 * @returns {Array}
 */
export const getFilteredStringArray = (arr, searchText) => {
    if (searchText !== undefined && arr && Array.isArray(arr)) {
        const searchTxt = searchText.replace(/\n/g, " ")
        if (searchTxt.length === 0) {
            return arr
        }
        return arr.filter(str => typeof str === "string" && str.toLowerCase().replace(/\n/g, " ").includes(searchTxt.toLowerCase()))
    }
    return arr
}

export function convertArrayToObject(array, key) {
    const initialValue = {}
    return array.reduce((obj, item) => {
        return {
            ...obj,
            [item[key]]: item,
        }
    }, initialValue)
}

export function arrayUnique(uniqueKey, arr) {
    let cleaned = []
    ;[...arr].forEach(itm => {
        let unique = true
        cleaned.forEach(itm2 => {
            if (itm2[uniqueKey] === itm[uniqueKey]) {
                unique = false
            }
        })
        if (unique) {
            cleaned = [...cleaned, itm]
        }
    })
    return cleaned
}

/**
 * Checks if user has selected any text
 *
 * @param {{targetEl: HTMLElement}}
 * @export
 * @returns {Boolean}
 */
export function isTextSelected(targetEl) {
    if (window.getSelection) {
        const selection = window.getSelection()
        const selectionStr = selection.toString()
        const isNode = selection.anchorNode !== null

        const isChildOfTargetEl = targetEl ? targetEl.contains(selection.anchorNode) : true

        return selectionStr !== "" && isNode && isChildOfTargetEl
    }
    return false
}

export const debounce = (callback, delay) => {
    let timer
    return (...args) => {
        clearTimeout(timer)
        timer = setTimeout(() => callback(...args), delay)
    }
}

/**
 * Swap values in an array
 *
 * @export
 * @param {Array} arr
 * @param {Number} old_index
 * @param {Number} new_index
 * @returns
 */
export function arrayMove(arr, old_index, new_index) {
    if (new_index >= arr.length) {
        let k = new_index - arr.length + 1
        while (k--) {
            arr.push(undefined)
        }
    }
    arr.splice(new_index, 0, arr.splice(old_index, 1)[0])
    return [...arr]
}

export const isUndefined = value => {
    return typeof value === "undefined"
}
/**
 * Compares two values.
 * If any one of the values is undefined, returns false.
 *
 * @export
 * @param {String|Number} val1
 * @param {String|Number} val2
 * @returns
 */
export function compareValues(val1, val2) {
    if (typeof val1 !== "undefined" && typeof val2 !== "undefined") {
        if ((typeof val1 === "string" || typeof val1 === "number") && (typeof val2 === "string" || typeof val2 === "number")) {
            return String(val1) === String(val2)
        }
    }
    return false
}

/**
 * Validates email addresses
 *
 * @export
 * @param {String} email
 * @returns {Boolean}
 */
export function validateEmail(email) {
    if (typeof email !== "string") return false

    const re = new RegExp(/^[-!#$%&'*+/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+/0-9=?A-Z^_a-z{|}~])*@[a-zA-Z0-9](-?[a-zA-Z0-9])*(\.[a-zA-Z](-?[a-zA-Z0-9])*)+$/)

    return re.test(String(email).toLowerCase())
}
/**
 * Copies text to the clipboard
 *
 * @export
 * @param {String} str
 */
export function copyToClipboard(text) {
    // Older browsers.
    if (!navigator.clipboard) {
        const textArea = document.createElement("textarea")
        textArea.value = text

        // Avoid scrolling to bottom
        textArea.style.top = "0"
        textArea.style.left = "0"
        textArea.style.position = "fixed"

        document.body.appendChild(textArea)
        textArea.focus()
        textArea.select()

        try {
            document.execCommand("copy")
        } catch (err) {
            console.error("Fallback: Oops, unable to copy", err)
        }

        document.body.removeChild(textArea)
    } else {
        navigator.clipboard.writeText(text).then(
            () => {
                // ..
            },
            err => {
                console.error("Async: Could not copy text: ", err)
            }
        )
    }
}

export function getCookie(key) {
    const cookieValue = document.cookie
        .split("; ")
        .find(row => row.startsWith(`${key}=`))
        ?.split("=")[1]

    return cookieValue
}

export async function getClipboardText() {
    try {
        if (navigator.clipboard) {
            const text = await navigator.clipboard.readText()
            return text
        }
        if (window.clipboardData) {
            return window.clipboardData.getData("text/plain")
        }
        return ""
    } catch (er) {
        console.error("Error in getClipboard", er)
    }
}

// export const validatePassword = str => {
//     const re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}$/
//     return re.test(str)
// }
// export const validateForm = errors => {
//     let valid = true
//     Object.values(errors).forEach(
//         // if we have an error string set valid to false
//         val => val.length > 0 && (valid = false)
//     )
//     return valid
// }
export const isEmpty = obj => {
    if (obj === null) return true
    if (_.isArray(obj) || _.isString(obj)) return obj.length === 0
    for (const key in obj) if (_.has(obj, key)) return false
    return true
}

/**
 * Checks whether the passed variable has any value irrespective of datatype. The variable checks for being undefined, null, empty.
 *
 * @param {*} obj
 * @returns {boolean}
 */
export const isEmptyOrUndefine = obj => {
    if (typeof obj === "undefined" || obj === null || obj === "") return true

    if (typeof obj === "object" && Array.isArray(obj)) return obj.length === 0

    if (typeof obj === "object" && Object.keys(obj).length === 0) return true

    return false
}

export const isEmptyOrUndefineValues = obj => {
    if (obj === null) return true

    if (typeof obj === "object") {
        if (Array.isArray(obj)) return obj.length === 0
        return Object.values(obj).every(val => isEmptyOrUndefine(val))
    }
    return false
}

// method returns default value of type specified
// in case type is not specified, array is considered as default
export const isEmptyReturnDefault = (data, _type) => {
    const type = _type || "array"
    const result = isEmpty(data) || isUndefined(data)
    if (result && type === "number") {
        return 0
    }
    if (result && type === "boolean") {
        return false
    }
    if (result && type === "array") {
        return []
    }
    if (result && type === "object") {
        return {}
    }

    return data
}

// Stops Event propagation onto the ansestor
export function stopPropagation(evt) {
    evt.stopPropagation()
}

/**
 *
 *
 * @export
 * @param {*} formId
 * @return {*}
 */
export function formDataToJson(formId) {
    if (!formId) {
        return
    }
    // Get the form element
    const form = document.getElementById(formId)

    // Create a FormData object
    const formData = new FormData(form)

    // Convert FormData to JSON
    const jsonData = {}
    formData.forEach((value, key) => {
        jsonData[key] = value
    })

    return jsonData
}

/**
 *
 *
 * @export
 * @param {*} obj
 * @param {*} keys
 * @return {*}
 */
export function checkMandatoryFields(obj, keys) {
    if (!obj || Object.keys(obj).length === 0) {
        return false
    }
    let hasMissingField = false
    keys.forEach(key => {
        const value = obj[key]
        // Check if the value is null, an empty string, or undefined
        if (value === null || (typeof value === "string" && value.trim() === "") || value === undefined) {
            hasMissingField = true
        }
    })
    return hasMissingField
}

/**
 *
 *
 * @export
 * @param {*} targetObj
 * @param {*} sourceObj
 * @param {*} keysToCheck
 * @return {*}
 */
export function spreadKeysIfExist(targetObj, sourceObj, keysToCheck) {
    // Validate input arguments
    if (!targetObj || typeof targetObj !== "object" || !sourceObj || typeof sourceObj !== "object" || !Array.isArray(keysToCheck)) {
        console.error("Invalid input arguments. Please provide valid objects and an array of keys to check.")
        return
    }

    // Perform key addition
    return keysToCheck.reduce(
        (acc, key) => {
            if (key in sourceObj && sourceObj[key] !== undefined && sourceObj[key] !== null) {
                acc[key] = sourceObj[key]
            }
            return acc
        },
        { ...targetObj }
    )
}

/**
 * Get the file extension from a URL
 *
 * @export
 * @param {string} filepath
 * @returns {string}
 */
export function getFileExtension(filepath) {
    let fileExt = ""
    if (typeof filepath === "string") {
        let filename = filepath

        // If it's a URL with search params, clean it.
        try {
            const urlObj = new URL(filepath)

            filename = urlObj.pathname
        } catch (err) {
            // ..
        }

        const ext = /^.+\.([^.]+)$/.exec(filename)
        fileExt = ext == null ? "" : ext[1]

        return fileExt.toLowerCase()
    }
    return ""
}

/**
 * Get the filename from URL
 *
 * @export
 * @param {string} url
 * @returns {string}
 */
export function getFileName(url) {
    if (typeof url === "string") {
        return url.substr(url.lastIndexOf("/") + 1)
    }
    return ""
}

/**
 * Download a file from a URL
 *
 * @export
 * @param {string} url
 */
export function downloadFile(url, skipWrapping = false, downloadFileName = "") {
    try {
        if (typeof url !== "string" || url.endsWith(".php")) return
        const linkEl = document.createElement("a")

        if (skipWrapping) {
            linkEl.href = url
        } else {
            const encodedUrl = encodeURI(url)
            linkEl.href = `${baseUrl}/ms/ticketcustomer/download-file?url=${encodedUrl}`
        }
        linkEl.download = downloadFileName
        linkEl.rel = "noopener,noreferrer"
        linkEl.target = "_blank"
        document.body.appendChild(linkEl)
        linkEl.click()
        document.body.removeChild(linkEl)
    } catch (er) {
        console.error("Error in downloadFile", er)
    }
}
/**
 * Convert Url queryString to Json Object
 *
 * @export
 * @param {string} query
 * @returns Json Object of key-value pair
 */
export function QueryStringToJSON(query) {
    const qstr = decodeURIComponent(query)
    const urlSearchParam = new URLSearchParams(qstr)
    const queryJson = {}
    for (const [key, val] of urlSearchParam) {
        queryJson[key] = val
    }
    return queryJson
}

export function getSubdomainFromUrl(urlString) {
    try {
        // ..
        const url = new URL(urlString)
        const { hostname } = url
        const hostnameParts = hostname.split(".")
        return hostnameParts.length >= 3 ? hostnameParts[0] : ""
    } catch (err) {
        return ""
    }
}

export function loadState() {
    try {
        const serializedState = localStorage.getItem("state")

        if (serializedState === null) {
            return undefined
        }

        return JSON.parse(serializedState)
    } catch (err) {
        return undefined
    }
}

export function isReactFragment(variableToInspect) {
    return React.isValidElement(variableToInspect) && React.Children.count(variableToInspect.props.children) > 0
}

export function saveState(state) {
    try {
        const serializedState = JSON.stringify(state)
        localStorage.setItem("state", serializedState)
    } catch (err) {
        // die
    }
}

/**
 * Extract text from an html string
 *
 * @export
 * @param {String} htmlText
 * @returns
 */
export function extractTextHtml(htmlText) {
    try {
        if (htmlText) {
            const htmlEl = document.createElement("div")
            // remove style tags and style attributes
            const updatedHtmlText = htmlText.replace(/<style[\s\S]*?>[\s\S]*?<\/style>|style="[\s\S]*?"/g, "")
            htmlEl.innerHTML = updatedHtmlText
            const text = htmlEl.textContent || htmlEl.innerText

            return text
        }

        return htmlText
    } catch (err) {
        console.error("error in extractTextHtml", err)
        return htmlText
    }
}

/**
 * Get the file type and its extension
 *
 * @export
 * @param {string} fileName
 * @returns {fileType, fileExtension}
 */
export function getFileType(fileName) {
    try {
        if (!fileName) {
            return {
                type: "",
                ext: "",
            }
        }

        const docTypes = ["ppt", "doc", "xls", "pptx", "docx", "xlsx", "txt", "csv"]
        const imageTypes = ["apng", "bmp", "gif", "ico", "cur", "jpg", "jpeg", "jfif", "pjpeg", "pjp", "png", "svg", "tif", "tiff", "webp"]
        const videoTypes = ["mp4", "webm", "ogg"]
        const audioTypes = ["mp3", "ogg", "wav"]

        const fileExtension = getFileExtension(fileName)
        let fileType = ""
        if (fileExtension === "pdf") {
            fileType = "pdfDocument"
        } else if (fileExtension === "txt") {
            fileType = "txtDocument"
        } else if (docTypes.includes(fileExtension)) {
            fileType = "document"
        } else if (imageTypes.includes(fileExtension)) {
            fileType = "image"
        } else if (videoTypes.includes(fileExtension)) {
            fileType = "video"
        } else if (audioTypes.includes(fileExtension)) {
            fileType = "audio"
        }

        return {
            type: fileType,
            ext: fileExtension,
        }
    } catch (err) {
        console.error("Error in getFileType", err)
        return null
    }
}

export function getFilteredColumn(filterType, filterValue, rows, fieldKey) {
    switch (filterType) {
        case "contains":
            return rows.filter(item => item[fieldKey].toString().toLowerCase().includes(filterValue.toLowerCase()))
        case "starts-with":
            return rows.filter(item => item[fieldKey].toString().toLowerCase().startsWith(filterValue.toLowerCase()) === true)
        case "ends-with":
            return rows.filter(item => item[fieldKey].toString().toLowerCase().endsWith(filterValue.toLowerCase()) === true)
        case "matches":
            return rows.filter(item => String(item[fieldKey]) === filterValue.toString())

        default:
            return true
    }
}
/**
 *
 *  Loads a file to the dom and callbacks once loaded
 *
 * @export
 * @param {String} url
 * @param {String} fileType
 * @param {Object} attributes
 * @param {Function} callbackFunc
 * @param {"head"|"body"} insertTo
 */
export function loadExternalFile(url, fileType = "script", attributes, insertTo = "head") {
    return new Promise((resolve, reject) => {
        try {
            // Check if script is already added.
            if ((fileType === "script" && document.querySelector(`${fileType}[src='${url}']`)) || (fileType === "css" && document.querySelector(`${fileType}[href='${url}']`))) {
                resolve()
                return
            }

            let loadEl
            let elType = ""
            if (fileType === "script") {
                elType = "script"
                loadEl = document.createElement(elType)
                loadEl.src = url
                loadEl.async = true
                loadEl.type = "text/javascript"
            } else if (fileType === "css") {
                elType = "link"
                loadEl = document.createElement(elType)
                loadEl.rel = "stylesheet"
                loadEl.href = url
            }

            if (loadEl) {
                // Append element attributes.
                if (typeof attributes === "object" && attributes !== null && !Array.isArray(attributes)) {
                    Object.keys(attributes).forEach(_attrKey => {
                        loadEl.setAttribute(_attrKey, attributes[_attrKey])
                    })
                }
            } else {
                return
            }
            loadEl.onload = () => {
                resolve()
            }
            loadEl.onerror = err => {
                throw new Error(err)
            }
            if (insertTo === "head") {
                document.getElementsByTagName("head")[0].appendChild(loadEl)
            } else if (insertTo === "body") {
                document.getElementsByTagName("body")[0].appendChild(loadEl)
            }
        } catch (err) {
            console.error(`Failed to load external file: ${url}`, err)
            reject(err)
        }
    })
}

export function fileDownload(data, fileName, type) {
    if (type === "excel") {
        const worksheet = XLSX.utils.json_to_sheet(data)
        const workbook = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(workbook, worksheet, "Dates")
        XLSX.writeFile(workbook, `${fileName}.xlsx`)
    } else if (type === "csv") {
        const fakeLink = document.createElement("a")
        fakeLink.style.display = "none"
        document.body.appendChild(fakeLink)
        const blob = new Blob([data], { type: "text/csv" })
        if (window.navigator && window.navigator.msSaveOrOpenBlob) {
            window.navigator.msSaveOrOpenBlob(blob, `${fileName}.csv`)
        } else {
            fakeLink.setAttribute("href", URL.createObjectURL(blob))
            fakeLink.setAttribute("download", `${fileName}.csv`)
            fakeLink.click()
        }
    } else if (type === "pdf") {
        const linkSource = data
        const downloadLink = document.createElement("a")
        const name = `${fileName}.pdf`
        downloadLink.href = linkSource
        downloadLink.download = name
        downloadLink.click()
    }
}

/**
 * Open URL in New Tab
 *
 * @export
 * @param {string} url
 */

function checkBlockedIframeURL(url) {
    const blockedIframeURLs = ["delhivery", "xpressbees", "shadowfax"]
    return blockedIframeURLs.some(_url => url.includes(_url))
}

export function openLinkInNewTab(url, updateTicketIFrameDetails = false) {
    const unSupportIframe = checkBlockedIframeURL(url)
    if (typeof url !== "string") return

    if (typeof updateTicketIFrameDetails === "function" && !unSupportIframe) {
        updateTicketIFrameDetails({ url, open: true })
    } else {
        window.open(url, "_blank")
    }
}

export function convertOldUrlToNewUIUrl(url) {
    try {
        if (typeof url !== "string" && url.includes("detail=")) return ""

        const endPoints = url.split("detail=")?.[1]?.split("/")

        // return `${DEFAULT_TICKET_LIST_URL}/detail/${endPoints[1]}/${endPoints[2]}`
    } catch (er) {
        console.error("Error in convertOldUrlToNewUIUrl", er)
        return ""
    }
}

/**
 * Trigger keyboard event from JS
 *
 * @export
 * @param {String} key
 * @param {{isAlt: Boolean, isShift: Boolean, isCtrl: Boolean}} { isAlt = false, isShift = false, isCtrl = false }
 *
 * @returns Boolean
 */
export function triggerKeyboardEvent(key, { isAlt = false, isShift = false, isCtrl = false }) {
    try {
        const uKeyEvent = new KeyboardEvent("keydown", {
            key,
            code: `Key${key}`,
            altKey: isAlt,
            shiftKey: isShift,
            ctrlKey: isCtrl,
        })

        return window.dispatchEvent(uKeyEvent)
    } catch (er) {
        console.error("Error in triggerKeyboardEvent", er)
        return false
    }
}

export function removeElementsFromHTML(htmlStr, tagName) {
    const documentEl = document.createElement("html")
    documentEl.innerHTML = htmlStr
    const removingList = documentEl.getElementsByTagName(tagName)
    let removingListLen = removingList.length - 1
    for (; removingListLen >= 0; removingListLen--) {
        removingList[removingListLen].parentNode.removeChild(removingList[removingListLen])
    }
    return documentEl.innerHTML
}

export function removeElementsFromHTMLByAttributes(htmlStr, tagName, attrName, attrValue) {
    const documentEl = document.createElement("html")
    documentEl.innerHTML = htmlStr
    const removingList = documentEl.getElementsByTagName(tagName)
    let removingListLen = removingList.length - 1
    for (; removingListLen >= 0; removingListLen--) {
        // compare the attribute value and then remove the element.
        const attributeValue = removingList[removingListLen].getAttribute(attrName)
        if (attributeValue && attributeValue.includes(attrValue)) {
            removingList[removingListLen].parentNode.removeChild(removingList[removingListLen])
        }
    }
    return documentEl.innerHTML
}

export function findElementFromHTMLByAttributes(htmlStr, tagName, attrName, attrValue) {
    const documentEl = document.createElement("html")
    documentEl.innerHTML = htmlStr
    const elList = documentEl.getElementsByTagName(tagName)
    let searchEl = null
    let elListLen = elList.length - 1
    for (; elListLen >= 0; elListLen--) {
        // compare the attribute value and then remove the element.
        const attributeValue = elList[elListLen].getAttribute(attrName)
        if (attributeValue && attributeValue.includes(attrValue)) {
            searchEl = elList[elListLen]
        }
    }
    return searchEl
}

/**
 * Get a date in a specific string format, with an option to get with Time.
 *
 * @export
 * @param {Date|number} date
 * @param {boolean} [withTime=false]
 * @return {*}
 */
export function getFormattedDate(date, withTime = false, customFormat) {
    try {
        if (!date) return ""
        if (withTime) {
            return moment(date).format("DD MMM YYYY hh:mm a")
        }
        if (customFormat) {
            return moment(date).format(customFormat)
        }
        return moment(date).format("DD MMM YYYY")
    } catch (er) {
        console.error("Error in getFormattedData", er)
    }
}

export function getFormattedNum(num = null) {
    try {
        if (num === null || typeof num === "undefined") {
            // return can be modified to anything better, currently returning "" for better display option.
            return ""
        }
        const number = parseFloat(num)

        if (Number.isNaN(number)) {
            return ""
        }

        return parseFloat(number.toFixed(2))
    } catch (er) {
        console.error("Error in getFormattedNum", er)
    }
}

export function reloadPage() {
    window.location.reload()
}

export function has(obj, val) {
    return typeof obj === "object" ? Object.prototype.hasOwnProperty.call(obj, val) : false
}

export function flattenObject(object) {
    if (typeof object !== "object" || Array.isArray(object)) {
        return {}
    }
    let returnObj = {}
    const iterate = obj => {
        for (const key in obj) {
            if (typeof obj[key] === "string" || typeof obj[key] === "number") {
                returnObj = {
                    ...returnObj,
                    [key]: obj[key],
                }
            } else if (obj[key] === "object") {
                flattenObject(obj[key])
            }
        }
    }
    iterate(object)
    return returnObj
}

export function addParamsToUrl(url, paramKey, paramValue) {
    try {
        const urlUpdated = new URL(url)
        urlUpdated.searchParams.set(paramKey, paramValue)
        return urlUpdated.toString()
    } catch (er) {
        console.error("Error in addParamsToUrl")
        return url
    }
}

export function parseToInt(str) {
    try {
        return parseInt(str, 10)
    } catch (er) {
        return null
    }
}

export function getDateDifference(start, end, format) {
    try {
        let timeSpent = 0
        timeSpent = end.diff(start, format ?? "seconds")

        return timeSpent
    } catch (er) {
        console.error("Error in getDateDifference", er)
        return 0
    }
}

export function CustomException(name, message) {
    this.message = message
    this.name = name
}

export function restrictReplyBasedOnWords(messageItem, restrictedWords, config) {
    if (!config) {
        return false
    }
    let isRestrict = false
    const messageStringArr = messageItem.split(/\s+/)
    // Checking the word is included in stringArray or not
    if (Array.isArray(restrictedWords) && messageStringArr.some(value => restrictedWords.some(value2 => value2.toLowerCase() === value.toLowerCase()))) {
        isRestrict = true
    }

    messageStringArr.map((_message, _messageIndex) => {
        restrictedWords.map(_restrict => {
            const msgString = _message.toLowerCase()
            const removeUnWantedChars = msgString.replace(/[^A-Za-z0-9]/g, "")
            const removeRestrictUnWantedChars = _restrict.replace(/[^A-Za-z0-9]/g, "")
            const prevString = messageStringArr[_messageIndex - 1]?.toLowerCase()
            const removePrevStringUnwantedChars = prevString?.replace(/[^A-Za-z0-9]/g, "")
            const nextString = messageStringArr[_messageIndex + 1]?.toLowerCase()
            const removeNextStringUnwantedChars = nextString?.replace(/[^A-Za-z0-9]/g, "")

            if (
                removeUnWantedChars === removeRestrictUnWantedChars ||
                removePrevStringUnwantedChars + removeUnWantedChars === removeRestrictUnWantedChars ||
                removeUnWantedChars + removeNextStringUnwantedChars === removeRestrictUnWantedChars
            ) {
                isRestrict = true
            }
            return true
        })
        return true
    })

    return isRestrict
}

export function sortAndOrderArray(mainArr, orderArr) {
    const tempArr = new Map()

    for (let i = 0; i < orderArr.length; i++) {
        if (!tempArr.has(orderArr[i])) {
            tempArr.set(orderArr[i], i + 1)
        }
    }

    return mainArr.sort((a, b) => {
        const tempIndex1 = tempArr.get(a) || 0
        const tempIndex2 = tempArr.get(b) || 0

        if (tempIndex1 === 0 && tempIndex2 === 0) {
            return a - b
        }

        if (tempIndex1 === 0) {
            return 1
        }

        if (tempIndex2 === 0) {
            return -1
        }
        return tempIndex1 - tempIndex2
    })
}

export const hexToRGBA = (color, opacity = "1") => {
    let hex = color
    if (!hex.includes("rgb")) {
        if (hex.includes("#")) {
            hex = hex.replace("#", "")

            if (hex.length === 3) {
                hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2]
            }

            const r = parseInt(hex.substring(0, 2), 16)
            const g = parseInt(hex.substring(2, 4), 16)
            const b = parseInt(hex.substring(4, 6), 16)

            return `rgba(${r},${g},${b},${opacity})`
        }
        const fakeDiv = document.createElement("div")
        fakeDiv.style.color = hex
        document.body.appendChild(fakeDiv)

        // Get color of div
        const cs = window.getComputedStyle(fakeDiv)
        const pv = cs.getPropertyValue("color")

        // Remove div after obtaining desired color value
        document.body.removeChild(fakeDiv)

        // Code ripped from RGBToHex() (except pv is substringed)
        const rgb = pv.match(/\d+/g)
        console.log(`rgba("${rgb[0]}","${rgb[1]}","${rgb[2]}","${opacity})`, "rgb")

        return `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${opacity})`
    }
    const updatedOpacity = hex.replace(/[^,]+(?=\))/, opacity)
    return updatedOpacity
}

export function validateImageInUrl(url) {
    return /\.(jpg|jpeg|png|webp|avif|gif|svg)$/.test(url)
}

export function getUrlFromString(text) {
    const urlRegex = /(https?:\/\/[^ ]*)/
    const url = text.match(urlRegex)[1]
    return url
}

export function getDesignationId(designationId) {
    // If designationId is an array, then set first one.
    if (designationId && Array.isArray(designationId)) {
        return designationId?.[0]
    }

    return designationId
}

export function removeOldUIHeader(id) {
    const iframeElement = document.getElementById(id)
    const iframeDocument = iframeElement?.contentDocument

    if (iframeDocument) {
        const iframeOldUiStyles = `
                .page-header, .page-sidebar-wrapper, .make-manual-call, #kaptureChatWrapper {
                    display:none !important
                }
                .page-content, .page-container{
                    margin: 0 !important;    
        
                }
                .page-content > .page-breadcrumb{
                    visibility: hidden;
                }`

        const styleEl = document.createElement("style")
        styleEl.innerHTML = iframeOldUiStyles

        const iframeHeadEl = iframeDocument.getElementsByTagName("head")[0]
        iframeHeadEl.appendChild(styleEl)
    }
    iframeElement.style.width = "100%"
}
export function downloadCSVfile(blob, fileName) {
    //  const link = document.createElement("a")

    const downloadLink = window.URL.createObjectURL(blob)
    // ink.download = fileName

    downloadFile(downloadLink, true, fileName)

    // Append the link to the document and trigger the click event

    // Clean up
}

export const filterObjectAccordingToArray = (obj, arr) => {
    const filteredObj = {}
    arr.forEach(key => {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            filteredObj[key] = obj[key]
        }
    })
    return filteredObj
}

// import LoggerService from "./logger.service"

/**
 * Handles all Storage related functions for you.
 *
 * @export
 * @class StorageHandler
 * @description
 */
export default class StorageHandler {
    /**
     * Check whether localStorage/sessionStorage is supported and available
     *
     * @export
     * @param {'localStorage'|'sessionStorage'} type
     * @returns {boolean}
     */
    static storageAvailable(type) {
        let storage
        try {
            storage = window[type]
            const x = "__storage_test__"
            storage.setItem(x, x)
            storage.removeItem(x)
            return true
        } catch (e) {
            // LoggerService.sendManualLogs(`Error StorageHandler::storageAvailable => Error: ${e.toString()} ErrorStack-> ${e?.stack}`, false, true)
            // return (
            //     e instanceof DOMException &&
            //     // everything except Firefox
            //     (e.code === 22 ||
            //         // Firefox
            //         e.code === 1014 ||
            //         // test name field too, because code might not be present
            //         // everything except Firefox
            //         e.name === "QuotaExceededError" ||
            //         // Firefox
            //         e.name === "NS_ERROR_DOM_QUOTA_REACHED") &&
            //     // acknowledge QuotaExceededError only if there's something already stored
            //     storage &&
            //     storage.length !== 0
            // )
        }
    }

    /**
     * set data to Storage
     *
     * @param {'localStorage'|'sessionStorage'} type type of Storage
     * @param {string} key
     * @param {*} data Data to set for the key, Objects will be stringified
     * @param {TimeStamp} expiration timestamp of expiry time
     * @memberof WebStorage
     */
    static setStorageData(type, key, data, expiration = false) {
        try {
            if (StorageHandler.storageAvailable(type)) {
                let serializedData = data

                if (typeof data === "function") {
                    throw new Error("function is not a valid datatype for data in StorageHandler")
                }

                if (typeof data === "object") {
                    serializedData = JSON.stringify(data)
                }

                // Set expiration for the data.
                if (expiration) {
                    let expirationList = StorageHandler.getStorageData(type, "expirationList")
                    expirationList = { ...expirationList, [key]: expiration }
                    StorageHandler.setStorageData(type, "expirationList", expirationList)
                }

                window[type].setItem(key, serializedData)
            }
        } catch (er) {
            console.error(`setStorageData::Error in setting ${type}`, er)
            // LoggerService.sendManualLogs(`Error StorageHandler::setStorageData => Error: ${er.toString()} ErrorStack-> ${er?.stack}`)
        }
    }

    /**
     * get data from Storage
     *
     * @param {'localStorage'|'sessionStorage'} type type of Storage
     * @param {string} key
     * @returns
     * @memberof WebStorage
     */
    static getStorageData(type, key) {
        try {
            if (StorageHandler.storageAvailable(type)) {
                const serializedData = window?.[type].getItem(key)

                if (serializedData === null) return null

                let data
                // Parse JSON data, otherwise return original data
                try {
                    data = JSON.parse(serializedData)

                    // check expiry time and remove if expired.
                    if (data) {
                        const expirationList = StorageHandler.getStorageData(type, "expirationList")
                        if (expirationList?.[key] && new Date().getTime() > new Date(expirationList[key])) {
                            StorageHandler.removeStorageData(type, key)
                            return null
                        }
                    }

                    return data
                } catch {
                    return serializedData
                }
            }
        } catch (er) {
            console.error(`getStorageData::Error in getting ${type}`, er)
            // LoggerService.sendManualLogs(`Error StorageHandler::getStorageData => Error: ${er.toString()} ErrorStack-> ${er?.stack}`)
            return null
        }
    }

    /**
     * remove item from Storage and its expiry data too if exists.
     *
     * @static
     * @param {'localStorage'|'sessionStorage'} type type of Storage
     * @param {string} key
     * @memberof StorageHandler
     */
    static removeStorageData(type, key) {
        try {
            window[type].removeItem(key)
            const expirationList = StorageHandler.getStorageData(type, "expirationList")
            if (expirationList?.[key]) {
                delete expirationList[key]
                StorageHandler.removeStorageData(type, "expirationList", expirationList)
            }
        } catch (er) {
            // LoggerService.sendManualLogs(`Error StorageHandler::removeStorageData => Error: ${er.toString()} ErrorStack-> ${er?.stack}`)
            console.error(`removeStorageData::Error in ${type}`, er)
        }
    }
}

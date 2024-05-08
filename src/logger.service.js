import { getSubdomainFromUrl } from "./library.factory"
import StorageHandler from "app/main/utilities/storage.handler"
import { sendLogs } from "app/services/general/generalFetcher"
// import store from "app/store"

const logs = []

export const logDb = { logs }
export default class LoggerService {
    constructor() {
        // Add a middleware in the console methods
        // const winLog = console.log
        // console.log = (message, ...args) => {
        //     // SEND LOGS HERE.
        //     this.processLogs(message)

        //     winLog.apply(console, args)
        // }

        const winError = console.error
        console.error = (...args) => {
            // SEND LOG HERE.
            this.processLogs(args)

            winError.apply(console, args)
        }

        this.employee = null
    }

    processLogs = _message => {
        const message = _message

        // REMOVE \n from message.
        // if (typeof message === "string") {
        //     message = message.replace(/\n/g, "")
        // }

        if (!this.employee || this.employee === null) {
            try {
                // const storeData = store && store.getState()
                const storeData = "datatat"
                this.employee = (storeData.user && storeData.user.id) || storeData.user.id
            } catch (er) {
                console.log("User data isn't fetched yet")
            }
        }

        const logMessage = {
            message,
            date: new Date().toString(),
            employee: this.employee,
        }

        const ENABLE_SYS_LOG = StorageHandler.getStorageData("localStorage", "ENABLE_SYS_LOG")

        if (ENABLE_SYS_LOG) {
            logDb.logs = [...logDb.logs, logMessage]
        }

        sendLogs({ ...logMessage })
    }

    /**
     * Log HTTP request with status code and response time
     *
     * @static
     * @param {METHOD} method
     * @param {URL} url
     * @param {number} responseTime
     * @param {number} statusCode
     * @memberof LoggerService
     */
    static sendApiAnalytics = (method, url, responseTime, statusCode) => {
        let urlCleaned = url

        const storeData = "12345"
        const agentId = storeData?.global?.currentEmployee?.id ?? storeData?.user?.empId ?? "null"
        try {
            const urlInstance = new URL(url)
            urlCleaned = urlInstance.origin + urlInstance.pathname
        } catch (e) {
            urlCleaned = url
        }

        // log with constructed string
        LoggerService.sendManualLogs(`${method} ${urlCleaned} ${responseTime} ${statusCode} ${agentId}`, true)
    }

    /**
     *
     *
     * @param {*} log
     */
    static sendManualLogs = (log, isAPIAnalyticsLog = false, skip = false) => {
        try {
            const storeData = "12345"
            const empId = storeData?.user?.empId
            const empName = storeData?.user?.name

            const logMessage = {
                message: log,
                date: new Date().toString(),
                empId,
                empName,
            }

            // disabled logger for democrm
            if (getSubdomainFromUrl(window.location.href) === "democrm") {
                return false
            }

            if (!skip) {
                const ENABLE_SYS_LOG = StorageHandler.getStorageData("localStorage", "ENABLE_SYS_LOG")
                if (ENABLE_SYS_LOG) {
                    logDb.logs = [...logDb.logs, log]
                }
            }

            const loqReq = { ...logMessage }

            /*          if (!isAPIAnalyticsLog) {
                sentryService.captureLogs(`${JSON.stringify(loqReq)}`, "debug")
            } */

            sendLogs(loqReq, isAPIAnalyticsLog)
        } catch (er) {
            console.error("User data isn't fetched yet", er, log)
        }
    }
}

// Service to handle generic URL params.

export const UtilityParams = {
    is_iframe_content: "is_iframe_content",
    env: "env",
    disableTicketList: "disableTicketList",
}

const UtilityParamList = [UtilityParams.is_iframe_content, UtilityParams.env, UtilityParams.disableTicketList]

export default class URLReaderService {
    static getUtilityParamValue(key) {
        if (!UtilityParamList.includes(key)) {
            throw new Error("The passed key isn't available in Utility param list.")
        }
        try {
            const params = new URLSearchParams(window.location.search)
            const paramValue = params.get(key)

            return paramValue
        } catch (er) {
            console.error("Error in getUtilityParamValue", er)
        }
    }

    /**
     * Filters URL from utility/tracking/unnecessary params and returns it as Object.
     *
     * @static
     * @param {string} [urlSearch=window.location.search]
     * @return {URLSearchParams}
     * @memberof UrlReaderService
     */
    static cleanUrlSearchParamsObj(urlSearch = window.location.search) {
        if (typeof urlSearch !== "string") {
            throw new Error("The url search param should be a string")
        }
        try {
            const decodedUrlSearch = decodeURIComponent(urlSearch)
            const params = new URLSearchParams(decodedUrlSearch)

            UtilityParamList.forEach(key => {
                params.delete(key)
            })
            return params
        } catch (er) {
            console.error("Error in cleanUrlSearchParam::cleanUrl", er)
            return {}
        }
    }

    /**
     * Filters URL from utility/tracking/unnecessary params and returns as string.
     *
     * @static
     * @param {string} [urlSearch=window.location.search]
     * @return {string}
     * @memberof UrlReaderService
     */
    static cleanUrlSearchParams(urlSearch = window.location.search) {
        try {
            const params = this.cleanUrlSearchParamsObj(urlSearch)
            if (params) {
                const paramStr = params.toString()

                // remove param without value. incase of ticket query.
                if (paramStr.endsWith("=")) {
                    return paramStr.substring(0, paramStr.length - 1)
                }
                return paramStr
            }
            return ""
        } catch (er) {
            console.error("Error in cleanUrlSearchParam", er)
            return ""
        }
    }

    static cleanUrlSearchParamsFromURL(url = window.location.href, base) {
        try {
            const urlObj = new URL(url, base)
            urlObj.search = this.cleanUrlSearchParams(urlObj.search)
            return urlObj.toString()
        } catch (er) {
            console.error("Error in cleanUrlSearchParamsFromURL", er)
            return ""
        }
    }
}

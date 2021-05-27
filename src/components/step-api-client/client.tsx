/**
 *  Step API Client
*/
export class Client {

    /**
     * Initialize API BaseURL
     * @example
     * Step_API_Client.baseURL = "https://my.web.site/api/"
     */
    static baseURL = ""


    /**
     * Initialize API Default Headers
     * @example
     * const myDefaultHeaders = {
     * "Accept": "application/json",
     * "Content-Type": "application/json",
     *  }
     * Step_API_Client.defaultHeaders = myDefaultHeaders
     * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers
     */
    static defaultHeaders = { 
        "Accept": "application/json",
        "Content-Type": "application/json",
    }


    /**
     * Set onUnauthorized handler
     * @example
     * Step_API_Client.onUnauthorized = () => {
     * 
     *  // Clear UserData, Remove Auth Headers
     * 
     * }
     */
    static onUnauthorized(): void { }


    /**
        * Append New Header (name, value) pair
        * @example // Usage Example
        * Step_API.appendHeader("Authorization", "Bearer xxxxx")
        * @param headerKey Header Name
        * @param headerValue Header Value
        */
    static appendHeader(headerKey: string, headerValue: string) {
        if ((typeof headerKey == "string") && (typeof headerValue == "string")) {
            this.defaultHeaders = {
                // Old Default Headers
                ...this.defaultHeaders,
                // New Header name and value pair
                [headerKey]: headerValue
            }
        } else {
            throw Error("type of headerKey & headerValue should be both strings!")
        }

    }

    /**
     * Remove header from default headers
     * @example // Usage Example
     * Step_API.removeHeader("Authorization")
     * @param headerKey Header Key to remove
     */
    static removeHeader(headerKey: string) {
        if (typeof headerKey == "string") {
            delete this.defaultHeaders[headerKey]
        } else {
            throw Error("type of headerKey should be string!")
        }

    }


}
import { Client } from './client'

/**
    * New Request Call
    * @param {string} resourceURL 
    * @param {string} method default to GET
    * @param {object} requestBody 
    * @param {object} requestHeaders 
    * @throws {string} Error Message
    * @returns {Promise} JSON Response
    */
export const request = async (
    resourceURL: string,
    method = 'GET',
    requestBody: object = null,
    requestHeaders: object = {}
): Promise<object> => {

    // Full URL: Base URL + Resource URL
    const requestURL = Client.baseURL + resourceURL;
    
    const headers = new Headers({
        // Default Headers
        ...Client.defaultHeaders,
        // Additional Headers 
        ...requestHeaders
    })

    // Fetch RequestDetails
    const requestDetails = { method, headers, body: null }

    // Add request Body (If Any)
    if (requestBody) { requestDetails.body = JSON.stringify(requestBody) }

    try {

        console.log("urlllllllll: " + requestURL);
        console.log("request body: " + JSON.stringify(requestBody));

        // Main Step, Wait for fetch response.
        const response = await fetch(requestURL, requestDetails)
        
        switch (response.status) {

            // Request Succeeded
            case 200:
                const jRes = await response.json()
                console.log("response:  " + JSON.stringify(jRes.data));
                return jRes.data

            // Bad Request
            case 400:
                const { errors } = await response.json();
                console.log(errors)
                const errorMessage = errors.join('\n')
                throw Error(errorMessage)

            // Unauthorized Request
            case 401:
                // Call onUnauthorized handler.
                console.log("401 error:::" + JSON.stringify(await response.json()))
                Client.onUnauthorized()
                throw Error('Something Went Wrong')

            default:
                // Log Response Text and throw resourceURL and status
                const responseText = await response.text()
                console.log(responseText)
                const errorText = `${resourceURL} ${response.status} `
                throw Error(errorText)
        }
    } catch (error) {
        console.log(`Request Failed ` + error);
        throw Error(error.message)
    }
}


const axios = require('axios')
const env = require('./env')

module.exports = class AvatarApi {
    constructor(url, clientId, clientSecret) {
        this.baseUrl = url;
        this.clientId = clientId;
        this.clientSecret = clientSecret;
    }
    async getToken(code) {
        const response = await axios({
            method: 'post',
            url: `${this.baseUrl}/api/v0/token`,
            data: {
                client_id: this.clientId,
                client_secret: this.clientSecret,
                code: code,
                grant_type: "authorization_code"
            }
        })
        return response.data.access_token;
    }
    async getProfile(token) {
        const response = await axios({
            method: 'get',
            url: `${this.baseUrl}/api/v0/profile`,
            headers: { 'Authorization': 'Bearer ' + token }
        })
        return response.data
    }
    async generate(token, text) {
        await axios({
            method: 'post',
            url: `${this.baseUrl}/api/v0/generate`,
            headers: { 'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json' },
            data: {
                text: text
            }
        })
    }
    async getGenerated(token) {
        const response = await axios({
            method: 'get',
            url: `${this.baseUrl}/api/v0/generated`,
            headers: { 'Authorization': 'Bearer ' + token }
        })
        return response.data.results
    }
}

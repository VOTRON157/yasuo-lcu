const axios = require('axios')
const https = require('https');
const LCUConnector = require('lcu-connector');
const Routes = require('./Routes');

module.exports = class YasuoApiClient extends Routes {
    constructor() {
        super()
        this.pass;
        this.baseURL;
        this.agent;
    }

    /**
    * Initializes the authentication credentials for accessing the League of Legends API.
    * @returns {Promise} - A Promise that resolves when the authentication is successful or rejects with an error.
    */
    init() {
        return new Promise((resolve, reject) => {
            const connector = new LCUConnector();
            console.log("Looking for my your lol account, make sure it is open, and that you ran that program as administrator")
            connector.on('connect', async (data) => {
                this.baseURL = `${data.protocol}://${data.address}:${data.port}`
                const access_token = `${data.username}:${data.password}`
                this.pass = new Buffer.alloc(Buffer.byteLength(access_token, "utf-8"), access_token).toString("base64")
                this.agent = axios.create({
                    baseURL: this.baseURL,
                    timeout: 1000,
                    headers: {
                        'User-Agent': 'LeagueOfLegendsClient',
                        'Accept': 'application/json',
                        'Authorization': `Basic ${this.pass}`,
                    },
                    httpsAgent: new https.Agent({
                        rejectUnauthorized: false
                    })
                });
                resolve(data)
            });
            connector.start();
            connector.on("disconnect", () => {
                connector.stop()
                console.warn('The League of Legends client has been closed, stopping the connector.')
            })
        })
    }

    /**
    * Sends an HTTP request to the League of Legends LCU API.
    * @param {string} method - The HTTP method of the request (e.g. GET, POST, PUT, DELETE).
    * @param {string} endpoint - The endpoint of the request (e.g. /lol-summoner/v1/current-summoner).
    * @param {Object} data - The data of the request (e.g. request body, parameters, headers).
    * @returns {Promise} - A Promise that resolves with the result of the request or rejects with an error.
    * @throws {Error} - If the authentication credentials have not been initialized using <APIManager>.init().
    */
    request(method, endpoint, data = {}) {
        if (!this.baseURL || !this.pass) throw new Error("Please use <APIManager>.init() to access the credentials before making any type of HTTP request.");
        return new Promise((resolve, reject) => {
            data.url = endpoint;
            data.method = method
            this.agent(data).then(res => {
                resolve(res)
            }).catch(e => reject(e))
        })
    }

    /**
    * Changes the avatar of the current user's League of Legends account.
    * @param {number} avatarId - The ID of the avatar to set.
    * @returns {Promise} - A Promise that resolves with the result of the request or rejects with an error.
    * @throws {Error} - If the authentication credentials have not been initialized using <APIManager>.init().
    */
    changeAvatar(avatarId) {
        return new Promise((resolve, reject) => {
            this.request('PUT', this.routes.changeAvatar, {
                data: {
                    profileIconId: avatarId
                }
            })
                .then(res => resolve(res))
                .catch(err => reject(err));
        })
    }


    /**
    * Initiates the matchmaking process for a League of Legends game.
    * @returns {Promise} - A Promise that resolves with the result of the request or rejects with an error.
    * @throws {Error} - If the authentication credentials have not been initialized using <APIManager>.init().
    */
    startMatchMaking() {
        return new Promise((resolve, reject) => {
            this.request('POST', this.routes.matchMaking)
                .then(res => resolve(res))
                .catch(err => reject(err));
        })
    }
}
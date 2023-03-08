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

    async request(method, endpoint, data = {}) {
        if (!this.baseURL || !this.pass) throw new Error("Please use <APIManager>.init() to access the credentials before making any type of HTTP request.");
        data.url = endpoint;
        data.method = method
        return (await this.agent(data))
    }

    async changeAvatar(avatarId) {
        return (await this.request('PUT', this.routes.changeAvatar, {
            data: {
                profileIconId: avatarId
            }
        }))
    }


    async getCurrentSummoner() {
        return (await this.request('GET', '/lol-summoner/v1/current-summoner/')).data
    }
    async startMatchMaking() {
        return (await this.request('POST', this.routes.matchMaking))
    }
    async currentSelection() {
        try {
            const res = await this.request('GET', '/lol-champ-select/v1/session')
            return res
        } catch {
            return false
        }
    }

    async autoSelectChampion(championForpickId) {
        const select = setInterval(async () => {
            const res = await this.currentSelection()
            if (res) {
                const { type, id } = res.data.actions[0].find(a => a.actorCellId === res.data.localPlayerCellId)
                if(type !== 'pick') return clearInterval(select)
                const { status } = await this.request('PATCH', `/lol-champ-select/v1/session/actions/${id}`, {
                    data: {
                        'championId': championForpickId,
                        'completed': true,
                    }
                }).catch(e => {
                    console.log(e)
                })
                if (status == 204) return clearInterval(select)
            }
        }, 1000);
    }
}
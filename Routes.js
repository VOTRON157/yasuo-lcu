module.exports = class Routes {
    constructor() {
        this.routes = {
            name: '/lol-summoner/v1/current-summoner/name',
            changeAvatar: '/lol-summoner/v1/current-summoner/icon',
            chat: '/lol-chat/v1/conversations/',
            cancelChampSelect: '/lol-lobby/v1/lobby/custom/cancel-champ-select',
            lobby: '/lol-lobby/v2/lobby',
            quickSearch: '/lol-lobby/v2/matchmaking/quick-search',
            gameChat: '/lol-game-client-chat/v1/instant-messages?',
            matchMaking: '/lol-lobby/v2/lobby/matchmaking/search'
        }
    }
}
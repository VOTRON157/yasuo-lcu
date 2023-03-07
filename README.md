# Yasuo Api Client LCU

![banner](/images/banner.png)
# Português
Yasuo API Client é uma ferramenta que permite a comunicação com a API da LCU do League of Legends de forma fácil e intuitiva.
# English
Yasuo API Client is a tool that allows easy and intuitive communication with the League of Legends LCU API.
# Exemplo/Example

```
npm install lcu-connector axios
```

```js
const YasuoAPIClient = require("./YasuoAPIClient")
const Summoner = new YasuoAPIClient();

(async () => {
    await Summoner.init().then(() => console.log('Logado na sua conta do LoL, ja pode começar a usar os metodos. / Logged in to your LoL account, you can now start using the methods'))

    Summoner.request('GET', '/lol-summoner/v1/current-summoner/')
        .then(res => console.log(res.data))
        .catch(err => console.error('Error:', err));


    Summoner.startMatchMaking() // Você precisa está em um saguão. / You need to be in a lobby.
        .then(res => console.log(`Entrando na fila, abra seu client! / Joining the queue, open your client!`))
        .catch(err => console.error(`Error MatchMaking:`, err));

})()
```
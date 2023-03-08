# Yasuo LCU

![banner](/images/banner.png)
## Português
Yasuo API Client é uma ferramenta que permite a comunicação com a API da LCU do League of Legends de forma fácil e intuitiva.
## English
Yasuo API Client is a tool that allows easy and intuitive communication with the League of Legends LCU API.

## Pré-requisitos

- Node.js v12.18.3 ou superior;
- NPM v6.14.6 ou superior.

## Instalação

Para instalar o projeto, siga os seguintes passos:

1. Clone o repositório do projeto:
```
git clone https://github.com/VOTRON157/yasuo-lcu.git
```
2. Instale as dependências do projeto:
```
npm install lcu-connector axios
```
3. Exemplo de código:

```js
const YasuoAPIClient = require("./YasuoAPIClient")
const Summoner = new YasuoAPIClient();

(async () => {
    await Summoner.init().then(() => console.log('Logado na sua conta do LoL, ja pode começar a usar os metodos. / Logged in to your LoL account, you can now start using the methods'))
    
    await Summoner.autoSelectChampion(54) // Vai selecionar o malphite (funciona apnas no modo "as cegas")
    await Summoner.changeAvatar(15) // Vai trocar para o avatar de um minion (roxo)
    console.log((await Summoner.getCurrentSummoner())) // Dados da conta atual
    await Summoner.startMatchMaking(); // Inicia a fila (precisa está em um saguão para funcionar, caso contrario retornara um erro)
    
    // Para fazer uma requisição HTTP para qualquer endpoint use --> Summoner.request(...)

})()
```

## Contribuição
Contribuições são sempre bem-vindas! Se você tiver alguma sugestão ou correção para o projeto, abra uma issue ou envie um pull request.
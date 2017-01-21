let fs = require('fs');

class WordReader {
    constructor(filePath){
        this.filePath = filePath;
        this.wordArray = this.read().split("\n").map((str) => str.trim());
    }

    read() {
        return fs.readFileSync(this.filePath, 'utf8');
    }

    printAllWords(){
        console.log(this.wordArray);
    }
}

class AliasGenerator{
    constructor(nouns, adjectives) {
        this.nounArray = nouns;
        this.adjectiveArray = adjectives;
    }
        generatePlayerName(){
            var randomName = this.adjectiveArray[Math.floor(Math.random() * this.adjectiveArray.length)];
            return randomName += " " + this.nounArray[Math.floor(Math.random() * this.nounArray.length)];
        }

        generateRoomCode(){
            let text = "";
            const rep = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"

            for( let i = 0; i < 5; i++)
                text += rep.charAt(Math.floor(Math.random() * rep.length));
            return text;
        }
}

const nounReader = new WordReader('../appData/nounlist.txt');
const adjReader = new WordReader('../appData/adjectiveList.txt');

const gen = new AliasGenerator(nounReader.wordArray, adjReader.wordArray);

const player1 = gen.generatePlayerName();
const game1 = gen.generateRoomCode();

console.log(player1);
console.log(game1);

let fs = require('fs');

class WordReader {
    constructor(filePath){
        this.filePath = filePath;
        this.wordArray = this.read().split("\n").map((str) => str.trim());
    }

    read() {
        return fs.readFileSync(this.filePath, 'utf8');
    }

    print(){
        console.log(this.wordArray);
    }
}

class NameGenerator{
    constructor(nouns, adjectives) {
        this.nounArray = nouns;
        this.adjectiveArray = adjectives;
    }
        generatePlayerName(){
            var randomName = this.adjectiveArray[Math.floor(Math.random() * this.adjectiveArray.length)];
            return randomName += " " + this.nounArray[Math.floor(Math.random() * this.nounArray.length)];
        }
}


const nounReader = new WordReader('../appData/nounlist.txt');
const adjReader = new WordReader('../appData/adjectiveList.txt');

const gen = new NameGenerator(nounReader.wordArray, adjReader.wordArray);

const player1 = gen.generatePlayerName();
console.log(player1);

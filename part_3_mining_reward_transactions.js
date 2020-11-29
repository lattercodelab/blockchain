const SHA256 = require('crypto-js/sha256');

class Transcation{

    constructor(fromAddress, toAddress, amount){
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;
    }



}


class Block{

    /**
     * 
     * @param {*} index 
     * @param {*} timestamp What time the black have be created.
     * @param {*} data The currency of the transaction data.
     * @param {*} previousHash The hash code that ensure the hash code not has modify when pass to other people. 
     */
    constructor(timestamp, transcations, previousHash = ''){
        this.timestamp = timestamp;
        this.transcations = transcations;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
        this.nonce = 0;
    }

    calculateHash(){
        return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data) + this.nonce).toString();
    }

    mineBlock(difficulty){
        while(this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")){
            this.nonce++;
            this.hash = this.calculateHash();
        }

        console.log("Block mined: " + this.hash);
    }

    

}

class Blockchain{
    
    constructor(){
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 1;
        this.pendingTranscations = [];
        this.miningReward = 100;
    }

    createGenesisBlock(){
        return new Block(0, "01/01/2020", "Genesis block", "0")
    }

    getLatestBlock(){
        return this.chain[this.chain.length - 1];
    }

    minePendingTranscations(miningRewardAddress){
        let block = new Block(Date.now(), this.pendingTranscations);
        block.mineBlock(this.difficulty);

        console.log('Blocksuccessfully mined!');
        this.chain.push(block);
        
        this.pendingTranscations = [
            new Transcation(null, miningRewardAddress, this.miningReward)
        ];
    }

    getBalanceOfAddress(address){
        let balance = 0;

        for(const block of this.chain){
            for(const trans of block.transcations){
                if(trans.fromAddress === address){
                    balance -= trans.amount;
                }

                if(trans.toAddress === address){
                    balance += trans.amount;
                }
            }
        }

        return balance;
    }

    createTranscation(transaction){
        this.pendingTranscations.push(transaction);
    }

    addBlock(newBlock){
        newBlock.previousHash = this.getLatestBlock().hash;
        newBlock.mineBlock(this.difficulty);
        this.chain.push(newBlock);
    }

    isChainValid(){
        for(let i=1; i<this.chain.length; i++){
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

            if(currentBlock.hash !== currentBlock.calculateHash()){
                return false;
            }

            if(currentBlock.previousHash !== previousBlock.hash){
                return false;
            }
        }

        return true;
    }
}

let savjeeCoin = new Blockchain();
savjeeCoin.createTranscation(new Transcation('address1', 'address2', 100));
savjeeCoin.createTranscation(new Transcation('address2', 'address1', 50));

console.log('\n Starting the miner...');
savjeeCoin.minePendingTranscations('xaviers-address');

console.log('\n Balance of xavier is', savjeeCoin.getBalanceOfAddress('xaviers-address'));

console.log('\n Starting the miner again...');
savjeeCoin.minePendingTranscations('xaviers-address');

console.log('\n Balance of xavier is', savjeeCoin.getBalanceOfAddress('xaviers-address'));
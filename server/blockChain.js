const SHA256 = require('crypto-js/sha256')
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');
const User = require('./models/user');

class Transaction {
    constructor(fromAddress, toAdress, amount) {
        this.fromAddress = fromAddress;
        this.toAdress = toAdress;
        this.amount = amount;
    }

    calculateHash() {
        return SHA256(this.fromAddress + this.toAdress + this.amount).toString();
    }

    signTransaction(signingKey) {

        if (signingKey.getPublic('hex') != this.fromAddress) {
            throw new Error('You cannot sign transactipn for other wallets!!');
        }

        const hashTx = this.calculateHash();
        const sig = signingKey.sign(hashTx, 'base64');
        this.signature = sig.toDER('hex');
    }

    isValid() {
        if (this.fromAddress == null) return true;

        if (!this.signature || this.signature.length == 0) {
            throw new Error('No signature in this transaction');
        }

        const publicKey = ec.keyFromPublic(this.fromAddress, 'hex');
        return publicKey.verify(this.calculateHash(), this.signature);
    }


}

class Block {
    constructor(timeStamp, transaction, previosHash = '') {
        this.timeStamp = timeStamp
        this.transaction = transaction
        this.previosHash = previosHash
        this.hash = this.calculateHash();
        this.nonce = 0;
    }


    calculateHash() {
        return SHA256(this.previosHash + this.timeStamp + JSON.stringify(this.transaction) + this.nonce).toString()
    }

    mineBlock(difficulty) {
        while (this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")) {
            this.nonce++;
            this.hash = this.calculateHash();
        }

    }

    hasValidTransaction() {
        for (const tx of this.transaction) {
            if (!tx.isValid()) {
                return false;
            }
        }
        return true;

    }
}

class BlockChain {
    constructor() {
        this.chain = [this.createGenesisBlock()]
        this.difficulty = 2;
        this.pendingTransactions = [];
        this.miningReward = 1000;
    }

    createGenesisBlock() {
        return new Block(Date.now, "Genesis Block", "0")
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1]
    }

    addBlock() {
        let block = new Block(Date.now, this.pendingTransactions);
        block.mineBlock(this.difficulty);
        block.previosHash = this.getLatestBlock().hash;
        this.chain.push(block);

        this.pendingTransactions = [
            new Transaction(null, block.hash, this.miningReward)
        ];
    }

    addTransaction(transaction) {
        if (!transaction.fromAddress || !transaction.toAdress) {
            throw new Error('Transaction must include from and to address');
        }

        if (!transaction.isValid()) {
            throw new Error('Cannot add invalid transaction to chain');
        }

        this.pendingTransactions.push(transaction);
    }

    getBalanceOfAddress(address) {
        let balance = 0;

        for (const block of this.chain) {
            for (const trans of this.pendingTransactions) {

                if (trans.fromAddress == address) {
                    balance -= trans.amount;
                }

                if (trans.toAdress == address) {
                    balance += trans.amount;
                }
            }
        }
        return balance;
    }

    isChainValid() {
        for (let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i]
            const previousBlock = this.chain[i - 1]

            if (!currentBlock.hasValidTransaction()) {
                return false;
            }


            if (currentBlock.previosHash !== previousBlock.hash) {
                return false;
            }
        }
        return true;
    }
}


const keys = ec.keyFromPrivate('R.Ltd', 'hex');
const userName = keys.getPublic('hex');
const password = keys.getPrivate('hex');
const owner = new User({
    userName: userName,
    password: password,
    name: 'R.Ltd',
    balance: 2000
});


class Parcel {
    constructor(x, y, status, price, owner, block) {
        this.x = x;
        this.y = y;
        this.status = status;
        this.price = price;
        this.owner = owner;
        this.block = block;
    }

    addBlock() {
        this.block.addBlock();
    }

    replaceOwner(toUser, amount) {
        const mykey = ec.keyFromPrivate(this.owner.name, 'hex');
        const tx1 = new Transaction(mykey.getPublic('hex'), toUser.userName, amount);
        tx1.signTransaction(mykey)
        this.block.addTransaction(tx1);
        if (this.block.isChainValid()) {
            this.owner.balance = this.owner.balance + amount;
            toUser.balance = toUser.balance - amount;
            this.owner = toUser;
            return true;
        }
        return false;

    }

}
module.exports.Parcel = Parcel;
module.exports.owner = owner;
module.exports.BlockChain = BlockChain;
module.exports.Block = Block
module.exports.Transaction = Transaction
const express = require('express')
const mongoose = require('mongoose')
const User = require('../models/user');
const Plot = require('../models/parcel');
const {
    BlockChain,
    Parcel,
    owner
} = require('../blockChain');
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');
const router = express.Router()
const db = mongoose.connection;
const blockChain = new BlockChain();


///////////////////Get, update and post parcel/////////////
///////////////Get one parcel//////////////////////////////
router.get('/parcel', async (req, res) => {
    const par = req.query;
    const rowIndex = parseInt(par.rowIndex);
    const colIndex = parseInt(par.colIndex);
    try {
        const parcel = await db.collection("parcel").findOne({
            rowIndex: rowIndex,
            colIndex: colIndex
        })
        if (parcel == null) {
            res.send("null")
        } else
            res.send(parcel)
    } catch (err) {
        res.status(404).json({
            message: err.message
        });

    }
});
////////////////////////////////////////////////////////////

/////////////Update parcel owner///////////////////////////
router.patch('/update', async (req, res) => {
    const newData = req.body;
    const newOwner = newData.owner;


    try {
        let par = await db.collection('parcel').findOne({
            rowIndex: newData.x,
            colIndex: newData.y
        })


        if (par == null) {
            res.send("null")
        } else {

            const plot = new Parcel(par.rowIndex, par.colIndex, par.status, par.price, par.owner, blockChain)
            let oldOwner = plot.owner;

            if (plot.replaceOwner(newOwner, par.price)) {
                par.owner = plot.owner;

                await db.collection('parcel').updateOne({
                    rowIndex: par.rowIndex,
                    colIndex: par.colIndex
                }, {
                    $set: {
                        owner: par.owner,
                        block: {
                            transaction: plot.block.pendingTransactions,
                            previosHash: par.block.previosHash,
                            hash: par.block.hash,
                            nonce: par.block.nonce
                        }
                    }
                });

                await db.collection('users').updateOne({
                    name: par.owner.name
                }, {
                    $set: {
                        balance: par.owner.balance
                    }
                });
                await db.collection('users').updateOne({
                    name: oldOwner.name
                }, {
                    $set: {
                        balance: oldOwner.balance
                    }
                });
                res.send(par);

            } else {
                res.send("null");
            }
        }
    } catch (err) {
        res.status(404).json({
            message: err.message
        });


    }

})
///////////////////////////////////////////////////////////

///////////////post parcels///////////////////////////////
router.post('/addParcel', async (req, res) => {
    const parcels = req.body;
    let randomStatus = 0;
    let randPraice = 0;
    const arr = []
    let flag = 0;

    for (let i = 0; i < parcels.length; i++) {
        randomStatus = Math.floor(Math.random() * (4 - 1) + 1);
        if (randomStatus != 1) {
            randPraice = Math.floor(Math.random() * (201 - 15) + 15)
        } else {
            randPraice = 0;
        }
        blockChain.addBlock();
        const lastBlock = blockChain.getLatestBlock();
        const newBlock = new Plot({
            rowIndex: parcels[i].rowIndex,
            colIndex: parcels[i].colIndex,
            status: randomStatus,
            block: lastBlock,
            price: randPraice,
            game: true,
            owner: owner
        });
        if (flag === 0) {
            flag += 1;
        } else {
            arr.push(newBlock);
        }
    }
    try {
        await db.collection("parcel").insertMany(arr);
        console.log('data saved')
        res.send(arr);

    } catch (err) {
        console.log(err);
        res.status(500).json
    }

})

///////////////////////////////////////////////////////////

////////////Get all parcels////////////////////////////////
router.get('/parcels', async (req, res) => {
    try {
        const parcels = await db.collection('parcel').find().toArray();
        if (parcels.length == 0) {
            res.send("null")
        } else
            res.send(parcels);

    } catch (err) {
        console.log(err)
        res.status(404).json({
            message: err.message
        });

    }
});
//////////////////////////////////////////////////////////

/////////////////Edit parcel//////////////////////////////
router.patch('/edit', async (req, res) => {
    const data = req.body;
    let isSale = 0;
    const game = data.game;
    let price = parseInt(data.price);
    if (data.status) isSale = 2;
    else {
        isSale = 1;
        price = 0;
    }
    try {
        const parcel = await db.collection('parcel').updateOne({
            rowIndex: data.rowIndex,
            colIndex: data.colIndex
        }, {
            $set: {
                status: isSale,
                price: price,
                game: game
            }
        });
        if (parcel === null) {
            res.send(null);
        } else {
            res.send(parcel);
        }

    } catch (err) {
        res.status(404).json({
            message: err.message
        });
    }
})
/////////////////////////////////////////////////////////
//////////////Get and post user/////////////////////////
////////////////Get user/////////////////////////////////
router.get('/login', async (req, res) => {
    const keys = ec.keyFromPrivate(req.query.userName + req.query.password, 'hex');
    const password = keys.getPrivate('hex');
    const userName = keys.getPublic('hex')
    try {
        const user = await db.collection('users').findOne({
            userName: userName
        })

        if (user == null) {
            res.send("null");
        } else if (user.password != password) {
            res.send("null");
        } else {

            res.send(user)
        }
    } catch (err) {
        res.status(404).json({
            message: err.message
        });
    }

})
/////////////////////////////////////////////////////////

///////////////////Post user//////////////////////////////
router.post('/signup', async (req, res) => {
    const name = req.body.userName;
    const keys = ec.keyFromPrivate(req.body.userName + req.body.password, 'hex');
    const password = keys.getPrivate('hex');
    const userName = keys.getPublic('hex');
    const balance = 1000;

    const newUser = new User({
        userName,
        password,
        name,
        balance
    });

    try {
        await db.collection("users").insertOne(newUser);
        console.log('data saved')
        res.send({
            userName: userName,
            password: password,
            name: name,
            balance: balance
        });
    } catch (e) {
        res.send('UserName already exist please try again')
    }
})
/////////////////////////////////////////////////////////



module.exports = router
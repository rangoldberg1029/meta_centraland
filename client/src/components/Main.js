import React, { useState, useEffect } from 'react'
import * as api from '../request/api.js'
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import './css/game.css'
import Plot from './Plot.js';


const LINK_STYLE = {
    color: 'white',
    fontFamily: 'Franklin Gothic Medium',
    fontSize: 'large'
}

const Main = () => {
    const [square, setSquare] = useState([]);
    const [login, setLogin] = useState(false);
    const [trigger, setTrigger] = useState(false);
    const tempBoard = [];

    const user = {
        userName: localStorage.getItem('username'),
        name: localStorage.getItem('name'),
        password: localStorage.getItem('password'),
        balance: parseInt(localStorage.getItem('balance'))
    }

    const Type = {
        NFT: 1,
        PARK: 2,
        ROAD: 3,
        default: 0
    };


    useEffect(() => {
        initBoard();
    }, [trigger])



    const initBoard = () => {
        for (let i = 0; i < 50; i++) {
            tempBoard[i] = []
            for (let j = 0; j < 50; j++) {
                tempBoard[i][j] = {
                    rowIndex: i,
                    columnIndex: j,
                    type: Type.default,
                    status: 0,
                    price: 0,
                    game: true,
                    owner: 'none'
                }
            }
        }
        initParks();
    }

    const initParks = () => {
        for (let i = 10; i < 21; i++) {
            for (let j = 10; j < 21; j++) {
                tempBoard[i][j].type = Type.PARK;
            }
        }
        for (let i = 30; i < 46; i++) {
            for (let j = 30; j < 46; j++) {
                tempBoard[i][j].type = Type.PARK;

            }
        }

        initRoads();
    }

    const initRoads = () => {
        for (let i = 1; i < 3; i++) {
            for (let j = 1; j < 3; j++) {
                tempBoard[i][j].type = Type.ROAD;
            }
        }

        for (let i = 24; i < 26; i++) {
            for (let j = 24; j < 26; j++) {
                tempBoard[i][j].type = Type.ROAD;
            }
        }

        for (let i = 46; i < 48; i++) {
            for (let j = 46; j < 48; j++) {
                tempBoard[i][j].type = Type.ROAD;
            }
        }

        initNFT();

    }

    const initNFT = async () => {
        const data = await api.getAllParcel();
        if (data != null) {
            initNFTHelper(data);
        } else {
            const parcelIndexs = [{}];
            for (let i = 0; i < 50; i++) {
                for (let j = 0; j < 50; j++) {
                    if (tempBoard[i][j].type !== Type.PARK && tempBoard[i][j].type !== Type.ROAD) {
                        parcelIndexs.push({ rowIndex: i, colIndex: j })
                        tempBoard[i][j].type = Type.NFT;
                    }
                }
            }
            const dataPost = await api.addParcels(parcelIndexs);
            if (dataPost === null) {
                console.log('falied 111---addparcels')
            } else {
                initNFTHelper(dataPost);

            }

        }
        setSquare(tempBoard);
        setLogin(true)


    }

    // const addData = async (startRow, startCol, endRow, endCol) => {
    // await addData(0, 0, 50, 50);
    // await addData(0, 50, 50, 100);
    // await addData(50, 0, 100, 50);
    // await addData(50, 50, 100, 100);
    //     const parcelIndexs = [{}];
    //     for (let i = startRow; i < endRow; i++) {
    //         for (let j = startCol; j < endCol; j++) {
    //             if (tempBoard[i][j].type !== Type.PARK && tempBoard[i][j].type !== Type.ROAD) {
    //                 parcelIndexs.push({ rowIndex: i, colIndex: j })
    //                 tempBoard[i][j].type = Type.NFT;
    //             }
    //         }
    //     }
    //     const dataPost = await api.addParcels(parcelIndexs);
    //     if (dataPost === null) {
    //         console.log('falied 111---addparcels')
    //     } else {
    //         initNFTHelper(dataPost);
    //     }

    // }

    const initNFTHelper = (data) => {
        for (let i = 0; i < data.length; i++) {
            tempBoard[data[i].rowIndex][data[i].colIndex].rowIndex = data[i].colIndex;
            tempBoard[data[i].rowIndex][data[i].colIndex].columnIndex = data[i].rowIndex;
            tempBoard[data[i].rowIndex][data[i].colIndex].type = Type.NFT;
            tempBoard[data[i].rowIndex][data[i].colIndex].status = data[i].status;
            tempBoard[data[i].rowIndex][data[i].colIndex].price = data[i].price;
            tempBoard[data[i].rowIndex][data[i].colIndex].owner = data[i].owner.name;
            tempBoard[data[i].rowIndex][data[i].colIndex].game = data[i].game;
        }

    }

    const renderCells = () => {
        return (
            <div className='Game-cells'>
                {square.map((rows, columnIndex) => {
                    return renderColumn(rows, columnIndex);
                })}
            </div>
        )
    }

    const checkSquare = (cellState) => {

        if (cellState.type === Type.NFT) {
            if (square[cellState.rowIndex][cellState.columnIndex].owner === user.name) {
                return 'parcel-own'
            }
            else if (square[cellState.rowIndex][cellState.columnIndex].status === 1) {
                return 'parcel-not-sale'
            } else
                return 'parcel-for-sale'
        }
        else if (square[cellState.rowIndex][cellState.columnIndex].type === Type.PARK) return 'parcel-park'
        else if (square[cellState.rowIndex][cellState.columnIndex].type === Type.ROAD) return 'parcel-road'
        return "default"
    }

    const renderColumn = (rows, columnIndex) => {
        return (
            <div className='Game-col' key={`column_${columnIndex}`}>
                {rows.map((cellState, rowIndex) => {
                    const cellModifier = checkSquare(cellState);
                    return <div className={`GameOfLife__cell GameOfLife__cell--${cellModifier}`}
                        key={`cell_${rowIndex}_${columnIndex}`}
                        onClick={() => clicked(columnIndex, rowIndex)}>
                    </div>
                })}
            </div>
        )
    }

    const clicked = async (rowIndex, columnIndex) => {
        if (square[rowIndex][columnIndex].type === Type.PARK) {
            console.log('type park')
            return;
        } else if (square[rowIndex][columnIndex].type === Type.ROAD) {
            console.log('type road')
            return;
        }
        else if (square[rowIndex][columnIndex].type === Type.NFT) {
            window.localStorage.setItem('rowIndex', square[rowIndex][columnIndex].rowIndex);
            window.localStorage.setItem('colIndex', square[rowIndex][columnIndex].columnIndex);
            setTrigger(true)
        }
        else {
            console.log('none')
        }
    }

    return (login) ? (
        <div className='board'>
            <nav className="navbar navbar-dark bg-dark">
                <h5 style={LINK_STYLE} > {user.name == '' ? 'hello guest' : "name: " + user.name} </h5>
                <h5 style={LINK_STYLE}>{user.balance == 0 ? '' : "balance: " + user.balance} </h5>
                <button className="navbar-toggler " type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav ml-auto">
                        <li className="nav-item "  >
                            <span className="legend-sale">Plot for sale</span>
                            <span className="legend-unsale">Plot unsale</span>
                            <span className='legend-park'>Park</span>
                            <span className='legend-road'>Road</span>
                            <span className='legend-own'>Your Plot</span>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="/" style={LINK_STYLE}>Log out</a>
                        </li>
                    </ul>
                </div>
            </nav>
            <div className='object3d chess-defaults'>
                <TransformWrapper defaultScale={2} defaultRositionX={100} defaultRositionY={200}>
                    <TransformComponent>
                        {renderCells()}
                    </TransformComponent>
                </TransformWrapper>
                {trigger ? (
                    <div >
                        <Plot close={() => setTrigger(false)} ></Plot>
                    </div>

                ) : ''}
            </div>
        </div>
    ) : <div className="text-center">
        Loading...
        <div className="spinner-border" role="status">
            <span className="sr-only"></span>
        </div>
    </div>
}

export default Main

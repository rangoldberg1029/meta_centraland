import React, { useState } from 'react'
import * as api from '../request/api.js'
import { useNavigate } from "react-router-dom";
import './css/edit.css'

const Edit = () => {
    const rowIndex = parseInt(window.localStorage.getItem('rowIndex'));
    const colIndex = parseInt(window.localStorage.getItem('colIndex'));
    const [price, setPrice] = useState(parseInt(window.localStorage.getItem('price')));
    const [status, setStatus] = useState(false);
    const [game, setGame] = useState(false);
    const path = useNavigate();

    // Handling the price change
    const handlePrice = (e) => {
        setPrice(e.target.value)

    }
    // Handling the form submission
    const handleSubmit = async () => {
        if (price < 0) {
            alert('Must have a positive number');
            return;
        }
        const data = await api.editParcel({ rowIndex: rowIndex, colIndex: colIndex, status: status, price: price, game: game });
        if (data !== null) {
            path('/main');
        } else {
            console.log('edit parcel falied');
        }
    }
    // Handling the status change
    const handleStatus = (e) => {
        setStatus(!status)
    }
    // Handling the game change
    const handleGame = () => {
        setGame(!game);
    }

    return (
        <div className='Edit'>
            <div className="d-flex justify-content-center h-100" >
                <div className="card-login">
                    <div className="card-header">
                        <h3>Edit</h3>
                    </div>
                    <div className="card-body">
                        <div className="input-group form-group">
                            <form>
                                <div className="form-check form-switch">
                                    <input className="form-check-input" type="checkbox" id="status" onChange={handleStatus} checked={status} />
                                    <label className="form-check-label" >Sale</label>
                                </div>
                                <div className="form-check form-switch">
                                    <input className="form-check-input" type="checkbox" id="game" onChange={handleGame} checked={game} />
                                    <label className="form-check-label" >Game</label>
                                </div>
                            </form>
                            {status ? <div className="input-group form-group">
                                <label className="label-price" >Price: </label>
                                <input type="text" className="form-price" onChange={handlePrice} value={price} id='price'></input>
                            </div> : ''}
                            <button type="submit" className="btn float-center login_btn mt-5" onClick={handleSubmit}>Save</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Edit
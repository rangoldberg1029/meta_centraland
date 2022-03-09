import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import './css/plot.css'
import * as api from '../request/api.js'
import { useNavigate } from "react-router-dom";
import ReactDom from 'react-dom'


const OVERLAY_STYLES = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,.7)',
    zIndex: 1000
}

function Plot({ close }) {
    const [parcel, setParcel] = useState(null);
    const rowIndex = parseInt(window.localStorage.getItem('rowIndex'));
    const colIndex = parseInt(window.localStorage.getItem('colIndex'));
    const path = useNavigate();

    const user = {
        userName: localStorage.getItem('username'),
        password: localStorage.getItem('password'),
        name: localStorage.getItem('name'),
        balance: parseInt(localStorage.getItem('balance'))
    }


    useEffect(() => {
        getParcelIndex();
    }, [])

    const getParcelIndex = async () => {
        const plot = await api.getParcel(rowIndex, colIndex);
        if (plot === null) {
            console.log('get parcel falied');
        } else {
            setParcel(plot);
        }

    }

    const updatePlot = async () => {
        if (parcel.owner.name === user.name) {
            alert('You the owner of this parcel');
            return;

        }
        if (parcel.status === 1) {
            alert('This parcel not for sale');
            return;
        }
        if (user.balance < parcel.price) {
            alert('You do not have enough money to buy this parcel');
            return;
        }

        const newData = await api.updateParcel(parcel.rowIndex, parcel.colIndex, user)
        if (newData != null) {
            setParcel(newData);
            window.localStorage.setItem('balance', newData.owner.balance);
            window.localStorage.setItem('user-name', newData.owner.name);
            alert("Congratulations you the owner of this plot");
        } else {
            alert("The exchange failed");

        }
    }


    const editParcel = () => {
        window.localStorage.setItem('price', parcel.price);
        path('/edit');
    }

    return (parcel !== null) ? ReactDom.createPortal(
        <>
            <div style={OVERLAY_STYLES}></div>
            <div className="container">
                <h3>Name owner: {parcel.owner.name}</h3>
                <div className='cardcontainer'>
                    <div className='photo'>
                        <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSc1NRXAGlbPNws_pdW8WxipAjh-9-19cqAuQ&usqp=CAU" />
                        <div className="photos">parcel: {parcel.rowIndex},{parcel.colIndex}</div>
                        {parcel.owner.name === user.name ? <button className="waves-effect waves-light btn-edit" onClick={editParcel}>Edit</button> : ''}
                    </div>
                    <div className='content'>
                        <p className="txt4">Block details</p>
                        <p className="txt5">hash:{parcel.block.hash.substring(0, 35)}..</p>
                        <p className="txt2">previosHash:{parcel.block.previosHash.substring(0, 30)}..</p>
                        <p className="txt2">nonce:{parcel.block.nonce}</p>
                    </div>
                    <div className='footer'>
                        <p><button className="waves-effect waves-light btn-buy" onClick={updatePlot}>BUY</button>
                            <button className="waves-effect waves-light btn-game" disabled={parcel.game == false ? true : false}   >
                                {parcel.game == false ? "not available" :
                                    <a href='https://rangoldberg1029.github.io/octocat.github.io/' >Memory game</a>}
                            </button>
                            <button className="waves-effect waves-light btn-close" onClick={close}></button>
                            <span className="price">{parcel.price === 0 ? 'Not for sale' : 'price:' + parcel.price + '$'}</span> </p>
                    </div>
                </div>
            </div>
        </>,
        document.getElementById('portal')
    ) : ''
}

export default Plot
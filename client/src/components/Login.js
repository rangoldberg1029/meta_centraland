import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./css/login.css"
import * as api from '../request/api.js'



const Login = () => {
    // States for registration
    const [user, setUser] = useState({
        userName: '',
        password: '',
        balance: 0
    })

    const inputRef = useRef(null);
    const passwordRef = useRef(null);
    const path = useNavigate();

    const handleChange = (e) => {
        const { id, value } = e.target;
        setUser(prevInput => {
            return {
                ...prevInput,
                [id]: value
            }
        })
    };

    // Handling the form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        inputRef.current.value = '';
        passwordRef.current.value = '';

        const data = await api.getUser(user);
        if (data != null) {
            localStorage.setItem('username', data.userName);
            localStorage.setItem('password', data.password);
            localStorage.setItem('name', data.name);
            localStorage.setItem('balance', data.balance);
            path('/main')
        } else
            alert("wrong userName or password ");

    };

    return (
        <div className='Login' >
            <div className="d-flex justify-content-center h-100">
                <div className="card-login">
                    <div className="card-header">
                        <h3>Sign In</h3>
                    </div>
                    <div className="card-body">
                        <form>
                            <div className="input-group form-group">
                                <div className="input-group-prepend">
                                    <span className="input-group-text"><i className="fas fa-user"></i></span>
                                </div>
                                <input type="text" className="form-control" placeholder="username" onChange={handleChange} value={user.userName} id='userName' ref={inputRef}></input>

                            </div>
                            <div className="input-group form-group">
                                <div className="input-group-prepend">
                                    <span className="input-group-text"><i className="fas fa-key"></i></span>
                                </div>
                                <input type="password" className="form-control" placeholder="password" onChange={handleChange} value={user.password} id='password' ref={passwordRef} ></input>
                            </div>

                            <div className="form-group">
                                <button type="submit" className="btn float-center login_btn mt-5" onClick={handleSubmit}>Login</button>
                            </div>
                        </form>
                    </div>
                    <div className="card-footer">
                        <div className="d-flex justify-content-center links">
                            Don't have an account?  <a href="/signup">Sign Up</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default Login;
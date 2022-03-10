
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./css/login.css"
import * as api from '../request/api.js'

export default function SignUp() {
    // States for registration
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const path = useNavigate();

    // Handling the name change
    const handleName = (e) => {
        setUserName(e.target.value);
    };

    // Handling the password change
    const handlePassword = async (e) => {
        setPassword(e.target.value);
    };
    // Handling the form submission
    const handleSignUp = async (e) => {
        e.preventDefault();

        if (password.length < 8) {
            alert("Password should be at least 8 characters")
            return;
        }

        if (userName === '') {
            alert("Please enter a username");
        } else {
            const newUser = {
                userName: userName,
                password: password,
                balance: 1000
            }

            const data = await api.addUser(newUser);
            if (data) {
                localStorage.setItem('name', userName);
                localStorage.setItem('username', data.name);
                localStorage.setItem('password', password);
                localStorage.setItem('balance', "1000");
                path('/main');
            }
            else
                alert('UserName already exist please try again')

        }
    }

    return (
        <div className="SignUp">
            <div className="d-flex justify-content-center h-100">

                <div className="card-login">
                    <div className="card-header">
                        <h3>Sign Up</h3>
                        <img className="profile-img" src="https://i.imgur.com/6b6psnA.png" />
                    </div>
                    <div className="card-body">
                        <form>
                            <div className="input-group form-group">
                                <div className="input-group-prepend">
                                    <span className="input-group-text"><i className="fas fa-user"></i></span>
                                </div>
                                <input type="text" className="form-control" placeholder="username" onChange={handleName} value={userName}></input>
                            </div>
                            <div className="input-group form-group">
                                <div className="input-group-prepend">
                                    <span className="input-group-text"><i className="fas fa-key"></i></span>
                                </div>
                                <input type="password" className="form-control" placeholder="password (at least 8 characters)" onChange={handlePassword} value={password}  ></input>
                            </div>
                            <div className="form-group">
                                <button type="submit" className="btn float-center mt-5 login_btn" onClick={handleSignUp}>Sign Up</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}


import logo from './logo.svg';
import './App.css';
import Header from './Tracker Components/Header';
import axios from 'axios';
import Authentication from './Tracker Components/Authentication';
import React, { useEffect, useState } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './Tracker Components/Dashboard';


function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loading, setLoading] = useState(true);
    const [userActivities, setUserActivities] = useState([]);
    const [categoryTotals, setCategoryTotals] = useState({
        Entertainment: 0,
        Product: 0,
        Bills: 0,
        Other: 0
    });
    const [searchText, setSearchText] = useState('');
    const [isNoData, setIsNoData] = useState(false);
    const apiUrl = process.env.REACT_APP_API_URL;


    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setIsLoggedIn(true);
            fetchUserActivities();
        } else {
            setIsLoggedIn(false);
        }
        setLoading(false);
    }, []);

    const fetchUserActivities = async () => {
        const token = localStorage.getItem('token');
        const user = localStorage.getItem('user');
        console.log(user);
        let jwtToken = 'Bearer ' + token;

        try {
            const response = await axios.get(`${apiUrl}/api/activities/user/${user}`, {
                headers: {
                    Authorization: jwtToken,
                },
            });

            setUserActivities(response.data);

            const newCategoryTotals = {
                Entertainment: 0,
                Product: 0,
                Bills: 0,
                Other: 0,
                Income: 0
            };

            response.data.forEach(activity => {
                const { category, money } = activity;
                newCategoryTotals[category] += money;
            });

            console.log('Category-wise totals:', newCategoryTotals);

            updateCategoryTotals(newCategoryTotals);
        } catch (error) {
            console.error('Error fetching user activities:', error);
        }
    };

    const fetchSearchActivities = async () => {

        if (!searchText) {
            fetchUserActivities();
            setIsNoData(false);
            return;
        }
        const token = localStorage.getItem('token');
        const user = localStorage.getItem('user');
        console.log(user);
        let jwtToken = 'Bearer ' + token;

        try {
            const response = await axios.get(`${apiUrl}/api/activities/search/${searchText}`, {
                headers: {
                    Authorization: jwtToken,
                },
            });
            if (response.data.length === 0) {
                setIsNoData(true);
                return;
            }else{
                setIsNoData(false);
            }

            setUserActivities(response.data);
        } catch (error) {
            console.error('Error fetching user activities:', error);
        }
    };

    const menuToggle = () => {
        const toggleMenu = document.querySelector('.menu');
        toggleMenu.classList.toggle('active');
    };

    const updateActivities = (newActivities) => {
        console.log(newActivities);
        setUserActivities(newActivities);
    };

    const updateCategoryTotals = (newCategoryTotals) => {
        setCategoryTotals(newCategoryTotals);
    };

    useEffect(() => {
        let toggle = document.querySelector('.toggle');

        let navigation = document.querySelector('.navigation');
        let main = document.querySelector('.main');

        toggle.onclick = function () {
            navigation.classList.toggle('active');
            main.classList.toggle('active');
        }

        let list = document.querySelectorAll('.navigation li');
        function activeLink() {
            list.forEach((item) =>
                item.classList.remove('hovered'));
            this.classList.add('hovered');
        }
        list.forEach((item) =>
            item.addEventListener('mouseover', activeLink));


    });
    return (
        <Router>
            <div className="containerMain">
                <div className="navigation">
                    <ul>
                        <li>
                            <a href="#">
                                <span className="icon"><ion-icon name="wallet"></ion-icon></span>
                                <span className="title">Expense Tracker</span>
                            </a>
                        </li>
                        <li>
                            <a href="#">
                                <span className="icon"><ion-icon name="home-outline"></ion-icon></span>
                                <span className="title">Dashboard</span>
                            </a>
                        </li>
                        <li>
                            <a href="#">
                                <span className="icon"><ion-icon name="person-outline"></ion-icon></span>
                                <span className="title">Customers</span>
                            </a>
                        </li>
                        <li>
                            <a href="#">
                                <span className="icon"><ion-icon name="chatbubble-outline"></ion-icon></span>
                                <span className="title">Message</span>
                            </a>
                        </li>
                        <li>
                            <a href="#">
                                <span className="icon"><ion-icon name="help-outline"></ion-icon></span>
                                <span className="title">Help</span>
                            </a>
                        </li>
                        <li>
                            <a href="#">
                                <span className="icon"><ion-icon name="settings-outline"></ion-icon></span>
                                <span className="title">Settings</span>
                            </a>
                        </li>
                        <li>
                            <a href="#">
                                <span className="icon"><ion-icon name="lock-closed-outline"></ion-icon></span>
                                <span className="title">Password</span>
                            </a>
                        </li>
                        <li>
                            <a href="#">
                                <span className="icon"><ion-icon name="log-out-outline"></ion-icon></span>
                                <span className="title">Sign out</span>
                            </a>
                        </li>
                    </ul>
                </div>
                <div className="main">
                    <div className="topbar">
                        <div className="toggle">
                            <ion-icon name="menu-outline"></ion-icon>
                        </div>

                        <div className="search">
                            <label>
                                <input type="text" value={searchText}
                                    onChange={(e) => setSearchText(e.target.value)} placeholder="Search here" onKeyPress={fetchSearchActivities}/>
                                <button onClick={fetchSearchActivities}>
                                    <ion-icon name="search-outline"></ion-icon>
                                </button>
                            </label>
                        </div>


                        {isLoggedIn ? (
                            <div className="action">
                                <div className="user" onClick={menuToggle}>
                                    <img src="user.jpg" />
                                </div>
                                <div className="menu">
                                    <h3>
                                        User Account
                                        <div>
                                            Operational Team
                                        </div>
                                    </h3>
                                    <ul>
                                        <li>
                                            <span className="material-icons icons-size"><ion-icon name="person-circle-outline"></ion-icon></span>
                                            <a href="#">My Profile</a>
                                        </li>
                                        <li>
                                            <span className="material-icons icons-size"><ion-icon name="create-outline"></ion-icon></span>
                                            <a href="#">Edit Account</a>
                                        </li>
                                        <li onClick={() => {
                                            localStorage.removeItem('token');
                                            localStorage.removeItem('user');
                                            setIsLoggedIn(false);
                                            window.location.reload();
                                        }}>
                                            <span className="material-icons icons-size"><ion-icon name="log-out-outline"></ion-icon></span>
                                            <a href="#">Sign Out</a>
                                        </li>

                                    </ul>
                                </div>
                            </div>
                        ) : (
                            <div></div>
                        )}
                    </div>
                    <Routes>
                        <Route
                            path="/"
                            element={isLoggedIn ? (
                                <Dashboard userActivities={userActivities} categoryTotals={categoryTotals} isNoData={isNoData} />
                            ) : (
                                <Authentication
                                    key={isLoggedIn}
                                    updateActivities={updateActivities} updateCategoryTotals={updateCategoryTotals}
                                />
                            )}
                        />
                        <Route path="/Authentication" element={<Authentication key={isLoggedIn} updateActivities={updateActivities} updateCategoryTotals={updateCategoryTotals} />} />
                        <Route path="/Dashboard" element={<Dashboard key={isLoggedIn} userActivities={userActivities} categoryTotals={categoryTotals} isNoData={isNoData} />} />
                    </Routes>

                </div>

            </div>
        </Router>

    )
}

export default App;

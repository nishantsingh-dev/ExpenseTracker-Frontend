import React, { useEffect } from 'react'
import './style.css'; // Import your CSS file


export default function Header() {
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
        <div className="container">
            <div className="navigation">
                <ul>
                    <li>
                        <a href="#">
                            <span className="icon"><ion-icon name="logo-apple"></ion-icon></span>
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
                            <input type="text" placeholder="Search here" />
                            <ion-icon name="search-outline"></ion-icon>
                        </label>
                    </div>

                    <div className="user">
                        <img src="user.jpg" />
                    </div>
                </div>

                

            </div>

        </div>

    )
}

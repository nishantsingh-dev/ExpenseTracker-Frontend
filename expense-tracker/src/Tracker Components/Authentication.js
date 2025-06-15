import React, { useState, useEffect } from 'react';
import './style1.css'; // Import your CSS file
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.css';

export default function Authentication({ updateActivities }) {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const apiUrl = process.env.REACT_APP_API_URL;

    const handleUsername = (e) => {
        setUsername(e.target.value);
    };

    const handlePassword = (e) => {
        setPassword(e.target.value);
    };

    const showAlert = () => {
        Swal.fire('Hello, World!');
      };

    
    useEffect(() => {
        if (isLoggedIn) {
            navigate('/');
        }
    }, [isLoggedIn, navigate]);

    const handleApi = async (e) => {
        setLoading(true);
        console.log('logging in');
        axios.post(`${apiUrl}/api/users/loginUser`, {
            username: username,
            password: password
        })
            .then(result => {
                // Handle the successful response here
                localStorage.setItem('token', result.data.token);
                localStorage.setItem('user', username);
                setIsLoggedIn(true);
                //window.location.reload();
                //fetchUserActivities();
                window.location.reload();
                navigate('/');
            })
            .catch(error => {
                // Handle errors here
                Swal.fire({   title: "Error",   
                text: error,   
                type: "warning", 
                icon: "warning",   
                confirmButtonColor: "#287bff",   
                confirmButtonText: "OK"});
                console.error('Error:', error.data);
            });
        setLoading(false);
    };

    // const fetchUserActivities = async () => {
    //     const token = localStorage.getItem('token');
    //     let jwtToken = 'Bearer ' + token;  // Fix the syntax here
    //     try {
    //         const response = await axios.get('http://localhost:8080/api/activities/user/' + username, {
    //             headers: {
    //                 Authorization: jwtToken,
    //             },
    //         });
    //         console.log(response.data);

    //         updateActivities(response.data);// This will contain the user's activities 
    //     } catch (error) {
    //         console.error('Error fetching user activities:', error);
    //     }
    // };
    
        


    return (
        <div className="container">
            <div className="forms-container">
                <div className="signin-signup">
                    <form action="#" className="sign-in-form" onSubmit={handleApi}>
                        <h2 className="title-sign-in">Sign in</h2>
                        <div className="input-field">
                            <i className="fas fa-user"></i>
                            <input type="text" value={username} onChange={handleUsername} placeholder="Username" />
                        </div>
                        <div className="input-field">
                            <i className="fas fa-lock"></i>
                            <input type="password" value={password} onChange={handlePassword} placeholder="Password" />
                        </div>
                        <input type="submit" value={loading ? 'Logging in...' : 'Login'} className="btn solid" disabled={loading} />
                        <p className="social-text">Use 'guest/guest' as default credentials</p>
                        <div className="social-media">
                            {/* Social media icons go here */}
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

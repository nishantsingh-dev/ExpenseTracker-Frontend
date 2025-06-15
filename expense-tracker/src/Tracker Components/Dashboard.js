import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Chart from 'chart.js/auto'
import axios from 'axios';
import Swal from 'sweetalert2';

export default function Dashboard({ userActivities, categoryTotals ,isNoData}) {
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const chartRef = useRef(null);
    const [name, setName] = useState('');
    const [money, setMoney] = useState('');
    const [paymentVia, setPaymentVia] = useState('BHIM UPI');
    const [category, setCategory] = useState('Product');
    const [type, setType] = useState('Expense'); // Default to "Expense"
    const [month, setMonth] = useState('January'); // Default to "January"
    const [note, setNote] = useState('');
    const [activityDate, setDate] = useState('');
    const apiUrl = process.env.REACT_APP_API_URL;


    useEffect(() => {
        if (isLoggedIn) {
            navigate('/');
        }
    }, [isLoggedIn, navigate]);

    useEffect(() => {
        if (Object.keys(categoryTotals).length === 0) return;
        const ctx = document.getElementById(chartRef);
        console.log(categoryTotals);
        const productTotal=Number(categoryTotals['Product']);
        const entertainmentTotal=Number(categoryTotals['Entertainment']);
        const othersTotal=Number(categoryTotals['Others']);
        const billsTotal=Number(categoryTotals['Bills']);
        const incomeTotal=Number(categoryTotals['Income']);
        console.log(productTotal)
       // const expense=productTotal+entertainmentTotal+othersTotal+billsTotal;
       const expense = (
        (categoryTotals['Product'] ?? 0) +
        (categoryTotals['Entertainment'] ?? 0) +
        (categoryTotals['Others'] ?? 0) +
        (categoryTotals['Bills'] ?? 0)
      );
        const balance=incomeTotal-expense;
        const myChart = new Chart(ctx, {
            type: 'polarArea',
            data: {
                labels: ['Expense', 'Income', 'Balance'],
                datasets: [{
                    label: '# ',
                    data: [expense, categoryTotals['Income'], balance],
                    backgroundColor: [
                        'rgba(255,99,132,1)',
                        'rgba(54,162,235,1)',
                        'rgba(255,206,86,1)',
                    ],
                }]
            },
            options: {
                responsive: true,
            }
        });

        // Clean up Chart.js when the component unmounts
        return () => {
            myChart.destroy();
        };
    }, [categoryTotals]);

    useEffect(() => {
        const showLoginButton = document.querySelector("#add");
        const popup = document.querySelector(".popup");
        const closeBtn = document.querySelector(".popup .close-btn");

        const showLoginHandler = () => {
            popup.classList.add("active");
        };

        const closeBtnHandler = () => {
            popup.classList.remove("active");
        };

        showLoginButton.addEventListener("click", showLoginHandler);
        closeBtn.addEventListener("click", closeBtnHandler);

        // Cleanup: remove event listeners when the component is unmounted
        return () => {
            showLoginButton.removeEventListener("click", showLoginHandler);
            closeBtn.removeEventListener("click", closeBtnHandler);
        };
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        try {
          const response = await axios.post(`${apiUrl}/api/activities`, {
            name,
            paymentVia,
            category,
            type,
            month,
            note,
            money: parseFloat(money), // Assuming money is the same as amount
            userId: localStorage.getItem('user'), // Hardcoded for now, replace it with dynamic user ID
            date: new Date(activityDate).toISOString(), // Current date and time
          });
          Swal.fire({
            title: 'Done!',
            text: 'Your Activity is added.',
            icon: 'success',
            confirmButtonColor: '#287bff',
            confirmButtonText: 'OK',
          }).then((result) => {
            // Check if the OK button is pressed
            if (result.isConfirmed) {
              // Trigger a page refresh
              window.location.reload();
            }
          });

          
          // Assuming the API response contains the updated list of activities
          //updateActivities(response.data);
        } catch (error) {
          console.error('Error creating activity:', error);
        }
      };

      const handleRowClick = (activity) => {
        // Use activity.name and activity.money in your method
        console.log(`Clicked on row: ${activity.name}, ₹${activity.money}, ${activity.id}`);
        const currentDate = new Date(activity.date);
const formattedDate = currentDate.toISOString().split('T')[0];
Swal.fire({
    title: activity.name,
    html: `<b>Amount:</b> ₹${activity.money} <br/> <b>Payment Via:</b> ${activity.paymentVia} <br/>  <b>Note:</b> ${activity.note} <br/> <b>Payment Date:</b> ${formattedDate}`,
    showCancelButton: true,
    confirmButtonColor: '#b70202',
    confirmButtonText: 'Delete',
    showLoaderOnConfirm: true,
    footer: '<button id="custom-cancel" class="swal2-cancel swal2-styled" style="margin-right: 5px; background:#f0b803">Update</button>',
    preConfirm: async () => {
        const token = localStorage.getItem('token');
        const jwtToken = 'Bearer ' + token;
    
        try {
          const response = await axios.delete(`${apiUrl}/api/activities/${activity.id}`, {
            headers: {
              Authorization: jwtToken,
            },
          });
    
          if (response.status !== 200) {
            throw new Error(response.statusText);
          }
    
          return response.data;
        } catch (error) {
          Swal.showValidationMessage(`Deletion failed: ${error}`);
        }
      },
      allowOutsideClick: () => !Swal.isLoading()
    }).then(result => {
      if (result.isConfirmed) {
        Swal.fire('Deleted!', 'The activity has been deleted.', 'success');
        // Refresh your activities here
        //fetchUserActivities();
        window.location.reload();
      }
    });
  
        // Add your logic here
      };

    return (<div>

        <div className="cardBox">
            <div className="card">
                <div>
                    <div className="numbers">₹{categoryTotals['Product']}</div>
                    <div className="cardName">Products</div>
                </div>
                <div className="iconBx">
                    <ion-icon name="cube-outline"></ion-icon>
                </div>
            </div>

            <div className="card">
                <div>
                    <div className="numbers">₹{categoryTotals['Bills']}</div>
                    <div className="cardName">Bills</div>
                </div>
                <div className="iconBx">
                    <ion-icon name="home-outline"></ion-icon>
                </div>
            </div>
            <div className="card">
                <div>
                    <div className="numbers">₹{categoryTotals['Entertainment']}</div>
                    <div className="cardName">Entertainment</div>
                </div>
                <div className="iconBx">
                    <ion-icon name="game-controller-outline"></ion-icon>
                </div>
            </div>

            <div className="card">
                <div>
                    <div className="numbers">₹{categoryTotals['Other']}</div>
                    <div className="cardName">Others</div>
                </div>
                <div className="iconBx">
                    <ion-icon name="receipt-outline"></ion-icon>
                </div>
            </div>

        </div>

        <div className="details">
            <div className="recentOrders">
                <div className="cardHeader">
                    <h2>Recent History</h2>
                    <a href="#" id="add" className="ViewBtn"><ion-icon name="add-circle"></ion-icon></a>
                   
                    <div class="popup">
                        <div class="close-btn">&times;</div>
                        <form onSubmit={handleSubmit}>
                            <div class="form">
                                <h2>Add Activity</h2>

                                <div class="form-element">
                                    <input type="text"  value={name} onChange={(e) => setName(e.target.value)} placeholder="Activity Name" />
                                    <select class="minimal" value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Category">
                                        <option>Product</option>
                                        <option>Bills</option>
                                        <option>Entertainment</option>
                                        <option>Income</option>
                                        <option>Others</option>
                                    </select>
                                </div>

                                <div class="form-element">
                                    <input type="date" id="dateInput" value={activityDate} onChange={(e) => setDate(e.target.value)} class="date-input" />
                                    <select class="minimal" value={month} onChange={(e) => setMonth(e.target.value)} placeholder="Month">
                                        <option>January</option>
                                        <option>February</option>
                                        <option>March</option>
                                        <option>April</option>
                                        <option>May</option>
                                        <option>June</option>
                                        <option>July</option>
                                        <option>August</option>
                                        <option>September</option>
                                        <option>October</option>
                                        <option>November</option>
                                        <option>December</option>
                                    </select>

                                </div>

                                <div class="form-element">
                                    <input type="text"  value={money} onChange={(e) => setMoney(e.target.value)} placeholder="Amount" />

                                    <select class="minimal" value={paymentVia} onChange={(e) => setPaymentVia(e.target.value)} placeholder="Payment Via">
                                        <option>BHIM UPI</option>
                                        <option>Net Banking</option>
                                        <option>Cash</option>
                                    </select>
                                </div>

                                <div class="form-element">

                                    <input type="text"  value={note} onChange={(e) => setNote(e.target.value)} placeholder="Note" />
                                    <select class="minimal" value={type} onChange={(e) => setType(e.target.value)} placeholder="Type">
                                        <option>Expense</option>
                                        <option>Income</option>
                                    </select>

                                </div>
                                <div class="form-element">
                                    <button type="submit">Add</button>
                                </div>

                            </div>
                        </form>
                    </div>
                </div>
                {!isNoData && userActivities.length > 0 && (
                <table>
                    <thead>
                        <tr>
                            <td>Name</td>
                            <td>Amount</td>
                            <td>Payment Via</td>
                            <td>Category</td>
                        </tr>
                    </thead>
                    <tbody>
                        {userActivities.map((activity) => (
                            <tr key={activity.id} onClick={() => handleRowClick(activity)}> {/* Assuming each activity has a unique identifier */}
                                <td>{activity.name}</td>
                                <td>₹{activity.money}</td>
                                <td>{activity.paymentVia}</td>
                                <td>
                                    <span className={activity.type === 'Income' ? 'Income' : 'expense'}>
                                        {activity.category}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>)}
                <center>{isNoData && (<div> <img src="Animation.gif" alt="No data" /></div>)}</center>
            </div>

            <div className="graphBox">
                <div className="cardHeader">
                    <h2>Analytics</h2>
                </div>
                <div>
                    <canvas id={chartRef}></canvas>
                </div>

            </div>
        </div>
    </div>)
} 
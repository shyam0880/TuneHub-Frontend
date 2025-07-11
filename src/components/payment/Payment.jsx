import { useEffect, useState, useContext } from "react";
import AuthContext from '../../context/AuthContext';
import { useNavigate, Navigate } from "react-router-dom";
import Loading from '../ui/Loading';

import '../../styles/Payment.css';

const Payment = () => {

    const [orderId, setOrderId] = useState("");
    const [razorpayKey, setRazorpayKey] = useState("");
    const { contextUser, login, setAlertData, apiUrl } = useContext(AuthContext);
    const navigate = useNavigate();
    
    useEffect(() => {
        const fetchRazorpayKey = async () => {
            try {
                const response = await fetch(`${apiUrl}/api/payment/razorpay-key`,{
                    credentials: "include",
                }); // API call to backend
                const data = await response.json();
                setRazorpayKey(data.razorpayKey); // Save key
            } catch (error) {
                console.error("Error fetching Razorpay Key:", error);
            }
        };
    
        fetchRazorpayKey();
    }, []);

    const refreshUser = () => {
        window.location.reload();
      };    

    // Fetch Razorpay Key from Backend
    
   // Create Order on Backend
   const createOrder = async (amount) => {
        try{
            const response = await fetch(`${apiUrl}/api/payment/create-order`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ 
                    amount:amount, 
                    email:contextUser.email
                }), 
                credentials: "include",
            });
            if (!response.ok) {
                setAlertData({
					show: true,
					status: false,
					message:`Failed to create order: ${response.statusText}`});
            }

            const data = await response.json();

            if (!data.order_id) {
                setAlertData({
					show: true,
					status: false,
					message:"Invalid order response from server."});
            }

            setOrderId(data.order_id);
            handlePayment(data);
        } catch (error) {
            setAlertData({
                show: true,
                status: false,
                message:"Failed to create order. Please try again."});
        }
    };

 // Handle Payment with Razorpay
    const handlePayment = (orderData) => {
        if (!razorpayKey) {
            setAlertData({
                show: true,
                status: false,
                message:"Kindely Refresh the page and Please try again."});
            return;
        }

        const options = {
            key: razorpayKey, // ✅ Using key from backend
            amount: orderData.amount,
            currency: orderData.currency,
            order_id: orderData.order_id,
            name: "TuneHub",
            description: "Premium Subscription",
            handler: function (response) {
                verifyPayment(response, orderData.amount);
            },
            prefill: {
                name: contextUser.name || "Test User",
                email: contextUser.email || "test@example.com",
                contact: "123456789",
            },
            theme: {
                color: "#3399cc",
            },
        };

        const rzp1 = new window.Razorpay(options);
        rzp1.open();
    };

    const verifyPayment = async (response, amount) => {
        try {
            const updateRes = await fetch(`${apiUrl}/api/payment/make-premium`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email: contextUser.email }),
                credentials: "include",
            });
    
            if (updateRes.ok) {
                const message = await updateRes.text();
                setAlertData({show: true, status: true, message: message});
                refreshUser();
            } else {
                setAlertData({
					show: true,
					status: false,
					message:"Failed to update user role."});
            }
        } catch (error) {
            setAlertData({
                show: true,
                status: false,
                message:"An error occurred."});
        }
    };
        
    if (contextUser && (contextUser.premium || contextUser.role === "ADMIN")) {
        return <Navigate to="/dashboard" replace />;
      }
      
    if (contextUser === undefined) {
        return <Loading />;
    }
 
    return (
        <div className="payment">            
                <h1>Listen without limits. Try 1 month of Premium Individual for free.</h1>
                <p>Only Rs 5000/month after. Cancel anytime. </p>
                <p className="warning"> USE UPI FOR PAYMENT (USE success@razorpay IN UPI) </p>
                <section className="layout">
                    <div className="grow">
                        <div className="info">
                            <h2>Individual</h2>
                            <p>Rs 500 per month</p>
                            <br/>
                            <ol>
                                <li><i className="bi bi-caret-right"></i> Premium account</li>
                                <li><i className="bi bi-caret-right"></i> Cancel anytime</li>
                                <li><i className="bi bi-caret-right"></i> 15 hours/month of listening time from our audiobooks subscriber catalog</li>
                            </ol>
                        </div>
                        <button type="submit" className="buy-button" onClick={()=>createOrder(500)}>Pay ₹500</button>
                    </div>
                    <div className="grow">
                        <div className="info">
                            <h2>Student</h2>
                            <p>Rs 600 per month</p>
                            <br/>
                            <ol>
                                <li><i className="bi bi-caret-right"></i>1 verified Premium account</li>
                                <li><i className="bi bi-caret-right"></i>Discount for eligible students</li>
                                <li><i className="bi bi-caret-right"></i>Cancel anytime</li>
                                
                            </ol>
                        </div>
                        <button type="submit" className="buy-button"  onClick={()=>createOrder(600)}>Pay ₹600</button>
                    </div>
                    <div className="grow">
                        <div className="info">
                            <h2>Family</h2>
                            <p>Rs 1000 /per month</p>
                            <br/>
                            <ol>
                                <li><i className="bi bi-caret-right"></i>Up to 6 Premium or Kids accounts</li>
                                <li><i className="bi bi-caret-right"></i>Control content marked as explicit</li>
                                <li><i className="bi bi-caret-right"></i>Access to Spotify Kids</li>
                                <li><i className="bi bi-caret-right"></i>Cancel anytime</li>
                                <li><i className="bi bi-caret-right"></i>15 hours/month of listening time from our audiobooks subscriber catalog</li>
                            </ol>
                        </div>
                        <button type="submit" className="buy-button"  onClick={()=>createOrder(1000)}>Pay ₹1000</button>
                    </div>
                </section>     
        </div>
    );
};


export default Payment;

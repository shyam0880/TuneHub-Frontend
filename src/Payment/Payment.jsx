import { useEffect, useState, useContext } from "react";
import AuthContext from '../Context/AuthContext';
import { useNavigate } from "react-router-dom";

import '../CSS/Payment.css';

const Payment = () => {

    const [orderId, setOrderId] = useState("");
    const [razorpayKey, setRazorpayKey] = useState("");
    const { contextUser, setContextUser } = useContext(AuthContext);
    const navigate = useNavigate();

    if (contextUser.premium || contextUser.role === "admin") {
        navigate("/");
        return;
    }

    // Fetch Razorpay Key from Backend
    useEffect(() => {
        const fetchRazorpayKey = async () => {
            try {
                const response = await fetch("http://localhost:8080/api/payment/razorpay-key"); // API call to backend
                const data = await response.json();
                setRazorpayKey(data.razorpayKey); // Save key
            } catch (error) {
                console.error("Error fetching Razorpay Key:", error);
            }
        };
    
        fetchRazorpayKey();
    }, []);
    
   // Create Order on Backend
   const createOrder = async (amount) => {
        try{
            const response = await fetch("http://localhost:8080/api/payment/create-order", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ 
                    amount:amount, 
                    email:contextUser.email
                }), // ✅ Sending email in request
            });
            if (!response.ok) {
                throw new Error(`Failed to create order: ${response.statusText}`);
            }

            const data = await response.json();

            if (!data.order_id) {
                throw new Error("Invalid order response from server.");
            }

            setOrderId(data.order_id);
            handlePayment(data);
        } catch (error) {
            alert("Failed to create order. Please try again.");
        }
    };

 // Handle Payment with Razorpay
    const handlePayment = (orderData) => {
        if (!razorpayKey) {
            alert("Razorpay key not loaded. Please try again.");
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



    return (
        <div className="payment">            
                <h1>Listen without limits. Try 1 month of Premium Individual for free.</h1>
                <p>Only Rs 5000/month after. Cancel anytime. </p>
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

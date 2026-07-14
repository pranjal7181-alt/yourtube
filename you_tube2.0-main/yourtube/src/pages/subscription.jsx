import { useEffect } from "react";
import axios from "../lib/axiosinstance";
import { useUser } from "../lib/AuthContext";

export default function Subscription() {
  const { user } = useUser();

  const plans = [
    { name: "Free", price: 0 },
    { name: "Bronze", price: 99 },
    { name: "Silver", price: 199 },
    { name: "Gold", price: 299 },
  ];

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handlePayment = async (plan, amount) => {
    if (!user) {
      alert("Please login first.");
      return;
    }

    try {
      const { data } = await axios.post("/subscription/create-order", {
        amount,
      });

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: data.amount,
        currency: data.currency,
        name: "YourTube",
        description: `${plan} Subscription`,
        order_id: data.id,

        handler: async function (response) {
          try {
            const verify = await axios.post(
              "/subscription/verify-payment",
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                userId: user._id,
                plan,
                amount,
              }
            );

            alert(verify.data.message);
          } catch (err) {
            console.error(err);
            console.log(err.response?.data);
            alert(
              err.response?.data?.message || "Payment verification failed"
            );
          }
        },

        prefill: {
          name: user.name,
          email: user.email,
        },

        theme: {
          color: "#FF0000",
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (error) {
      console.error(error);
      alert("Failed to create order");
    }
  };

  return (
    <div style={{ padding: "30px" }}>
      <h1>Upgrade Plan</h1>

      {plans.map((plan) => (
        <div
          key={plan.name}
          style={{
            border: "1px solid gray",
            padding: "20px",
            marginBottom: "20px",
            width: "250px",
          }}
        >
          <h2>{plan.name}</h2>
          <h3>₹{plan.price}</h3>

          {plan.price === 0 ? (
            <button disabled>Current Plan</button>
          ) : (
            <button onClick={() => handlePayment(plan.name, plan.price)}>
              Upgrade
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
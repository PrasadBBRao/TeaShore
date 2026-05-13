import {
  mainButton,
  inputStyle,
  priceRow,
  confirmButton,
  overlayStyle,
  popupStyle,
} from "../utils/styles"

function Checkout({
  cartItems,
  totalPrice,
  deliveryFee,
  finalTotal,
  couponDiscountRate,
  discountAmount,
  discountedTotal,
  name,
  setName,
  phone,
  setPhone,
  address,
  setAddress,
  city,
  setCity,
  pincode,
  setPincode,
  couponCode,
  setCouponCode,
  appliedCoupon,
  setAppliedCoupon,
  couponMessage,
  setCouponMessage,
  isCafeQrOrderingMode,
  detectedTableNumber,
  onPayNow,
  showPayment,
  paymentMethod,
  setPaymentMethod,
  onCreate,
  onCancel,
}) {
  const applyCoupon = () => {
    const normalizedCoupon = couponCode.trim().toUpperCase()

    if (
      normalizedCoupon === "TEA20" ||
      normalizedCoupon === "WELCOME10"
    ) {
      setAppliedCoupon(normalizedCoupon)
      setCouponMessage(`${normalizedCoupon} applied successfully!`)
      return
    }

    setAppliedCoupon("")
    setCouponMessage("Invalid coupon code")
  }

  return (
    <>
      <div
        style={{
          width: "90%",
          maxWidth: "1100px",
          margin: "50px auto",
          display: "flex",
          gap: "25px",
          flexWrap: "wrap",
        }}
      >
        <div
          style={{
            flex: "1 1 500px",
            backgroundColor: "#2c1d14",
            padding: "30px",
            borderRadius: "18px",
          }}
        >
          <h2>🛒 Order Summary</h2>

          {cartItems.map((item, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: "20px",
              }}
            >
              <p>
                {item.name} x{item.quantity}
              </p>

              <p>
                ₹{item.price * item.quantity}
              </p>
            </div>
          ))}

          <div
            style={{
              marginTop: "40px",
            }}
          >
            <h2>
              {isCafeQrOrderingMode
                ? "Cafe QR Ordering Mode ☕"
                : "📍 Delivery Details"}
            </h2>
            {isCafeQrOrderingMode && (
              <p
                style={{
                  marginTop: "8px",
                  marginBottom: "6px",
                  color: "#d2b48c",
                  fontWeight: "bold",
                }}
              >
                Ordering For Table {detectedTableNumber} ☕
              </p>
            )}

            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={inputStyle}
            />

            <input
              type="text"
              placeholder="Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              style={inputStyle}
            />

            {!isCafeQrOrderingMode && (
              <>
                <input
                  type="text"
                  placeholder="Street Address"
                  value={address}
                  onChange={(e) =>
                    setAddress(e.target.value)
                  }
                  style={inputStyle}
                />

                <input
                  type="text"
                  placeholder="City"
                  value={city}
                  onChange={(e) =>
                    setCity(e.target.value)
                  }
                  style={inputStyle}
                />

                <input
                  type="text"
                  placeholder="Pincode"
                  value={pincode}
                  onChange={(e) =>
                    setPincode(e.target.value)
                  }
                  style={inputStyle}
                />
              </>
            )}
          </div>
        </div>

        <div
          style={{
            flex: "1 1 300px",
            backgroundColor: "#2c1d14",
            padding: "30px",
            borderRadius: "18px",
          }}
        >
          <h2>Price Details</h2>

          <div
            style={{
              marginTop: "18px",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
            }}
          >
            <input
              type="text"
              placeholder="Enter coupon code"
              value={couponCode}
              onChange={(e) =>
                setCouponCode(e.target.value)
              }
              style={{
                ...inputStyle,
                marginTop: 0,
                backgroundColor: "#24160f",
                border: "1px solid #4a3325",
                color: "white",
              }}
            />

            <button
              onClick={applyCoupon}
              style={{
                ...mainButton,
                marginTop: 0,
              }}
            >
              Apply Coupon
            </button>

            {couponMessage && (
              <p
                style={{
                  margin: 0,
                  color: appliedCoupon
                    ? "#8be28b"
                    : "#ff8f8f",
                  fontWeight: "bold",
                }}
              >
                {couponMessage}
              </p>
            )}
          </div>

          <div style={priceRow}>
            <p>Subtotal</p>
            <p>₹{totalPrice}</p>
          </div>

          <div style={priceRow}>
            <p>Delivery Fee</p>
            <p>₹{deliveryFee}</p>
          </div>

          <div style={priceRow}>
            <p>Original Total</p>
            <p>₹{finalTotal}</p>
          </div>

          <div style={priceRow}>
            <p>Discount</p>
            <p>-₹{discountAmount}</p>
          </div>

          <hr
            style={{
              border: "1px solid #4a3325",
              margin: "20px 0",
            }}
          />

          <div
            style={{
              ...priceRow,
              fontSize: "24px",
              fontWeight: "bold",
            }}
          >
            <p>Final Total</p>
            <p>₹{discountedTotal}</p>
          </div>

          {isCafeQrOrderingMode ? (
            <>
              <p
                style={{
                  marginTop: "20px",
                  marginBottom: "20px",
                  color: "#c68b59",
                  fontWeight: "bold",
                  textAlign: "center",
                  fontSize: "16px",
                }}
              >
                ☕ Pay at Counter After Serving
              </p>
              <button
                onClick={onPayNow}
                style={mainButton}
              >
                Place Order 📝
              </button>
            </>
          ) : (
            <button
              onClick={onPayNow}
              style={mainButton}
            >
              Pay Now 💳
            </button>
          )}
        </div>
      </div>

      {/* PAYMENT POPUP */}
      {showPayment && !isCafeQrOrderingMode && (
        <div style={overlayStyle}>
          <div style={popupStyle}>
            <h2>Select Payment Method</h2>

            <div
              onClick={() =>
                setPaymentMethod("UPI")
              }
              style={{
                backgroundColor: "#3a261a",
                padding: "15px",
                borderRadius: "12px",
                marginTop: "15px",
                cursor: "pointer",
              }}
            >
              📱 UPI Payment
            </div>

            <div
              onClick={() =>
                setPaymentMethod("COD")
              }
              style={{
                backgroundColor: "#3a261a",
                padding: "15px",
                borderRadius: "12px",
                marginTop: "15px",
                cursor: "pointer",
              }}
            >
              💵 Cash on Delivery
            </div>

            {paymentMethod === "UPI" && (
              <div>
                <img
                  src={`https://quickchart.io/qr?text=${encodeURIComponent(
                    `upi://pay?pa=prasadrao02012004-1@oksbi&pn=TeaShore&am=${discountedTotal}&cu=INR`
                  )}&size=250`}
                  alt="QR"
                  style={{
                    marginTop: "20px",
                    borderRadius: "12px",
                    backgroundColor: "white",
                    padding: "10px",
                    width: "100%",
                    maxWidth: "250px",
                  }}
                />

                <button
                  onClick={() =>
                    onCreate("Paid ✅")
                  }
                  style={confirmButton}
                >
                  Confirm Payment
                </button>
              </div>
            )}

            {paymentMethod === "COD" && (
              <div>
                <p
                  style={{
                    marginTop: "20px",
                  }}
                >
                  Pay when order arrives 🚚
                </p>

                <button
                  onClick={() =>
                    onCreate("Cash on Delivery")
                  }
                  style={confirmButton}
                >
                  Confirm Order
                </button>
              </div>
            )}

            <button
              onClick={onCancel}
              style={{
                marginTop: "20px",
                backgroundColor: "transparent",
                border: "none",
                color: "#d2b48c",
                cursor: "pointer",
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  )
}

export default Checkout

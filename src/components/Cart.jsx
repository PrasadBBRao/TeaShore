import { mainButton, qtyButton } from "../utils/styles"

function Cart({
  cartItems,
  increaseQuantity,
  decreaseQuantity,
  finalTotal,
  onCheckout,
  menuRef,
  onExploreMenu,
}) {
  if (cartItems.length === 0) {
    return (
      <div
        style={{
          width: "90%",
          maxWidth: "700px",
          margin: "50px auto",
          backgroundColor: "#2c1d14",
          border: "1px solid #4a3325",
          borderRadius: "18px",
          padding: "36px 24px",
          textAlign: "center",
          boxSizing: "border-box",
        }}
      >
        <h2
          style={{
            margin: 0,
          }}
        >
          🛒 Your Cart is Empty
        </h2>
        <p
          style={{
            marginTop: "12px",
            marginBottom: 0,
            color: "#d2b48c",
            fontSize: "18px",
          }}
        >
          ☕ Add delicious items from the menu
        </p>
        <button
          onClick={onExploreMenu}
          style={{
            ...mainButton,
            maxWidth: "240px",
            marginInline: "auto",
          }}
        >
          Explore Menu
        </button>
      </div>
    )
  }

  return (
    <div
      style={{
        width: "90%",
        maxWidth: "700px",
        margin: "50px auto",
        backgroundColor: "#2c1d14",
        padding: "30px",
        borderRadius: "18px",
      }}
    >
      <h2>🛒 Your Cart</h2>

      {cartItems.map((item, index) => (
        <div
          key={index}
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: "20px",
            flexWrap: "wrap",
            gap: "15px",
          }}
        >
          <div>
            <h3>{item.name}</h3>

            <p>
              ₹{item.price} x {item.quantity}
            </p>
          </div>

          <div
            style={{
              display: "flex",
              gap: "10px",
              alignItems: "center",
            }}
          >
            <button
              onClick={() =>
                decreaseQuantity(item.name)
              }
              style={qtyButton}
            >
              -
            </button>

            <span>{item.quantity}</span>

            <button
              onClick={() =>
                increaseQuantity(item.name)
              }
              style={qtyButton}
            >
              +
            </button>
          </div>
        </div>
      ))}

      <h2
        style={{
          marginTop: "30px",
        }}
      >
        Total: ₹{finalTotal}
      </h2>

      <button
        onClick={onCheckout}
        style={mainButton}
      >
        Proceed to Checkout →
      </button>
    </div>
  )
}

export default Cart

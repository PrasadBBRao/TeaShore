import { useState, useRef, useEffect } from "react"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

function App() {
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem("teashore-cart")
    return savedCart ? JSON.parse(savedCart) : []
  })

  const [orders, setOrders] = useState(() => {
    const savedOrders = localStorage.getItem("teashore-orders")
    return savedOrders ? JSON.parse(savedOrders) : []
  })

  const [showCheckout, setShowCheckout] = useState(false)
  const [showPayment, setShowPayment] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState("")
  const [showOrders, setShowOrders] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] =
    useState("All")

  const [mobileMenu, setMobileMenu] = useState(false)

  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [address, setAddress] = useState("")
  const [city, setCity] = useState("")
  const [pincode, setPincode] = useState("")

  const [isMobile, setIsMobile] = useState(
    window.innerWidth < 768
  )

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }

    window.addEventListener("resize", handleResize)

    return () =>
      window.removeEventListener(
        "resize",
        handleResize
      )
  }, [])

  useEffect(() => {
    localStorage.setItem(
      "teashore-cart",
      JSON.stringify(cartItems)
    )
  }, [cartItems])

  useEffect(() => {
    localStorage.setItem(
      "teashore-orders",
      JSON.stringify(orders)
    )
  }, [orders])

  const homeRef = useRef(null)
  const menuRef = useRef(null)
  const aboutRef = useRef(null)
  const contactRef = useRef(null)

  const scrollToSection = (ref) => {
    setShowOrders(false)
    setShowCheckout(false)
    setMobileMenu(false)

    ref.current.scrollIntoView({
      behavior: "smooth",
    })
  }

  const addToCart = (item) => {
    const existingItem = cartItems.find(
      (cartItem) => cartItem.name === item.name
    )
  
    if (existingItem) {
      setCartItems(
        cartItems.map((cartItem) =>
          cartItem.name === item.name
            ? {
                ...cartItem,
                quantity: cartItem.quantity + 1,
              }
            : cartItem
        )
      )
    } else {
      setCartItems([
        ...cartItems,
        {
          ...item,
          quantity: 1,
        },
      ])
    }
  
    toast.success(`${item.name} added to cart ☕`, {
      position: "top-right",
      autoClose: 2000,
      theme: "dark",
    })
  }

  const increaseQuantity = (name) => {
    setCartItems(
      cartItems.map((item) =>
        item.name === name
          ? {
              ...item,
              quantity: item.quantity + 1,
            }
          : item
      )
    )
  }

  const decreaseQuantity = (name) => {
    setCartItems(
      cartItems
        .map((item) =>
          item.name === name
            ? {
                ...item,
                quantity: item.quantity - 1,
              }
            : item
        )
        .filter((item) => item.quantity > 0)
    )
  }

  const totalPrice = cartItems.reduce(
    (total, item) =>
      total + item.price * item.quantity,
    0
  )

  const deliveryFee = cartItems.length > 0 ? 40 : 0
  const finalTotal = totalPrice + deliveryFee

  const products = [
    {
      name: "Masala Tea ☕",
      category: "Tea",
      price: 40,
      image:
        "https://images.unsplash.com/photo-1571934811356-5cc061b6821f?q=80&w=800",
    },
    {
      name: "Cold Coffee 🧋",
      category: "Drinks",
      price: 90,
      image:
        "https://images.unsplash.com/photo-1517701604599-bb29b565090c?q=80&w=800",
    },
    {
      name: "French Fries 🍟",
      category: "Snacks",
      price: 120,
      image:
        "https://images.unsplash.com/photo-1576107232684-1279f390859f?q=80&w=800",
    },
  ]

  const filteredProducts = products.filter((item) => {
    const matchesSearch = item.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
    const matchesCategory =
      selectedCategory === "All" ||
      item.category === selectedCategory

    return matchesSearch && matchesCategory
  })

  const validateForm = () => {
    if (name.trim().length < 3) {
      alert("Please enter valid full name")
      return false
    }

    if (!/^[0-9]{10}$/.test(phone)) {
      alert("Phone number must be 10 digits")
      return false
    }

    if (address.trim().length < 10) {
      alert("Please enter complete address")
      return false
    }

    if (city.trim().length < 3) {
      alert("Please enter valid city")
      return false
    }

    if (!/^[0-9]{6}$/.test(pincode)) {
      alert("Pincode must be 6 digits")
      return false
    }

    return true
  }

  const createOrder = (paidStatus) => {
    const orderId =
      "TS" + Math.floor(1000 + Math.random() * 9000)

    const newOrder = {
      id: orderId,
      items: cartItems,
      total: finalTotal,
      payment: paidStatus,
      name,
      phone,
      address,
      city,
      pincode,
      status: "Preparing ☕",
      time: new Date().toLocaleTimeString(),
    }

    setOrders((prev) => [newOrder, ...prev])

    setTimeout(() => {
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId
            ? {
                ...order,
                status: "Out for Delivery 🚚",
              }
            : order
        )
      )
    }, 60000)

    setTimeout(() => {
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId
            ? {
                ...order,
                status:
                  "Reached Your Destination 📍",
              }
            : order
        )
      )
    }, 120000)

    setTimeout(() => {
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId
            ? {
                ...order,
                status: "Delivered ✅",
              }
            : order
        )
      )
    }, 180000)

    setShowPayment(false)
    setShowCheckout(false)
    setCartItems([])

    setName("")
    setPhone("")
    setAddress("")
    setCity("")
    setPincode("")

    setShowOrders(true)
  }

  const trackingSteps = [
    "Preparing ☕",
    "Out for Delivery 🚚",
    "Reached Destination 📍",
    "Delivered ✅",
  ]

  const getTrackingStepIndex = (status) => {
    if (status === "Preparing ☕") return 0
    if (status === "Out for Delivery 🚚") return 1
    if (
      status === "Reached Destination 📍" ||
      status === "Reached Your Destination 📍"
    )
      return 2
    if (status === "Delivered ✅") return 3
    return 0
  }

  return (
    <div
      style={{
        backgroundColor: "#1a120b",
        minHeight: "100vh",
        color: "white",
        fontFamily: "Arial",
      }}
    >
      {/* NAVBAR */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "20px",
          borderBottom: "1px solid #3b2a20",
          position: "sticky",
          top: 0,
          backgroundColor: "#1a120b",
          zIndex: 1000,
        }}
      >
        <h1
          style={{
            fontSize: "clamp(30px,5vw,42px)",
          }}
        >
          TeaShore ☕
        </h1>

        {/* DESKTOP MENU */}
        {!isMobile && (
          <div
            style={{
              display: "flex",
              gap: "25px",
              alignItems: "center",
              fontSize: "18px",
              cursor: "pointer",
            }}
          >
            <p onClick={() => scrollToSection(homeRef)}>
              Home
            </p>

            <p onClick={() => scrollToSection(menuRef)}>
              Menu
            </p>

            <p onClick={() => scrollToSection(aboutRef)}>
              About
            </p>

            <p onClick={() => scrollToSection(contactRef)}>
              Contact
            </p>

            <p
              onClick={() => {
                setShowOrders(true)
                setShowCheckout(false)
              }}
            >
              Orders
            </p>

            <div
              style={{
                backgroundColor: "#c68b59",
                padding: "10px 16px",
                borderRadius: "10px",
                fontWeight: "bold",
              }}
            >
              🛒{" "}
              {cartItems.reduce(
                (total, item) =>
                  total + item.quantity,
                0
              )}
            </div>
          </div>
        )}

        {/* MOBILE HAMBURGER */}
        {isMobile && (
          <div
            onClick={() =>
              setMobileMenu(!mobileMenu)
            }
            style={{
              fontSize: "38px",
              cursor: "pointer",
            }}
          >
            ☰
          </div>
        )}
      </div>

      {/* MOBILE MENU */}
      {mobileMenu && isMobile && (
        <div
          style={{
            backgroundColor: "#24160f",
            padding: "30px",
            display: "flex",
            flexDirection: "column",
            gap: "25px",
            fontSize: "22px",
          }}
        >
          <p onClick={() => scrollToSection(homeRef)}>
            Home
          </p>

          <p onClick={() => scrollToSection(menuRef)}>
            Menu
          </p>

          <p onClick={() => scrollToSection(aboutRef)}>
            About
          </p>

          <p onClick={() => scrollToSection(contactRef)}>
            Contact
          </p>

          <p
            onClick={() => {
              setShowOrders(true)
              setShowCheckout(false)
              setMobileMenu(false)
            }}
          >
            Orders
          </p>

          <div
            style={{
              backgroundColor: "#c68b59",
              padding: "12px",
              borderRadius: "10px",
              width: "fit-content",
              fontWeight: "bold",
            }}
          >
            🛒 Cart (
            {cartItems.reduce(
              (total, item) =>
                total + item.quantity,
              0
            )}
            )
          </div>
        </div>
      )}

      {/* ORDERS PAGE */}
      {showOrders ? (
        <div
          style={{
            padding: "40px 7%",
          }}
        >
          <h1
            style={{
              textAlign: "center",
              marginBottom: "40px",
            }}
          >
            Your Orders 📦
          </h1>

          {orders.length === 0 ? (
            <p
              style={{
                textAlign: "center",
                color: "#d2b48c",
              }}
            >
              No Orders Yet
            </p>
          ) : (
            orders.map((order, index) => (
              <div
                key={index}
                onClick={() =>
                  setSelectedOrder(
                    selectedOrder?.id === order.id
                      ? null
                      : order
                  )
                }
                style={{
                  backgroundColor: "#2c1d14",
                  padding: "20px",
                  borderRadius: "18px",
                  marginBottom: "25px",
                  cursor: "pointer",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent:
                      "space-between",
                    flexWrap: "wrap",
                    gap: "15px",
                  }}
                >
                  <div>
                    <h2>Order #{order.id}</h2>

                    <p
                      style={{
                        color: "#d2b48c",
                      }}
                    >
                      {order.status}
                    </p>
                  </div>

                  <h2>₹{order.total}</h2>
                </div>

                {selectedOrder?.id === order.id && (
                  <div
                    style={{
                      marginTop: "25px",
                      borderTop:
                        "1px solid #4a3325",
                      paddingTop: "20px",
                    }}
                  >
                    {order.items.map(
                      (item, idx) => (
                        <p key={idx}>
                          • {item.name} x
                          {item.quantity}
                        </p>
                      )
                    )}

                    <div
                      style={{
                        marginTop: "20px",
                        lineHeight: "2",
                      }}
                    >
                      <p>
                        <strong>Name:</strong>{" "}
                        {order.name}
                      </p>

                      <p>
                        <strong>Phone:</strong>{" "}
                        {order.phone}
                      </p>

                      <p>
                        <strong>
                          Address:
                        </strong>{" "}
                        {order.address},{" "}
                        {order.city}
                      </p>

                      <p>
                        <strong>
                          Payment:
                        </strong>{" "}
                        {order.payment}
                      </p>

                      <div
                        style={{
                          marginTop: "6px",
                          backgroundColor: "#23170f",
                          border:
                            "1px solid #4a3325",
                          borderRadius: "14px",
                          padding: "16px 14px",
                        }}
                      >
                        <p
                          style={{
                            marginTop: 0,
                            marginBottom: "14px",
                          }}
                        >
                          <strong>Status:</strong>{" "}
                          {order.status}
                        </p>

                        <div
                          style={{
                            display: "flex",
                            alignItems: "flex-start",
                          }}
                        >
                          {trackingSteps.map(
                            (step, stepIndex) => {
                              const currentStepIndex =
                                getTrackingStepIndex(
                                  order.status
                                )
                              const isCompleted =
                                stepIndex <=
                                currentStepIndex
                              const isActive =
                                stepIndex ===
                                currentStepIndex

                              return (
                                <div
                                  key={step}
                                  style={{
                                    display: "flex",
                                    alignItems:
                                      "center",
                                    flex: 1,
                                    minWidth: 0,
                                  }}
                                >
                                  <div
                                    style={{
                                      display: "flex",
                                      flexDirection:
                                        "column",
                                      alignItems:
                                        "center",
                                      gap: "8px",
                                      minWidth: 0,
                                    }}
                                  >
                                    <div
                                      style={{
                                        width: "30px",
                                        height: "30px",
                                        borderRadius:
                                          "50%",
                                        display: "flex",
                                        alignItems:
                                          "center",
                                        justifyContent:
                                          "center",
                                        fontSize:
                                          "14px",
                                        fontWeight:
                                          "bold",
                                        color:
                                          isCompleted
                                            ? "#1a120b"
                                            : "#d2b48c",
                                        border: `2px solid ${
                                          isCompleted
                                            ? "#f0b56e"
                                            : "#6a4a36"
                                        }`,
                                        background:
                                          isCompleted
                                            ? "linear-gradient(135deg, #f0b56e, #c68b59)"
                                            : "transparent",
                                        boxShadow:
                                          isActive
                                            ? "0 0 0 3px rgba(240, 181, 110, 0.2)"
                                            : "none",
                                      }}
                                    >
                                      {stepIndex + 1}
                                    </div>

                                    <p
                                      style={{
                                        margin: 0,
                                        textAlign:
                                          "center",
                                        fontSize:
                                          "12px",
                                        lineHeight:
                                          "1.35",
                                        color:
                                          isCompleted
                                            ? "#f5d6b3"
                                            : "#9d7d67",
                                        fontWeight:
                                          isActive
                                            ? "bold"
                                            : "normal",
                                        maxWidth:
                                          "120px",
                                      }}
                                    >
                                      {step}
                                    </p>
                                  </div>

                                  {stepIndex <
                                    trackingSteps.length -
                                      1 && (
                                    <div
                                      style={{
                                        flex: 1,
                                        height: "4px",
                                        borderRadius:
                                          "999px",
                                        margin:
                                          "0 8px",
                                        marginTop:
                                          "13px",
                                        backgroundColor:
                                          stepIndex <
                                          currentStepIndex
                                            ? "#d89b63"
                                            : "#5a3d2c",
                                      }}
                                    />
                                  )}
                                </div>
                              )
                            }
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      ) : !showCheckout ? (
        <>
          {/* HOME */}
          <div
            ref={homeRef}
            style={{
              textAlign: "center",
              padding: "100px 20px",
            }}
          >
            <h1
              style={{
                fontSize:
                  "clamp(42px,9vw,75px)",
                lineHeight: "1.2",
              }}
            >
              Welcome to TeaShore ☕
            </h1>

            <p
              style={{
                color: "#d2b48c",
                fontSize:
                  "clamp(18px,4vw,28px)",
                marginTop: "20px",
              }}
            >
              Fresh Tea • Cozy Ambience • Smart
              Ordering
            </p>
          </div>

          {/* MENU */}
          <div
            ref={menuRef}
            style={{
              paddingBottom: "80px",
            }}
          >
            <h1
              style={{
                textAlign: "center",
                marginBottom: "50px",
              }}
            >
              Our Menu 🍽️
            </h1>

            <div
              style={{
                width: "100%",
                maxWidth: "900px",
                margin: "0 auto 24px auto",
                paddingInline: "20px",
                boxSizing: "border-box",
              }}
            >
              <input
                type="text"
                placeholder="Search menu items..."
                value={searchQuery}
                onChange={(e) =>
                  setSearchQuery(e.target.value)
                }
                style={{
                  width: "100%",
                  padding: "14px 16px",
                  borderRadius: "12px",
                  border: "1px solid #4a3325",
                  backgroundColor: "#2c1d14",
                  color: "white",
                  fontSize: "16px",
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />

              <div
                style={{
                  marginTop: "14px",
                  display: "flex",
                  gap: "10px",
                  flexWrap: "wrap",
                }}
              >
                {[
                  "All",
                  "Tea",
                  "Drinks",
                  "Snacks",
                ].map((category) => (
                  <button
                    key={category}
                    onClick={() =>
                      setSelectedCategory(category)
                    }
                    style={{
                      border: "none",
                      borderRadius: "999px",
                      padding: "10px 16px",
                      cursor: "pointer",
                      fontWeight: "bold",
                      color:
                        selectedCategory === category
                          ? "#1a120b"
                          : "#f5d6b3",
                      background:
                        selectedCategory === category
                          ? "linear-gradient(135deg, #f0b56e, #c68b59)"
                          : "#3a261a",
                    }}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "25px",
                flexWrap: "wrap",
                paddingInline: "20px",
              }}
            >
              {filteredProducts.map((item, index) => (
                <div
                  key={index}
                  style={{
                    backgroundColor: "#2c1d14",
                    padding: "20px",
                    borderRadius: "18px",
                    width: "100%",
                    maxWidth: "280px",
                    textAlign: "center",
                  }}
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    style={{
                      width: "100%",
                      height: "190px",
                      objectFit: "cover",
                      borderRadius: "12px",
                    }}
                  />

                  <h2
                    style={{
                      marginTop: "15px",
                    }}
                  >
                    {item.name}
                  </h2>

                  <h3
                    style={{
                      color: "#d2b48c",
                    }}
                  >
                    ₹{item.price}
                  </h3>

                  <button
                    onClick={() =>
                      addToCart(item)
                    }
                    style={mainButton}
                  >
                    Add to Cart
                  </button>
                </div>
              ))}
            </div>

            {/* CART */}
            {cartItems.length > 0 && (
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
                      justifyContent:
                        "space-between",
                      alignItems: "center",
                      marginTop: "20px",
                      flexWrap: "wrap",
                      gap: "15px",
                    }}
                  >
                    <div>
                      <h3>{item.name}</h3>

                      <p>
                        ₹{item.price} x{" "}
                        {item.quantity}
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
                          decreaseQuantity(
                            item.name
                          )
                        }
                        style={qtyButton}
                      >
                        -
                      </button>

                      <span>
                        {item.quantity}
                      </span>

                      <button
                        onClick={() =>
                          increaseQuantity(
                            item.name
                          )
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
                  onClick={() =>
                    setShowCheckout(true)
                  }
                  style={mainButton}
                >
                  Proceed to Checkout →
                </button>
              </div>
            )}
          </div>

          {/* ABOUT */}
          <div
            ref={aboutRef}
            style={{
              padding: "100px 10%",
              textAlign: "center",
              backgroundColor: "#24160f",
            }}
          >
            <h1>About TeaShore ☕</h1>

            <p
              style={{
                marginTop: "30px",
                fontSize: "20px",
                lineHeight: "1.8",
                color: "#d2b48c",
              }}
            >
              TeaShore is a smart cafe ordering
              platform for seamless ordering
              experience.
            </p>
          </div>

          {/* CONTACT */}
          <div
            ref={contactRef}
            style={{
              padding: "100px 10%",
              textAlign: "center",
            }}
          >
            <h1>Contact Us 📞</h1>

            <div
              style={{
                marginTop: "40px",
                lineHeight: "2.2",
                color: "#d2b48c",
                fontSize: "20px",
              }}
            >
              <p>📍 Bangalore, India</p>
              <p>📞 +91 9876543210</p>
              <p>
                ✉️ teashorecafe@gmail.com
              </p>
            </div>
          </div>
        </>
      ) : (
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
                  justifyContent:
                    "space-between",
                  marginTop: "20px",
                }}
              >
                <p>
                  {item.name} x{item.quantity}
                </p>

                <p>
                  ₹
                  {item.price *
                    item.quantity}
                </p>
              </div>
            ))}

            <div
              style={{
                marginTop: "40px",
              }}
            >
              <h2>
                📍 Delivery Details
              </h2>

              <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) =>
                  setName(e.target.value)
                }
                style={inputStyle}
              />

              <input
                type="text"
                placeholder="Phone Number"
                value={phone}
                onChange={(e) =>
                  setPhone(e.target.value)
                }
                style={inputStyle}
              />

              <input
                type="text"
                placeholder="Street Address"
                value={address}
                onChange={(e) =>
                  setAddress(
                    e.target.value
                  )
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
                  setPincode(
                    e.target.value
                  )
                }
                style={inputStyle}
              />
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

            <div style={priceRow}>
              <p>Subtotal</p>
              <p>₹{totalPrice}</p>
            </div>

            <div style={priceRow}>
              <p>Delivery Fee</p>
              <p>₹{deliveryFee}</p>
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
              <p>Total</p>
              <p>₹{finalTotal}</p>
            </div>

            <button
              onClick={() => {
                if (validateForm()) {
                  setShowPayment(true)
                }
              }}
              style={mainButton}
            >
              Pay Now 💳
            </button>
          </div>
        </div>
      )}

      {/* PAYMENT POPUP */}
      {showPayment && (
        <div style={overlayStyle}>
          <div style={popupStyle}>
            <h2>Select Payment Method</h2>

            <div
              onClick={() =>
                setPaymentMethod("UPI")
              }
              style={paymentOption}
            >
              📱 UPI Payment
            </div>

            <div
              onClick={() =>
                setPaymentMethod("COD")
              }
              style={paymentOption}
            >
              💵 Cash on Delivery
            </div>

            {paymentMethod === "UPI" && (
              <div>
                <img
                  src={`https://quickchart.io/qr?text=${encodeURIComponent(
                    `upi://pay?pa=prasadrao02012004-1@oksbi&pn=TeaShore&am=${finalTotal}&cu=INR`
                  )}&size=250`}
                  alt="QR"
                  style={{
                    marginTop: "20px",
                    borderRadius: "12px",
                    backgroundColor:
                      "white",
                    padding: "10px",
                    width: "100%",
                    maxWidth: "250px",
                  }}
                />

                <button
                  onClick={() =>
                    createOrder(
                      "Paid ✅"
                    )
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
                    createOrder(
                      "Cash on Delivery"
                    )
                  }
                  style={confirmButton}
                >
                  Confirm Order
                </button>
              </div>
            )}

            <button
              onClick={() => {
                setShowPayment(false)
                setPaymentMethod("")
              }}
              style={{
                marginTop: "20px",
                backgroundColor:
                  "transparent",
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
      
      <ToastContainer
  position="top-right"
  autoClose={2000}
  theme="dark"
/>
    </div>
  )
}

const mainButton = {
  marginTop: "20px",
  padding: "12px 25px",
  backgroundColor: "#c68b59",
  color: "white",
  border: "none",
  borderRadius: "10px",
  cursor: "pointer",
  fontWeight: "bold",
  width: "100%",
}

const qtyButton = {
  width: "35px",
  height: "35px",
  borderRadius: "50%",
  border: "none",
  backgroundColor: "#c68b59",
  color: "white",
  cursor: "pointer",
  fontSize: "18px",
  fontWeight: "bold",
}

const inputStyle = {
  width: "100%",
  padding: "15px",
  marginTop: "15px",
  borderRadius: "10px",
  border: "none",
  outline: "none",
  fontSize: "16px",
  boxSizing: "border-box",
}

const priceRow = {
  display: "flex",
  justifyContent: "space-between",
  marginTop: "15px",
}

const paymentOption = {
  backgroundColor: "#3a261a",
  padding: "15px",
  borderRadius: "12px",
  marginTop: "15px",
  cursor: "pointer",
}

const confirmButton = {
  marginTop: "20px",
  padding: "14px 30px",
  backgroundColor: "#c68b59",
  color: "white",
  border: "none",
  borderRadius: "12px",
  cursor: "pointer",
  fontWeight: "bold",
  width: "100%",
}

const overlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  backgroundColor:
    "rgba(0,0,0,0.7)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1000,
  padding: "20px",
  boxSizing: "border-box",
}

const popupStyle = {
  backgroundColor: "#2c1d14",
  padding: "30px",
  borderRadius: "20px",
  width: "100%",
  maxWidth: "450px",
  textAlign: "center",
}

export default App
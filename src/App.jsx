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
  const [showAdmin, setShowAdmin] = useState(false)
  const [showAdminLoginModal, setShowAdminLoginModal] =
    useState(false)
  const [adminUsername, setAdminUsername] = useState("")
  const [adminPassword, setAdminPassword] = useState("")
  const [adminLoginMessage, setAdminLoginMessage] =
    useState("")
  const [isAdminAuthenticated, setIsAdminAuthenticated] =
    useState(() => localStorage.getItem("isAdminLoggedIn") === "true")
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] =
    useState("All")
  const [lastAddedProduct, setLastAddedProduct] =
    useState(null)
  const [couponCode, setCouponCode] = useState("")
  const [appliedCoupon, setAppliedCoupon] = useState("")
  const [couponMessage, setCouponMessage] = useState("")
  const [showScrollTop, setShowScrollTop] =
    useState(false)
  const [isScrollTopHovered, setIsScrollTopHovered] =
    useState(false)
  const [showReservations, setShowReservations] =
    useState(false)
  const [reservations, setReservations] = useState(() => {
    const savedReservations = localStorage.getItem(
      "teashore-reservations"
    )
    return savedReservations
      ? JSON.parse(savedReservations)
      : []
  })
  const [reservationName, setReservationName] =
    useState("")
  const [reservationPhone, setReservationPhone] =
    useState("")
  const [reservationPeople, setReservationPeople] =
    useState("")
  const [reservationDate, setReservationDate] =
    useState("")
  const [reservationTime, setReservationTime] =
    useState("")
  const [reservationDuration, setReservationDuration] =
    useState("")
  const [reservationMessage, setReservationMessage] =
    useState("")

  const [mobileMenu, setMobileMenu] = useState(false)
  const adminLogoClickTimestampsRef = useRef([])

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
    const handleWindowScroll = () => {
      setShowScrollTop(window.scrollY > 280)
    }

    window.addEventListener("scroll", handleWindowScroll)

    return () =>
      window.removeEventListener(
        "scroll",
        handleWindowScroll
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

  useEffect(() => {
    localStorage.setItem(
      "teashore-reservations",
      JSON.stringify(reservations)
    )
  }, [reservations])

  useEffect(() => {
    if (isAdminAuthenticated) {
      localStorage.setItem("isAdminLoggedIn", "true")
      return
    }
    localStorage.removeItem("isAdminLoggedIn")
  }, [isAdminAuthenticated])

  const homeRef = useRef(null)
  const menuRef = useRef(null)
  const aboutRef = useRef(null)
  const contactRef = useRef(null)

  const scrollToSection = (ref) => {
    setShowOrders(false)
    setShowAdmin(false)
    setShowCheckout(false)
    setShowReservations(false)
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

    setLastAddedProduct(item.name)
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
  const couponDiscountRate =
    appliedCoupon === "TEA20"
      ? 0.2
      : appliedCoupon === "WELCOME10"
      ? 0.1
      : 0
  const discountAmount = Math.round(
    finalTotal * couponDiscountRate
  )
  const discountedTotal = finalTotal - discountAmount

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

  const getRecommendationsForProduct = (
    productName
  ) => {
    if (
      productName === "Masala Tea ☕" ||
      productName === "Cold Coffee 🧋"
    ) {
      return products.filter(
        (item) => item.name === "French Fries 🍟"
      )
    }

    if (productName === "French Fries 🍟") {
      return products.filter(
        (item) =>
          item.name === "Masala Tea ☕" ||
          item.name === "Cold Coffee 🧋"
      )
    }

    return []
  }

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
      total: discountedTotal,
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
    setCouponCode("")
    setAppliedCoupon("")
    setCouponMessage("")

    setShowOrders(true)
  }

  const applyCoupon = () => {
    const normalizedCoupon = couponCode
      .trim()
      .toUpperCase()

    if (
      normalizedCoupon === "TEA20" ||
      normalizedCoupon === "WELCOME10"
    ) {
      setAppliedCoupon(normalizedCoupon)
      setCouponMessage(
        `${normalizedCoupon} applied successfully!`
      )
      return
    }

    setAppliedCoupon("")
    setCouponMessage("Invalid coupon code")
  }

  const getMinutesFromTime = (timeValue) => {
    const [hours, minutes] = timeValue
      .split(":")
      .map(Number)
    return hours * 60 + minutes
  }

  const getTodayDate = () =>
    new Date().toISOString().split("T")[0]

  const canCancelReservation = (reservation) => {
    if (!reservation.createdAt) return false
    const elapsedMs = Date.now() - reservation.createdAt
    return elapsedMs <= 60 * 60 * 1000
  }

  const handleReservationTimeChange = (value) => {
    const isDeleting =
      value.length < reservationTime.length
    const digitsOnly = value
      .replace(/\D/g, "")
      .slice(0, 4)

    if (digitsOnly.length === 0) {
      setReservationTime("")
      return
    }

    if (digitsOnly.length >= 2) {
      const hour = Number(digitsOnly.slice(0, 2))
      if (hour > 23) return
    }

    if (digitsOnly.length >= 3) {
      const firstMinuteDigit = Number(digitsOnly[2])
      if (firstMinuteDigit > 5) return
    }

    if (digitsOnly.length === 4) {
      const minute = Number(digitsOnly.slice(2, 4))
      if (minute > 59) return
    }

    if (isDeleting) {
      if (digitsOnly.length <= 2) {
        setReservationTime(digitsOnly)
        return
      }
      setReservationTime(
        `${digitsOnly.slice(0, 2)}:${digitsOnly.slice(2)}`
      )
      return
    }

    if (digitsOnly.length === 1) {
      const firstHourDigit = Number(digitsOnly)
      if (firstHourDigit >= 3) {
        setReservationTime(`0${digitsOnly}:`)
        return
      }
      setReservationTime(digitsOnly)
      return
    }

    if (digitsOnly.length === 2) {
      setReservationTime(`${digitsOnly}:`)
      return
    }

    setReservationTime(
      `${digitsOnly.slice(0, 2)}:${digitsOnly.slice(2)}`
    )
  }

  const handleBookTable = () => {
    const peopleCount = Number(reservationPeople)
    const durationHours = Number(reservationDuration)
    const openingTimeMinutes = 8 * 60
    const closingTimeMinutes = 23 * 60
    const todayDate = getTodayDate()

    if (reservationName.trim().length < 3) {
      setReservationMessage(
        "Please enter a valid full name"
      )
      return
    }

    if (!/^[0-9]{10}$/.test(reservationPhone)) {
      setReservationMessage(
        "Invalid phone number (must be exactly 10 digits)"
      )
      return
    }

    if (
      !reservationDate ||
      Number.isNaN(durationHours) ||
      durationHours <= 0
    ) {
      setReservationMessage(
        "Invalid reservation timing"
      )
      return
    }

    if (reservationDate !== todayDate) {
      setReservationMessage(
        "Reservations Allowed Only for Today ☕"
      )
      return
    }

    if (
      !/^(?:[01]\d|2[0-3]):[0-5]\d$/.test(
        reservationTime
      )
    ) {
      setReservationMessage(
        "Invalid reservation timing (use 24-hour format, e.g. 14:00)"
      )
      return
    }

    if (
      Number.isNaN(peopleCount) ||
      peopleCount < 1 ||
      peopleCount > 50
    ) {
      setReservationMessage(
        "Invalid members count (allowed: 1 to 50)"
      )
      return
    }

    const totalSeatsForToday = reservations.filter(
      (reservation) => reservation.date === reservationDate
    ).length
    if (totalSeatsForToday >= 12) {
      setReservationMessage(
        "All Reservation Seats Filled for Today ⛔"
      )
      return
    }

    const slotReservations = reservations.filter(
      (reservation) =>
        reservation.date === reservationDate &&
        reservation.time === reservationTime
    ).length
    if (slotReservations >= 6) {
      setReservationMessage(
        "Reservations Full for This Time ⛔"
      )
      return
    }

    const newStart = getMinutesFromTime(reservationTime)
    const newEnd = newStart + durationHours * 60

    if (
      newStart < openingTimeMinutes ||
      newEnd > closingTimeMinutes
    ) {
      setReservationMessage(
        "Invalid reservation timing (Cafe hours: 8:00 AM to 11:00 PM)"
      )
      return
    }

    const hasConflict = reservations.some(
      (reservation) => {
        if (reservation.date !== reservationDate) {
          return false
        }
        const existingStart = getMinutesFromTime(
          reservation.time
        )
        const existingEnd =
          existingStart + reservation.duration * 60
        return (
          newStart < existingEnd &&
          newEnd > existingStart
        )
      }
    )

    if (hasConflict) {
      setReservationMessage(
        "Table Already Reserved for This Time ⛔"
      )
      return
    }

    const newReservation = {
      id:
        "RSV" +
        Math.floor(1000 + Math.random() * 9000),
      name: reservationName.trim(),
      phone: reservationPhone,
      people: peopleCount,
      date: reservationDate,
      time: reservationTime,
      duration: durationHours,
      tablesAllocated: peopleCount >= 8 ? 2 : 1,
      createdAt: Date.now(),
    }

    setReservations((prev) => [newReservation, ...prev])
    setReservationMessage(
      "Table Reserved Successfully ☕"
    )
    setReservationName("")
    setReservationPhone("")
    setReservationPeople("")
    setReservationDate("")
    setReservationTime("")
    setReservationDuration("")
  }

  const handleCancelReservation = (reservationId) => {
    const reservationToCancel = reservations.find(
      (reservation) => reservation.id === reservationId
    )

    if (!reservationToCancel) return

    if (!canCancelReservation(reservationToCancel)) {
      setReservationMessage("Cancellation Time Expired ⛔")
      return
    }

    setReservations((prev) =>
      prev.filter(
        (reservation) => reservation.id !== reservationId
      )
    )
    setReservationMessage("Reservation Cancelled Successfully")
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

  const totalRevenue = orders.reduce(
    (total, order) => total + Number(order.total || 0),
    0
  )
  const activeDeliveries = orders.filter(
    (order) => order.status !== "Delivered ✅"
  ).length
  const recentOrders = orders.slice(0, 6)

  const handleLogoClick = () => {
    const now = Date.now()
    const recentClicks =
      adminLogoClickTimestampsRef.current.filter(
        (timestamp) => now - timestamp <= 1800
      )
    recentClicks.push(now)
    adminLogoClickTimestampsRef.current = recentClicks

    if (recentClicks.length < 5) return

    adminLogoClickTimestampsRef.current = []
    if (isAdminAuthenticated) {
      setShowAdmin(true)
      setShowOrders(false)
      setShowCheckout(false)
      setShowReservations(false)
      return
    }
    setAdminUsername("")
    setAdminPassword("")
    setAdminLoginMessage("")
    setShowAdminLoginModal(true)
  }

  const handleAdminLogin = () => {
    if (
      adminUsername === "admin" &&
      adminPassword === "teashore123"
    ) {
      setIsAdminAuthenticated(true)
      setShowAdmin(true)
      setShowOrders(false)
      setShowCheckout(false)
      setShowReservations(false)
      setAdminLoginMessage("")
      setShowAdminLoginModal(false)
      return
    }
    setAdminLoginMessage("Invalid Admin Credentials ⛔")
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
          onClick={handleLogoClick}
          style={{
            fontSize: "clamp(30px,5vw,42px)",
            cursor: "pointer",
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
                setShowAdmin(false)
                setShowCheckout(false)
                setShowReservations(false)
              }}
            >
              Orders
            </p>

            <p
              onClick={() => {
                setShowOrders(false)
                setShowAdmin(false)
                setShowCheckout(false)
                setShowReservations(true)
              }}
            >
              Reservations
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
              setShowAdmin(false)
              setShowCheckout(false)
              setShowReservations(false)
              setMobileMenu(false)
            }}
          >
            Orders
          </p>

          <p
            onClick={() => {
              setShowOrders(false)
              setShowAdmin(false)
              setShowCheckout(false)
              setShowReservations(true)
              setMobileMenu(false)
            }}
          >
            Reservations
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
      {showAdmin && isAdminAuthenticated ? (
        <div
          style={{
            padding: "40px 7%",
          }}
        >
          <h1
            style={{
              textAlign: "center",
              marginBottom: "30px",
            }}
          >
            Admin Dashboard 📊
          </h1>
          <button
            onClick={() => {
              setIsAdminAuthenticated(false)
              setShowAdmin(false)
            }}
            style={{
              ...mainButton,
              maxWidth: "180px",
              margin: "0 auto 24px auto",
              display: "block",
            }}
          >
            Logout
          </button>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "16px",
              marginBottom: "24px",
            }}
          >
            <div style={adminCardStyle}>
              <p style={adminCardTitleStyle}>Total Orders</p>
              <h2 style={adminCardValueStyle}>{orders.length}</h2>
            </div>
            <div style={adminCardStyle}>
              <p style={adminCardTitleStyle}>Total Revenue</p>
              <h2 style={adminCardValueStyle}>₹{totalRevenue}</h2>
            </div>
            <div style={adminCardStyle}>
              <p style={adminCardTitleStyle}>Active Deliveries</p>
              <h2 style={adminCardValueStyle}>
                {activeDeliveries}
              </h2>
            </div>
            <div style={adminCardStyle}>
              <p style={adminCardTitleStyle}>
                Total Reservations
              </p>
              <h2 style={adminCardValueStyle}>
                {reservations.length}
              </h2>
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "18px",
            }}
          >
            <div
              style={{
                backgroundColor: "#2c1d14",
                border: "1px solid #4a3325",
                borderRadius: "16px",
                padding: "18px",
              }}
            >
              <h2
                style={{
                  marginTop: 0,
                  marginBottom: "14px",
                }}
              >
                Recent Orders
              </h2>
              {recentOrders.length === 0 ? (
                <p style={{ color: "#d2b48c", margin: 0 }}>
                  No Orders Yet
                </p>
              ) : (
                recentOrders.map((order) => (
                  <div
                    key={order.id}
                    style={{
                      backgroundColor: "#24160f",
                      border: "1px solid #4a3325",
                      borderRadius: "12px",
                      padding: "12px",
                      marginBottom: "10px",
                    }}
                  >
                    <p style={{ margin: "0 0 6px 0" }}>
                      <strong>Order ID:</strong> {order.id}
                    </p>
                    <p
                      style={{
                        margin: "0 0 6px 0",
                        color: "#d2b48c",
                      }}
                    >
                      <strong>Payment:</strong>{" "}
                      {order.payment}
                    </p>
                    <p
                      style={{
                        margin: "0 0 6px 0",
                        color: "#d2b48c",
                      }}
                    >
                      <strong>Delivery:</strong>{" "}
                      {order.status}
                    </p>
                    <p
                      style={{
                        margin: 0,
                        color: "#f5d6b3",
                        fontWeight: "bold",
                      }}
                    >
                      <strong>Total:</strong> ₹
                      {order.total}
                    </p>
                  </div>
                ))
              )}
            </div>

            <div
              style={{
                backgroundColor: "#2c1d14",
                border: "1px solid #4a3325",
                borderRadius: "16px",
                padding: "18px",
              }}
            >
              <h2
                style={{
                  marginTop: 0,
                  marginBottom: "14px",
                }}
              >
                Reservations
              </h2>
              {reservations.length === 0 ? (
                <p style={{ color: "#d2b48c", margin: 0 }}>
                  No Reservations Yet
                </p>
              ) : (
                reservations.map((reservation) => (
                  <div
                    key={reservation.id}
                    style={{
                      backgroundColor: "#24160f",
                      border: "1px solid #4a3325",
                      borderRadius: "12px",
                      padding: "12px",
                      marginBottom: "10px",
                    }}
                  >
                    <p style={{ margin: "0 0 6px 0" }}>
                      <strong>Customer:</strong>{" "}
                      {reservation.name}
                    </p>
                    <p
                      style={{
                        margin: "0 0 6px 0",
                        color: "#d2b48c",
                      }}
                    >
                      <strong>Time:</strong>{" "}
                      {reservation.time}
                    </p>
                    <p
                      style={{
                        margin: "0 0 6px 0",
                        color: "#d2b48c",
                      }}
                    >
                      <strong>Members:</strong>{" "}
                      {reservation.people}
                    </p>
                    <p style={{ margin: 0, color: "#f5d6b3" }}>
                      <strong>Tables:</strong>{" "}
                      {reservation.tablesAllocated ?? 1}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      ) : showOrders ? (
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
            <div
              style={{
                width: "100%",
                maxWidth: "620px",
                margin: "0 auto",
                backgroundColor: "#2c1d14",
                border: "1px solid #4a3325",
                borderRadius: "18px",
                padding: "34px 24px",
                textAlign: "center",
                boxSizing: "border-box",
              }}
            >
              <h2
                style={{
                  margin: 0,
                }}
              >
                📦 No Orders Yet
              </h2>
              <p
                style={{
                  marginTop: "12px",
                  marginBottom: 0,
                  color: "#d2b48c",
                  fontSize: "18px",
                }}
              >
                ☕ Your orders will appear here
              </p>
            </div>
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

                  {lastAddedProduct === item.name &&
                    getRecommendationsForProduct(
                      item.name
                    ).length > 0 && (
                      <div
                        style={{
                          marginTop: "16px",
                          paddingTop: "14px",
                          borderTop:
                            "1px solid #4a3325",
                        }}
                      >
                        <p
                          style={{
                            margin: "0 0 12px 0",
                            color: "#f5d6b3",
                            fontWeight: "bold",
                          }}
                        >
                          Recommended For You 🤖
                        </p>

                        <div
                          style={{
                            display: "flex",
                            gap: "10px",
                            flexWrap: "wrap",
                            justifyContent:
                              "center",
                          }}
                        >
                          {getRecommendationsForProduct(
                            item.name
                          ).map((recommendedItem) => (
                            <div
                              key={`inline-recommended-${item.name}-${recommendedItem.name}`}
                              style={{
                                backgroundColor:
                                  "#24160f",
                                border:
                                  "1px solid #4a3325",
                                borderRadius:
                                  "12px",
                                padding: "10px",
                                width: "100%",
                                maxWidth: "220px",
                              }}
                            >
                              <p
                                style={{
                                  margin: 0,
                                  color: "#d2b48c",
                                  fontSize: "12px",
                                }}
                              >
                                AI Pick
                              </p>

                              <p
                                style={{
                                  margin:
                                    "6px 0 4px 0",
                                  fontWeight:
                                    "bold",
                                }}
                              >
                                {
                                  recommendedItem.name
                                }
                              </p>

                              <p
                                style={{
                                  margin: 0,
                                  color: "#d2b48c",
                                }}
                              >
                                ₹
                                {
                                  recommendedItem.price
                                }
                              </p>

                              <button
                                onClick={() =>
                                  addToCart(
                                    recommendedItem
                                  )
                                }
                                style={mainButton}
                              >
                                Add to Cart
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                </div>
              ))}
            </div>

            {/* CART */}
            {cartItems.length > 0 ? (
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
            ) : (
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
                    color: "#d2b48c",
                    fontSize: "18px",
                  }}
                >
                  ☕ Add delicious items from the menu
                </p>
                <button
                  onClick={() =>
                    scrollToSection(menuRef)
                  }
                  style={{
                    ...mainButton,
                    maxWidth: "240px",
                    marginInline: "auto",
                  }}
                >
                  Explore Menu
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
                    `upi://pay?pa=prasadrao02012004-1@oksbi&pn=TeaShore&am=${discountedTotal}&cu=INR`
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

      {showReservations && (
        <div style={overlayStyle}>
          <div
            style={{
              ...popupStyle,
              maxWidth: "620px",
              maxHeight: "85vh",
              overflowY: "auto",
              textAlign: "left",
            }}
          >
            <h2 style={{ textAlign: "center" }}>
              Table Reservations 🍽️
            </h2>

            <input
              type="text"
              placeholder="Full Name"
              value={reservationName}
              onChange={(e) =>
                setReservationName(e.target.value)
              }
              style={inputStyle}
            />

            <input
              type="text"
              placeholder="Phone Number"
              value={reservationPhone}
              onChange={(e) =>
                setReservationPhone(
                  e.target.value
                    .replace(/\D/g, "")
                    .slice(0, 10)
                )
              }
              inputMode="numeric"
              maxLength={10}
              style={inputStyle}
            />

            <input
              type="number"
              placeholder="Number of People"
              min="1"
              max="50"
              value={reservationPeople}
              onChange={(e) => {
                const rawValue = e.target.value
                if (rawValue === "") {
                  setReservationPeople("")
                  return
                }
                const normalizedValue = Math.min(
                  50,
                  Math.max(1, Number(rawValue))
                )
                setReservationPeople(
                  String(normalizedValue)
                )
              }}
              style={inputStyle}
            />

            <input
              type="date"
              value={reservationDate}
              onChange={(e) =>
                setReservationDate(e.target.value)
              }
              min={getTodayDate()}
              max={getTodayDate()}
              style={inputStyle}
            />

            <input
              type="text"
              placeholder="Time (24-hour format, e.g. 14:00)"
              value={reservationTime}
              onChange={(e) =>
                handleReservationTimeChange(
                  e.target.value
                )
              }
              inputMode="numeric"
              maxLength={5}
              style={inputStyle}
            />

            <input
              type="number"
              placeholder="Reservation Duration (hours)"
              min="1"
              step="1"
              value={reservationDuration}
              onChange={(e) =>
                setReservationDuration(
                  e.target.value
                )
              }
              style={inputStyle}
            />

            <button
              onClick={handleBookTable}
              style={mainButton}
            >
              Book Table
            </button>

            {reservationMessage && (
              <p
                style={{
                  marginTop: "12px",
                  marginBottom: 0,
                  color: reservationMessage.includes(
                    "Successfully"
                  )
                    ? "#8be28b"
                    : "#ff8f8f",
                  fontWeight: "bold",
                  textAlign: "center",
                }}
              >
                {reservationMessage}
              </p>
            )}

            <div
              style={{
                marginTop: "24px",
                borderTop: "1px solid #4a3325",
                paddingTop: "18px",
              }}
            >
              <h3
                style={{
                  textAlign: "center",
                  marginTop: 0,
                }}
              >
                Booked Reservations
              </h3>

              {reservations.length === 0 ? (
                <p
                  style={{
                    color: "#d2b48c",
                    textAlign: "center",
                  }}
                >
                  No Reservations Yet
                </p>
              ) : (
                reservations.map((reservation) => (
                  <div
                    key={reservation.id}
                    style={{
                      backgroundColor: "#24160f",
                      border:
                        "1px solid #4a3325",
                      borderRadius: "12px",
                      padding: "12px",
                      marginBottom: "10px",
                    }}
                  >
                    <p style={{ margin: "0 0 6px 0" }}>
                      <strong>
                        {reservation.name}
                      </strong>{" "}
                      • {reservation.people} People
                    </p>
                    <p
                      style={{
                        margin: 0,
                        color: "#d2b48c",
                      }}
                    >
                      {reservation.date} |{" "}
                      {reservation.time} |{" "}
                      {reservation.duration}h | Tables:{" "}
                      {reservation.tablesAllocated ?? 1}
                    </p>
                    <button
                      onClick={() =>
                        handleCancelReservation(
                          reservation.id
                        )
                      }
                      disabled={
                        !canCancelReservation(reservation)
                      }
                      style={{
                        ...mainButton,
                        marginTop: "10px",
                        marginBottom: 0,
                        opacity: canCancelReservation(
                          reservation
                        )
                          ? 1
                          : 0.6,
                        cursor: canCancelReservation(
                          reservation
                        )
                          ? "pointer"
                          : "not-allowed",
                      }}
                    >
                      {canCancelReservation(reservation)
                        ? "Cancel Reservation"
                        : "Cancellation Time Expired ⛔"}
                    </button>
                  </div>
                ))
              )}
            </div>

            <button
              onClick={() => {
                setShowReservations(false)
                setReservationMessage("")
              }}
              style={{
                marginTop: "16px",
                backgroundColor: "transparent",
                border: "none",
                color: "#d2b48c",
                cursor: "pointer",
                width: "100%",
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {showAdminLoginModal && (
        <div style={overlayStyle}>
          <div
            style={{
              ...popupStyle,
              maxWidth: "430px",
            }}
          >
            <h2>Admin Login</h2>

            <input
              type="text"
              placeholder="Username"
              value={adminUsername}
              onChange={(e) =>
                setAdminUsername(e.target.value)
              }
              style={inputStyle}
            />

            <input
              type="password"
              placeholder="Password"
              value={adminPassword}
              onChange={(e) =>
                setAdminPassword(e.target.value)
              }
              style={inputStyle}
            />

            <button
              onClick={handleAdminLogin}
              style={mainButton}
            >
              Login
            </button>

            {adminLoginMessage && (
              <p
                style={{
                  marginTop: "12px",
                  marginBottom: 0,
                  color: "#ff8f8f",
                  fontWeight: "bold",
                }}
              >
                {adminLoginMessage}
              </p>
            )}

            <button
              onClick={() => {
                setShowAdminLoginModal(false)
                setAdminLoginMessage("")
              }}
              style={{
                marginTop: "14px",
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

      {showScrollTop && (
        <button
          onClick={() =>
            window.scrollTo({
              top: 0,
              behavior: "smooth",
            })
          }
          onMouseEnter={() =>
            setIsScrollTopHovered(true)
          }
          onMouseLeave={() =>
            setIsScrollTopHovered(false)
          }
          aria-label="Scroll to top"
          style={{
            position: "fixed",
            right: isMobile ? "16px" : "24px",
            bottom: isMobile ? "18px" : "28px",
            width: isMobile ? "48px" : "54px",
            height: isMobile ? "48px" : "54px",
            borderRadius: "50%",
            border: "1px solid #8a5a35",
            background:
              "linear-gradient(135deg, #f0b56e, #c68b59)",
            color: "#1a120b",
            fontSize: isMobile ? "20px" : "22px",
            cursor: "pointer",
            zIndex: 1200,
            boxShadow: isScrollTopHovered
              ? "0 0 18px rgba(240, 181, 110, 0.45)"
              : "0 8px 18px rgba(0, 0, 0, 0.35)",
            transform: isScrollTopHovered
              ? "translateY(-2px)"
              : "translateY(0)",
            transition: "all 0.2s ease",
          }}
        >
          ⬆️
        </button>
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

const adminCardStyle = {
  backgroundColor: "#2c1d14",
  border: "1px solid #4a3325",
  borderRadius: "14px",
  padding: "16px",
}

const adminCardTitleStyle = {
  margin: "0 0 8px 0",
  color: "#d2b48c",
}

const adminCardValueStyle = {
  margin: 0,
}

export default App
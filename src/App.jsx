import { useState, useRef, useEffect } from "react"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

import Navbar from "./components/Navbar"
import Checkout from "./components/Checkout"
import Orders from "./components/Orders"
import Reservation from "./components/Reservation"
import Home from "./pages/Home"
import Admin from "./pages/Admin"

function App() {
  // ===== CART STATE =====
  const [cartItems, setCartItems] = useState(() => {
    // For cafe QR mode, load cart only if a table session already exists
    const tableFromQuery = new URLSearchParams(window.location.search).get("table")
    if (tableFromQuery) {
      const savedSessions = localStorage.getItem("teashore-table-sessions")
      const sessions = savedSessions ? JSON.parse(savedSessions) : []
      const existingSession = sessions.find(
        (session) =>
          session.tableNumber === Number(tableFromQuery) &&
          session.status !== "Closed"
      )
      if (existingSession) {
        const sessionCart = localStorage.getItem(`teashore-cart-${existingSession.id}`)
        return sessionCart ? JSON.parse(sessionCart) : []
      }
      return []
    }
    // Default: load global cart for delivery mode
    const savedCart = localStorage.getItem("teashore-cart")
    return savedCart ? JSON.parse(savedCart) : []
  })

  // ===== ORDERS STATE =====
  const [orders, setOrders] = useState(() => {
    const savedOrders = localStorage.getItem("teashore-orders")
    return savedOrders ? JSON.parse(savedOrders) : []
  })

  // ===== TABLE SESSIONS STATE =====
  const [tableSessions, setTableSessions] = useState(() => {
    const savedSessions = localStorage.getItem("teashore-table-sessions")
    return savedSessions ? JSON.parse(savedSessions) : []
  })

  // ===== RESERVATIONS STATE =====
  const [reservations, setReservations] = useState(() => {
    const savedReservations = localStorage.getItem("teashore-reservations")
    return savedReservations ? JSON.parse(savedReservations) : []
  })

  // ===== UI STATE =====
  const [showCheckout, setShowCheckout] = useState(false)
  const [showPayment, setShowPayment] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState("")
  const [showOrders, setShowOrders] = useState(false)
  const [showAdmin, setShowAdmin] = useState(false)
  const [showAdminLoginModal, setShowAdminLoginModal] = useState(false)
  const [showReservations, setShowReservations] = useState(false)
  const [mobileMenu, setMobileMenu] = useState(false)
  const [showOrderSuccess, setShowOrderSuccess] = useState(false)

  // ===== CHECKOUT FORM STATE =====
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [address, setAddress] = useState("")
  const [city, setCity] = useState("")
  const [pincode, setPincode] = useState("")

  // ===== ADMIN STATE =====
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(() =>
    localStorage.getItem("isAdminLoggedIn") === "true"
  )
  const [adminUsername, setAdminUsername] = useState("")
  const [adminPassword, setAdminPassword] = useState("")
  const [adminLoginMessage, setAdminLoginMessage] = useState("")

  // ===== COUPON STATE =====
  const [couponCode, setCouponCode] = useState("")
  const [appliedCoupon, setAppliedCoupon] = useState("")
  const [couponMessage, setCouponMessage] = useState("")

  // ===== SEARCH & FILTER STATE =====
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [lastAddedProduct, setLastAddedProduct] = useState(null)

  // ===== ORDER TRACKING STATE =====
  const [selectedOrder, setSelectedOrder] = useState(null)

  // ===== RESERVATION FORM STATE =====
  const [reservationName, setReservationName] = useState("")
  const [reservationPhone, setReservationPhone] = useState("")
  const [reservationPeople, setReservationPeople] = useState("")
  const [reservationDate, setReservationDate] = useState("")
  const [reservationTime, setReservationTime] = useState("")
  const [reservationDuration, setReservationDuration] = useState("")
  const [reservationMessage, setReservationMessage] = useState("")
  const [tableAvailabilityMessage, setTableAvailabilityMessage] = useState("")

  // ===== TABLE SESSION STATE =====
  const [currentTableSessionId, setCurrentTableSessionId] = useState(null)
  const [showActiveTableSessionPopup, setShowActiveTableSessionPopup] = useState(false)

  // ===== SCROLL & RESPONSIVE STATE =====
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)
  const [showScrollTop, setShowScrollTop] = useState(false)
  const [isScrollTopHovered, setIsScrollTopHovered] = useState(false)

  // ===== REFS =====
  const homeRef = useRef(null)
  const menuRef = useRef(null)
  const aboutRef = useRef(null)
  const contactRef = useRef(null)
  const checkoutRef = useRef(null)
  const lastShownPopupSessionRef = useRef(null)
  const adminLogoClickTimestampsRef = useRef([])

  // ===== QR ORDERING DETECTION =====
  const detectedTableNumber = (() => {
    const tableFromQuery = new URLSearchParams(window.location.search).get("table")
    if (!tableFromQuery) return null
    const parsedTableNumber = Number(tableFromQuery)
    if (!Number.isInteger(parsedTableNumber) || parsedTableNumber < 1) return null
    return parsedTableNumber
  })()
  const isCafeQrOrderingMode = detectedTableNumber !== null

  // ===== USEEFFECTS =====
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Clear sessionStorage on page load to allow popup to show on refresh
  useEffect(() => {
    if (isCafeQrOrderingMode && detectedTableNumber !== null) {
      const existingSession = tableSessions.find(
        (session) =>
          session.tableNumber === detectedTableNumber &&
          session.status !== "Closed"
      )
      if (existingSession) {
        sessionStorage.removeItem(`teashore-popup-shown-${existingSession.id}`)
      }
    }
  }, [])

  useEffect(() => {
    const handleWindowScroll = () => {
      setShowScrollTop(window.scrollY > 280)
    }
    window.addEventListener("scroll", handleWindowScroll)
    return () => window.removeEventListener("scroll", handleWindowScroll)
  }, [])

  useEffect(() => {
    if (isCafeQrOrderingMode) {
      if (currentTableSessionId) {
        localStorage.setItem(`teashore-cart-${currentTableSessionId}`, JSON.stringify(cartItems))
      }
      return
    }

    // In delivery mode, save to global cart
    localStorage.setItem("teashore-cart", JSON.stringify(cartItems))
  }, [cartItems, isCafeQrOrderingMode, currentTableSessionId])

  useEffect(() => {
    localStorage.setItem("teashore-orders", JSON.stringify(orders))
  }, [orders])

  useEffect(() => {
    localStorage.setItem("teashore-table-sessions", JSON.stringify(tableSessions))
  }, [tableSessions])

  useEffect(() => {
    localStorage.setItem("teashore-reservations", JSON.stringify(reservations))
  }, [reservations])

  useEffect(() => {
    calculateTableAvailability()
  }, [reservationDate, reservationTime, reservationPeople, reservationDuration, reservations])

  useEffect(() => {
    if (isAdminAuthenticated) {
      localStorage.setItem("isAdminLoggedIn", "true")
      return
    }
    localStorage.removeItem("isAdminLoggedIn")
  }, [isAdminAuthenticated])

  useEffect(() => {
    if (!isCafeQrOrderingMode || detectedTableNumber === null) {
      setCurrentTableSessionId(null)
      setShowActiveTableSessionPopup(false)
      lastShownPopupSessionRef.current = null
      return
    }

    const existingSession = tableSessions.find(
      (session) =>
        session.tableNumber === detectedTableNumber &&
        session.status !== "Closed"
    )

    if (existingSession) {
      setCurrentTableSessionId(existingSession.id)

      // Load existing session's cart (if any) and restore same running bill
      const sessionCart = localStorage.getItem(`teashore-cart-${existingSession.id}`)
      if (sessionCart) {
        setCartItems(JSON.parse(sessionCart))
      } else {
        setCartItems([])
      }

      // Restore customer info if exists in session
      if (existingSession.customerName) {
        setName(existingSession.customerName)
      }
      if (existingSession.customerPhone) {
        setPhone(existingSession.customerPhone)
      }

      if (existingSession.status === "Active") {
        // Check if this session has any orders placed
        const sessionHasOrders = orders.some(
          (order) => order.tableSessionId === existingSession.id
        )

        // Show popup on page refresh/re-entry ONLY if session has orders AND not showing order success screen
        if (sessionHasOrders && !showOrderSuccess) {
          const sessionStorageKey = `teashore-popup-shown-${existingSession.id}`
          const alreadyShownInThisSession = sessionStorage.getItem(sessionStorageKey)
          
          if (!alreadyShownInThisSession && lastShownPopupSessionRef.current !== existingSession.id) {
            setShowActiveTableSessionPopup(true)
            lastShownPopupSessionRef.current = existingSession.id
            sessionStorage.setItem(sessionStorageKey, "true")
          }
        } else {
          setShowActiveTableSessionPopup(false)
        }

        // In QR mode with active session, show checkout to continue adding items (unless showing success screen)
        if (!showOrderSuccess) {
          setShowCheckout(true)
        }
      } else {
        // Pending table session has no active bill yet
        setShowActiveTableSessionPopup(false)
        setShowCheckout(false)
      }
      return
    }

    // No existing session, create a new pending one until first order is placed
    const newSessionId = "TBL" + Math.floor(10000 + Math.random() * 90000)
    const newSession = {
      id: newSessionId,
      tableNumber: detectedTableNumber,
      status: "Pending",
      createdAt: Date.now(),
      closedAt: null,
    }
    setTableSessions((prev) => [newSession, ...prev])
    setCurrentTableSessionId(newSessionId)
    setShowActiveTableSessionPopup(false)
    lastShownPopupSessionRef.current = null
    // New session starts empty and at home
    setShowCheckout(false)
    setCartItems([])
  }, [isCafeQrOrderingMode, detectedTableNumber, tableSessions])

  // ===== PRICE CALCULATIONS =====
  const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0)
  const deliveryFee = cartItems.length > 0 ? 40 : 0
  const finalTotal = totalPrice + deliveryFee
  const couponDiscountRate =
    appliedCoupon === "TEA20" ? 0.2 : appliedCoupon === "WELCOME10" ? 0.1 : 0
  const discountAmount = Math.round(finalTotal * couponDiscountRate)
  const discountedTotal = finalTotal - discountAmount

  // ===== CART FUNCTIONS =====
  const addToCart = (item) => {
    const existingItem = cartItems.find((cartItem) => cartItem.name === item.name)

    if (existingItem) {
      setCartItems(
        cartItems.map((cartItem) =>
          cartItem.name === item.name
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        )
      )
    } else {
      setCartItems([...cartItems, { ...item, quantity: 1 }])
    }

    // Show different toast for QR cafe mode during active table session
    if (isCafeQrOrderingMode && currentTableSessionId) {
      const existingSession = tableSessions.find(
        (session) => session.id === currentTableSessionId && session.status === "Active"
      )
      if (existingSession) {
        toast.success("☕ Added to Running Table Bill", {
          position: "top-right",
          autoClose: 2000,
          theme: "dark",
        })
        setLastAddedProduct(item.name)
        return
      }
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
        item.name === name ? { ...item, quantity: item.quantity + 1 } : item
      )
    )
  }

  const decreaseQuantity = (name) => {
    setCartItems(
      cartItems
        .map((item) =>
          item.name === name ? { ...item, quantity: item.quantity - 1 } : item
        )
        .filter((item) => item.quantity > 0)
    )
  }

  // ===== FORM VALIDATION =====
  const validateForm = () => {
    if (name.trim().length < 3) {
      alert("Please enter valid full name")
      return false
    }

    if (!/^[0-9]{10}$/.test(phone)) {
      alert("Phone number must be 10 digits")
      return false
    }

    if (isCafeQrOrderingMode) {
      return true
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

  // ===== ORDER CREATION =====
  const createOrder = (paidStatus) => {
    let orderSessionId = currentTableSessionId

    if (isCafeQrOrderingMode) {
      if (!orderSessionId) {
        // Create a new session when first cafe QR order is placed
        orderSessionId = "TBL" + Math.floor(10000 + Math.random() * 90000)
        const newSession = {
          id: orderSessionId,
          tableNumber: detectedTableNumber,
          status: "Active",
          customerName: name,
          customerPhone: phone,
          createdAt: Date.now(),
          closedAt: null,
        }
        setTableSessions((prev) => [newSession, ...prev])
        setCurrentTableSessionId(orderSessionId)
      } else {
        const matchedSession = tableSessions.find((session) => session.id === orderSessionId)
        if (!matchedSession || matchedSession.status === "Closed") {
          alert("This table session is closed. Please scan QR again for a new session.")
          return
        }

        if (matchedSession.status !== "Active") {
          // Activate pending session on first order and store customer info
          setTableSessions((prevSessions) =>
            prevSessions.map((session) =>
              session.id === orderSessionId
                ? { ...session, status: "Active", customerName: name, customerPhone: phone }
                : session
            )
          )
        } else {
          // Update customer info if changed during continued session
          setTableSessions((prevSessions) =>
            prevSessions.map((session) =>
              session.id === orderSessionId
                ? { ...session, customerName: name, customerPhone: phone }
                : session
            )
          )
        }
      }
    }

    const orderId = "TS" + Math.floor(1000 + Math.random() * 9000)

    const orderTotal = isCafeQrOrderingMode ? totalPrice : discountedTotal

    const newOrder = {
      id: orderId,
      items: cartItems,
      total: orderTotal,
      payment: paidStatus,
      name,
      phone,
      address,
      city,
      pincode,
      tableNumber: isCafeQrOrderingMode ? detectedTableNumber : null,
      tableSessionId: isCafeQrOrderingMode ? orderSessionId : null,
      status: "Preparing ☕",
      time: new Date().toLocaleTimeString(),
    }

    setOrders((prev) => [newOrder, ...prev])

    // Show toast for QR cafe order placement
    if (isCafeQrOrderingMode) {
      toast.success(`🎉 Table ${detectedTableNumber} Order Placed Successfully`, {
        position: "top-right",
        autoClose: 3000,
        theme: "dark",
      })
    }

    if (isCafeQrOrderingMode && orderSessionId) {
      setTableSessions((prevSessions) =>
        prevSessions.map((session) => {
          if (session.id !== orderSessionId) return session
          if (session.status === "Closed") return session
          return {
            ...session,
            status:
              paidStatus === "Paid ✅" || session.status === "Paid"
                ? "Paid"
                : "Active",
          }
        })
      )
    }

    setTimeout(() => {
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId
            ? { ...order, status: isCafeQrOrderingMode ? "Ready for Serving 🍽️" : "Out for Delivery 🚚" }
            : order
        )
      )
    }, 60000)

    setTimeout(() => {
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId
            ? { ...order, status: isCafeQrOrderingMode ? "Served to Table ✅" : "Reached Your Destination 📍" }
            : order
        )
      )
    }, 120000)

    setTimeout(() => {
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId
            ? { ...order, status: isCafeQrOrderingMode ? "Completed 🎉" : "Delivered ✅" }
            : order
        )
      )
    }, 180000)

    setShowPayment(false)
    setShowCheckout(false)
    
    // Show order success screen
    setShowOrderSuccess(true)
    
    // In QR cafe mode, keep items for running bill; in delivery mode, clear cart
    if (!isCafeQrOrderingMode) {
      setCartItems([])
    }

    // Clear form fields
    setName("")
    setPhone("")
    setAddress("")
    setCity("")
    setPincode("")
    setCouponCode("")
    setAppliedCoupon("")
    setCouponMessage("")
  }

  // ===== RESERVATION FUNCTIONS =====
  const getTodayDate = () => new Date().toISOString().split("T")[0]

  const getTomorrowDate = () => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    return tomorrow.toISOString().split("T")[0]
  }

  const getCurrentTimeInMinutes = () => {
    const now = new Date()
    return now.getHours() * 60 + now.getMinutes()
  }

  const handleBookTable = () => {
    const peopleCount = Number(reservationPeople)
    const durationHours = Number(reservationDuration)
    const openingTimeMinutes = 8 * 60
    const closingTimeMinutes = 23 * 60
    const todayDate = getTodayDate()
    const tomorrowDate = getTomorrowDate()

    if (reservationName.trim().length < 3) {
      setReservationMessage("Please enter a valid full name")
      return
    }

    if (!/^[0-9]{10}$/.test(reservationPhone)) {
      setReservationMessage("Invalid phone number (must be exactly 10 digits)")
      return
    }

    if (!reservationDate || Number.isNaN(durationHours) || durationHours <= 0) {
      setReservationMessage("Invalid reservation timing")
      return
    }

    if (reservationDate !== todayDate && reservationDate !== tomorrowDate) {
      setReservationMessage("Reservations Allowed Only for Today or Tomorrow ☕")
      return
    }

    if (!/^(?:[01]\d|2[0-3]):[0-5]\d$/.test(reservationTime)) {
      setReservationMessage(
        "Invalid reservation timing (use 24-hour format, e.g. 14:00)"
      )
      return
    }

    if (reservationDate === todayDate) {
      const getMinutesFromTime = (timeValue) => {
        const [hours, minutes] = timeValue.split(":").map(Number)
        return hours * 60 + minutes
      }

      const reservationTimeInMinutes = getMinutesFromTime(reservationTime)
      const currentTimeInMinutes = getCurrentTimeInMinutes()

      if (reservationTimeInMinutes <= currentTimeInMinutes) {
        setReservationMessage("Reservation time must be in the future ⏰")
        return
      }
    }

    if (Number.isNaN(peopleCount) || peopleCount < 1 || peopleCount > 50) {
      setReservationMessage("Invalid members count (allowed: 1 to 50)")
      return
    }

    const getMinutesFromTime = (timeValue) => {
      const [hours, minutes] = timeValue.split(":").map(Number)
      return hours * 60 + minutes
    }

    const newStart = getMinutesFromTime(reservationTime)
    const newEnd = newStart + durationHours * 60

    if (newStart < openingTimeMinutes || newEnd > closingTimeMinutes) {
      setReservationMessage(
        "Invalid reservation timing (Cafe hours: 8:00 AM to 11:00 PM)"
      )
      return
    }

    // Calculate tables required for new reservation
    const newReservationTables = peopleCount <= 7 ? 1 : Math.ceil((peopleCount - 7) / 6) + 1

    // Calculate total tables occupied by overlapping reservations
    const overlappingReservations = reservations.filter((reservation) => {
      if (reservation.date !== reservationDate) {
        return false
      }
      const existingStart = getMinutesFromTime(reservation.time)
      const existingEnd = existingStart + reservation.duration * 60
      return newStart < existingEnd && newEnd > existingStart
    })

    const occupiedTables = overlappingReservations.reduce(
      (total, reservation) => total + (reservation.tablesAllocated ?? 1),
      0
    )

    // Check if total tables would exceed capacity (8 tables)
    if (occupiedTables + newReservationTables > 8) {
      setReservationMessage("Reservations Full During This Time ⛔ Please Choose Another Time")
      return
    }

    const newReservation = {
      id: "RSV" + Math.floor(1000 + Math.random() * 9000),
      name: reservationName.trim(),
      phone: reservationPhone,
      people: peopleCount,
      date: reservationDate,
      time: reservationTime,
      duration: durationHours,
      tablesAllocated: peopleCount <= 7 ? 1 : Math.ceil((peopleCount - 7) / 6) + 1,
      createdAt: Date.now(),
    }

    setReservations((prev) => [newReservation, ...prev])
    setReservationMessage("Table Reserved Successfully ☕")
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

    const canCancel = (() => {
      if (!reservationToCancel.createdAt) return false
      const elapsedMs = Date.now() - reservationToCancel.createdAt
      return elapsedMs <= 60 * 60 * 1000
    })()

    if (!canCancel) {
      setReservationMessage("Cancellation Time Expired ⛔")
      return
    }

    setReservations((prev) =>
      prev.filter((reservation) => reservation.id !== reservationId)
    )
    setReservationMessage("Reservation Cancelled Successfully")
  }

  const calculateTableAvailability = () => {
    const peopleCount = Number(reservationPeople)
    const durationHours = Number(reservationDuration)

    // Reset message if required fields are missing
    if (!reservationDate || !reservationTime || !peopleCount || !durationHours) {
      setTableAvailabilityMessage("")
      return
    }

    // Validate time format
    if (!/^(?:[01]\d|2[0-3]):[0-5]\d$/.test(reservationTime)) {
      setTableAvailabilityMessage("")
      return
    }

    const getMinutesFromTime = (timeValue) => {
      const [hours, minutes] = timeValue.split(":").map(Number)
      return hours * 60 + minutes
    }

    const newStart = getMinutesFromTime(reservationTime)
    const newEnd = newStart + durationHours * 60

    // Calculate tables required for new reservation
    const newReservationTables = peopleCount <= 7 ? 1 : Math.ceil((peopleCount - 7) / 6) + 1

    // Calculate total tables occupied by overlapping reservations
    const overlappingReservations = reservations.filter((reservation) => {
      if (reservation.date !== reservationDate) {
        return false
      }
      const existingStart = getMinutesFromTime(reservation.time)
      const existingEnd = existingStart + reservation.duration * 60
      return newStart < existingEnd && newEnd > existingStart
    })

    const occupiedTables = overlappingReservations.reduce(
      (total, reservation) => total + (reservation.tablesAllocated ?? 1),
      0
    )

    const remainingTables = 8 - occupiedTables

    if (remainingTables >= newReservationTables) {
      setTableAvailabilityMessage(`${remainingTables} Tables Remaining for This Time ☕`)
    } else {
      setTableAvailabilityMessage("No Tables Available During This Time ⛔")
    }
  }

  // ===== ADMIN FUNCTIONS =====
  const handleLogoClick = () => {
    const now = Date.now()
    const recentClicks = adminLogoClickTimestampsRef.current.filter(
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
    if (adminUsername === "admin" && adminPassword === "teashore123") {
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

  const handleCloseTable = (sessionId) => {
    // Get table number before closing for toast message
    const sessionToClose = tableSessions.find((session) => session.id === sessionId)
    const tableNumber = sessionToClose?.tableNumber

    // Clear the session's cart from localStorage
    localStorage.removeItem(`teashore-cart-${sessionId}`)
    
    // Fully remove the session from the array instead of just marking as Closed
    setTableSessions((prevSessions) =>
      prevSessions.filter((session) => session.id !== sessionId)
    )
    
    // Reset popup tracking for this session to allow fresh popup on next QR scan
    if (lastShownPopupSessionRef.current === sessionId) {
      lastShownPopupSessionRef.current = null
    }
    
    // If this is the current table session, reset it and clear its cart
    if (currentTableSessionId === sessionId) {
      setCurrentTableSessionId(null)
      setShowActiveTableSessionPopup(false)
      setShowCheckout(false)
      setCartItems([])
    }

    // Show toast for table closure
    if (tableNumber) {
      toast.success(`✅ Table ${tableNumber} Closed Successfully`, {
        position: "top-right",
        autoClose: 3000,
        theme: "dark",
      })
    }
  }

  const handleMarkPaymentPaid = (sessionId) => {
    // Get table number for toast message
    const sessionToMark = tableSessions.find((session) => session.id === sessionId)
    const tableNumber = sessionToMark?.tableNumber

    // Update session status to Paid
    setTableSessions((prevSessions) =>
      prevSessions.map((session) =>
        session.id === sessionId
          ? { ...session, status: "Paid" }
          : session
      )
    )

    // Show toast for payment marked as paid
    if (tableNumber) {
      toast.success(`💰 Payment Marked as Paid`, {
        position: "top-right",
        autoClose: 3000,
        theme: "dark",
      })
    }
  }

  // ===== NAVIGATION FUNCTIONS =====
  const scrollToSection = (ref) => {
    setShowOrders(false)
    setShowAdmin(false)
    setShowCheckout(false)
    setShowReservations(false)
    setMobileMenu(false)

    ref.current.scrollIntoView({ behavior: "smooth" })
  }

  const handleNavigate = (type = "") => {
    if (type === "reservations") {
      setShowReservations(true)
      setShowOrders(false)
      setShowAdmin(false)
      setShowCheckout(false)
      setMobileMenu(false)
    } else {
      setShowOrders(true)
      setShowAdmin(false)
      setShowCheckout(false)
      setShowReservations(false)
      setMobileMenu(false)
    }
  }

  const handleContinueTableSession = () => {
    // Explicitly restore the cart from the current session
    if (currentTableSessionId) {
      const sessionCart = localStorage.getItem(`teashore-cart-${currentTableSessionId}`)
      if (sessionCart) {
        setCartItems(JSON.parse(sessionCart))
      }
    }
    
    setShowActiveTableSessionPopup(false)
    setShowCheckout(true)
    
    // Show toast notification for continuing session
    toast.warn("⚠️ Continuing Existing Table Session", {
      position: "top-right",
      autoClose: 3000,
      theme: "dark",
    })
    
    // Ensure checkout is visible and scrolled into view
    setTimeout(() => {
      if (checkoutRef.current) {
        checkoutRef.current.scrollIntoView({ behavior: "smooth" })
      }
    }, 100)
  }

  const handleContinueOrdering = () => {
    setShowOrderSuccess(false)
    setShowCheckout(false)
    // Scroll to top/menu section
    setTimeout(() => {
      if (homeRef.current) {
        homeRef.current.scrollIntoView({ behavior: "smooth" })
      }
    }, 100)
  }

  // ===== RENDER =====
  return (
    <div
      style={{
        backgroundColor: "#1a120b",
        minHeight: "100vh",
        color: "white",
        fontFamily: "Arial",
      }}
    >
      <Navbar
        isMobile={isMobile}
        mobileMenu={mobileMenu}
        setMobileMenu={setMobileMenu}
        cartItems={cartItems}
        onLogoClick={handleLogoClick}
        onNavigate={handleNavigate}
        onScrollToSection={scrollToSection}
        homeRef={homeRef}
        menuRef={menuRef}
        aboutRef={aboutRef}
        contactRef={contactRef}
      />

      {showAdmin && isAdminAuthenticated ? (
        <Admin
          show={true}
          isAuthenticated={isAdminAuthenticated}
          orders={orders}
          reservations={reservations}
          tableSessions={tableSessions}
          onLogout={() => {
            setIsAdminAuthenticated(false)
            setShowAdmin(false)
          }}
          onCloseTable={handleCloseTable}
          onMarkPaymentPaid={handleMarkPaymentPaid}
          showLoginModal={false}
          adminUsername={adminUsername}
          setAdminUsername={setAdminUsername}
          adminPassword={adminPassword}
          setAdminPassword={setAdminPassword}
          onLogin={handleAdminLogin}
          adminLoginMessage={adminLoginMessage}
          onCloseLoginModal={() => {
            setShowAdminLoginModal(false)
            setAdminLoginMessage("")
          }}
        />
      ) : showOrders ? (
        <Orders
          orders={orders}
          selectedOrder={selectedOrder}
          setSelectedOrder={setSelectedOrder}
        />
      ) : showOrderSuccess ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "60vh",
            padding: "40px 20px",
            textAlign: "center",
          }}
        >
          <h1
            style={{
              fontSize: "clamp(32px, 6vw, 48px)",
              marginBottom: "20px",
            }}
          >
            🎉 Order Placed Successfully
          </h1>
          <p
            style={{
              color: "#d2b48c",
              fontSize: "clamp(18px, 4vw, 24px)",
              marginBottom: "40px",
            }}
          >
            Your order is being prepared ☕
          </p>
          <button
            onClick={handleContinueOrdering}
            style={{
              padding: "16px 32px",
              backgroundColor: "#c68b59",
              color: "white",
              border: "none",
              borderRadius: "12px",
              cursor: "pointer",
              fontWeight: "bold",
              fontSize: "18px",
              transition: "transform 0.2s",
            }}
            onMouseOver={(e) => {
              e.target.style.transform = "scale(1.05)"
            }}
            onMouseOut={(e) => {
              e.target.style.transform = "scale(1)"
            }}
          >
            Continue Ordering
          </button>
        </div>
      ) : !showCheckout ? (
        <Home
          homeRef={homeRef}
          menuRef={menuRef}
          aboutRef={aboutRef}
          contactRef={contactRef}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          lastAddedProduct={lastAddedProduct}
          cartItems={cartItems}
          increaseQuantity={increaseQuantity}
          decreaseQuantity={decreaseQuantity}
          finalTotal={finalTotal}
          addToCart={addToCart}
          onExploreMenu={() => scrollToSection(menuRef)}
          onCheckout={() => setShowCheckout(true)}
          onScrollToSection={scrollToSection}
        />
      ) : (
        <div ref={checkoutRef}>
          <Checkout
            cartItems={cartItems}
            totalPrice={totalPrice}
            deliveryFee={deliveryFee}
            finalTotal={finalTotal}
            couponDiscountRate={couponDiscountRate}
            discountAmount={discountAmount}
            discountedTotal={discountedTotal}
            name={name}
            setName={setName}
            phone={phone}
            setPhone={setPhone}
            address={address}
            setAddress={setAddress}
            city={city}
            setCity={setCity}
            pincode={pincode}
            setPincode={setPincode}
            couponCode={couponCode}
            setCouponCode={setCouponCode}
            appliedCoupon={appliedCoupon}
            setAppliedCoupon={setAppliedCoupon}
            couponMessage={couponMessage}
            setCouponMessage={setCouponMessage}
            isCafeQrOrderingMode={isCafeQrOrderingMode}
            detectedTableNumber={detectedTableNumber}
            onPayNow={() => {
              if (validateForm()) {
                if (isCafeQrOrderingMode) {
                  createOrder("Pending")
                } else {
                  setShowPayment(true)
                }
              }
            }}
            showPayment={showPayment}
            paymentMethod={paymentMethod}
            setPaymentMethod={setPaymentMethod}
            onCreate={createOrder}
            onCancel={() => {
              setShowPayment(false)
              setPaymentMethod("")
            }}
          />
        </div>
      )}

      {showActiveTableSessionPopup && isCafeQrOrderingMode && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", backgroundColor: "rgba(0,0,0,0.7)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000, padding: "20px", boxSizing: "border-box" }}>
          <div style={{ backgroundColor: "#2c1d14", padding: "30px", borderRadius: "20px", width: "100%", maxWidth: "450px", textAlign: "center" }}>
            <h2 style={{ marginTop: 0, marginBottom: "14px" }}>
              ⚠️ Table {detectedTableNumber} Already Has an Active Order
            </h2>
            <p style={{ color: "#d2b48c", marginTop: 0 }}>
              Continue with the same table session.
            </p>
            <button
              onClick={handleContinueTableSession}
              style={{
                marginTop: "20px",
                padding: "12px 25px",
                backgroundColor: "#c68b59",
                color: "white",
                border: "none",
                borderRadius: "10px",
                cursor: "pointer",
                fontWeight: "bold",
                width: "100%",
              }}
            >
              Continue Ordering
            </button>
          </div>
        </div>
      )}

      <Reservation
        show={showReservations}
        onClose={() => {
          setShowReservations(false)
          setReservationMessage("")
        }}
        reservationName={reservationName}
        setReservationName={setReservationName}
        reservationPhone={reservationPhone}
        setReservationPhone={setReservationPhone}
        reservationPeople={reservationPeople}
        setReservationPeople={setReservationPeople}
        reservationDate={reservationDate}
        setReservationDate={setReservationDate}
        reservationTime={reservationTime}
        setReservationTime={setReservationTime}
        reservationDuration={reservationDuration}
        setReservationDuration={setReservationDuration}
        reservations={reservations}
        onBookTable={handleBookTable}
        onCancelReservation={handleCancelReservation}
        reservationMessage={reservationMessage}
        tableAvailabilityMessage={tableAvailabilityMessage}
      />

      {cartItems.length > 0 && !showCheckout && !showOrders && !showAdmin && (
        <div
          style={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: "#2c1d14",
            borderTop: "2px solid #c68b59",
            padding: isMobile ? "12px 16px" : "16px 20px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: isMobile ? "10px" : "15px",
            flexWrap: isMobile ? "wrap" : "nowrap",
            zIndex: 1100,
            boxShadow: "0 -4px 12px rgba(0, 0, 0, 0.3)",
            boxSizing: "border-box",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: isMobile ? "8px" : "12px", minWidth: isMobile ? "auto" : "fit-content" }}>
            <span style={{ fontSize: isMobile ? "16px" : "18px" }}>🛒</span>
            <div>
              <div style={{ fontWeight: "bold", fontSize: isMobile ? "14px" : "16px" }}>
                {cartItems.reduce((sum, item) => sum + item.quantity, 0)} items
              </div>
              <div style={{ color: "#d2b48c", fontSize: isMobile ? "12px" : "14px" }}>
                Total: ₹{discountedTotal}
              </div>
            </div>
          </div>
          <button
            onClick={() => {
              setShowCheckout(true)
              setTimeout(() => {
                checkoutRef.current?.scrollIntoView({ behavior: "smooth" })
              }, 100)
            }}
            style={{
              backgroundColor: "#c68b59",
              color: "white",
              border: "none",
              borderRadius: "8px",
              padding: isMobile ? "10px 14px" : "12px 20px",
              fontSize: isMobile ? "14px" : "16px",
              fontWeight: "bold",
              cursor: "pointer",
              transition: "background-color 0.2s ease",
              whiteSpace: "nowrap",
              flex: isMobile ? "1 1 auto" : "0 0 auto",
              minWidth: isMobile ? "100px" : "auto",
            }}
            onMouseEnter={(e) => (e.target.style.backgroundColor = "#a67c52")}
            onMouseLeave={(e) => (e.target.style.backgroundColor = "#c68b59")}
          >
            Proceed →
          </button>
        </div>
      )}

      {showAdminLoginModal && !isAdminAuthenticated && (
        <Admin
          show={true}
          isAuthenticated={false}
          orders={orders}
          reservations={reservations}
          tableSessions={tableSessions}
          onLogout={() => {}}
          onCloseTable={() => {}}
          showLoginModal={true}
          adminUsername={adminUsername}
          setAdminUsername={setAdminUsername}
          adminPassword={adminPassword}
          setAdminPassword={setAdminPassword}
          onLogin={handleAdminLogin}
          adminLoginMessage={adminLoginMessage}
          onCloseLoginModal={() => {
            setShowAdminLoginModal(false)
            setAdminLoginMessage("")
          }}
        />
      )}

      {showScrollTop && (
        <button
          onClick={() =>
            window.scrollTo({ top: 0, behavior: "smooth" })
          }
          onMouseEnter={() => setIsScrollTopHovered(true)}
          onMouseLeave={() => setIsScrollTopHovered(false)}
          aria-label="Scroll to top"
          style={{
            position: "fixed",
            right: isMobile ? "16px" : "24px",
            bottom: cartItems.length > 0 ? (isMobile ? "90px" : "100px") : (isMobile ? "18px" : "28px"),
            width: isMobile ? "48px" : "54px",
            height: isMobile ? "48px" : "54px",
            borderRadius: "50%",
            border: "1px solid #8a5a35",
            background: "linear-gradient(135deg, #f0b56e, #c68b59)",
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

export default App

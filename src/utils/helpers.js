export const getRecommendationsForProduct = (productName, products) => {
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

export const getMinutesFromTime = (timeValue) => {
  const [hours, minutes] = timeValue
    .split(":")
    .map(Number)
  return hours * 60 + minutes
}

export const getTodayDate = () =>
  new Date().toISOString().split("T")[0]

export const canCancelReservation = (reservation) => {
  if (!reservation.createdAt) return false
  const elapsedMs = Date.now() - reservation.createdAt
  return elapsedMs <= 60 * 60 * 1000
}

export const getTrackingStepIndex = (status) => {
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

export const products = [
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

export const trackingSteps = [
  "Preparing ☕",
  "Out for Delivery 🚚",
  "Reached Destination 📍",
  "Delivered ✅",
]

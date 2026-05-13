import { useRef } from "react"

function Navbar({
  isMobile,
  mobileMenu,
  setMobileMenu,
  cartItems,
  onLogoClick,
  onNavigate,
  onScrollToSection,
  homeRef,
  menuRef,
  aboutRef,
  contactRef,
}) {
  const handleScroll = (ref) => {
    onScrollToSection(ref)
  }

  return (
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
        onClick={onLogoClick}
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
          <p onClick={() => handleScroll(homeRef)}>
            Home
          </p>

          <p onClick={() => handleScroll(menuRef)}>
            Menu
          </p>

          <p onClick={() => handleScroll(aboutRef)}>
            About
          </p>

          <p onClick={() => handleScroll(contactRef)}>
            Contact
          </p>

          <p
            onClick={() => {
              onNavigate()
              setMobileMenu(false)
            }}
          >
            Orders
          </p>

          <p
            onClick={() => {
              onNavigate("reservations")
              setMobileMenu(false)
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

      {/* MOBILE MENU */}
      {mobileMenu && isMobile && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            backgroundColor: "#24160f",
            padding: "30px",
            display: "flex",
            flexDirection: "column",
            gap: "25px",
            fontSize: "22px",
            zIndex: 999,
          }}
        >
          <p onClick={() => handleScroll(homeRef)}>
            Home
          </p>

          <p onClick={() => handleScroll(menuRef)}>
            Menu
          </p>

          <p onClick={() => handleScroll(aboutRef)}>
            About
          </p>

          <p onClick={() => handleScroll(contactRef)}>
            Contact
          </p>

          <p
            onClick={() => {
              onNavigate()
              setMobileMenu(false)
            }}
          >
            Orders
          </p>

          <p
            onClick={() => {
              onNavigate("reservations")
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
    </div>
  )
}

export default Navbar

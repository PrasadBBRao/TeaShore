import { mainButton, overlayStyle, popupStyle, adminCardStyle, adminCardTitleStyle, adminCardValueStyle } from "../utils/styles"

function Admin({
  show,
  isAuthenticated,
  orders,
  reservations,
  tableSessions,
  onLogout,
  onCloseTable,
  showLoginModal,
  adminUsername,
  setAdminUsername,
  adminPassword,
  setAdminPassword,
  onLogin,
  adminLoginMessage,
  onCloseLoginModal,
}) {
  if (!show) return null
  
  if (showLoginModal && !isAuthenticated) {
    return (
      <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", backgroundColor: "rgba(0,0,0,0.7)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000, padding: "20px", boxSizing: "border-box" }}>
        <div
          style={{
            backgroundColor: "#2c1d14",
            padding: "30px",
            borderRadius: "20px",
            width: "100%",
            maxWidth: "430px",
            textAlign: "center",
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
            style={{
              width: "100%",
              padding: "15px",
              marginTop: "15px",
              borderRadius: "10px",
              border: "none",
              outline: "none",
              fontSize: "16px",
              boxSizing: "border-box",
            }}
          />

          <input
            type="password"
            placeholder="Password"
            value={adminPassword}
            onChange={(e) =>
              setAdminPassword(e.target.value)
            }
            style={{
              width: "100%",
              padding: "15px",
              marginTop: "15px",
              borderRadius: "10px",
              border: "none",
              outline: "none",
              fontSize: "16px",
              boxSizing: "border-box",
            }}
          />

          <button
            onClick={onLogin}
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
            onClick={onCloseLoginModal}
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
    )
  }
  
  if (!isAuthenticated) return null

  const totalRevenue = orders.reduce(
    (total, order) => total + Number(order.total || 0),
    0
  )
  const activeDeliveries = orders.filter(
    (order) => order.status !== "Delivered ✅"
  ).length
  const recentOrders = orders.slice(0, 6)

  return (
    <>
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
          onClick={onLogout}
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
            <p style={adminCardTitleStyle}>
              Total Orders
            </p>
            <h2 style={adminCardValueStyle}>
              {orders.length}
            </h2>
          </div>
          <div style={adminCardStyle}>
            <p style={adminCardTitleStyle}>
              Total Revenue
            </p>
            <h2 style={adminCardValueStyle}>
              ₹{totalRevenue}
            </h2>
          </div>
          <div style={adminCardStyle}>
            <p style={adminCardTitleStyle}>
              Active Deliveries
            </p>
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
              <p
                style={{
                  color: "#d2b48c",
                  margin: 0,
                }}
              >
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
                  <p
                    style={{ margin: "0 0 6px 0" }}
                  >
                    <strong>Order ID:</strong>{" "}
                    {order.id}
                  </p>
                  <p
                    style={{
                      margin: "0 0 6px 0",
                      color: "#d2b48c",
                    }}
                  >
                    <strong>Table:</strong>{" "}
                    {order.tableNumber ?? "Delivery"}
                  </p>
                  <p
                    style={{
                      margin: "0 0 6px 0",
                      color: "#d2b48c",
                    }}
                  >
                    <strong>Order Details:</strong>{" "}
                    {order.items
                      .map(
                        (item) =>
                          `${item.name} x${item.quantity}`
                      )
                      .join(", ")}
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
              <p
                style={{
                  color: "#d2b48c",
                  margin: 0,
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
                    border: "1px solid #4a3325",
                    borderRadius: "12px",
                    padding: "12px",
                    marginBottom: "10px",
                  }}
                >
                  <p
                    style={{ margin: "0 0 6px 0" }}
                  >
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
                  <p
                    style={{
                      margin: 0,
                      color: "#f5d6b3",
                    }}
                  >
                    <strong>Tables:</strong>{" "}
                    {reservation.tablesAllocated ?? 1}
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
              Table Sessions
            </h2>
            {tableSessions.length === 0 ? (
              <p
                style={{
                  color: "#d2b48c",
                  margin: 0,
                }}
              >
                No Table Sessions Yet
              </p>
            ) : (
              tableSessions.map((session) => (
                <div
                  key={session.id}
                  style={{
                    backgroundColor: "#24160f",
                    border: "1px solid #4a3325",
                    borderRadius: "12px",
                    padding: "12px",
                    marginBottom: "10px",
                  }}
                >
                  <p
                    style={{ margin: "0 0 6px 0" }}
                  >
                    <strong>Table:</strong>{" "}
                    {session.tableNumber}
                  </p>
                  <p
                    style={{
                      margin: "0 0 6px 0",
                      color: "#d2b48c",
                    }}
                  >
                    <strong>Status:</strong>{" "}
                    {session.status}
                  </p>
                  <p
                    style={{
                      margin: "0 0 6px 0",
                      color: "#d2b48c",
                    }}
                  >
                    <strong>Session ID:</strong>{" "}
                    {session.id}
                  </p>
                  {session.status !== "Closed" && (
                    <button
                      onClick={() =>
                        onCloseTable(session.id)
                      }
                      style={mainButton}
                    >
                      Close Table
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* ADMIN LOGIN MODAL */}
      {showLoginModal && (
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
              style={{
                width: "100%",
                padding: "15px",
                marginTop: "15px",
                borderRadius: "10px",
                border: "none",
                outline: "none",
                fontSize: "16px",
                boxSizing: "border-box",
              }}
            />

            <input
              type="password"
              placeholder="Password"
              value={adminPassword}
              onChange={(e) =>
                setAdminPassword(e.target.value)
              }
              style={{
                width: "100%",
                padding: "15px",
                marginTop: "15px",
                borderRadius: "10px",
                border: "none",
                outline: "none",
                fontSize: "16px",
                boxSizing: "border-box",
              }}
            />

            <button
              onClick={onLogin}
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
              onClick={onCloseLoginModal}
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
    </>
  )
}

export default Admin

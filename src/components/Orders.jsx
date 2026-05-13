import { getTrackingStepIndex, isQrCafeOrder, getTrackingStepsForOrder } from "../utils/helpers"

function Orders({ orders, selectedOrder, setSelectedOrder }) {
  return (
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
                justifyContent: "space-between",
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
                  borderTop: "1px solid #4a3325",
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
                    <strong>Address:</strong>{" "}
                    {order.address},{" "}
                    {order.city}
                  </p>

                  <p>
                    <strong>Payment:</strong>{" "}
                    {order.payment}
                  </p>

                  <div
                    style={{
                      marginTop: "6px",
                      backgroundColor: "#23170f",
                      border: "1px solid #4a3325",
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
                      {getTrackingStepsForOrder(order).map(
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
                                getTrackingStepsForOrder(order).length -
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

                    {isQrCafeOrder(order) && order.status === "Pending" && (
                      <p style={{ marginTop: "12px", marginBottom: 0, color: "#c68b59", fontStyle: "italic", fontSize: "14px" }}>
                        ⏱️ Estimated Preparation Time: 10-15 mins
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  )
}

export default Orders

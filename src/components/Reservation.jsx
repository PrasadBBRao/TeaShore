import { inputStyle, mainButton, overlayStyle, popupStyle, confirmButton } from "../utils/styles"
import {
  getMinutesFromTime,
  getTodayDate,
  canCancelReservation,
} from "../utils/helpers"

function Reservation({
  show,
  onClose,
  reservationName,
  setReservationName,
  reservationPhone,
  setReservationPhone,
  reservationPeople,
  setReservationPeople,
  reservationDate,
  setReservationDate,
  reservationTime,
  setReservationTime,
  reservationDuration,
  setReservationDuration,
  reservations,
  onBookTable,
  onCancelReservation,
  reservationMessage,
  tableAvailabilityMessage,
  showReservationPayment,
  reservationPaymentMethod,
  setReservationPaymentMethod,
  onConfirmReservationPayment,
  pendingReservationData,
  onCancelReservationPayment,
  showCancelReasonModal,
  selectedCancelReason,
  setSelectedCancelReason,
  onConfirmCancelReservation,
  onModifyReservation,
  onCancelReasonModal,
  isModifyingReservation,
  onSaveModifiedReservation,
}) {
  const handleReservationTimeChange = (value) => {
    const isDeleting = value.length < reservationTime.length
    const digitsOnly = value.replace(/\D/g, "").slice(0, 4)

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

  const calculateTablesAllocated = (peopleCount) => {
    const count = Number(peopleCount)
    if (Number.isNaN(count) || count < 1) return 1
    return count <= 7 ? 1 : Math.ceil((count - 7) / 6) + 1
  }

  const tablesAllocated = calculateTablesAllocated(reservationPeople)
  const reservationAdvance = tablesAllocated * 100

  if (!show) return null

  const isMobile = window.innerWidth < 768

  return (
    <div style={overlayStyle}>
      <div
        style={{
          ...popupStyle,
          maxWidth: isMobile ? "90vw" : "620px",
          maxHeight: "90vh",
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
            setReservationPeople(String(normalizedValue))
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
          max={(() => {
            const tomorrow = new Date()
            tomorrow.setDate(tomorrow.getDate() + 1)
            return tomorrow.toISOString().split("T")[0]
          })()}
          style={inputStyle}
        />

        <input
          type="text"
          placeholder="Time (24-hour format, e.g. 14:00)"
          value={reservationTime}
          onChange={(e) =>
            handleReservationTimeChange(e.target.value)
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
            setReservationDuration(e.target.value)
          }
          style={inputStyle}
        />

        {reservationPeople && !isModifyingReservation && (
          <p
            style={{
              marginTop: "12px",
              marginBottom: "8px",
              color: "#d2b48c",
              fontWeight: "bold",
              textAlign: "center",
              fontSize: "16px",
            }}
          >
            Reservation Advance: ₹{reservationAdvance}
          </p>
        )}

        {isModifyingReservation ? (
          <button
            onClick={onSaveModifiedReservation}
            style={mainButton}
          >
            Save Modified Reservation
          </button>
        ) : (
          <button
            onClick={onBookTable}
            style={mainButton}
          >
            Confirm & Pay Reservation
          </button>
        )}

        {tableAvailabilityMessage && (
          <p
            style={{
              marginTop: "12px",
              marginBottom: 0,
              color: tableAvailabilityMessage.includes("No Tables")
                ? "#ff8f8f"
                : "#8be28b",
              fontWeight: "bold",
              textAlign: "center",
            }}
          >
            {tableAvailabilityMessage}
          </p>
        )}

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
                  border: "1px solid #4a3325",
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
                    onCancelReservation(reservation.id)
                  }
                  disabled={
                    !canCancelReservation(reservation)
                  }
                  style={{
                    ...mainButton,
                    marginTop: "10px",
                    marginBottom: 0,
                    opacity: canCancelReservation(reservation)
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
          onClick={onClose}
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

      {/* RESERVATION PAYMENT POPUP */}
      {showReservationPayment && pendingReservationData && (
        <div style={overlayStyle}>
          <div style={popupStyle}>
            <h2>Select Payment Method</h2>

            <p
              style={{
                marginTop: "15px",
                color: "#d2b48c",
                textAlign: "center",
              }}
            >
              Reservation Advance: ₹{pendingReservationData.advanceAmount}
            </p>

            <div
              onClick={() =>
                setReservationPaymentMethod("UPI")
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

            {reservationPaymentMethod === "UPI" && (
              <div>
                <img
                  src={`https://quickchart.io/qr?text=${encodeURIComponent(
                    `upi://pay?pa=prasadrao02012004-1@oksbi&pn=TeaShore&am=${pendingReservationData.advanceAmount}&cu=INR`
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
                    onConfirmReservationPayment("Paid ✅")
                  }
                  style={confirmButton}
                >
                  Confirm Payment
                </button>
              </div>
            )}

            <button
              onClick={onCancelReservationPayment}
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

      {/* CANCELLATION REASON MODAL */}
      {showCancelReasonModal && (
        <div style={overlayStyle}>
          <div style={popupStyle}>
            <h2 style={{ textAlign: "center" }}>
              Why are you cancelling?
            </h2>

            {(() => {
              const reservation = reservations.find(r => r.id === pendingCancelReservationId)
              if (!reservation) return null
              const elapsedMs = Date.now() - (reservation.createdAt || 0)
              const isWithinOneHour = elapsedMs <= 60 * 60 * 1000
              return (
                <p
                  style={{
                    marginTop: "15px",
                    marginBottom: "15px",
                    color: isWithinOneHour ? "#8be28b" : "#ff8f8f",
                    fontWeight: "bold",
                    textAlign: "center",
                    fontSize: "14px",
                  }}
                >
                  {isWithinOneHour
                    ? "Advance Eligible For Refund ✅"
                    : "Advance Amount Non-Refundable Due To Late Cancellation ⛔"}
                </p>
              )
            })()}

            <div
              onClick={() => setSelectedCancelReason("Change of Plans")}
              style={{
                backgroundColor: selectedCancelReason === "Change of Plans" ? "#4a3325" : "#3a261a",
                padding: "15px",
                borderRadius: "12px",
                marginTop: "15px",
                cursor: "pointer",
                border: selectedCancelReason === "Change of Plans" ? "2px solid #d2b48c" : "none",
              }}
            >
              Change of Plans
            </div>

            <div
              onClick={() => setSelectedCancelReason("Running Late")}
              style={{
                backgroundColor: selectedCancelReason === "Running Late" ? "#4a3325" : "#3a261a",
                padding: "15px",
                borderRadius: "12px",
                marginTop: "15px",
                cursor: "pointer",
                border: selectedCancelReason === "Running Late" ? "2px solid #d2b48c" : "none",
              }}
            >
              Running Late
            </div>

            <div
              onClick={() => setSelectedCancelReason("Found Another Place")}
              style={{
                backgroundColor: selectedCancelReason === "Found Another Place" ? "#4a3325" : "#3a261a",
                padding: "15px",
                borderRadius: "12px",
                marginTop: "15px",
                cursor: "pointer",
                border: selectedCancelReason === "Found Another Place" ? "2px solid #d2b48c" : "none",
              }}
            >
              Found Another Place
            </div>

            <div
              onClick={() => setSelectedCancelReason("Wrong Booking Details")}
              style={{
                backgroundColor: selectedCancelReason === "Wrong Booking Details" ? "#4a3325" : "#3a261a",
                padding: "15px",
                borderRadius: "12px",
                marginTop: "15px",
                cursor: "pointer",
                border: selectedCancelReason === "Wrong Booking Details" ? "2px solid #d2b48c" : "none",
              }}
            >
              Wrong Booking Details
            </div>

            <div
              onClick={() => setSelectedCancelReason("Emergency / Personal Reason")}
              style={{
                backgroundColor: selectedCancelReason === "Emergency / Personal Reason" ? "#4a3325" : "#3a261a",
                padding: "15px",
                borderRadius: "12px",
                marginTop: "15px",
                cursor: "pointer",
                border: selectedCancelReason === "Emergency / Personal Reason" ? "2px solid #d2b48c" : "none",
              }}
            >
              Emergency / Personal Reason
            </div>

            {selectedCancelReason === "Wrong Booking Details" ? (
              <button
                onClick={onModifyReservation}
                style={{
                  ...mainButton,
                  marginTop: "20px",
                }}
              >
                Modify Reservation
              </button>
            ) : (
              <button
                onClick={onConfirmCancelReservation}
                disabled={!selectedCancelReason}
                style={{
                  ...mainButton,
                  marginTop: "20px",
                  opacity: selectedCancelReason ? 1 : 0.5,
                  cursor: selectedCancelReason ? "pointer" : "not-allowed",
                }}
              >
                Cancel Reservation
              </button>
            )}

            <button
              onClick={onCancelReasonModal}
              style={{
                marginTop: "15px",
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
    </div>
  )
}

export default Reservation

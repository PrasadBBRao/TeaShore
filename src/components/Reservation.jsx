import { inputStyle, mainButton, overlayStyle, popupStyle } from "../utils/styles"
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

  if (!show) return null

  return (
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

        <button
          onClick={onBookTable}
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
    </div>
  )
}

export default Reservation

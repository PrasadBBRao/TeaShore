import { mainButton } from "../utils/styles"
import { products, getRecommendationsForProduct } from "../utils/helpers"
import Cart from "../components/Cart"

function Home({
  homeRef,
  menuRef,
  aboutRef,
  contactRef,
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  lastAddedProduct,
  cartItems,
  increaseQuantity,
  decreaseQuantity,
  finalTotal,
  addToCart,
  onExploreMenu,
  onCheckout,
  onScrollToSection,
}) {
  const filteredProducts = products.filter((item) => {
    const matchesSearch = item.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
    const matchesCategory =
      selectedCategory === "All" ||
      item.category === selectedCategory

    return matchesSearch && matchesCategory
  })

  return (
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
            fontSize: "clamp(42px,9vw,75px)",
            lineHeight: "1.2",
          }}
        >
          Welcome to TeaShore ☕
        </h1>

        <p
          style={{
            color: "#d2b48c",
            fontSize: "clamp(18px,4vw,28px)",
            marginTop: "20px",
          }}
        >
          Fresh Tea • Cozy Ambience • Smart Ordering
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
            {["All", "Tea", "Drinks", "Snacks"].map(
              (category) => (
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
              )
            )}
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
                onClick={() => addToCart(item)}
                style={mainButton}
              >
                Add to Cart
              </button>

              {lastAddedProduct === item.name &&
                getRecommendationsForProduct(
                  item.name,
                  products
                ).length > 0 && (
                  <div
                    style={{
                      marginTop: "16px",
                      paddingTop: "14px",
                      borderTop: "1px solid #4a3325",
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
                        justifyContent: "center",
                      }}
                    >
                      {getRecommendationsForProduct(
                        item.name,
                        products
                      ).map((recommendedItem) => (
                        <div
                          key={`inline-recommended-${item.name}-${recommendedItem.name}`}
                          style={{
                            backgroundColor: "#24160f",
                            border: "1px solid #4a3325",
                            borderRadius: "12px",
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
                              margin: "6px 0 4px 0",
                              fontWeight: "bold",
                            }}
                          >
                            {recommendedItem.name}
                          </p>

                          <p
                            style={{
                              margin: 0,
                              color: "#d2b48c",
                            }}
                          >
                            ₹{recommendedItem.price}
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
        <Cart
          cartItems={cartItems}
          increaseQuantity={increaseQuantity}
          decreaseQuantity={decreaseQuantity}
          finalTotal={finalTotal}
          onCheckout={onCheckout}
          menuRef={menuRef}
          onExploreMenu={onExploreMenu}
        />
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
          TeaShore is a smart cafe ordering platform
          for seamless ordering experience.
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
          <p>✉️ teashorecafe@gmail.com</p>
        </div>
      </div>
    </>
  )
}

export default Home

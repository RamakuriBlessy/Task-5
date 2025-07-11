document.addEventListener("DOMContentLoaded", () => {
  const products = [
    { name: "Stylish Hoodie", price: 999, category: "Clothing", img: "hoodie.png" },
    { name: "Trendy Watch", price: 1999, category: "Accessories", img: "watch.png" },
    { name: "Sneakers", price: 1299, category: "Footwear", img: "sneakers.png" },
    { name: "Leather Jacket", price: 2999, category: "Clothing", img: "jacket.png" },
    { name: "Backpack", price: 799, category: "Accessories", img: "backpack.png" },
    { name: "Running Shoes", price: 1599, category: "Footwear", img: "runningshoes.png" },
    { name: "Cap", price: 399, category: "Accessories", img: "cap.png" },
    { name: "T-Shirt", price: 499, category: "Clothing", img: "t-shirt.png" },
    { name: "Denim Jeans", price: 1099, category: "Clothing", img: "denimjeans.png" },
    { name: "Smart Glasses", price: 2599, category: "Accessories", img: "smartglasses.png" }
  ];

  let cartItems = [];
  let favoriteItems = [];
  let cartCount = 0;

  const grid = document.getElementById("productGrid");
  const favGrid = document.getElementById("favoritesGrid");
  const input = document.getElementById("searchInput");
  const categoryFilter = document.getElementById("categoryFilter");
  const priceSort = document.getElementById("priceSort");
  const cartDisplay = document.getElementById("cartCount");

  const contactSection = document.querySelector(".contact");
  const productSection = document.querySelector(".products");
  const heroSection = document.querySelector(".hero");
  const favSection = document.querySelector(".favorites");

  const detailPanel = document.getElementById("productDetail");
  const detailImg = document.getElementById("detailImg");
  const detailName = document.getElementById("detailName");
  const detailPrice = document.getElementById("detailPrice");
  const detailDesc = document.getElementById("detailDesc");
  const detailAddCart = document.getElementById("detailAddCart");
  const detailAddFav = document.getElementById("detailAddFav");
  const closeDetail = document.getElementById("closeDetail");

  const loginTrigger = document.getElementById("loginTrigger");
  const authModal = document.getElementById("authModal");
  const closeAuth = document.getElementById("closeAuth");
  const authTitle = document.getElementById("authTitle");
  const authEmail = document.getElementById("authEmail");
  const authPassword = document.getElementById("authPassword");
  const authConfirm = document.getElementById("authConfirm");
  const authForm = document.getElementById("authForm");
  const switchMode = document.querySelector(".switch-mode");
  const toggleAuthText = document.getElementById("toggleAuthText");

  const toast = document.getElementById("toast");

  // 🍔 Hamburger Menu Toggle
  const menuToggle = document.getElementById("menuToggle");
  const navList = document.getElementById("navList");
  menuToggle.onclick = () => {
    navList.classList.toggle("show-nav");
  };

  let isLogin = true;

  function showToast(message) {
    toast.textContent = message;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 3000);
  }

  function openProductDetail(product) {
    detailImg.src = product.img;
    detailName.textContent = product.name;
    detailPrice.textContent = `₹${product.price}`;
    detailDesc.textContent = "This is a beautiful and trendy product you'll love.";

    detailAddCart.onclick = () => {
      cartItems.push(product);
      cartCount++;
      cartDisplay.textContent = `🛒 ${cartCount}`;
      showToast(`${product.name} added to cart 🛒`);
    };

    detailAddFav.textContent = favoriteItems.includes(product) ? '❤️' : '🤍';
    detailAddFav.onclick = () => {
      if (favoriteItems.includes(product)) {
        favoriteItems = favoriteItems.filter(p => p !== product);
        detailAddFav.textContent = '🤍';
        showToast(`${product.name} removed from favorites ❌`);
      } else {
        favoriteItems.push(product);
        detailAddFav.textContent = '❤️';
        showToast(`${product.name} added to favorites 💖`);
      }
    };

    detailPanel.classList.add("show");
  }

  closeDetail.onclick = () => detailPanel.classList.remove("show");

  function displayProducts(filterText = "", category = "All") {
    grid.innerHTML = "";
    productSection.style.display = "block";
    heroSection.style.display = "block";
    contactSection.style.display = "none";
    favSection.style.display = "none";
    detailPanel.classList.remove("show");

    let filtered = products.filter(p => {
      const matchText = p.name.toLowerCase().includes(filterText.toLowerCase());
      const matchCategory = category === "All" || p.category === category;
      return matchText && matchCategory;
    });

    if (priceSort.value === "low") filtered.sort((a, b) => a.price - b.price);
    else if (priceSort.value === "high") filtered.sort((a, b) => b.price - a.price);

    if (filtered.length === 0) {
      grid.innerHTML = "<p>No products found.</p>";
      return;
    }

    filtered.forEach(product => {
      const card = document.createElement("div");
      card.className = "product-card";
      const isFav = favoriteItems.includes(product);
      card.innerHTML = `
        <img src="${product.img}" alt="${product.name}" class="viewDetail" loading="lazy">
        <h3 class="viewDetail">${product.name}</h3>
        <p>₹${product.price}</p>
        <button class="addToCart">Add to Cart</button>
        <button class="fav-btn ${isFav ? 'active' : ''}">${isFav ? '❤️' : '🤍'}</button>
      `;
      card.querySelector(".addToCart").onclick = () => {
        cartItems.push(product);
        cartCount++;
        cartDisplay.textContent = `🛒 ${cartCount}`;
        showToast(`${product.name} added to cart 🛒`);
      };
      card.querySelector(".fav-btn").onclick = (e) => {
        const btn = e.target;
        if (favoriteItems.includes(product)) {
          favoriteItems = favoriteItems.filter(p => p !== product);
          btn.classList.remove("active");
          btn.textContent = "🤍";
          showToast(`${product.name} removed from favorites ❌`);
        } else {
          favoriteItems.push(product);
          btn.classList.add("active");
          btn.textContent = "❤️";
          showToast(`${product.name} added to favorites 💖`);
        }
      };
      card.querySelectorAll(".viewDetail").forEach(el => {
        el.onclick = () => openProductDetail(product);
      });
      grid.appendChild(card);
    });
  }

  function displayCartItems() {
    grid.innerHTML = "";
    heroSection.style.display = "none";
    contactSection.style.display = "none";
    favSection.style.display = "none";
    productSection.style.display = "block";
    detailPanel.classList.remove("show");

    if (cartItems.length === 0) {
      grid.innerHTML = "<p>Your cart is empty.</p>";
      return;
    }

    cartItems.forEach((product, index) => {
      const card = document.createElement("div");
      card.className = "product-card";
      card.innerHTML = `
        <img src="${product.img}" alt="${product.name}">
        <h3>${product.name}</h3>
        <p>₹${product.price}</p>
        <button class="removeFromCart">Remove ❌</button>
      `;
      card.querySelector(".removeFromCart").onclick = () => {
        cartItems.splice(index, 1);
        cartCount--;
        cartDisplay.textContent = `🛒 ${cartCount}`;
        displayCartItems();
        showToast(`${product.name} removed from cart ❌`);
      };
      grid.appendChild(card);
    });
  }

  function displayFavorites() {
    favGrid.innerHTML = "";
    favSection.style.display = "block";
    productSection.style.display = "none";
    contactSection.style.display = "none";
    heroSection.style.display = "none";
    detailPanel.classList.remove("show");

    if (favoriteItems.length === 0) {
      favGrid.innerHTML = "<p>No favorites yet.</p>";
      return;
    }

    favoriteItems.forEach(product => {
      const card = document.createElement("div");
      card.className = "product-card";
      card.innerHTML = `
        <img src="${product.img}" alt="${product.name}">
        <h3>${product.name}</h3>
        <p>₹${product.price}</p>
        <button class="removeFav">Remove ❌</button>
      `;
      card.querySelector(".removeFav").onclick = () => {
        favoriteItems = favoriteItems.filter(p => p !== product);
        displayFavorites();
        showToast(`${product.name} removed from favorites ❌`);
      };
      favGrid.appendChild(card);
    });
  }

  // Event Listeners
  input.oninput = () => displayProducts(input.value, categoryFilter.value);
  categoryFilter.onchange = () => displayProducts(input.value, categoryFilter.value);
  priceSort.onchange = () => displayProducts(input.value, categoryFilter.value);

  document.getElementById("toggleMode").onclick = () => {
    document.body.classList.toggle("dark-mode");
  };

  document.getElementById("scrollToTop").onclick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  document.getElementById("contactForm").onsubmit = (e) => {
    e.preventDefault();
    const name = document.getElementById("contactName").value.trim();
    const email = document.getElementById("contactEmail").value.trim();
    const message = document.getElementById("contactMessage").value.trim();
    if (!name || !email || !message) {
      showToast("Please fill in all fields ❗");
      return;
    }
    showToast(`Thank you, ${name}! Message received 💌`);
    e.target.reset();
  };

  document.querySelector('a[href="#contact"]').onclick = (e) => {
    e.preventDefault();
    contactSection.style.display = "block";
    heroSection.style.display = "none";
    productSection.style.display = "none";
    favSection.style.display = "none";
    detailPanel.classList.remove("show");
    contactSection.scrollIntoView({ behavior: "smooth" });
  };

  document.querySelector('a[href="#home"]').onclick = (e) => {
    e.preventDefault();
    displayProducts(input.value, categoryFilter.value);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  document.getElementById("favLink").onclick = (e) => {
    e.preventDefault();
    displayFavorites();
  };

  cartDisplay.onclick = () => displayCartItems();

  // 🔐 Login/Signup Modal
  loginTrigger.onclick = () => {
    authModal.classList.add("show");
    isLogin = true;
    authTitle.textContent = "Login";
    authConfirm.style.display = "none";
    toggleAuthText.innerHTML = `Don't have an account? <span class="switch-mode">Sign up</span>`;
  };

  closeAuth.onclick = () => {
    authModal.classList.remove("show");
    authForm.reset();
  };

  document.body.addEventListener("click", (e) => {
    if (e.target.classList.contains("switch-mode")) {
      isLogin = !isLogin;
      authTitle.textContent = isLogin ? "Login" : "Sign Up";
      authConfirm.style.display = isLogin ? "none" : "block";
      toggleAuthText.innerHTML = isLogin
        ? `Don't have an account? <span class="switch-mode">Sign up</span>`
        : `Already have an account? <span class="switch-mode">Login</span>`;
    }
  });

  authForm.onsubmit = (e) => {
    e.preventDefault();
    const email = authEmail.value;
    const password = authPassword.value;
    const confirm = authConfirm.value;

    if (!isLogin && password !== confirm) {
      showToast("Passwords do not match ❌");
      return;
    }

    showToast(isLogin ? "Logged in successfully ✅" : "Signed up successfully 🎉");
    authModal.classList.remove("show");
    authForm.reset();
  };

  // Initial load
  displayProducts();
});

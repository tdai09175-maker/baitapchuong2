// console.log("MiniShop: main.js đã được nạp");
// let price = 250000;

// typeof price; // "number"

// price = "hai trăm"; // không lỗi: biến đổi sang kiểu chuỗi

// typeof price; // "string"


// const SHOP = "MiniShop";

// // SHOP = "Khác"; // lỗi: không được gán lại hằng

// 7 / 2; // 3.5 (không phải 3 như phép chia nguyên trong C)

// Math.floor(7 / 2); // 3


// "5" == 5; // true (tự chuyển kiểu rồi mới so sánh)

// "5" === 5; // false (so sánh cả kiểu lẫn giá trị)
// "5" + 5; // "55" (dấu + nối chuỗi)

// Number("5") + 5; // 10


// let tenSanPham = "Chuột M1";

// `Sản phẩm: ${tenSanPham}`; // "Sản phẩm: Chuột M1"


// ===== 1. Hàm tiện ích =====

// Định dạng số thành tiền Việt: 250000 -> "250.000 đ"
function formatPrice(amount) {
    return amount.toLocaleString("vi-VN") + " đ";
}

// // ===== Thí nghiệm (sẽ xóa ở cuối lab) =====
// const products = [
//     { id: 1, name: "Chuột không dây M1", price: 250000 },
//     { id: 2, name: "Bàn phím cơ K2", price: 790000 },
//     { id: 3, name: "Tai nghe Bluetooth T3", price: 450000 },
// ];

// console.log(products.length); // 3
// console.log(products[0].name); // Chuột không dây M1

// // Cách 1: vòng for kiểu C
// let total = 0;
// for (let i = 0; i < products.length; i++) {
//     total += products[i].price;
// }
// console.log("Tổng:", formatPrice(total));

// // Cách 2: for...of, không cần biến chỉ số
// for (const product of products) {
//     console.log(`${product.name}: ${formatPrice(product.price)}`);
// }

// // Cách 3: forEach, truyền một hàm vào để gọi cho từng phần tử
// products.forEach(function (product) {
//     console.log(product.id, product.name);
// });

// // Thêm phần tử vào cuối mảng
// products.push({ id: 4, name: "USB 64GB U4", price: 150000 });
// console.log(products.length); // 4

// // Lọc: tạo mảng mới gồm các sản phẩm giá dưới 300.000
// const cheap = products.filter(function (product) {
//     return product.price < 300000;
// });
// console.log(cheap);

// ===== 2. Giỏ hàng lưu tạm trong trình duyệt =====
// Giỏ hàng là một đối tượng: { "mã sản phẩm": số lượng }
// Ví dụ: { "1": 2, "4": 1 } nghĩa là 2 sản phẩm mã 1 và 1 sản phẩm mã 4.

const CART_KEY = "minishop_cart";

function getCart() {
    const data = localStorage.getItem(CART_KEY);
    return data ? JSON.parse(data) : {};
}

function saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function updateCartCount() {
    const cart = getCart();
    let count = 0;
    for (const id in cart) {
        count += cart[id];
    }
    const badge = document.querySelector("#cart-count");
    if (badge) {
        badge.textContent = count;
    }
}

function addToCart(id) {
    const cart = getCart();
    cart[id] = (cart[id] || 0) + 1;
    saveCart(cart);
    updateCartCount();
}

// Gắn sự kiện click cho mọi nút "Thêm vào giỏ"
document.querySelectorAll(".add-to-cart").forEach(function (button) {
    button.addEventListener("click", function () {
        addToCart(button.dataset.id);
    });
});

// Hiện số lượng ngay khi trang vừa mở
updateCartCount();

// ===== 3. Trang giỏ hàng: tự tính thành tiền và tổng cộng =====
function updateCartTotals(table) {
    let total = 0;
    table.querySelectorAll("tbody tr").forEach(function (row) {
        const price = Number(row.dataset.price);
        const qty = Number(row.querySelector(".qty").value);
        const lineTotal = price * qty;
        row.querySelector(".line-total").textContent = formatPrice(lineTotal);
        total += lineTotal;
    });
    document.querySelector("#cart-total").textContent = formatPrice(total);
}

const cartTable = document.querySelector(".cart-table");
if (cartTable) {
    // Tính lại mỗi khi người dùng đổi số lượng ở bất kỳ ô nào trong bảng
    cartTable.addEventListener("input", function () {
        updateCartTotals(cartTable);
    });
    // Tính lần đầu khi trang vừa mở
    updateCartTotals(cartTable);
}

// ===== 4. Form đăng ký: hai mật khẩu phải khớp nhau =====
const registerForm = document.querySelector("#register-form");
if (registerForm) {
    const password = document.querySelector("#password");
    const password2 = document.querySelector("#password2");
    const error = document.querySelector("#password-error");

    // Trả về true nếu hai mật khẩu khớp, đồng thời hiện/xóa thông báo
    function checkPasswords() {
        if (password2.value !== "" && password.value !== password2.value) {
            error.textContent = "Hai mật khẩu không khớp nhau.";
            return false;
        }
        error.textContent = "";
        return true;
    }

    // Kiểm tra ngay khi gõ vào một trong hai ô
    password.addEventListener("input", checkPasswords);
    password2.addEventListener("input", checkPasswords);

    // Kiểm tra lần cuối khi gửi form
    registerForm.addEventListener("submit", function (event) {
        if (!checkPasswords()) {
            event.preventDefault();
        }
    });
}

const clearCartButton = document.querySelector("#clear-cart");

if (clearCartButton) {
    clearCartButton.addEventListener("click", function () {
        if (confirm("Xóa toàn bộ giỏ hàng?")) {
            localStorage.removeItem(CART_KEY);
            updateCartCount();

            const cartTable = document.querySelector(".cart-table");

            if (cartTable) {
                cartTable.querySelector("tbody").innerHTML = "";
                updateCartTotals(cartTable);
            }
        }
    });
}

const contactForm = document.querySelector("#contact-form");

if (contactForm) {
    const message = document.querySelector("#message");
    const messageError = document.querySelector("#message-error");

    contactForm.addEventListener("submit", function (event) {
        if (message.value.trim().length < 10) {
            event.preventDefault();
            messageError.textContent = "Nội dung tin nhắn phải có ít nhất 10 ký tự.";
        } else {
            messageError.textContent = "";
        }
    });

    message.addEventListener("input", function () {
        messageError.textContent = "";
    });
}
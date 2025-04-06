function updateCity() {
    const citySelect = document.getElementById('city');
    const selectedCity = citySelect.value;
    console.log(`Выбран город: ${selectedCity}`);
}


function showMainPage() {
    document.getElementById('main-page').style.display = 'block';
    document.getElementById('hair-product').style.display = 'none';
    document.getElementById('body-product').style.display = 'none';
    document.getElementById('perfume-product').style.display = 'none';
}

function showProduct(productId) {
    document.getElementById('main-page').style.display = 'none';
    
    const productPages = document.querySelectorAll('.product-page');
    productPages.forEach(page => {
        page.style.display = 'none';
    });
    
    document.getElementById(`${productId}-product`).style.display = 'block';
    
    window.scrollTo(0, 0);
}

function addToCart(productName, price) {
    alert(`${productName} за ${price}₽ добавлен в корзину!`);
    console.log(`Товар добавлен в корзину: ${productName}, Цена: ${price}₽`);
}

document.addEventListener('DOMContentLoaded', function() {
    showMainPage();
});
// Корзина
let cart = [];

// Открыть корзину
function openCart() {
    document.getElementById('cartModal').style.display = 'flex';
    renderCart();
}

// Закрыть корзину
function closeCart() {
    document.getElementById('cartModal').style.display = 'none';
}

// Добавить товар в корзину
function addToCart(productName, price, imageUrl = '') {
    const existingItem = cart.find(item => item.name === productName);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            name: productName,
            price: price,
            quantity: 1,
            image: imageUrl || 'default-product.jpg'
        });
    }
    
    updateCartCount();
    renderCart();
    showAddedToCart(productName);
}

// Показать уведомление о добавлении
function showAddedToCart(productName) {
    const notification = document.createElement('div');
    notification.className = 'cart-notification';
    notification.innerHTML = `
        <span>${productName} добавлен в корзину</span>
    `;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Обновить счетчик корзины
function updateCartCount() {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartCount = document.getElementById('cartCount');
    
    if (cartCount) {
        cartCount.textContent = count;
        cartCount.style.display = count > 0 ? 'flex' : 'none';
    } else {
        // Создаем счетчик, если его нет
        const cartIcon = document.querySelector('.fa-shopping-bag').parentElement;
        cartIcon.classList.add('cart-icon');
        cartIcon.innerHTML += `<span class="cart-count" id="cartCount" style="display: ${count > 0 ? 'flex' : 'none'}">${count}</span>`;
    }
}

// Отрисовать корзину
function renderCart() {
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<div class="empty-cart">Ваша корзина пуста</div>';
        cartTotal.textContent = '0 ₽';
        return;
    }
    
    let itemsHTML = '';
    let total = 0;
    
    cart.forEach(item => {
        total += item.price * item.quantity;
        itemsHTML += `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}" class="cart-item-img">
                <div class="cart-item-details">
                    <h4 class="cart-item-title">${item.name}</h4>
                    <p class="cart-item-price">${item.price.toLocaleString()} ₽</p>
                    <div class="cart-item-actions">
                        <button class="quantity-btn minus" onclick="updateQuantity('${item.name}', -1)">−</button>
                        <input type="text" class="quantity-input" value="${item.quantity}" readonly>
                        <button class="quantity-btn plus" onclick="updateQuantity('${item.name}', 1)">+</button>
                        <button class="remove-item" onclick="removeItem('${item.name}')">Удалить</button>
                    </div>
                </div>
            </div>
        `;
    });
    
    cartItems.innerHTML = itemsHTML;
    cartTotal.textContent = `${total.toLocaleString()} ₽`;
}

// Обновить количество товара
function updateQuantity(productName, change) {
    const item = cart.find(item => item.name === productName);
    if (item) {
        item.quantity += change;
        
        if (item.quantity < 1) {
            cart = cart.filter(i => i.name !== productName);
        }
        
        updateCartCount();
        renderCart();
    }
}

// Удалить товар
function removeItem(productName) {
    cart = cart.filter(item => item.name !== productName);
    updateCartCount();
    renderCart();
}

// Оформить заказ
function checkout() {
    if (cart.length === 0) return;
    
    alert(`Заказ оформлен на сумму ${cart.reduce((sum, item) => sum + (item.price * item.quantity), 0).toLocaleString()} ₽`);
    cart = [];
    updateCartCount();
    renderCart();
    closeCart();
}

// Инициализация
document.addEventListener('DOMContentLoaded', function() {
    showMainPage();
    
    // Обработчики для корзины
    document.querySelector('.fa-shopping-bag').parentElement.addEventListener('click', function(e) {
        e.preventDefault();
        openCart();
    });
    
    document.querySelector('.close-cart').addEventListener('click', closeCart);
    document.querySelector('.checkout-btn').addEventListener('click', checkout);
    
    // Закрытие корзины при клике вне ее
    document.getElementById('cartModal').addEventListener('click', function(e) {
        if (e.target === this) {
            closeCart();
        }
    });
    
    // Обновляем кнопки "Добавить в корзину" на главной
    document.querySelectorAll('.product-card button').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const card = this.closest('.product-card');
            const name = card.querySelector('h2').textContent;
            const price = parseInt(card.querySelector('.price').textContent);
            const img = card.querySelector('img').src;
            addToCart(name, price, img);
        });
    });
});

// Стиль для уведомлений
const style = document.createElement('style');
style.textContent = `
    .cart-notification {
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%) translateY(100px);
        background-color: #222;
        color: white;
        padding: 12px 24px;
        border-radius: 4px;
        font-family: 'Montserrat', sans-serif;
        font-size: 14px;
        z-index: 1100;
        opacity: 0;
        transition: all 0.3s ease;
    }
    
    .cart-notification.show {
        transform: translateX(-50%) translateY(0);
        opacity: 1;
    }
`;
document.head.appendChild(style);
// Личный кабинет
function openAccount() {
    document.getElementById('accountPage').style.display = 'block';
    document.getElementById('main-page').style.display = 'none';
    showTab('profile');
}

function closeAccount() {
    document.getElementById('accountPage').style.display = 'none';
    document.getElementById('main-page').style.display = 'block';
}

function showTab(tabId) {
    // Скрыть все вкладки
    document.querySelectorAll('.account-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Показать выбранную вкладку (если она существует)
    const tab = document.getElementById(`${tabId}Tab`);
    if (tab) {
        tab.classList.add('active');
    }
    
    // Обновить активный пункт меню
    document.querySelectorAll('.account-menu li').forEach(item => {
        item.classList.remove('active');
        if (item.dataset.tab === tabId) {
            item.classList.add('active');
        }
    });
}

// Инициализация личного кабинета
document.addEventListener('DOMContentLoaded', function() {
    // Обработчики для меню личного кабинета
    document.querySelectorAll('.account-menu li[data-tab]').forEach(item => {
        item.addEventListener('click', function() {
            showTab(this.dataset.tab);
        });
    });
    
    // Обработчик для кнопки пользователя в шапке
    document.querySelector('.fa-user').parentElement.addEventListener('click', function(e) {
        e.preventDefault();
        openAccount();
    });
    
    // Обработчики для форм
    document.querySelector('.account-form').addEventListener('submit', function(e) {
        e.preventDefault();
        updateUserProfile();
    });
    
    document.querySelector('.settings-form').addEventListener('submit', function(e) {
        e.preventDefault();
        saveSettings();
    });
});

function updateUserProfile() {
    // Здесь должна быть логика обновления профиля
    alert('Изменения сохранены');
}

function saveSettings() {
    // Здесь должна быть логика сохранения настроек
    alert('Настройки сохранены');
}
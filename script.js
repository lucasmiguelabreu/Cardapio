const menu = document.getElementById("menu");
const cartBtn = document.getElementById("cart-btn");
const cartModal = document.getElementById("cart-modal");
const cartItemsContainer = document.getElementById("cart-item");
const cartTotal = document.getElementById("cart-total");
const checkoutBtn = document.getElementById("chekout-btn");
const closeModalBtn = document.getElementById("close-modal-btn");
const cartCounter = document.getElementById("cart-count");
const observationItem = document.getElementById("observation");
const addressInput = document.getElementById("adress");
const addressWarn = document.getElementById("adress-warn");

let cart = [];


// Abrir o modal do carrinho
cartBtn.addEventListener("click", function () {
    updateCartModal();
    cartModal.style.display = "flex";
});

// Fechar o modal, clicando fora
cartModal.addEventListener("click", function (event) {
    if (event.target === cartModal) {
        cartModal.style.display = "none";
    };
});

// Fechar Modal no botão fechar
closeModalBtn.addEventListener("click", function () {
    cartModal.style.display = "none";
});

// Mapeando o botão do carrinho
menu.addEventListener("click", function (event) {
    let parenButton = event.target.closest(".add-to-cart-btn");

    if (parenButton) {
        const name = parenButton.getAttribute("data-name");
        const price = parseFloat(parenButton.getAttribute("data-price"));

        addToCart(name, price);
    };
});

// Função para adicionar no carrinho
function addToCart(name, price) {
    const existingItem = cart.find(item => item.name === name);

    if (existingItem) {
        existingItem.quantity += 1;

    } else {
        cart.push({
            name,
            price,
            quantity: 1,
        });
    }

    updateCartModal();
};


// Atualiza o carrinho
function updateCartModal() {
    cartItemsContainer.innerHTML = "";
    let total = 0;

    cart.forEach(item => {
        const cartItemElement = document.createElement("div");
        cartItemElement.classList.add("flex", "justify-between", "mb-4", "flex-col")

        cartItemElement.innerHTML = `
            <div class="flex items-center justify-between">
                <div>
                    <p>Qtd: ${item.quantity}</p>
                    <p class="font-bold">${item.name}</p>
                    <p class="font-medium mt-2">R$ ${item.price.toFixed(2)}</p>
                </div>

                <div>
                    <button class="remove-from-cart-btn" data-name="${item.name}">
                        Remover
                    </button>
                </div>
            </div>
        `
        total += item.price * item.quantity;

        cartItemsContainer.appendChild(cartItemElement);
    });

    cartTotal.textContent = total.toLocaleString("pt-br", {
        style: "currency",
        currency: "BRL"
    });

    cartCounter.innerHTML = cart.length;
};

// Função para remover item
cartItemsContainer.addEventListener("click", function (event) {
    if (event.target.classList.contains("remove-from-cart-btn")) {
        const name = event.target.getAttribute("data-name")

        removeItemCart(name);
    };
});

function removeItemCart(name) {
    const index = cart.findIndex(item => item.name === name);

    if (index !== -1) {
        const item = cart[index]

        if (item.quantity > 1) {
            item.quantity -= 1;
            updateCartModal();
            return;
        };

        cart.splice(index, 1);
        updateCartModal();
    };
};

addressInput.addEventListener("input", function (event) {
    let inputValue = event.target.value;

    if (inputValue !== "") {
        addressInput.classList.remove("border-red-500");
        addressWarn.classList.add("hidden");
    }

});

// Finalizar pedido
checkoutBtn.addEventListener("click", function () {
    const IsOpen = checkRestaurantOpen();
    if(!IsOpen){
        Toastify({
            text: "Ops, o restaurante esta fechado",
            duration: 3000,
            close: true,
            gravity: "top", // `top` or `bottom`
            position: "right", // `rifht`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
              background: "#ef4444",
            },
        }).showToast();

       return;
    }

    if (cart.length === 0) return;
    if (addressInput.value === "") {
        addressWarn.classList.remove("hidden");
        addressInput.classList.add("border-red-500");
        return;
    };

    // Enviar o pedido para o Whatsapp
    const cartItems = cart.map((item) => {
        return (
            `${item.quantity}  ${item.name}  
R$${item.price} 
-----------------------------------------------
`
        )
    }).join("")

    const message = encodeURIComponent(cartItems)
    const phone = "17997236529"
    const atencao = "A taxa de entrega sera fornecida pelo restaurante!"

    window.open(`https://wa.me/${phone}?text=${message}%0AObservações: ${observationItem.value}%0AEndereço: ${addressInput.value}%0AATENÇÃO: ${atencao}`, "_blank");

    cart = [];
    updateCartModal();
});

// Verificar se a loja esta aberta
function checkRestaurantOpen() {
    const data = new Date();
    const hora = data.getHours();
    return hora >= 10 && hora < 17;
}

const spanItem = document.getElementById("date-span");
const IsOpen = checkRestaurantOpen();

if (IsOpen) {
    spanItem.classList.remove("bg-red-500")
    spanItem.classList.add("bg-green-600")
} else {
    spanItem.classList.remove("bg-green-600")
    spanItem.classList.add("bg-red-500")
}

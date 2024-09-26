const menu = document.getElementById("menu")
const cartBtn = document.getElementById("cart-btn")
const cartModal = document.getElementById("cart-modal")
const cartItemsContainer = document.getElementById("cart-items")
const cartTotal = document.getElementById("cart-total")
const checkoutBtn = document.getElementById("checkout-btn")
const closeModalBtn = document.getElementById("close-modal-btn")
const cartCounter = document.getElementById("cart-count")
const addressInput = document.getElementById("address")
const addressWarn = document.getElementById("address-warn")
const nomeInput = document.getElementById("nome")
const nomeWarn = document.getElementById("nome-warn")

let cart = [];

// ABRIR O MODAL DO CARRINHO
cartBtn.addEventListener("click", function() { 
    updateCartModal();
    cartModal.style.display = "flex";
});

// FECHAR O MODAL QUANDO CLICAR FORA
cartModal.addEventListener("click", function(event){
    if(event.target === cartModal){
        cartModal.style.display = "none";
    }
});

closeModalBtn.addEventListener("click", function(){
    cartModal.style.display = "none";
});

menu.addEventListener("click", function(event){
    let parentButton = event.target.closest(".add-to-cart-btn");
  
    if(parentButton){
        const name = parentButton.getAttribute("data-name");
        const price = parseFloat(parentButton.getAttribute("data-price"));

        // Pegando o tamanho correspondente ao produto (supondo que o ID do select é sempre relacionado ao produto)
        const produtoId = parentButton.getAttribute("data-name").toLowerCase().replace(/\s/g, ""); // Exemplo: Camiseta Preta vira 'camisetapreta'
        const tamanhoSelect = document.getElementById(`tamanho-${produtoId}`);
        const tamanho = tamanhoSelect.value;

        if (!tamanho) {
            alert("Por favor, selecione um tamanho.");
            return;
        }

        addToCart(name, price, tamanho);
    }
});

// FUNÇÃO DE ADICIONAR NO CARRINHO
function addToCart(name, price, tamanho){
    const existingItem = cart.find(item => item.name === name && item.tamanho === tamanho);
  
    if(existingItem){
        // SE O ITEM JÁ EXISTE, AUMENTA A QUANTIDADE EM +1
        existingItem.quantity += 1;
    } else {
        cart.push({
            name,
            price,
            tamanho, // Adiciona o tamanho ao item no carrinho
            quantity: 1,
        });
    }

    updateCartModal();
}

// ATUALIZA O CARRINHO
function updateCartModal(){
    cartItemsContainer.innerHTML = "";
    let total = 0;
  
    cart.forEach(item => {
        const cartItemElement = document.createElement("div");
        cartItemElement.classList.add("flex", "justify-between", "mb-4", "flex-col");

        cartItemElement.innerHTML = `
        <div class="flex items-center justify-between">
            <div>
                <p class="font-medium">${item.name}</p>
                <p>Tamanho: ${item.tamanho}</p> <!-- Exibe o tamanho no carrinho -->
                <p>Qtd: ${item.quantity}</p>
                <p class="font-medium mt-2">R$ ${item.price.toFixed(2)}</p>
            </div>
  
            <button class="remove-from-cart-btn hover:cursor-pointer hover:font-bold" data-name="${item.name}" data-tamanho="${item.tamanho}">
                Remover
            </button>
        </div>
        `;

        total += item.price * item.quantity;
        cartItemsContainer.appendChild(cartItemElement);
    });
  
    cartTotal.textContent = total.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
  
    cartCounter.innerHTML = cart.length;
}

// FUNÇÃO DE REMOVER UM ITEM DO CARRINHO
cartItemsContainer.addEventListener("click", function (event){
    if(event.target.classList.contains("remove-from-cart-btn")){
      const name = event.target.getAttribute("data-name")
  
      removeItemCart(name);
    }
  
  })
  
  function removeItemCart(name){
    const index = cart.findIndex(item => item.name === name);
  
    if(index !== -1){
      const item = cart[index];
      
      if(item.quantity > 1){
        item.quantity -= 1;
        updateCartModal();
        return;
      }
  
      cart.splice(index, 1);
      updateCartModal();
  
    }
  
  }
  
  addressInput.addEventListener("input", function(event){
    let inputValue = event.target.value;
  
    if(inputValue !== ""){
      addressInput.classList.remove("border-red-500")
      addressWarn.classList.add("hidden")
    }
  
  })

  nomeInput.addEventListener("input", function(event){
    let inputValue = event.target.value;
  
    if(inputValue !== ""){
      nomeInput.classList.remove("border-red-500")
      nomeWarn.classList.add("hidden")
    }
  
  })

// FINALIZAR O PEDIDO
checkoutBtn.addEventListener("click", function(){

    const isOpen = checkLojaOpen();
    if(!isOpen){
      
      // API DE NOTIFICAÇÕES
      Toastify({
        text: "A loja está fechada!",
        duration: 3000,
        close: true,
        gravity: "top",
        position: "center",
        stopOnFocus: true,
        style: {
          background: "#ef4444",
        },
      }).showToast();
  
      return;
    }
  
    if(cart.length === 0) return;
    if(addressInput.value === ""){
      addressWarn.classList.remove("hidden")
      addressInput.classList.add("border-red-500")
      return;
    }
    if(nomeInput.value === ""){
        nomeWarn.classList.remove("hidden")
        nomeInput.classList.add("border-red-500")
        return;
      }

        //ENVIAR O PEDIDO
        const cartItems = cart.map((item) => {
            return (
              ` ${item.name}| Quantidade: (${item.quantity})| Preço: R$${item.price}| Tamanho: ${item.tamanho}|`
            )
          }).join("")
          
          // FUNÇÃO QUE CHAMA O NÚMERO DE TELEFONE
          const message = encodeURIComponent(cartItems)
          const phone = "61984161687"
         
        
          window.open(`https://wa.me/${phone}?text=${message}  Nome: ${nomeInput.value}| Endereço: ${addressInput.value}`, "_blank")
        
          cart = [];
          updateCartModal();
        
        })

// VERIFICAR A HORA E MANIPULAR O CARD DO HORÁRIO
function checkLojaOpen(){
    const data = new Date();
    const hora = data.getHours();
    return hora >= 8 && hora < 22; 
  }
  
  const spanItem = document.getElementById("date-span")
  const isOpen = checkLojaOpen();
  
  if(isOpen){
    spanItem.classList.remove("bg-red-500");
    spanItem.classList.add("bg-green-600")
  }else{
    spanItem.classList.remove("bg-green-600")
    spanItem.classList.add("bg-red-500")
  }
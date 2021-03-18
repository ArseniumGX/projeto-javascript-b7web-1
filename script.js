let cart = []
let modalKey = 0
let modalQtd = 1

const cmd = element => document.querySelector(element)
const cmdAll = element => document.querySelectorAll(element)
const modalStyle = cmd('.pizzaWindowArea').style


// Listagem do cardapio
pizzaJson.map((item, index) => {
    let pizzaItem = cmd('.models .pizza-item').cloneNode(true)
    
    pizzaItem.setAttribute('data-key', index)
    pizzaItem.querySelector('.pizza-item--name').innerHTML = item.name
    pizzaItem.querySelector('.pizza-item--desc').innerHTML = item.description
    pizzaItem.querySelector('.pizza-item--price').innerHTML = `R$ ${item.price.toFixed(2)}`
    pizzaItem.querySelector('.pizza-item--img img').src = item.img

    // Listagem do Modal
    pizzaItem.querySelector('a').addEventListener('click', (e) => {
        e.preventDefault()

        modalQtd = 1
        let key = e.target.closest('.pizza-item').getAttribute('data-key')
        modalKey = key
        
        cmd('.pizzaInfo h1').innerHTML = pizzaJson[key].name
        cmd('.pizzaInfo--desc').innerHTML = pizzaJson[key].description
        cmd('.pizzaBig img').src = pizzaJson[key].img
        cmd('.pizzaInfo--actualPrice').innerHTML = `R$ ${pizzaJson[key].price.toFixed(2)}`
        cmd('.pizzaInfo--size.selected').classList.remove('selected')
        cmd('.pizzaInfo--qt').innerHTML = modalQtd
        cmdAll('.pizzaInfo--size').forEach((size, sizeIndex) => {
            if(sizeIndex == 2)
                size.classList.add('selected')

            size.querySelector('span').innerHTML = pizzaJson[key].sizes[sizeIndex]
        })

        modalStyle.opacity = 0
        modalStyle.display = 'flex'
        setTimeout(() => { modalStyle.opacity = 1 }, 200)

    })
    cmd('.pizza-area').append(pizzaItem)
})

// Modal Events
const closeModal = () => {
    modalStyle.opacity = 0
    setTimeout(() => { modalStyle.display = 'none' }, 500)
}

cmdAll('.pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton').forEach( item => {
    item.addEventListener('click', closeModal)
})

cmd('.pizzaInfo--qtmais').addEventListener('click', () => {
    modalQtd += 1
    cmd('.pizzaInfo--qt').innerHTML = modalQtd
}) 
cmd('.pizzaInfo--qtmenos').addEventListener('click', () => {
    modalQtd > 1 ? modalQtd -= 1 : modalQtd
    cmd('.pizzaInfo--qt').innerHTML = modalQtd
})
cmdAll('.pizzaInfo--size').forEach((size) => {
    size.addEventListener('click', () => {
        cmd('.pizzaInfo--size.selected').classList.remove('selected')
        size.classList.add('selected')
    })
})

cmd('.pizzaInfo--addButton').addEventListener('click', () => {
    let size = parseInt(cmd('.pizzaInfo--size.selected').getAttribute('data-key'))

    let identifier = `${pizzaJson[modalKey].id}@${size}`

    let key = cart.findIndex( item => item.identifier == identifier )

    if(key > -1)
        cart[key].qt += modalQtd
    else
        cart.push({
            identifier,
            id: pizzaJson[modalKey].id,
            size,
            qt: modalQtd
        })
    
    updateCart()
    closeModal()
})

cmd('.menu-openner').addEventListener('click', () => {
    cart.length > 0 ? cmd('aside').style.left = '0' : cart.length
})
cmd('.menu-closer').addEventListener('click', () => {
    cmd('aside').style.left = '100vw'
})

// Função atualiza cart
const updateCart = () => {

    cmd('.menu-openner span').innerHTML = cart.length

    if(cart.length > 0){
        cmd('aside').classList.add('show')
        cmd('.cart').innerHTML = ''

        /* let subtotal = 0 
        let desconto = 0 
        let total = 0 */
        let [ subtotal, desconto, total ] = [ 0, 0, 0 ]

        for(let i in cart){
            let pizzaItem = pizzaJson.find(item => item.id == cart[i].id)
            
            subtotal += pizzaItem.price * cart[i].qt

            let cartItem = cmd('.models .cart--item').cloneNode(true)
            let pizzaSizeName = ''

            switch(cart[i].size){
                case 0:
                    pizzaSizeName = 'P'
                    break
                case 1:
                    pizzaSizeName = 'M'
                    break
                case 2:
                    pizzaSizeName = 'G'
                    break
                default:
                    pizzaSizeName
                    break
            }

            cartItem.querySelector('img').src = pizzaItem.img
            cartItem.querySelector('.cart--item-nome').innerHTML = `${pizzaItem.name} (${pizzaSizeName})`
            cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt
            cartItem.querySelector('.cart--item-qtmais').addEventListener('click', () => {
                cart[i].qt += 1
                updateCart()
            })
            cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', () => {
                cart[i].qt > 1 ? cart[i].qt -= 1 : cart.splice(i, 1)
                updateCart()
            })

            cmd('.cart').append(cartItem)
        }

        desconto = subtotal * 0.1
        total = subtotal - desconto

        cmd('.subtotal span:last-child').innerHTML = `R$ ${subtotal.toFixed(2)}`
        cmd('.desconto span:last-child').innerHTML = `R$ ${desconto.toFixed(2)}`
        cmd('.total span:last-child').innerHTML = `R$ ${total.toFixed(2)}`



    } else{
        cmd('aside.show').classList.remove('show')
        cmd('aside').style.left = '100vw'
    }
}
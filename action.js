
const CARDS = document.getElementById('cards')
const FORM = document.getElementById('search-form')

class Product{
    constructor(id, title, price, description, category, image, rating){
        this.id = id
        this.title = title
        this.price = price
        this.description = description
        this.category = category
        this.image = image,
        this.rating = rating
    }
}

class Shop{

    Products = []
    shop_base_url = 'https://fakestoreapi.com/'
    shop_endpoint = 'products'
    fetch_url = new URL(this.shop_base_url + this.shop_endpoint).href
    display_product = []
    category = []

    add_product(product){
        this.Products.push(product)
    }

    fetch_products(){
        fetch(new URL(this.shop_base_url + this.shop_endpoint).href)
        .then(response => response.json())
        .then(data => {
            data.forEach(product => {
                this.add_product(new Product(product.id, product.title, product.price, product.description, product.category, product.image, product.rating))
            })
            this.set_display_product()
            this.render_products();
        })
        .catch(error => console.log(error))
    }
    set_display_product(){
        this.display_product = this.Products
    }

    render_products(){
        CARDS.innerHTML = "";
        this.display_product.forEach(product => {
            console.log(product)
            const card = document.createElement('div')
            card.classList.add('row')
            card.innerHTML = `
                    <div class="card-body img col-md-2">
                        <img src="${product.image}" alt="image${product.id}"/>
                    </div>
                    <div class="card-body col-md-8">
                        <h5 class="card-title">${product.title}</h5>
                        <p class="card-text">${product.description}</p>
                    </div>
                    <div class="card-body col-md-2">
                        <p class="chip">${product.category}</p>
                        <div class="rating-card">
                            <div class="rating">${product.rating.rate}</div>
                            <div style="border-left:1px solid #fff;height:100%; width: 1px"></div>
                            <div class="count">${product.rating.count}</div>    
                        </div>
                        <div class="price">$${product.rating.rate}</div>
                    </div>
                    `
            CARDS.appendChild(card)
        })
    }

    search_product(title){
        this.display_product = this.Products.filter(product => product.title.toLowerCase().includes(title.toLowerCase()))
        this.render_products()
    }

    
}

const shop = new Shop()
shop.fetch_products()
console.log("hello")

FORM.addEventListener('submit', (e) => {
    e.preventDefault()
    const formData = new FormData(FORM)
    let search = ""
    for (let [key, value] of formData.entries()) {
        search = value;
    }
    shop.search_product(search)
    // shop.search_product(submitsearch)
});

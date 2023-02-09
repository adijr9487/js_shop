
const CARDS = document.getElementById('cards')
const FORM = document.getElementById('search-form')
const CATEGORY = document.getElementById('category_ul')
const RATING = document.getElementById('rating_ul')

const PRICE_SORT_BUTTON = document.getElementById('Price')
const RATING_SORT_BUTTON = document.getElementById('Rating')

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
    category = {}
    search_title = ""
    order_field = "rating"

    sort_by = "none"
    order = true   

    rating = {
        '0-1': false,
        '1-2': false,
        '2-3': false,
        '3-4': false,
        '4-5': false,
    }

    add_product(product){
        this.Products.push(product)
    }

    fetch_products(){
        fetch(new URL(this.shop_base_url + this.shop_endpoint).href)
        .then(response => response.json())
        .then(data => {
            data.forEach(product => {
                this.add_product(new Product(product.id, product.title, product.price, product.description, product.category, product.image, product.rating))
                this.category[product.category] = false;
            })
            this.render_products();
            this.render_category(); 
            this.render_rating();

        })
        .catch(error => console.log(error))
    }

    render_category(){  
        CATEGORY.innerHTML = "";
        console.log(this.category)
        Object.keys(this.category).forEach(key => {
            const li = document.createElement('li')
            li.innerHTML = `
                <a class="dropdown-item" href="#">
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" ${this.category[key] ? 'checked' : ''} id=${key} name="${key}" />
                        <label class="form-check-label" for=${key}>${key}</label>
                    </div>
                </a>
            `
            CATEGORY.appendChild(li)
        })
    }

    render_rating(){
        RATING.innerHTML = "";
        console.log(this.rating)
        Object.keys(this.rating).forEach(key => {
            const li = document.createElement('li')
            li.innerHTML = `
                <a class="dropdown-item" href="#">
                    <div class="form-check">
                        <input class="form-check-input" ${this.rating[key] ? 'checked' : ''} type="checkbox" id='${key}' name="${key}" />
                        <label class="form-check-label" for="${key}">${key}</label>
                    </div>
                </a>
            `
            RATING.appendChild(li)
        })
    }

    render_products(){
        CARDS.innerHTML = "";
        console.log(this.Products)
        let search_product = this.Products.filter(product => product.title.toLowerCase().includes(this.search_title.toLowerCase()))
        let filter_product_category = search_product.filter(product => this.category[product.category])
        if(Object.keys(this.category).every(key => this.category[key] === false)){
            filter_product_category = [...search_product]
        }
        let filter_product_rating = filter_product_category.filter(product => {
            let rating = product.rating.rate
            console.log(rating, typeof rating)
            if(this.rating['0-1'] && rating >= 0 && rating < 1){
                return true
            }
            if(this.rating['1-2'] && rating >= 1 && rating < 2){
                return true
            }
            if(this.rating['2-3'] && rating >= 2 && rating < 3){
                return true
            }
            if(this.rating['3-4'] && rating >= 3 && rating < 4){
                return true
            }
            if(this.rating['4-5'] && rating >= 4 && rating <= 5){
                return true
            }
            return false
        })
        if(Object.keys(this.rating).every(key => this.rating[key] === false)){
            filter_product_rating = [...filter_product_category]
        }

        if(this.sort_by == 'price'){
            if(this.order){
                filter_product_rating.sort((a, b) => a.price - b.price)
            }else{
                filter_product_rating.sort((a, b) => b.price - a.price)
            }
        }else if(this.sort_by == 'rating'){
            if(this.order){
                filter_product_rating.sort((a, b) => a.rating.rate - b.rating.rate)
            }else{
                filter_product_rating.sort((a, b) => b.rating.rate - a.rating.rate)
            }
        }
        

        filter_product_rating.forEach(product => {
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
        this.search_title = title;
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

CATEGORY.addEventListener('click', (e)=>{
    
    checkbox_element = e.target;
    if(checkbox_element.type === 'checkbox'){
        shop.category[checkbox_element.name] = !shop.category[checkbox_element.name]
        if(shop.category[checkbox_element.name]){
            checkbox_element.setAttribute('checked', shop.category[checkbox_element.name])
        }else{
            checkbox_element.removeAttribute('checked')
        }
        console.log(shop.category)
        shop.render_category()
        shop.render_products()
    }

})

RATING.addEventListener('click', (e)=>{
    
    checkbox_element = e.target;
    if(checkbox_element.type === 'checkbox'){
        shop.rating[checkbox_element.name] = !shop.rating[checkbox_element.name]
        if(shop.rating[checkbox_element.name]){
            checkbox_element.setAttribute('checked', shop.rating[checkbox_element.name])
        }else{
            checkbox_element.removeAttribute('checked')
        }
        console.log(shop.rating)
        shop.render_rating()
        shop.render_products()
    }

})

PRICE_SORT_BUTTON.addEventListener('click', (e)=>{
    if(shop.sort_by != 'price'){
        shop.sort_by = 'price'
        shop.order = true
    }else{
        shop.order = !shop.order
    }
    shop.render_products()
})

RATING_SORT_BUTTON.addEventListener('click', (e)=>{
    if(shop.sort_by != 'rating'){
        shop.sort_by = 'rating'
        shop.order = true
    }else{
        shop.order = !shop.order
    }
    shop.render_products()
})
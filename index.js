const express = require('express');
const app = express();
const { engine } = require('express-handlebars');
const PORT = 8080;

const server = app.listen(PORT, () => {
    console.log(`Servidor http escuchando en el puerto ${server.address().port}`);
});

server.on('error', (error) => console.log(`Error en servidor ${error}`));
app.use('/public', express.static(__dirname + '/public'));

app.set('view engine', 'hbs');
app.set('views', './views');
app.engine(
    'hbs',
    engine({
        extname: '.hbs',
        defaultLayout: 'index.hbs',
        layoutsDir: __dirname + '/views/layouts',
        partialsDir: __dirname + '/views/partials',
    })
);


class Products {
    constructor(products) {
        this.products = [...products];
        //this.products = products;
    }

    getAll() {
        return this.products;
    }
    getById(id) {
        return this.products.find((item) => item.id == id);
    }
    addOne(product) {
        const lastItem = this.products[this.products.length - 1];
        let lastId = 1;
        if (lastItem) {
            lastId = lastItem.id + 1;
        }
        product.id = lastId;
        this.products.push(product);
        return this.products[this.products.length - 1];
    }

    updateOne(id, product) {
        const productToInsert = {...product, id };

        for (let i = 0; i < this.products.length; i++) {
            if (this.products[i].id == id) {
                this.products[i] = productToInsert;
                return productToInsert;
            }
        }
        return undefined;
    }
    deleteById(id) {
        const foundProduct = this.getById(id);
        if (foundProduct) {
            this.products = this.products.filter((item) => item.id != id);
            return id;
        }
        return undefined;
    }
}


let productsHC = [
    { id: 1, title: 'nike ball', price: 101, thumbnail: 'http://localhost:8080/public/nike-ball.jpg' },
    { id: 2, title: 'nike shoes', price: 102, thumbnail: 'http://localhost:8080/public/nike-shoes.jpg' },
    { id: 3, title: 'adidas shoes', price: 102, thumbnail: 'http://localhost:8080/public/adidas-shoes.jpg' },
];



app.get('/products', (req, res) => {
    try {
        //sirve productslist.hbs en index.hbs (index.hbs es la plantilla por defecto donde arranca todo)
        res.render('productslist', { products: productsHC, productsExist: true });
    } catch (e) {
        console.log(e)
    }
});

app.get('/products/:id', (req, res) => {
    try {
        const { id } = req.params;
        let find = productsHC.find(e => e.id == id)
        if (!find) {
            res.render('errorProduct', { title: 'Error - Producto no encontrado' });
        }
        res.render('oneProduct', { product: find, title: 'Detalles del producto' });
    } catch (e) {
        console.log(e)
    }
});
app.get('/form', (req, res) => {
    try {
        //sirve productslist.hbs en index.hbs (index.hbs es la plantilla por defecto donde arranca todo)
        res.render('form', { tite: 'Formmulario' });
    } catch (e) {
        console.log(e)
    }
});
app.post('/products', (req, res) => {
    const { body } = req;
    console.log("object", body)
    body.price = parseFloat(body.price);
    const products = new Products(productsHC);
    const productoGenerado = products.addOne(body);
    res.json({ success: 'ok', new: productoGenerado });
});
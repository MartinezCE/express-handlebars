const express = require('express');
const app = express();
const { engine } = require('express-handlebars');
const PORT = 8080;

const server = app.listen(PORT, () => {
    console.log(`Servidor http escuchando en el puerto ${server.address().port}`);
});

server.on('error', (error) => console.log(`Error en servidor ${error}`));
app.use('/public', express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

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
    productsHC.push(body)
    const productoGenerado = body
    res.json({ success: 'ok', new: productoGenerado });
});
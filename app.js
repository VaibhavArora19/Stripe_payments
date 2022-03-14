require('dotenv').config();
const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_API_KEY);
const bodyParser = require('body-parser');
const ejs = require('ejs');

const app = express();

app.use(express.static('public'));
app.use(express.json());
app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine', 'ejs');

const storeItems = [
    { sno: 1, priceInCents: 10000, name: 'Learn React Today' },
     { sno: 2, priceInCents: 20000, name: 'Learn CSS Today' }
]

app.get('/', (req, res) => {
    return stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: storeItems.map(item =>
            {
                return {
                    name: item.name, 
                    amount: item.priceInCents,
                    currency: 'inr',
                    quantity: 2
                };
            }),
            success_url: req.protocol + '://' + req.get('host') + '/success', //http://localhost:3000/checkout/success
            cancel_url: req.protocol + '://' + req.get('host') + '/cancel',
    })
    .then(session =>
        {
            res.render('index', {sessionId: session.id})
        })
});

app.get('/success', (req, res) =>
{
    res.render('success');
})

app.listen(3000, console.log('Started'));
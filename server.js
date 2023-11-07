const express = require('express')
const mongoose = require('mongoose')
const session = require('express-session')
const ShortUrl = require('./models/shortUrl')
const User = require('./models/user')
const Tier = require('./models/tier')
const tier = require('./models/tier')

const app = express()

mongoose.connect('mongodb+srv://Kareddy_29:Pavithra2910@cluster0.e8mo0ea.mongodb.net/test', {

})

app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: false }))

app.use(session({
    secret: 'HelloWorld',
    resave: false,
    saveUninitialized: true
}));

app.use((req, res, next) => {
    if(!req.session.user){
        res.locals.user = null;
    } else{
        res.locals.user = req.session.user;
    }
    next();
})

app.get('/', async (req, res) => {
    res.render('welcome');

});

app.get('/register', async (req, res) => {
    res.render('register');
})

app.get('/login', async (req, res) => {
    res.render('login');
})

app.get('/shorten', async (req, res) => {
    const user = req.session.user;
    if(!user){
        return res.redirect('/login');
    }
    res.render('shorten');
})

app.post('/register', async (req, res) => {
    const { username, password, nameTier } = req.body;

    console.log(nameTier);

    const tier = await Tier.findOne({ nameTier: nameTier });

    console.log(tier);

    if(!tier){
        return res.status(400).send('Invalid tier');
    }

    const user = new User({
        username, 
        password,
        nameTier: nameTier,
        tierId: tier._id
    });

    console.log(user);
    console.log(typeof user);
    console.log(user.constructor === User);

    try{
        await user.save();
        req.session.user = user;

        res.redirect('/login');
    } catch(err){
        console.log(err);
        return res.status(500).send('Internal Server Error');
    }
});

app.post('/login', async (req, res) => {
    const { loginUsername, loginPassword } = req.body;

    try{
        const user = await User.findOne({ username: loginUsername });

        if(!user){
            return res.status(401).send('Invalid username and password');
        }

        if(user.password !== loginPassword){
            return res.status(401).send('Invalid username and password');
        }

        req.session.user = user;

        console.log(req.session.user);

        res.redirect('/shorten');
    } catch(err){
        return res.status(500).send('Internal Server Error');
    }
});

app.post('/shorten', async (req, res) => {
    const user = req.session.user;

    console.log(user);

    if(!user){
        return res.status(401).send('Unauthorized');
    }

    const userTier = await Tier.findOne({nameTier: user.nameTier});

    console.log(userTier);
    //console.log(userTier.requestsMade);
    //console.log(userTier.maxRequests);

    if(userTier && userTier.requestsMade < userTier.maxRequests){
        const preferredShortUrl = req.body.preferredShortUrl;
        const fullUrl = req.body.fullUrl;

        const existingShortUrl = await ShortUrl.findOne({ short: preferredShortUrl });

        if(existingShortUrl){
            return res.status(400).send('Short URL already in use');
        }

        const shortUrl = await ShortUrl.create({ full: fullUrl, short: preferredShortUrl });

        console.log(user);
        console.log(typeof user);
        console.log(user.constructor.name);
        console.log(user.constructor === User);

       /// user.preferredShortUrl = preferredShortUrl;
       user
       // await user.save();

        userTier.requestsMade++;
        await userTier.save();

        return res.redirect('/');
    } else{
        return res.status(403).send('Request limit exceeded for the current tier');
    }
})

app.get('/:shortUrl', async (req, res) => {
    const shortUrl = await ShortUrl.findOne({ short: req.params.shortUrl })
    if(shortUrl == null) return res.sendStatus(404)

    shortUrl.clicks++
    shortUrl.save()

    res.redirect(shortUrl.full)
});

app.get('/user/:userId/history', async (req, res) => {
    const user = await User.findById(req.params.userId).populate('tier');
    if(!user) return res.sendStatus(404);

    const shortUrls = await ShortUrl.find({ userId: user._id });
    res.send('userHistory', { user, shortUrls});
});

app.listen(process.env.PORT || 5000);
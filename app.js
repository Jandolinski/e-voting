const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

//Import routes
const mainRoutes = require('./routes/mainRoutes');
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');
const notFoundController = require('./controllers/404');
//Import DB
const sequelize = require('./util/database');

const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
//Import Models
const Candidate = require('./models/candidate');
const Election = require('./models/election');
const Vote = require('./models/vote');
const User = require('./models/user');
const Admin = require('./models/admin');

const csrf = require('csurf');

//Init app
const app = express();

const csrfProtection = csrf();

const flash = require('connect-flash');

//Set ejs as view engine
app.set('view engine', 'ejs');
app.set('views', 'views');

//Set static folder (css,js, etc.)
app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.urlencoded({ extended: false }));

const store = new MySQLStore({
    host: 'sql.wrekol.nazwa.pl',
    port: 3306,
    user: 'wrekol_e-voting',
    password: 'e-votingProj2019',
    database: 'wrekol_e-voting'
});

app.use(session({
    secret: 'anySecret',
    resave: false,
    store: store,
    saveUninitialized: false}));

app.use(csrfProtection);

app.use(flash());

app.use((req,res,next) => {
    if(!req.session.user) {
        return next();
    }
    User.findByPk(req.session.user.id)
    .then(user => {
        req.user = user;
        next();
    })
    .catch(err => console.log(err));
})

app.use((req,res,next) => {
    if(!req.session.admin) {
        return next();
    }
    User.findByPk(req.session.admin.id)
    .then(admin => {
        req.admin = admin;
        next();
    })
    .catch(err => console.log(err));
})

app.use((req,res,next) => {
    res.locals.isAdminAuthenticated = req.session.isAdminLoggedIn,
    res.locals.isUserAuthenticated = req.session.isUserLoggedIn,
    res.locals.csrfToken = req.csrfToken();
    next();
});


//Take routes from Router
app.use('/user', userRoutes);
app.use('/admin', adminRoutes);
app.use(mainRoutes);
app.use(notFoundController.get404);

Election.belongsTo(Admin, {constraints: true, onDelete: 'CASCADE'});
Admin.hasMany(Election);
Candidate.belongsTo(Admin, {constraints: true, onDelete: 'CASCADE'});
Admin.hasMany(Candidate);
Candidate.belongsTo(Election, {constraints: true, onDelete: 'CASCADE'});
Election.hasMany(Candidate);
User.hasMany(Vote);
Vote.belongsTo(User, {constraints: true, onDelete: 'CASCADE'});
Election.hasMany(Vote);
Vote.belongsTo(Election, {constraints: true, onDelete: 'CASCADE'});


// sequelize.sync({force: true})
sequelize.sync()
.then(res => {
        //Launch app
        app.listen(3000, () => {
            console.log("Server started at port 3000");
})
})
.catch(err => console.log(err));


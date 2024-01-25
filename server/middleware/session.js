var session = require('express-session');
const MongoStore = require('connect-mongo');

const store = MongoStore.create({ mongoUrl: process.env.DB_URI });
// Session for authentication
sess = session({
    // Save sessions in MongoDB
    secret: process.env.AUTH_TOKEN,
    resave: true,
    saveUninitialized: true,
    cookie: { secure: true, maxAge: 60 * 60 * 24 * 100 },
    store: store
}); 
  
module.exports = sess
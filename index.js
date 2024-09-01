const express = require('express');
const path = require('path');
const methodOverride = require('method-override');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const flash = require('express-flash');
const moment = require('moment');
const http = require('http');
const { Server } = require("socket.io");

// congif dotenv
require('dotenv').config();

const app = express();
const port = process.env.PORT;

// SocketIO
const server = http.createServer(app);
const io = new Server(server);
global._io = io; // biến toàn cục của io();
// End SocketIO


//config
const database = require("./config/database");
database.connect();

// Router
const routeAdmin = require('./router/admin/index.route');
const route = require('./router/client/index.route');

app.use(methodOverride('_method'));
app.set('views', `${__dirname}/views`);
app.set('view engine', 'pug');

/* New Route to the TinyMCE Node module */
app.use('/tinymce', express.static(path.join(__dirname, 'node_modules', 'tinymce')));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// flash
app.use(cookieParser('ADSAFAFSSGFS'));
app.use(session({ cookie: { maxAge: 60000 } }));
app.use(flash());
// end flash

// App Local variable
const systemConfig = require("./config/system");
app.locals.prefitAdmin = systemConfig.prefixAdmin;
app.locals.moment = moment;

app.use(express.static(`${__dirname}/public`));


// Route
route(app);
routeAdmin(app);

// Các đường dẫn không hợp lệ sẽ vào trang 404
app.get("*", (req, res) => {
  res.render("client/pages/errors/404", {
    pageTitle: "404 Not found",
  });
});


server.listen(port, () => {
  console.log(`App listening on port ${port}`);
})
const express = require('express');
let mysql = require('mysql');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const cookieParser = require("cookie-parser");
const sessions = require('express-session');

const app = express();

app.use(cookieParser());

const timeEXp = 1000 * 60 * 60 * 24;
app.use(sessions({
    secret: "rfghf66a76ythggi87au7td",
    saveUninitialized: true,
    cookie: { maxAge: timeEXp },
    resave: false
}));

app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use('/public/', express.static('./public'));

const port = 10101;
const pool = mysql.createPool({
    connectionLimit: 100,
    host: 'localhost',
    user: 'root',
    password: 'Apto1404',
    database: 'tienda',
    debug: false
});
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    auth: {
        user: 'servi.tools22@gmail.com',
        pass: 'izmthaseotcktbwc'
    }
});


app.get('/', (req, res) => {
    
    let session = req.session;
    if (session.correo) {
        return res.render('index', { nombre: session.nombre })
    }
    return res.render('index', { nombre: undefined })
});

app.get('/registro', (req, res) => {
    let session = req.session;
    if (session.correo) {
        return res.render('registro', { nombre: session.nombre })
    }
    return res.render('registro', { nombre: undefined })
});

app.get('/login', (req, res) => {
    let session = req.session;
    if (session.correo) {
        return res.render('login', { nombre: session.nombre })
    }
    return res.render('login', { nombre: undefined })
});

app.get('/registro', (req, res) => {
    res.render('registro')
})
app.get('/login', (req, res) => {
    res.render('login');
})

app.post('/registro', (req, res) => {
    let correo = req.body.correo;
    let nombre = req.body.nombre;
    let apellido = req.body.apellido;
    let contrasenia = req.body.contrasenia;

    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    const hash = bcrypt.hashSync(contrasenia, salt);

    pool.query("INSERT INTO usuario VALUES (?, ?, ?, ?)", [correo, nombre, apellido, hash],
        (error) => {
            if (error) throw error;
            res.redirect('/login');
            transporter.sendMail({
                from: 'servi.tools22@gmail.com',
                to: `${correo}`,
                subject: 'Ensayo cliente correo',
                html: '<h1>Hola prro</h1> <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Python-logo-notext.svg/800px-Python-logo-notext.svg.png">'
            }).then((res) => { console.log(res); }).catch((err) => { console.log(err); });
        });
})

app.post('/login', (req, res) => {

    let correo = req.body.correo;
    let contrasenia = req.body.contrasenia;
    pool.query("SELECT contraseña, nombre, apellido FROM usuario WHERE correo=?", [correo], (error, data) => {
        if (error) throw error;
        if (data.length > 0) {
            let contraseniaEncriptada = data[0].contraseña;
            if (bcrypt.compareSync(contrasenia, contraseniaEncriptada)) {
                let session = req.session;
                session.correo = correo;
                session.nombre = `${data[0].nombre} ${data[0].apellido}`
                return res.redirect('/');
            }
            return res.send('Usuario o contraseña incorrecta');
        }
        return res.send('Usuario o contraseña incorrecta');
    });

});

app.get('/test-cookies', (req, res) => {
    session = req.session;
    if (session.correo) {
        res.send(`Usted tiene una sesión en nuestro sistema con el correo:
        ${session.correo}`);
    } else
        res.send('Por favor inicie sesión para acceder a esta ruta protegida')
});

app.get('/logout', (req, res) => {
    let session = req.session;
    if (session.correo) {
        req.session.destroy();
        return res.redirect('/');
    } else
        return res.send('Por favor inicie sesión')
});


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
});
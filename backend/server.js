// Instanciamos/Importamos las depedencias necesarias y las almacenamos en una constante
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Iniciamos nuestra aplicación express
const aplicacion = express();
const puerto = 3000;

// Instanciamos las depedencias de la aplicación
aplicacion.use(cors());
aplicacion.use(express.json());

// Crear la conexión con DB
mongoose.connect('mongodb://localhost:27017/AP-N3-C2')
    .then(() => console.log('Conexión Exitosa!'))
    .catch((excepcion) => console.log('No ha sido posible conectarse con la DB, error ocurrido: ', excepcion));

const PORT = process.env.PORT || 3000;
aplicacion.listen(PORT, 'localhost', () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});

const direccion = new mongoose.Schema({
    comuna: String,
    calle: String,
    numero: String,
    departamento: String
});

const usuario = new mongoose.Schema({
    nombre: String,
    rut: String,
    nacionalidad: String,
    email: String,
    celular: String,
    fechaNacimiento: Date,
    contrasena: String,
    direccion: [direccion],
    foto:{
        filename: String,
        path: String,
        mimetype: String
    },
    activo:{
        type:Boolean,
        default:true
    },
    fechaRegistro:{
    type:Date,
    default:Date.now
    }
});

const pais = new mongoose.Schema({
    nombre: String,
    iso2: String,
    iso3: String,
    codigoPais: String,
    nacionalidad: String
});

const libro = new mongoose.Schema({
    titulo: String,
    autor: String,
    categoria: String,
    anio: Number,
    usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario'
    }
});
const Usuario = mongoose.model('Usuario', usuario, 'usuarios');

const Pais = mongoose.model('Pais', pais, 'paises');

const Libro = mongoose.model('Libro', libro, 'libros');

aplicacion.post('/guardarUsuario', async (req, res) => {
    try {
        const { nombre, rut, nacionalidad, email, celular, fechaNacimiento, contrasena, direccion, foto } = req.body;
        const direccionUsuario = JSON.parse(direccion);

        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(contrasena, salt);

        const nuevoUsuario = new Usuario({ nombre, rut, nacionalidad, email, celular, fechaNacimiento, contrasena:hash, direccion: direccionUsuario, foto });
        await nuevoUsuario.save();

        res.status(200).json({ mensaje: 'Datos almacenados correctamente.' })
    }
    catch (error) {
        res.status(500).json({ mensaje: 'No se han podido guardar los datos. ', error });
    };
});
aplicacion.get('/obtenerUsuarios', async (req, res) => {
    try {
        const usuarios = await Usuario.aggregate([
            {
                $lookup: {
                    from: 'paises',
                    localField: 'nacionalidad',
                    foreignField: 'iso2',
                    as: 'paisOrigen'
                }
            }
        ]);
        res.json(usuarios);
    } catch (error) {
        res.status(500).json({ mensaje: 'No se han podido obtener los datos.', error });
    }
});
aplicacion.get('/obtenerPaises', async (req, res) => {
    try {
        const paises = await Pais.find();
        res.json(paises);
    } catch (error) {
        res.status(500).json({ mensaje: 'No se han podido obtener los datos. ', error });
    }
});
aplicacion.post('/guardarLibro', async (req, res) => {
    try {
        const {
            titulo,
            autor,
            categoria,
            anio,
            usuario
        } = req.body;
        const nuevoLibro = new Libro({
            titulo,
            autor,
            categoria,
            anio,
            usuario
        });
        await nuevoLibro.save();
        res.status(200).json({
            mensaje: "Libro guardado correctamente."
        });
    } catch (error) {
        res.status(500).json({
            mensaje: "Error al guardar libro",
            error
        });
    }
});
aplicacion.get('/obtenerLibros', async (req, res) => {
    try {
        const libros = await Libro.aggregate([
            {
                $lookup: {
                    from: "usuarios",
                    localField: "usuario",
                    foreignField: "_id",
                    as: "datosUsuario"
                }
            }
        ]);
        res.json(libros);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
});

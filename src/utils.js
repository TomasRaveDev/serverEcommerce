import bcrypt from "bcrypt";
import { config } from "./config/config.js";
import { fileURLToPath } from 'url';
import Jwt from 'jsonwebtoken';
import multer from 'multer';
import path from 'path';
import userModel from "./models/user.model.js";
import {faker} from "@faker-js/faker"
import { promises as fs } from "fs";

const JWT_SECRET = config.JwtSecret;
const JWT_SECRET_PASS = config.JwtSecret_PASS;

const __filename = fileURLToPath(import.meta.url);

export const __dirname = path.dirname(__filename);

export default class Exception extends Error {
    constructor(message, status) {
        super(message);
        this.statusCode = status;
    }
}

/* const storage = multer.diskStorage({
    destination: (req, file, cb) =>{
        const { params: { typeFile }} = req;
        let folderPath = null;
        switch (typeFile) {
            case 'Identificacion':
                folderPath = path.join(__dirname, '/public/documents');
                break;
            case 'Domicilio':
                folderPath = path.join(__dirname, '/public/documents');
                break;
            case 'Estado de cuenta':
                folderPath = path.join(__dirname, '/public/documents');
                break;
            case 'avatar':
                folderPath = path.join(__dirname, '/public/profile');
                break;
            case 'products':
                folderPath = path.join(__dirname, '/public/img');
                break;
            default:
                throw new Exception('Archivo incorrecto');
        }
        fs.mkdir(folderPath, {recursive: true});
        cb(null, folderPath)
    },
    filename: (req, file, cb) =>{
        const filname = `${Date.now()}-${file.originalname}`;
        cb(null, filname);
    }
});

export const uploader = multer({storage}); */

const storage = multer.diskStorage({
    destination: async (req, file, cb) =>{
        const { params: { typeFile }} = req;
        let folderPath = null;
       
        switch (typeFile) {
            case 'Identificacion':
            case 'Domicilio':
            case 'Estado de cuenta':
                folderPath = path.join(process.cwd(), 'src/public/documents');
                break;
            case 'avatar':
                folderPath = path.join(process.cwd(), 'src/public/profile');
                break;
            case 'products':
                folderPath = path.join(process.cwd(), 'src/public/img');
                break;
            default:
                throw new Error('Archivo incorrecto');
        }
        console.log(folderPath);
        fs.mkdir(folderPath, {recursive: true});
        cb(null, folderPath)
    },
    filename: (req, file, cb) =>{
        const filname = `${Date.now()}-${file.originalname}`;
        cb(null, filname);
    }
});

export const uploader = multer({storage});



export const createHash = (password) => bcrypt.hashSync(password, bcrypt.genSaltSync(10));

export const isValidPassword = (password, user) => bcrypt.compareSync(password, user.password);

export const tokenGenerator = (user) =>{
    const { id, username, lastname, email, rol } = user;
    const payload = {
        id: id,
        username: username,
        lastname: lastname,
        email: email,
        rol: rol
    };
    const token = Jwt.sign(payload, JWT_SECRET, {expiresIn: '24h'});
    return token;
};

export const tokenGeneratorPass = (user) =>{
    const { id, username, email, rol } = user;
    const payload = {
        id: id,
        username: username,
        email: email,
        rol: rol
    };
    const token = Jwt.sign(payload, JWT_SECRET_PASS, {expiresIn: '1h'});
    return token;
};

export const jwtAuth = (req, res ,next) =>{
    const { authorization: token } = req.headers; 
    /* const token = req.signedCookies['accessToken']; */
    if(!token) throw new Exception('Unauthorized');
    Jwt.verify(token.split(' ')[1], JWT_SECRET, async (error, payload)=>{

        if(error) throw new Exception('No authorized');
        req.user = await userModel.findById(payload.id);
        next();
    })
}

/* function jwtAuthBear(req, res, next) {
    const token = req.headers['authorization'];
    if (!token) {
      return res.status(403).json({ mensaje: 'Token no proporcionado' });
    }
  
    jwt.verify(token.split(' ')[1], config.JwtSecret, (err, decoded) => {
      if (err) {
        return res.status(401).json({ mensaje: 'Token inválido' });
      }
      req.usuario = decoded;
      next();
    });
  } */

/*   export const jwtAuthBear = (req, res, next) => {
    const token = req.headers['authorization'].split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ error: 'Unauthorized' }); 
    }

    console.log('Token recibido:', token); // Registro de depuración

    Jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            console.error('Error al verificar el token:', err); // Registro de depuración
            return res.status(401).json({ mensaje: 'Token inválido' });
        }
        req.usuario = decoded;
        next();
    });
};  */ 

export const generateProduct = () => {
    return {
        title: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        price: faker.commerce.price(),
        code: faker.number.int({min: 1000000, max: 99999999}),
        stock: faker.number.int({min: 1000000, max: 99999999}),
        category: faker.commerce.department(),
    }

}

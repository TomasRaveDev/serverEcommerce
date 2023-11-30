import path from 'path';
import multer from 'multer';
import { fileURLToPath } from 'url';
import bcrypt, { genSaltSync } from "bcrypt";
import Jwt from 'jsonwebtoken';
/* import dotenv from "dotenv"; */
import userModel from "./models/user.model.js";
import { config } from "./config.js";

/* dotenv.config(); */

const JWT_SECRET = config.JwtSecret;

const __filename = fileURLToPath(import.meta.url);

export const __dirname = path.dirname(__filename);

export default class Exception extends Error {
    constructor(message, status) {
        super(message);
        this.statusCode = status;
    }
}

const storage = multer.diskStorage({
    destination: (req, file, cb) =>{
        const folderPath = path.join(__dirname, '/public/img');
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
    const { _id, username, lastname, email, isAdmin } = user;
    if(email === 'ravetomas@gmail.com') {
       user.isAdmin = true;
    }else{
        user.isAdmin = false;
    }
    const payload = {
        id: _id,
        username,
        lastname,
        email,
        isAdmin
    };
    const token = Jwt.sign(payload, JWT_SECRET, {expiresIn: '24h'});
    return token;
};

export const jwtAuth = (req, res ,next) =>{
    const {authorization: token} = req.headers;
    if(!token) res.status(401).json({message:'Unauthorized'});
    Jwt.verify(token, JWT_SECRET, async (error, payload)=>{
        if(error) res.status(403).json({message:'No authorized'});
        req.user = await userModel.findById(payload.id);
        next();
    })
}

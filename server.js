const express = require('express');
const cors = require('cors');
require('dotenv').config();
const userRouter=require ('./routes/users')
class Server {
    constructor(){
        this.app = express(); //Se instancia Express
        this.port = process.env.PORT;    //Definimos el puerto

        //paths   http://localhost:3000/api/v1 
        this.basePath = '/api/v1';   //Ruta base
        this.usersPath = `${this.basePath}/pilotos`;//Path para la tabla users

        this.middlewares(); //Invocacion de los middlewares

        this.routes();
    }

    middlewares(){
        this.app.use(cors());
        this.app.use(express.json()) //Para poder interpretar texto en formato JSON
    }

    routes(){
        this.app.use(this.usersPath, userRouter); //EndPoint de users
    }

    listen (){
        this.app.listen(this.port, () =>{
            console.log("Server listening on port"+ this.port )
        });
}
}
module.exports = Server;
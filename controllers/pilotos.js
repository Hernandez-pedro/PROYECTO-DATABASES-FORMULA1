const {request, response} = require('express');
const bcrypt = require ('bcrypt');
const usermodels = require('../models/pilotos');
const pool=require('../db');


const listapiloto = async (req = request, res = response) => {
    let conn; 

    try{
        conn = await pool.getConnection();

    const pilotos = await conn.query (usermodels.todoslospilotos, (err)=>{
        if(err){
            throw err
        }
    });

    res.json(pilotos);
    } catch (error){
        console.log(error);
        res.status(500).json(error);
    } finally{
        if (conn) conn.end();
    }
    
}

const listapilotoid = async (req = request, res = response) => {
    const {id} = req.params;

    if (isNaN(id)) {
        res.status(400).json({msg: 'identificación invalida 🏎️🚫'});
        return;
    }


    let conn; 

    try{
        conn = await pool.getConnection();

    const [user] = await conn.query (usermodels.busquedaid, [id], (err)=>{
        if(err){
            throw err
        }
    });

    if (!user) {
        res.status(404).json({msg: 'piloto no encontrado 🏎️⚠️'});
        return;
    }

    res.json(user);
    } catch (error){
        console.log(error);
        res.status(500).json(error);
    } finally{
        if (conn) conn.end();
    }
}
/* 3 endponit*/
const addpiloto = async (req = request, res =response)=>{
    const {
    piloto,
     TV,
     password,
     circuito,
     Equipo,
     numero ='',
     dia,
     mes = 1
    } = req.body;

   
  
    if(!piloto || !TV || !password || !circuito || !Equipo ||!dia){
        res.status(400).json ({msg: 'Información faltante ⚠️🚫⚠️'});
        return;
    }
///24-10-2023//
    let passwordHash
    if (password) {
    const saltRounds = 10;
    passwordHash = await bcrypt.hash(password,saltRounds);
    }


    const user =[piloto, TV, passwordHash, circuito, Equipo, numero, dia, mes];
//24-10-2023 hasta aqui//
    let conn;

    try{
        conn= await pool.getConnection();

        const [usernameUsers] = await conn.query(
            usermodels.getBypiloto,
            [piloto],
            (err)=>{if (err) throw err;}
        );
        if (usernameUsers) {
            res.status(409).json({msg: `El piloto ${piloto} ya existe ⚠️🏎️⚠️`});
            return;
        }

            

        const [emailUsers] = await conn.query(
            usermodels.getBytv,
            [TV],
            (err)=>{if (err) throw err;}
        );
        if (emailUsers) {
            res.status(409).json({msg: `La TV ${TV} ya existe ⚠️📺`});
            return;
        }



const userAdded = await conn.query(usermodels.añadir, [...user], (err) => {
  if (err)throw err;
});


if (userAdded.affectedRows === 0 ) throw new Error ({message:'FALLO AL AGREGAR AL PILOTO ⚠️⚠️🏎️'});

res.json({msg: 'Piloto agregado exitosamente ✅🏎️✅'});

    }catch(error){
      console.log(error);
      res.status(500).json(error);
    }finally{
    if (conn) conn.end();
}
}

//UPDATEUSERS//
const actualizarpiloto=async(req, res)=>{
  const {
    piloto,
      TV,
      password,
      circuito,
      Equipo,
      numero,
      dia,
      mes ,
  } = req.body;

const {id} = req.params;
let newUserData=[
  piloto,
  TV,
  password,
  circuito,
  Equipo,
  numero,
  dia,
  mes   
];
let conn;
try{
  conn = await pool.getConnection();
const [userExists]=await conn.query(
  usermodels.busquedaid,
  [id],
  (err) => {if (err) throw err;}
);
if (!userExists || userExists.id_active === 0){
  res.status(404).json({msg:'Piloto no encontrado ⚠️⚠️🏎️'});
  return;
}
//24-10-2023//
const [usernameUser] = await conn.query(
  usermodels.getBypiloto,
  [piloto],
  (err) => {if (err) throw err;}
);
if (usernameUser){
  res.status(409).json({msg:`El  piloto ${piloto} ya existe ⚠️🏎️`});
  return;
}

const [emailUsers] = await conn.query(
  usermodels.getBytv,
  [TV],
  (err)=>{if (err) throw err;}
);
if (emailUsers) {
  res.status(409).json({msg: `LA TV ${TV} YA EXISTE 🚫📺`});
  return;
}
//24-10-2023/hasta qui/

const oldUserData = [
  userExists.piloto,
  userExists.TV,
  userExists.password,
  userExists.circuito,
  userExists.Equipo,
  userExists.numero,
  userExists.dia,
  userExists.mes  
];

newUserData.forEach((userData, index)=> {
  if (!userData){
      newUserData[index] = oldUserData[index];
  }
})

const userUpdate = await conn.query(
  usermodels.actualizarpiloto,
  [...newUserData, id],
  (err) => {if (err) throw err;}
);
if(userUpdate.affecteRows === 0){
  throw new Error ('Piloto no actualizado');
}
res.json({msg:'Piloto actualizado exitosamente 🏎️✅'})
}catch (error){
      console.log(error);
      res.status(500).json(error);
  } finally{
      if (conn) conn.end();
  }
};

//detele usuario 19-100203//
const eliminarpiloto = async (req = request, res = response) => {
  let conn;
  const {id} = req.params;

  try {
    conn = await pool.getConnection();

    const [userExists] = await conn.query(
      usermodels.busquedaid,
      [id],
      (err) => {throw err;}
  
    )
     if(!userExists || userExists.mes == 0) {
      res.status(404).json({msg: 'PILOTO NO ENCONTRADO 🚫🏎️🚫'});
      return;
     }
  
  
     const userDelete = await conn.query (
      usermodels.eliminarpiloto,
      [id],
      (err) => {if (err) throw err;}
     )
  
     if (userDelete.affectedRows ===0) {
      throw new Error({message : 'ERROR AL ELIMINAR PILOTO 🚫🚫🚫'})
     };
     
     res.json ({msg: 'PILOTO ELIMINADO EXITOSAMENTE 👍👍'});

  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  } finally {
    if (conn) conn.end();
  }
}

//26-10-2023 iniciar sesion///
const iniciarsesiónPiloto = async (req, res) => {
  const { piloto, password } = req.body;

  let conn;

  if (!piloto || !password) {
    res.status(400).json({ msg: 'Invalid username or password 🤨😠' });
    return;
  }

  try {
    conn = await pool.getConnection();

    const [user] = await pool.query(usermodels.getBypiloto, [piloto]);

    if (!user || user.password == 0) {
      res.status(401).json({ msg: 'Invalid username or password 🚫🏎️🚫' });
      return;
    }

    const passwordOk = await bcrypt.compare(password, user.password);

    if (!passwordOk) {
      res.status(401).json({ msg: 'Invalid username or password 🚫🏎️🚫' });
      return;
    }

    delete user.password;
    delete user.created_at;
    delete user.updated_at;
    res.json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  } finally {
    if (conn) conn.release();
  }
};

module.exports = { iniciarsesiónPiloto };


module.exports={
  listapiloto, 
  listapilotoid, 
  addpiloto, 
  actualizarpiloto, 
  eliminarpiloto,
  iniciarsesiónPiloto
};
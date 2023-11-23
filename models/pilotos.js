const { end } = require("../db");

const usermodels = {
  todoslospilotos: `
    SELECT 
    * 
    FROM 
    f1`,

    busquedaid: `
    SELECT
    *
    FROM
    f1
    WHERE
    id= ?
    `,

    añadir:`
    INSERT INTO
    f1(
        piloto,
        TV,
        password,
        circuito,
        Equipo,
        numero,
        dia,
        mes
    )  VALUES(?,?,?,?,?,?,?,?)
    `,
   
    getBypiloto: `
    SELECT 
    * 
    FROM
    f1
    WHERE 
    piloto = ?
    `,

    getBytv: `
    SELECT
    id 
    FROM 
    f1
    WHERE
    TV = ?
    `,

  actualizarpiloto: `
  UPDATE 
     f1
  SET 
      piloto = ?,
      TV = ?,
      password = ?,
      circuito = ?,
      Equipo = ?,
      numero = ?,
      dia = ?,
      mes = ?
  WHERE
      id = ?
`,

///delate 19-10-2023///
  eliminarpiloto:`
     UPDATE
     f1
     SET
     id = 0
     WHERE
     id = ?
  `,
}

module.exports = usermodels;
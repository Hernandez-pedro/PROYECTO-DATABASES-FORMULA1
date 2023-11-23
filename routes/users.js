const {Router} = require ('express')
const{listapiloto,listapilotoid, addpiloto, actualizarpiloto,eliminarpiloto, iniciarsesiónPiloto}=require('../controllers/pilotos');


const router =Router();

//http://localhost:3000/api/v1/pilotos/
//http://localhost:3000/api/v1/pilotos/1
//http://localhost:3000/api/v1/pilotos/3
router.get('/', listapiloto);
router.get('/:id', listapilotoid);
router.post('/', iniciarsesiónPiloto);
router.put('/', addpiloto);
//mi modificacion
router.patch('/:id', actualizarpiloto);  ///MI MODIFCACION.
router.delete('/:id', eliminarpiloto);
module.exports = router;
const express = require('express')
const {doctorRequest,getAllDoctors,updateDoctor, deleteDoctor} = require('../Controllers/doctorController')
const router = express.Router()


router.post('/doctor/create',doctorRequest)
router.get('/doctor/all',getAllDoctors)
router.put('/doctor/update/:id',updateDoctor)
router.delete('/doctor/delete/:id',deleteDoctor)

module.exports = router
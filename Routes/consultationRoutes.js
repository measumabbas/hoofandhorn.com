const express = require('express')
const { getAllConsultations, getUserConsultations, createConsultation, updateConsultation, deleteConsultation } = require('../Controllers/consultationsController')
const { authenticateUser } = require('../middlewares/authentication')

const router = express.Router()


router.get('/consultations/all',getAllConsultations)
router.get('/consultations/user',authenticateUser,getUserConsultations)
router.post('/consultations/create',authenticateUser,createConsultation)
router.put('/consultations/update/:id',updateConsultation)
router.delete('/consultations/delete/:id',deleteConsultation)

module.exports = router
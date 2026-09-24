const express = require('express')
const router = express.Router({mergeParams: true})
const leadService = require('../services/leadService')
const validateLead = require('../middleware/validateLead')

/**
 * @swagger
 * /api/leads:
 *  get:
 *      summary: Listar todos los leads
 *      description: Retorna todos los leads captados, de todas las landings, sin filtrar.
 *      tags: [Leads]
 *      responses:
 *          200:
 *              description: Lista completa de leads
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/Lead'
 */

router.get('/', (req, res, next) => {
    try {
        res.json(leadService.getAllLeads())
    }catch(err){
        next(err)
    }
})


/**
 * @swagger
 * /api/leads:
 *   post:
 *     summary: Registrar un nuevo lead
 *     description: Crea un lead indicando a qué landing pertenece mediante landingId en el body.
 *     tags: [Leads]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             allOf:
 *               - $ref: '#/components/schemas/CreateLeadRequest'
 *               - type: object
 *                 required: [landingId]
 *                 properties:
 *                   landingId:
 *                     type: integer
 *                     example: 3
 *           example:
 *             landingId: 3
 *             name: "Maria Gomez"
 *             email: "maria@gmail.com"
 *             phone: "1134567890"
 *             message: null
 *     responses:
 *       201:
 *         description: Lead registrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Lead'
 *       400:
 *         description: Datos inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Landing no encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/', validateLead, (req, res, next) => {
    try {
      const { landingId, ...leadData } = req.body
      const lead = leadService.createLead(landingId, leadData)
      res.status(201).json(lead)
    } catch (err) {
      next(err)
    }
  })
  
  module.exports = router
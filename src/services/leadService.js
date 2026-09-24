const landingService = require('./landingService')
const leadRepository = require('../repositories/leadRepository')

function getAllLeads(){
    return leadRepository.findAll()
}

function getLeadsByLanding(landingId) {
    landingService.getLandingById(landingId)
    return leadRepository.findByLandingId(landingId)
}

function createLead(landingId, data) {
    landingService.getLandingById(landingId)
    const lead = {
        landingId: Number(landingId),
        name: data.name,
        email: data.email,
        phone: data.phone || null,
        message: data.message || null,
        createdAt: new Date().toISOString()
    }

    return leadRepository.save(lead)
}

module.exports = {getAllLeads, getLeadsByLanding, createLead}
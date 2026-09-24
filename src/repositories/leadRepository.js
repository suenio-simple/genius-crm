const db = require('../data/db')

function findAll(){
    return db.leads
}

function findByLandingId(landingId) {
    return db.leads.filter(l => l.landingId === Number(landingId))
}

function save(lead){
    const newLead = {
        id: db.nextLeadId++,
        ...lead
    }

    db.leads.push(newLead)
    return newLead
}

module.exports = {findAll, findByLandingId, save}


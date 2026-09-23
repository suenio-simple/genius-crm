function validateLead(req, res, next){
  const { name, email, phone, message, landingId } = req.body
  const errores = []

  if(landingId !== undefined && (isNaN(Number(landingId)) || Number(landingId) <= 0)) {
    errores.push("El campo 'landingId' debe ser un número válido.")
  }


  if (typeof name !== "string" || name.trim().length === 0){
      errores.push("El campo 'name' es obligatorio.")
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  if (typeof email !== "string" || email.trim().length === 0){
      errores.push("El campo 'email' es obligatorio.")
  }else if(!emailRegex.test(email.trim())){
      errores.push("El campo email no tiene formato válido.")
  }

  if (phone !== undefined && (typeof phone !== "string" || phone.trim().length === 0)){
      errores.push("El campo phone, no puede estar vacío.")
  }
  if(message !== undefined && typeof message !== "string"){
      errores.push("El campo message debe ser texto. ")
  }

  if(errores.length > 0){
      const error = new Error(errores.join("; "))
      error.statusCode = 400
      return next(error)
  }
  
  req.body = {
      name: name.trim(),
      email: email.trim(),
      ...(phone !== undefined && {phone: phone.trim() }),
      ...(message !== undefined && {message:message.trim() }),
      ...(landingId !== undefined && {landingId: Number(landingId) })
  }
  
  next()
}

module.exports = validateLead
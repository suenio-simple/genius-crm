const validateLead = require("../validateLead");

// Helper para simular el objeto res de Express
function mockResponse() {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
}

describe("validateLead", () => {
  let res;
  let next;

  beforeEach(() => {
    res = mockResponse();
    next = jest.fn();
  });

  test("rechaza cuando falta name", () => {
    const req = { body: { email: "test@test.com" } };
    validateLead(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(Error));
    const errorPasado = next.mock.calls[0][0];
    expect(errorPasado.statusCode).toBe(400);
    expect(errorPasado.message).toMatch(/name/);
  });

  test("rechaza cuando falta email", () => {
    const req = { body: { name: "Test" } };
    validateLead(req, res, next);

    const errorPasado = next.mock.calls[0][0];
    expect(errorPasado.statusCode).toBe(400);
    expect(errorPasado.message).toMatch(/email/);
  });

  test("rechaza email con formato inválido", () => {
    const req = { body: { name: "Test", email: "esto-no-es-un-mail" } };
    validateLead(req, res, next);

    const errorPasado = next.mock.calls[0][0];
    expect(errorPasado.statusCode).toBe(400);
    expect(errorPasado.message).toMatch(/formato/);
  });

  test("rechaza phone vacío cuando se envía", () => {
    const req = { body: { name: "Test", email: "test@test.com", phone: "   " } };
    validateLead(req, res, next);

    const errorPasado = next.mock.calls[0][0];
    expect(errorPasado.statusCode).toBe(400);
  });

  test("rechaza message con tipo incorrecto", () => {
    const req = { body: { name: "Test", email: "test@test.com", message: 12345 } };
    validateLead(req, res, next);

    const errorPasado = next.mock.calls[0][0];
    expect(errorPasado.statusCode).toBe(400);
  });

  test("acepta datos válidos completos y limpia el body", () => {
    const req = {
      body: {
        name: "  Test Hernan  ",
        email: "  test@test.com  ",
        phone: "3411234567",
        message: "Quiero info",
      },
    };
    validateLead(req, res, next);

    expect(next).toHaveBeenCalledWith(); // sin argumentos = sin error
    expect(req.body).toEqual({
      name: "Test Hernan",
      email: "test@test.com",
      phone: "3411234567",
      message: "Quiero info",
    });
  });

  test("acepta datos válidos sin phone ni message (opcionales)", () => {
    const req = { body: { name: "Test", email: "test@test.com" } };
    validateLead(req, res, next);

    expect(next).toHaveBeenCalledWith();
    expect(req.body).toEqual({
      name: "Test",
      email: "test@test.com",
    });
  });

  test("rechaza campos mal nombrados (caso real del bug original)", () => {
    const req = {
      body: { nombre: "Test Hernan", mail: "test@test.com", celular: "3411234567" },
    };
    validateLead(req, res, next);

    const errorPasado = next.mock.calls[0][0];
    expect(errorPasado.statusCode).toBe(400);
  });
});
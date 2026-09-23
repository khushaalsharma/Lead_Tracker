import { Request, Response } from "express";
import {
  validateCreateLead,
  validateStatusUpdate,
} from "../src/middleware/validateLead";

function mockRes() {
  const res: Partial<Response> = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res as Response;
}

describe("validateCreateLead", () => {
  it("calls next() for a valid payload", () => {
    const req = {
      body: { name: "Jane Doe", email: "jane@example.com", phone: "9876543210" },
    } as Request;
    const res = mockRes();
    const next = jest.fn();

    validateCreateLead(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(res.status).not.toHaveBeenCalled();
  });

  it("rejects a missing name", () => {
    const req = {
      body: { email: "jane@example.com", phone: "9876543210" },
    } as Request;
    const res = mockRes();
    const next = jest.fn();

    validateCreateLead(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(next).not.toHaveBeenCalled();
  });

  it("rejects an invalid email", () => {
    const req = {
      body: { name: "Jane Doe", email: "not-an-email", phone: "9876543210" },
    } as Request;
    const res = mockRes();
    const next = jest.fn();

    validateCreateLead(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(next).not.toHaveBeenCalled();
  });

  it("rejects an invalid status", () => {
    const req = {
      body: {
        name: "Jane Doe",
        email: "jane@example.com",
        phone: "9876543210",
        status: "MADE_UP",
      },
    } as Request;
    const res = mockRes();
    const next = jest.fn();

    validateCreateLead(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
  });
});

describe("validateStatusUpdate", () => {
  it("calls next() for a valid status", () => {
    const req = { body: { status: "CONTACTED" } } as Request;
    const res = mockRes();
    const next = jest.fn();

    validateStatusUpdate(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
  });

  it("rejects a missing status", () => {
    const req = { body: {} } as Request;
    const res = mockRes();
    const next = jest.fn();

    validateStatusUpdate(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
  });
});

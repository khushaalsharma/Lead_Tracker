import request from "supertest";

jest.mock("../src/models/lead", () => {
  const actual = jest.requireActual("../src/models/lead");
  return {
    ...actual,
    createLead: jest.fn(),
    listLeads: jest.fn(),
    searchLeads: jest.fn(),
    getLeadById: jest.fn(),
    updateLeadStatus: jest.fn(),
  };
});

// Import app AFTER the mock so the routes pick up the mocked model.
// eslint-disable-next-line import/first
import app from "../src/app";
// eslint-disable-next-line import/first
import * as leadModel from "../src/models/lead";

const mockedModel = leadModel as jest.Mocked<typeof leadModel>;

const sampleLead = {
  id: "11111111-1111-1111-1111-111111111111",
  name: "Jane Doe",
  email: "jane@example.com",
  phone: "9876543210",
  status: "NEW",
  created_at: new Date().toISOString(),
};

beforeEach(() => {
  jest.clearAllMocks();
});

describe("GET /health", () => {
  it("returns ok", async () => {
    const res = await request(app).get("/health");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: "ok" });
  });
});

describe("POST /api/leads", () => {
  it("creates a lead with valid input", async () => {
    mockedModel.createLead.mockResolvedValue(sampleLead as any);

    const res = await request(app).post("/api/leads").send({
      name: "Jane Doe",
      email: "jane@example.com",
      phone: "9876543210",
    });

    expect(res.status).toBe(201);
    expect(res.body).toEqual(sampleLead);
    expect(mockedModel.createLead).toHaveBeenCalledTimes(1);
  });

  it("rejects invalid input with 400", async () => {
    const res = await request(app).post("/api/leads").send({ name: "J" });

    expect(res.status).toBe(400);
    expect(mockedModel.createLead).not.toHaveBeenCalled();
  });
});

describe("GET /api/leads", () => {
  it("lists all leads when no query is provided", async () => {
    mockedModel.listLeads.mockResolvedValue([sampleLead as any]);

    const res = await request(app).get("/api/leads");

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
    expect(mockedModel.listLeads).toHaveBeenCalledTimes(1);
    expect(mockedModel.searchLeads).not.toHaveBeenCalled();
  });

  it("searches leads when a query is provided", async () => {
    mockedModel.searchLeads.mockResolvedValue([sampleLead as any]);

    const res = await request(app).get("/api/leads?q=jane");

    expect(res.status).toBe(200);
    expect(mockedModel.searchLeads).toHaveBeenCalledWith("jane");
    expect(mockedModel.listLeads).not.toHaveBeenCalled();
  });
});

describe("PATCH /api/leads/:id/status", () => {
  it("updates a lead's status", async () => {
    mockedModel.updateLeadStatus.mockResolvedValue({
      ...sampleLead,
      status: "CONTACTED",
    } as any);

    const res = await request(app)
      .patch(`/api/leads/${sampleLead.id}/status`)
      .send({ status: "CONTACTED" });

    expect(res.status).toBe(200);
    expect(res.body.status).toBe("CONTACTED");
  });

  it("returns 404 when the lead does not exist", async () => {
    mockedModel.updateLeadStatus.mockResolvedValue(null);

    const res = await request(app)
      .patch(`/api/leads/does-not-exist/status`)
      .send({ status: "CONTACTED" });

    expect(res.status).toBe(404);
  });

  it("rejects an invalid status with 400", async () => {
    const res = await request(app)
      .patch(`/api/leads/${sampleLead.id}/status`)
      .send({ status: "NOT_REAL" });

    expect(res.status).toBe(400);
    expect(mockedModel.updateLeadStatus).not.toHaveBeenCalled();
  });
});

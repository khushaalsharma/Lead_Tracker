import request from "supertest";

jest.mock("../src/models/lead", () => {
  const actual = jest.requireActual("../src/models/lead");
  return {
    ...actual,
    createLead: jest.fn(),
    listLeads: jest.fn(),
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
  it("returns the first page of leads by default", async () => {
    mockedModel.listLeads.mockResolvedValue({
      leads: [sampleLead as any],
      total: 1,
      page: 1,
      pageSize: 10,
    });

    const res = await request(app).get("/api/leads");

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ total: 1, page: 1, pageSize: 10 });
    expect(res.body.leads).toHaveLength(1);
    expect(mockedModel.listLeads).toHaveBeenCalledWith(1, 10, undefined);
  });

  it("paginates search results", async () => {
    mockedModel.listLeads.mockResolvedValue({
      leads: [sampleLead as any],
      total: 21,
      page: 2,
      pageSize: 10,
    });

    const res = await request(app).get("/api/leads?q=jane&page=2&pageSize=10");

    expect(res.status).toBe(200);
    expect(mockedModel.listLeads).toHaveBeenCalledWith(2, 10, "jane");
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

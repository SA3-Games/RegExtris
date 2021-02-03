// global describe beforeEach it

const { expect } = require("chai");
const request = require("supertest");
const { db } = require("../db");
// const app = require('../index')
const Player = db.model("player");

describe("Player routes", () => {
  beforeEach(() => {
    return db.sync({ force: true });
  });

  describe("/api/player/", () => {
    const codysAlias = "codyThePug";
    const codysPassword = "puglife";

    beforeEach(() => {
      return Player.create({
        alias: codysAlias,
        password: codysPassword,
      });
    });

    it("GET /api/players", async () => {
      const res = await request(app).get("/api/players").expect(200);

      expect(res.body).to.be.an("array");
      expect(res.body[0].alias).to.be.equal(codysAlias);
    });
  }); // end describe('/api/users')
}); // end describe('User routes')

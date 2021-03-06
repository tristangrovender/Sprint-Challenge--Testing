const server = require("./server");
const request = require("supertest");
const db = require("../data/dbConfig");
const Games = require("./games");

describe("server.js", () => {
  describe("/POST", () => {
    afterEach(async () => {
      await db("games").truncate();
    });

    it("should return 200 when posting is complete", () => {
      return request(server)
        .post("/games")
        .send({ title: "test", genre: "test", releaseYear: "1960" })
        .expect(200);
    });

    it("should return 422 when posting is incomplete", () => {
      return request(server)
        .post("/games")
        .send({ title: "test" })
        .expect(422);
    });

    it("should return an object", async () => {
      const body = {
        title: "Pong",
        genre: "Arcade",
        releaseYear: 1972
      };
      const res = await request(server)
        .post("/games")
        .send(body);
      expect(typeof res.body).toEqual("object");
    });
  });

  describe("/GET", () => {
    afterEach(() => {
      db("games").truncate();
    });

    it("should return status code 200", async () => {
      const res = await request(server).get("/games");
      expect(res.status).toBe(200);
    });

    it("should return an empty array", async () => {
      const res = await request(server).get("/games");

      expect(Array.isArray(res.body)).toEqual(true);
    });

    it("should return an array with the new game created", async () => {
      const game = {
        title: "test",
        genre: "test",
        releaseYear: "2013"
      };

      await Games.insert(game);

      const res = await request(server).get("/games");

      expect(res.body[0].title).toEqual(game.title);
    });
  });
});

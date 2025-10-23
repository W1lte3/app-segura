const request = require("supertest");
const appFactory = ()=> require("http").createServer(require("../src/index"));
test("health", async ()=>{
  const server = appFactory();
  const res = await request(server).get("/health");
  expect(res.statusCode).toBe(200);
});
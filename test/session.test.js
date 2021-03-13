const request = require("supertest");
const chai = require("chai");
const expect = chai.expect;
const app = require("../app");
const model = require("../src/sessionModel");
const userModel = require("../src/userModel");

let id;
const email = "sess@auth.com";
const password = "test";
const name = "Session Tester";
let session;

describe("session api calls", () => {
  before(async () => {
    await model.collection.drop();
    //await userModel.collection.drop();
    // await userModel.init();
    //await userModel.syncIndexes();
    await model.init();
    await model.syncIndexes();
      // Add user
    const newUser = new userModel({
        email: email,
        password: password,
        name: name,
      });
      const data = await newUser.save();    
      id = "" + data._id;
  });

  describe("add session by POST /user/session/register", () => {
    it("user should be added", (done) => {
      request(app)
        .post("/user/session/register")
        .set("Content-Type", "application/json")
        .send({ "id": id})
        .end((err, res) => {
          expect(res.status).to.eq(200);
          session = res.body;
          done();
        });
    });
  });

  describe("login using session by POST /user/session/login", () => {
    it("user data should be received", (done) => {
      request(app)
        .post("/user/session/login")
        .set("Content-Type", "application/json")
        .send({ "session": session })
        .end((err, res) => {
          expect(res.status).to.eq(200);
          expect(res.body.id).to.eq(id);
          expect(res.body.name).to.eq(name);
          expect(res.body.email).to.eq(email);
          done();
        });
    });
  });
});

const request = require("supertest");
const chai = require("chai");
const expect = chai.expect;
const app = require("../app");
const model = require("../src/userModel");

describe("user api calls", () => {
  before(async () => {
    await model.collection.drop();
    await model.init();
    await model.syncIndexes();
  });
  const email = "mern@auth.com";
  const password = "test";
  let user;

  describe("insert user by POST /register", () => {
    it("user should be added", (done) => {
      request(app)
        .post("/user/register")
        .set("Content-Type", "application/json")
        .send({ email: email, password: password })
        .end((err, res) => {
          expect(res.status).to.eq(200);
          user = res.body;
          expect(res.body.email).to.eq(email);
          done();
        });
    });

    it("should get error if existing email is used", (done) => {
      request(app)
        .post("/user/register")
        .set("Content-Type", "application/json")
        .send({ email: email, password: "pass" })
        .end((err, res) => {
          expect(res.statusCode).to.eq(401);
          expect(res.text).to.eq("Email already in use");
          done();
        });
    });
  });

  describe("login using registered email and password", () => {
    it("user data should be received", (done) => {
      request(app)
        .post("/user/login")
        .set("Content-Type", "application/json")
        .send({ email: email, password: password })
        .end((err, res) => {
          expect(res.status).to.eq(200);
          expect(res.body.id).to.eq(user.id);
          done();
        });
    });

    it("should get error if incorrect password is used", (done) => {
      request(app)
        .post("/user/login")
        .set("Content-Type", "application/json")
        .send({ email: email, password: "pass" })
        .end((err, res) => {
          expect(res.status).to.eq(401);
          expect(res.text).to.eq("Incorrect password");
          done();
        });
    });
  });

  describe("update user data by POST /update", () => {
    const existingMail = "user2@test.com";
    before(async () => {
      const newUser = new model({
        email: existingMail,
        password: "123456",
        name: "User 2",
      });
      await newUser.save();
    });

    it("user data should get updated", (done) => {
      const name = "New Name";
      request(app)
        .post("/user/update")
        .set("Content-Type", "application/json")
        .send({ id:user.id, name: name })
        .end((err, res) => {
          expect(res.status).to.eq(200);
          expect(res.body.name).to.eq(name);
          user = res.body;
          done();
        });
    });

    it("should get error if email is changed to another existing one", (done) => {
      request(app)
        .post("/user/update")
        .set("Content-Type", "application/json")
        .send({ id:user.id, email: existingMail, name: "dude" })
        .end((err, res) => {
          expect(res.status).to.eq(401);
          expect(res.text).to.eq("Email already in use");
          done();
        });
    });
  });
});

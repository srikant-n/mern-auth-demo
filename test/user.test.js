const request = require("supertest");
const chai = require("chai");
const expect = chai.expect;
const app = require("../app");
const model = require("../src/userModel");

describe("user api calls", () => {
  before(() => {
    model.collection.drop();
  });
  const email = "mern@auth.com";
  const password = "test";
  let user;

  describe("insert user by POST /register", () => {
    it("user should be added", (done) => {
      request(app)
        .post("/register")
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
        .post("/register")
        .set("Content-Type", "application/json")
        .send({ email: email, password: "pass" })
        .end((err, res) => {
          expect(res.status).to.eq(401);
          expect(res.statusText).to.eq("Email already in use");
          done();
        });
    });
  });

  describe("login using registered email and password", () => {
    it("user data should be received", (done) => {
      request(app)
        .post("/login")
        .set("Content-Type", "application/json")
        .send({ email: email, password: password })
        .end((err, res) => {
          expect(res.status).to.eq(200);
          expect(res.body).to.eq(user);
          done();
        });
    });

    it("should get error if incorrect password is used", (done) => {
      request(app)
        .post("/login")
        .set("Content-Type", "application/json")
        .send({ email: email, password: "pass" })
        .end((err, res) => {
          expect(res.status).to.eq(401);
          expect(res.statusText).to.eq("Incorrect password");
          done();
        });
    });
  });

  describe("update user data by POST /update", () => {
    const existingMail = "user2@test.com";
    before(() => {
      const newUser = new model({
        email: existingMail,
        password: "123456",
        name: "User 2",
      });
      newUser.save();
    });
    it("user data should get updated", (done) => {
      const name = "New Name";
      request(app)
        .post("/update")
        .set("Content-Type", "application/json")
        .send({ name: name })
        .end((err, res) => {
          expect(res.status).to.eq(200);
          expect(res.body.name).to.eq(name);
          user = res.body;
          done();
        });
    });

    it("should get error if email is changed to another existing one", (done) => {
      request(app)
        .post("/update")
        .set("Content-Type", "application/json")
        .send({ email: existingMail, name: "dude" })
        .end((err, res) => {
          expect(res.status).to.eq(401);
          expect(res.statusText).to.eq("Email already in use");
          done();
        });
    });
  });
});

import React from "react";
import { fireEvent, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Login from "./Login";
import UserData from "../UserData";

const fetchMock = require("fetch-mock-jest");

describe("login and register form toggle", () => {
  test("Login button should be there if isLogin=true", () => {
    const { getByText } = render(
      <Login isLogin={true} onLoginToggle={jest.fn} onLogin={jest.fn} />
    );
    // Login is there
    expect(getByText("Login")).toBeInTheDocument();
    // Register is not there
    expect(getByText("Register")).not.toBeInTheDocument();
  });

  test("Register button should be there if isLogin=false", () => {
    const { getByText } = render(
      <Login isLogin={false} onLoginToggle={jest.fn} onLogin={jest.fn} />
    );
    // Login is not there
    expect(getByText("Login")).not.toBeInTheDocument();
    // Register is there
    expect(getByText("Register")).toBeInTheDocument();
  });

  test("Login menu toggle is called on clicking register/login", () => {
    const onToggle = jest.fn();
    const { getByText } = render(
      <Login isLogin={true} onLoginToggle={onToggle} onLogin={jest.fn} />
    );
    fireEvent.click(getByText("register"));
    // The mock function is called once
    expect(onToggle.mock.calls.length).toBe(1);
  });
});

describe("login functionality", () => {
  afterEach(() => {
    fetchMock.restore();
  });

  test("should receive mocked UserData on clicking login with email and password", () => {
    const email = "auth@mern.com";
    const password = "password";
    const userData: UserData = {
      id: "0",
      name: "Test User",
      photo: "",
      bio: "I am a test user created for unit tests",
      website: "www.test.com",
      email: email,
    };
    const onLogin = jest.fn((userData: UserData) => {});

    fetchMock.postOnce("/login", userData);

    const { getByLabelText, getByText } = render(
      <Login isLogin={true} onLoginToggle={jest.fn} onLogin={onLogin} />
    );

    const emailField = getByLabelText(/email/i);
    const passwordField = getByLabelText(/password/i);
    userEvent.type(emailField, email);
    userEvent.type(passwordField, password);
    fireEvent.click(getByText("Login"));

    // The mock function is called once
    expect(onLogin.mock.calls.length).toBe(1);
    // The argument is the userdata obtained from fetch
    expect(onLogin.mock.calls[0][0]).toBe(userData);
  });

  test("error is displayed if password is incorrect", () => {
    const email = "auth@mern.com";
    const password = "password";
    const error = "Incorrect password";
    fetchMock.postOnce("/login", { status: 401, statusText: error });
    const { getByText, getByLabelText } = render(
      <Login isLogin={true} onLoginToggle={jest.fn} onLogin={jest.fn} />
    );
    const emailField = getByLabelText(/email/i);
    const passwordField = getByLabelText(/password/i);
    userEvent.type(emailField, email);
    userEvent.type(passwordField, password);
    fireEvent.click(getByText("Login"));
    expect(getByText(error)).toBeInTheDocument();
  });
});

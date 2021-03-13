import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LoginOrRegister from "./LoginOrRegister";
import UserData from "../UserData";
import { BrowserRouter } from "react-router-dom";

const fetchMock = require("fetch-mock-jest");

describe("login and register form", () => {
  test("Login button should be there if isLogin=true", () => {
    const { getByDisplayValue, queryByDisplayValue } = render(
      <BrowserRouter>
        <LoginOrRegister isLogin={true} onLogin={jest.fn} />
      </BrowserRouter>
    );
    // Login is there
    expect(getByDisplayValue("Login")).toBeInTheDocument();
    // Register is not there
    expect(queryByDisplayValue("Register")).not.toBeInTheDocument();
  });

  test("Register button should be there if isLogin=false", () => {
    const { getByDisplayValue, queryByDisplayValue } = render(
      <BrowserRouter>
        <LoginOrRegister isLogin={false} onLogin={jest.fn} />
      </BrowserRouter>
    );
    // Login is not there
    expect(queryByDisplayValue("Login")).not.toBeInTheDocument();
    // Register is there
    expect(getByDisplayValue("Register")).toBeInTheDocument();
  });
});

describe("login functionality", () => {
  afterEach(() => {
    fetchMock.restore();
  });

  test("should receive mocked UserData on clicking login with email and password", async () => {
    const email = "auth@mern.com";
    const password = "password";
    const userData: UserData = {
      id: "0",
      name: "Test User",
      photo: "",
      bio: "I am a test user created for unit tests",
      phone: "123456789",
      email: email,
    };
    // const onLogin = jest.fn((userData?: UserData) => {});
    const onLogin = jest.fn((userData: UserData) => {});

    fetchMock.postOnce("/user/login", userData);

    const { getByPlaceholderText, getByText } = render(
      <BrowserRouter>
        <LoginOrRegister isLogin={true} onLogin={onLogin} />
      </BrowserRouter>
    );

    const emailField = getByPlaceholderText(/email/i);
    const passwordField = getByPlaceholderText(/password/i);
    userEvent.type(emailField, email);
    userEvent.type(passwordField, password);
    fireEvent.click(getByText("Login"));

    await new Promise((r) => setTimeout(r, 100));

    // The mock function is called once
    expect(onLogin.mock.calls.length).toBe(1);
    // The argument is the userdata obtained from fetch
    expect(onLogin.mock.calls[0][0]).toStrictEqual(userData);
  });

  test("error is displayed if password is incorrect", async () => {
    const email = "auth@mern.com";
    const password = "password";
    const error = "Incorrect password";
    fetchMock.postOnce("/user/login", { ok:false, status: 401, statusText: error });
    const { getByText, getByPlaceholderText } = render(
      <BrowserRouter>
        <LoginOrRegister isLogin={true} onLogin={jest.fn} />
      </BrowserRouter>
    );
    const emailField = getByPlaceholderText(/email/i);
    const passwordField = getByPlaceholderText(/password/i);
    userEvent.type(emailField, email);
    userEvent.type(passwordField, password);
    fireEvent.click(getByText("Login"));
    await new Promise((r) => setTimeout(r, 100));
    expect(await screen.findByText(error)).toBeInTheDocument();
  });
});

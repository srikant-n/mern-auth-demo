import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import App from "./App";
import UserData from "./UserData";
import { BrowserRouter } from "react-router-dom";

const fetchMock = require("fetch-mock-jest");

afterEach(() => {
  fetchMock.restore();
});

test("profile should be visible with data after login", async () => {
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

  fetchMock.postOnce("/user/login", userData);

  const { getByPlaceholderText, getByLabelText, getByText } = render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );

  const emailField = getByPlaceholderText(/email/i);
  const passwordField = getByPlaceholderText(/password/i);
  fireEvent.change(emailField, { value: email });
  fireEvent.change(passwordField, { value: password });
  fireEvent.click(getByText("Login"));

  expect(await screen.findByLabelText(/name/i)).toBeInTheDocument();
  expect(getByLabelText(/name/i)).toHaveValue(userData.name);
  // expect(getByLabelText(/photo/i)).toHaveValue(userData.photo);
  expect(getByText(userData.bio!)).toBeInTheDocument();
  expect(getByLabelText(/email/i)).toHaveValue(userData.email);
  expect(getByLabelText(/phone/i)).toHaveValue(userData.phone);
});


describe("login and register page", ()=>{
  test("Login menu is toggled on clicking register/login", async () => {
    const { getByText } = render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );
    fireEvent.click(getByText("Register"));
  
    expect(await screen.findByText("Login")).toBeInTheDocument();
  });

  
});
import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import App from './App';
import UserData from './UserData';

const fetchMock = require("fetch-mock-jest");

test("profile should be visible with data after login", async () => {
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

  fetchMock.postOnce("/login", userData);

  const { getByLabelText, getByText } = render(
    <App />
  );

  const emailField = getByLabelText(/email/i);
  const passwordField = getByLabelText(/password/i);
  fireEvent.change(emailField, {value: email});
  fireEvent.change(passwordField, {value: password});
  fireEvent.click(getByText("Login"));

  expect(await screen.findAllByLabelText("Name")).toBeInTheDocument();
  expect(getByLabelText("Name")).toHaveValue(userData.name);
  expect(getByLabelText("Photo")).toHaveValue(userData.photo);
  expect(getByLabelText("Bio")).toHaveValue(userData.bio);
  expect(getByLabelText("Email")).toHaveValue(userData.email);
  expect(getByLabelText("Website")).toHaveValue(userData.website);
});
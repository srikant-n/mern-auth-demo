import React from "react";
import { fireEvent, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Profile from "./Profile";
import UserData from "../UserData";

const fetchMock = require("fetch-mock-jest");

const userData: UserData = {
  id: "0",
  name: "Test User",
  photo: "",
  bio: "I am a test user created for unit tests",
  website: "www.test.com",
  email: "email@mailcom",
};

describe("profile edit and save", () => {
  test("fields are not editable by default", () => {
    const { getByLabelText } = render(<Profile user={userData} onUpdateUser={jest.fn} />);

    expect(getByLabelText("Name")).toHaveAttribute("readOnly");
    expect(getByLabelText("Photo")).toHaveAttribute("readOnly");
    expect(getByLabelText("Bio")).toHaveAttribute("readOnly");
    expect(getByLabelText("Email")).toHaveAttribute("readOnly");
    expect(getByLabelText("Website")).toHaveAttribute("readOnly");
    expect(getByLabelText("Password")).toHaveAttribute("readOnly");
  });

  test("fields are editable after clicking edit button", () => {
    const { getByLabelText, getByText } = render(<Profile user={userData} onUpdateUser={jest.fn} />);

    // Click on edit
    fireEvent.click(getByText("Edit"));

    expect(getByLabelText("Name")).not.toHaveAttribute("readOnly");
    expect(getByLabelText("Photo")).not.toHaveAttribute("readOnly");
    expect(getByLabelText("Bio")).not.toHaveAttribute("readOnly");
    expect(getByLabelText("Email")).not.toHaveAttribute("readOnly");
    expect(getByLabelText("Website")).not.toHaveAttribute("readOnly");
    expect(getByLabelText("Password")).not.toHaveAttribute("readOnly");
  });

  test("edited value is saved and sent to callback", () => {
    const userDataUpdated: UserData = {
      id: "0",
      name: "Tested User",
      photo: "",
      bio: "I am a test user created for unit tests",
      website: "www.test.com",
      email: "email@mailcom",
    };

    fetchMock.postOnce("/update", userDataUpdated);

    const onUpdateUser = jest.fn((user: UserData) => {});
    const { getByLabelText, getByText } = render(
      <Profile user={userData} onUpdateUser={onUpdateUser} />
    );
    // Click on edit
    fireEvent.click(getByText("Edit"));
    // Change name
    userEvent.type(getByLabelText("Name"), userDataUpdated.name!);
    // Save
    fireEvent.click(getByText("Save"));
    // Updated data received
    expect(onUpdateUser.mock.calls[0][0]).toBe(userDataUpdated);
  });
});

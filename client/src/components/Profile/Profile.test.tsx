import React from "react";
import { fireEvent, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Profile from "./Profile";
import UserData from "../../UserData";

const fetchMock = require("fetch-mock-jest");

const userData: UserData = {
  id: "0",
  name: "Test User",
  photo: "",
  bio: "I am a test user created for unit tests",
  phone: "123456789",
  email: "email@mailcom",
};

describe("profile edit and save", () => {
  test("fields are not editable by default", () => {
    const { getByLabelText, getByText } = render(<Profile user={userData} onUpdateUser={jest.fn} />);

    expect(getByLabelText(/name/i)).toHaveAttribute("readOnly");
    expect(getByText(userData.bio!)).not.toHaveAttribute("rows");
    expect(getByLabelText(/email/i)).toHaveAttribute("readOnly");
    expect(getByLabelText(/phone/i)).toHaveAttribute("readOnly");
    expect(getByLabelText(/password/i)).toHaveAttribute("readOnly");
  });

  test("fields are editable after clicking edit button", () => {
    const { getByLabelText, getByText } = render(
      <Profile user={userData} onUpdateUser={jest.fn} />
    );

    // Click on edit
    fireEvent.click(getByText("Edit"));

    expect(getByLabelText(/name/i)).not.toHaveAttribute("readOnly");
    expect(getByLabelText(/bio/i)).not.toHaveAttribute("readOnly");
    expect(getByLabelText(/bio/i)).toHaveAttribute("rows");
    expect(getByLabelText(/email/i)).not.toHaveAttribute("readOnly");
    expect(getByLabelText(/phone/i)).not.toHaveAttribute("readOnly");
    expect(getByLabelText(/password/i)).not.toHaveAttribute("readOnly");
  });

  test("edited value is saved and sent to callback", async () => {
    const userDataUpdated: UserData = {
      id: "0",
      name: "Tested User",
      photo: "",
      bio: "I am a test user created for unit tests",
      phone: "123465789",
      email: "email@mailcom",
    };

    fetchMock.postOnce("/user/update", userDataUpdated);

    const onUpdateUser = jest.fn((user: UserData) => {});
    const { getByLabelText, getByText } = render(
      <Profile user={userData} onUpdateUser={onUpdateUser} />
    );
    // Click on edit
    fireEvent.click(getByText("Edit"));
    await new Promise((r) => setTimeout(r, 1000));
    // Change name
    userEvent.type(getByLabelText(/name/i), userDataUpdated.name!);
    // Save
    fireEvent.click(getByText("Save"));
    await new Promise((r) => setTimeout(r, 1000));
    // Updated data received
    expect(onUpdateUser.mock.calls[0][0]).toStrictEqual(userDataUpdated);
  });
});

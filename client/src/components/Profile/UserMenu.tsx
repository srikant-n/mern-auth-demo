import React, { FC, useEffect, useState } from "react";
import { ProfileIcon, ChatIcon, LogoutIcon } from "../../icons";
import "./UserMenu.css";

/**
 * 
 * @param props Required properties
 * @returns UserMenu Component
 */
function UserMenu(props: {
  isVisible: boolean;
  onClickMenuItem: (item: string) => void;
  onClose: () => void;
}) {
  const [open, setOpen] = useState<boolean>(true);
  const [addAnimation, setAddAnimation] = useState<boolean>(false);

  /**
   * Add listener and animation based on visibilitiy
   */
  useEffect(() => {
    // Add listener if open and visible
    if (open && props.isVisible) {
      setAddAnimation(true);
      window.addEventListener("click", closeMenuOnBodyClick);
    }
    return function cleanup() {
      if (open) {
        window.removeEventListener("click", closeMenuOnBodyClick);
      }
    };
  }, [open,props.isVisible]);

  /**
   * Close the menu if user clicks outside
   * @param event Click event
   */
  function closeMenuOnBodyClick(event: any):void {
    // get the event path
    const path = event.composedPath();
    // check if it has the menu element
    if (path.some((elem: { id: string }) => elem.id === "user-menu")) {
      // terminate this function if it does
      return;
    }
    setOpen(false);
  }

  /**
   * Get a menu item component
   * @param Icon Icon for the menu item
   * @param name Menu item name
   * @param onClick Action on clicking item
   * @returns MenuItem component
   */
  function menuItem(Icon: FC, name: string, onClick?: () => void) {
    return (
      <div className={"menu-item" + (onClick ? "" : " disabled")} onClick={onClick}>
        <Icon />
        <p>{name}</p>
      </div>
    );
  }

  /**
   * Transition ended
   */
  function onTransitionEnd() {
    if (!open) {
      // Notify to close
      props.onClose();
      // For next time
      setOpen(true);
      setAddAnimation(false);
    }
  }

  return props.isVisible ? (
    <div
      id="user-menu"
      className={"user-menu " + (addAnimation ? (open ? "open" : "close") : "")}
      onTransitionEnd={onTransitionEnd}>
      {menuItem(ProfileIcon, "Profile", () => props.onClickMenuItem("profile"))}
      {menuItem(ChatIcon, "Group Chat", undefined)}
      <hr />
      {menuItem(LogoutIcon, "Logout", () => props.onClickMenuItem("logout"))}
    </div>
  ) : (
    <div />
  );
}

export default UserMenu;

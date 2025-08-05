import React from "react";
import { FriendsProvider } from "./FriendsContext";
import { SavedPostsProvider } from "./SavedPostsContext";
import useUser from "../hooks/useUser";

// Combined provider component for easier usage
export const SocialContextProvider = ({ children }) => {
  const { user, jwt } = useUser();

  return (
    <FriendsProvider user={user} token={jwt}>
      <SavedPostsProvider user={user} token={jwt}>
        {children}
      </SavedPostsProvider>
    </FriendsProvider>
  );
};

// Alternative: Separate providers if you need more control
export const FriendsContextWrapper = ({ children }) => {
  const { user, jwt } = useUser();

  return (
    <FriendsProvider user={user} token={jwt}>
      {children}
    </FriendsProvider>
  );
};

export const SavedPostsContextWrapper = ({ children }) => {
  const { user, jwt } = useUser();

  return (
    <SavedPostsProvider user={user} token={jwt}>
      {children}
    </SavedPostsProvider>
  );
};

export default SocialContextProvider;

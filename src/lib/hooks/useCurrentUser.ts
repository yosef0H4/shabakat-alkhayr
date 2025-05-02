import { useQuery } from "convex/react";
import { useConvexAuth } from "convex/react";
import { api } from "../../../convex/_generated/api";

export function useCurrentUser() {
  const { isAuthenticated, isLoading: isAuthLoading } = useConvexAuth();
  const user = useQuery(api.auth.loggedInUser);
  const identity = useQuery(api.auth.getIdentity);
  
  return {
    user,
    userId: user?._id,
    subjectId: identity?.subject,
    isLoading: isAuthLoading || (isAuthenticated && user === undefined),
    isAuthenticated: isAuthenticated && user !== null,
  };
} 
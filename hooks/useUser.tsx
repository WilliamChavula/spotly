import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  useSessionContext,
  useUser as useSupabaseUser,
} from "@supabase/auth-helpers-react";

import { User } from "@supabase/auth-helpers-nextjs";
import { Subscription, UserDetails } from "@/types";

type UserContextType = {
  accessToken: string | null;
  user: User | null;
  userDetails: UserDetails | null;
  isActive: boolean;
  subscription: Subscription | null;
  isLoading: boolean;
};
export interface Props {
  [propName: string]: any;
}

export const UserContext = createContext<UserContextType | undefined>(
  undefined
);

export const CustomUserContextProvider = (props: Props) => {
  const { session, supabaseClient, isLoading } = useSessionContext();
  const user = useSupabaseUser();
  const accessToken = session?.access_token ?? null;

  const [isLoadingData, setIsLoadingData] = useState(false);
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);

  const getUserDetails = useCallback(
    () => supabaseClient.from("users").select("*").single(),
    [supabaseClient]
  );
  const getSubscriptions = useCallback(
    () =>
      supabaseClient
        .from("subscriptions")
        .select("*, prices(*, products(*))")
        .in("status", ["trialing", "active"])
        .single(),
    [supabaseClient]
  );

  useEffect(() => {
    if (user && !isLoadingData && !userDetails && !subscription) {
      setIsLoadingData(true);
      Promise.allSettled([getUserDetails(), getSubscriptions()]).then(
        (results) => {
          const [userDetailsPromiseObject, subscriptionPromiseObject] = results;

          if (userDetailsPromiseObject.status === "fulfilled")
            setUserDetails(userDetailsPromiseObject.value.data as UserDetails);
          if (subscriptionPromiseObject.status === "fulfilled")
            setSubscription(
              subscriptionPromiseObject.value.data as Subscription
            );

          setIsLoadingData(false);
        }
      );
    } else {
      if (!user && !isLoading && !isLoadingData) {
        setUserDetails(null);
        setSubscription(null);
      }
    }
  }, [
    getSubscriptions,
    getUserDetails,
    isLoading,
    isLoadingData,
    subscription,
    user,
    userDetails,
  ]);

  const value = {
    accessToken,
    user,
    userDetails,
    isActive: false,
    subscription,
    isLoading: isLoading || isLoadingData,
  };

  return <UserContext.Provider value={value} {...props} />;
};

export const useUser = () => {
  const context = useContext(UserContext);

  if (context === undefined)
    throw new Error(
      "useUser hook must be used within a CustomUserContextProvider component"
    );

  return context;
};

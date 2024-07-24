import React, { useContext, useState } from "react";
import { UserDetails } from "../components/Dashboard/Dashboard";
import { Topic } from "../components/Topics/Topics";

type AppContext = {
  userDetails?: UserDetails;
  updateUserDetail: (user?: UserDetails) => void;
  event: string;
  updateEvent: (event: string) => void;
  topics: Topic[];
  updateTopics: (topics: Topic[]) => void;
};

const AppContext = React.createContext<AppContext | undefined>(undefined);

export const AppContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [userDetails, setUserDetails] = useState<UserDetails | undefined>(
    undefined
  );

  const [event, setEvent] = useState<string>("");
  const [topics, setTopics] = useState<Topic[]>([]);

  const updateUserDetail = (user?: UserDetails) => {
    setUserDetails(user);
  };

  const updateEvent = (event: string) => {
    setEvent(event);
  };

  const updateTopics = (topics: Topic[]) => {
    setTopics(topics);
  };

  return (
    <AppContext.Provider
      value={{
        userDetails,
        updateUserDetail,
        event,
        updateEvent,
        topics,
        updateTopics,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  return context as AppContext;
};

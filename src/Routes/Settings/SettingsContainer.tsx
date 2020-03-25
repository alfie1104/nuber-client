import React from "react";
import { Mutation, Query } from "react-apollo";
import { LOG_USER_OUT } from "src/sharedQueries.local";
import SettingsPresenter from "./SettingsPresenter";
import { userProfile } from "../../types/api";
import { USER_PROFILE } from "src/sharedQueries";

class MiniProfileQuery extends Query<userProfile> {}
class SettingsContainer extends React.Component {
  public render() {
    return (
      <Mutation mutation={LOG_USER_OUT}>
        {logUserOut => (
          <MiniProfileQuery query={USER_PROFILE}>
            {({ data, loading: userDataLoading }) => (
              <SettingsPresenter
                userDataLoading={userDataLoading}
                logUserOut={logUserOut}
                userData={data}
              />
            )}
          </MiniProfileQuery>
        )}
      </Mutation>
    );
  }
}

export default SettingsContainer;

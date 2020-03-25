import React from "react";
import { Mutation, Query } from "react-apollo";
import { LOG_USER_OUT } from "src/sharedQueries.local";
import SettingsPresenter from "./SettingsPresenter";
import { userProfile, getPlaces } from "../../types/api";
import { USER_PROFILE, GET_PLACES } from "src/sharedQueries";

class MiniProfileQuery extends Query<userProfile> {}

class PlacesQuery extends Query<getPlaces> {}

class SettingsContainer extends React.Component {
  public render() {
    return (
      <Mutation mutation={LOG_USER_OUT}>
        {logUserOut => (
          <MiniProfileQuery query={USER_PROFILE}>
            {({ data: userData, loading: userDataLoading }) => (
              <PlacesQuery query={GET_PLACES}>
                {({ data: placesData, loading: placesLoading }) => (
                  <SettingsPresenter
                    userDataLoading={userDataLoading}
                    logUserOut={logUserOut}
                    userData={userData}
                    placesData={placesData}
                    placesLoading={placesLoading}
                  />
                )}
              </PlacesQuery>
            )}
          </MiniProfileQuery>
        )}
      </Mutation>
    );
  }
}

export default SettingsContainer;

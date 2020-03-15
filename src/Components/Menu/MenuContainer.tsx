import React from "react";
import MenuPresenter from "./MenuPresenter";
import { Query } from "react-apollo";
import { userProfile } from "src/types/api";
import { USER_PROFILE } from "src/sharedQueries";

class ProfileQuery extends Query<userProfile> {}
class MenuContainer extends React.Component {
  render() {
    return (
      <ProfileQuery query={USER_PROFILE}>
        {({ data, loading }) => <MenuPresenter data={data} loading={loading} />}
      </ProfileQuery>
    );
  }
}

export default MenuContainer;

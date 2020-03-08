import React from "react";
import SocialLoginPresenter from "./SocialLoginPresenter";
import { Mutation } from "react-apollo";
import { facebookConnect, facebookConnectVariables } from "src/types/api";
import { FACEBOOK_CONNECT } from "./SocialLoginQueries";
import { RouteComponentProps } from "react-router-dom";

class LoginMutation extends Mutation<
  facebookConnect,
  facebookConnectVariables
> {}

interface IState {
  firstName: string;
  lastName: string;
  email?: string;
  fbId: string;
}

interface IProps extends RouteComponentProps<any> {}

class SocialLoginContainer extends React.Component<IProps, IState> {
  public render() {
    return (
      <LoginMutation mutation={FACEBOOK_CONNECT}>
        {(mutation, { loading }) => {
          return <SocialLoginPresenter />;
        }}
      </LoginMutation>
    );
  }
}

export default SocialLoginContainer;

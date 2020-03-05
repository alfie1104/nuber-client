import React from "react";
import VerifyPhonePresenter from "./VerifyPhonePresenter";
import { RouteComponentProps } from "react-router-dom";
import { Mutation } from "react-apollo";
import { verifyPhone, verifyPhoneVariables } from "src/types/api";
import { VERIFY_PHONE } from "./VerifyPhoneQueries";

interface IProps extends RouteComponentProps<any> {
  location: any;
}
interface IState {
  key: string;
  phoneNumber: string;
}

class VerifyMutation extends Mutation<verifyPhone, verifyPhoneVariables> {}

class VerifyPhoneContainer extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    if (!props.location.state) {
      props.history.push("/");
    }

    this.state = {
      key: "",
      phoneNumber: props.location.state.phone
    };
  }

  public onInputChange: React.ChangeEventHandler<HTMLInputElement> = event => {
    const {
      target: { name, value }
    } = event;
    this.setState({
      [name]: value
    } as any);
  };

  public render() {
    const { key, phoneNumber } = this.state;
    return (
      <VerifyMutation
        mutation={VERIFY_PHONE}
        variables={{
          key,
          phoneNumber
        }}
      >
        {(mutation, { loading }) => (
          <VerifyPhonePresenter onChange={this.onInputChange} key={key} />
        )}
      </VerifyMutation>
    );
  }
}

export default VerifyPhoneContainer;

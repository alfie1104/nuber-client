import React from "react";
import AddPlacePresenter from "./AddPlacePresenter";
import { RouteComponentProps } from "react-router-dom";

interface IState {
  address: string;
  name: string;
}

interface IProps extends RouteComponentProps<any> {}

class AddPlaceContainer extends React.Component<IProps, IState> {
  public state = {
    address: "",
    name: ""
  };
  public render() {
    const { address, name } = this.state;
    return (
      <AddPlacePresenter
        address={address}
        name={name}
        onInputChange={this.onInputChange}
        loading={false}
      />
    );
  }

  public onInputChange: React.ChangeEventHandler<
    HTMLInputElement
  > = async event => {
    const {
      target: { name, value }
    } = event;

    this.setState({
      [name]: value
    } as any);
  };
}

export default AddPlaceContainer;

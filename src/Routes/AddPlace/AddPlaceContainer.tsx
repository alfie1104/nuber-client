import React from "react";
import AddPlacePresenter from "./AddPlacePresenter";
import { RouteComponentProps } from "react-router-dom";
import { Mutation } from "react-apollo";
import { addPlace, addPlaceVariables } from "../../types/api";
import { ADD_PLACE } from "./AddPlaceQuery";
import { GET_PLACES } from "src/sharedQueries";
import { toast } from "react-toastify";

interface IState {
  address: string;
  name: string;
  lat: number;
  lng: number;
}

interface IProps extends RouteComponentProps<any> {}

class AddPlaceMutation extends Mutation<addPlace, addPlaceVariables> {}

class AddPlaceContainer extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    // const { location: { state = {} } = {} } = props;

    this.state = {
      /*
      address: state?.address || "",
      lat: state?.lat || 0,
      lng: state?.lng || 0,
      name: ""
      */
      address: "",
      lat: 0,
      lng: 0,
      name: ""
    };
  }

  public render() {
    const { address, name, lat, lng } = this.state;
    const { history } = this.props;

    return (
      <AddPlaceMutation
        mutation={ADD_PLACE}
        onCompleted={data => {
          const { AddPlace } = data;
          if (AddPlace.ok) {
            toast.success("Place added");
            setTimeout(() => {
              history.push("/places");
            }, 2000);
          } else {
            toast.error(AddPlace.error);
          }
        }}
        refetchQueries={[{ query: GET_PLACES }]}
        variables={{ name, address, lat, lng, isFav: false }}
      >
        {(addPlaceFn, { loading }) => {
          return (
            <AddPlacePresenter
              address={address}
              name={name}
              onInputChange={this.onInputChange}
              loading={loading}
              onSubmit={addPlaceFn}
              pickedAddress={lat !== 0 && lng !== 0}
            />
          );
        }}
      </AddPlaceMutation>
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

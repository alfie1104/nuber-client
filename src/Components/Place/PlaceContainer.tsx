import React from "react";
import PlacePresenter from "./PlacePresenter";
import { Mutation } from "react-apollo";
import { editPlace, editPlaceVariables } from "src/types/api";
import { EDIT_PLACE } from "src/Routes/Places/PlaceQueries";
import { GET_PLACES } from "src/sharedQueries";

interface IProps {
  fav: boolean;
  name: string;
  address: string;
  id: number;
}

class FavMutation extends Mutation<editPlace, editPlaceVariables> {}

class PlaceContainer extends React.Component<IProps> {
  public render() {
    const { id, fav, name, address } = this.props;
    return (
      <FavMutation
        mutation={EDIT_PLACE}
        refetchQueries={[{ query: GET_PLACES }]}
        variables={{
          placeId: id,
          isFav: !fav
        }}
      >
        {editPlaceFn => {
          return (
            <PlacePresenter
              onStarPress={editPlaceFn}
              fav={fav}
              name={name}
              address={address}
            />
          );
        }}
      </FavMutation>
    );
  }
}

export default PlaceContainer;

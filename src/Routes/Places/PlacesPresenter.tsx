import React from "react";
import styled from "../../typed-component";
import Helmet from "react-helmet";
import { getPlaces } from "src/types/api";
import Place from "src/Components/Place";
import Header from "src/Components/Header";
import { Link } from "react-router-dom";

const Container = styled.div`
  padding: 0 40px;
`;

const SLink = styled(Link)`
  text-decoration: underline;
`;

interface IProps {
  data?: getPlaces;
  loading: boolean;
}

const PlacesPresenter: React.FC<IProps> = ({
  data: { GetMyPlaces: { places = null } = {} } = {},
  loading
}) => {
  return (
    <React.Fragment>
      <Helmet>
        <title>Places | Nuber</title>
      </Helmet>
      <Container>
        <Header title={"Places"} backTo={"/"} />
        {!loading && places && places.length === 0 && "You have no places"}
        {!loading &&
          places &&
          places.map(place => (
            <Place
              key={place!.id}
              id={place!.id}
              fav={place!.isFav}
              name={place!.name}
              address={place!.address}
            />
          ))}
        <SLink to={"/add-place"}>Add some places!</SLink>
      </Container>
    </React.Fragment>
  );
};

export default PlacesPresenter;

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
        {!loading && places && places.length === 0 && (
          <SLink to={"/add-place"}>Place add some places!</SLink>
        )}
        {!loading &&
          places &&
          places.map(place => (
            <Place
              key={place!.id}
              fav={place!.isFav}
              name={place!.name}
              address={place!.address}
            />
          ))}
      </Container>
    </React.Fragment>
  );
};

export default PlacesPresenter;

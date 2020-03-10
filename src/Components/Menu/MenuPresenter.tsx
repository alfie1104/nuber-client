import React from "react";
import styled from "../../typed-component";
import { Link } from "react-router-dom";

const Container = styled.div`
  height: 100%;
`;

const Header = styled.div`
  background-color: black;
  height: 20%;
  margin-bottom: 30px;
  padding: 0 15px;
  color: white;
`;

// const SLink = styled(Link)``;

const Image = styled.img``;

const Name = styled.h2``;

const Rating = styled.h5``;

const Text = styled.span``;

const Grid = styled.div``;
/*
interface IToggleProps {
  isDriving: boolean;
}

const ToggleDriving = styled<IToggleProps, any>("button")``;
*/
const MenuPresenter: React.FC = () => (
  <Container>
    <Header>
      <Grid>
        <Link to={"/edit-account"}>
          <Image
            src={
              "https://yt3.ggpht.com/-CTwXMuZRaWw/AAAAAAAAAAI/AAAAAAAAAAA/HTJy-KJ4F2c/s88-c-k-no-mo-rj-c0xffffff/photo.jpg"
            }
          />
        </Link>
        <Text>
          <Name>Nicolas</Name>
          <Rating>4.5</Rating>
        </Text>
      </Grid>
    </Header>
  </Container>
);

export default MenuPresenter;

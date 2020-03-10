import React from "react";
import Helmet from "react-helmet";
import styled from "../../typed-component";
import Sidebar from "react-sidebar";
import Menu from "../../Components/Menu";

const Container = styled.div``;

interface IProps {
  isMenuOpen: boolean;
  toggleMenu: () => void;
}
const HomePresenter: React.FC<IProps> = ({ isMenuOpen, toggleMenu }) => (
  <Container>
    <Helmet>
      <title>Home | Nuber</title>
    </Helmet>
    <Sidebar
      sidebar={<Menu />}
      open={isMenuOpen}
      onSetOpen={toggleMenu}
      styles={{ sidebar: { width: "80%", background: "white", zIndex: "10" } }}
    >
      <button onClick={() => toggleMenu()}>Open sidebar</button>
    </Sidebar>
  </Container>
);

export default HomePresenter;

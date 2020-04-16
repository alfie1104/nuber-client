import React from "react";
import styled from "../../typed-component";
import { getRide } from "src/types/api";

const Container = styled.div``;

interface IProps {
  data?: getRide;
}

const RidePresenter: React.FC<IProps> = ({ data }) => (
  <Container>Ride</Container>
);

export default RidePresenter;

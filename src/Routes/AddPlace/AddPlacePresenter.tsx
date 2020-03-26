import React from "react";
import Helmet from "react-helmet";
import styled from "../../typed-component";
import Header from "src/Components/Header";
import Form from "src/Components/Form";
import Input from "src/Components/Input";
import { Link } from "react-router-dom";
import Button from "src/Components/Button";

const Container = styled.div`
  padding: 0 40px;
`;

const ExtendedInput = styled(Input)`
  margin-bottom: 40px;
`;

const ExtendedLink = styled(Link)`
  text-decoration: underline;
  margin-bottom: 20px;
  display: block;
`;

interface IProps {
  address: string;
  name: string;
  onInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  loading: boolean;
}

const AddPlacePresenter: React.FC<IProps> = ({
  address,
  name,
  onInputChange,
  loading
}) => (
  <React.Fragment>
    <Helmet>
      <title>Add Place | Nuber</title>
    </Helmet>
    <Header title={"Add Place"} backTo={"/"} />
    <Container>
      <Form submitFn={null}>
        <ExtendedInput
          type={"text"}
          placeholder={"Name"}
          value={name}
          onChange={onInputChange}
        />
        <ExtendedInput
          type={"text"}
          placeholder={"Address"}
          value={address}
          onChange={onInputChange}
        />
        <ExtendedLink to={"/find-address"}>Pick place from map</ExtendedLink>
        <Button onClick={null} value={loading ? "Adding place" : "Add Place"} />
      </Form>
    </Container>
  </React.Fragment>
);

export default AddPlacePresenter;

import React from "react";
import styled from "../../typed-component";
import Form from "src/Components/Form";
import Input from "src/Components/Input";
import { MutationFn } from "react-apollo";
import Helmet from "react-helmet";
import Header from "src/Components/Header";
import Button from "src/Components/Button";

const Container = styled.div``;

const ExtendedForm = styled(Form)`
  padding: 0px 40px;
`;

const ExtendedInput = styled(Input)`
  margin-bottom: 30px;
`;

interface IProps {
  firstName: string;
  lastName: string;
  email: string;
  profilePhoto: string;
  onSubmit: MutationFn;
  onInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  loading: boolean;
}

const EditAccountPresenter: React.FC<IProps> = ({
  firstName,
  lastName,
  email,
  profilePhoto,
  onSubmit,
  onInputChange,
  loading
}) => {
  return (
    <Container>
      <Helmet>
        <title>Edit Account | Nuber</title>
      </Helmet>
      <Header title={"Edit Account"} backTo={"/"} />
      <ExtendedForm submitFn={onSubmit}>
        <ExtendedInput
          onChange={onInputChange}
          type={"text"}
          value={firstName}
          placeholder={"First name"}
        />
        <ExtendedInput
          onChange={onInputChange}
          type={"text"}
          value={lastName}
          placeholder={"Last name"}
        />
        <ExtendedInput
          onChange={onInputChange}
          type={"email"}
          value={email}
          placeholder={"Email name"}
        />
        <Button onClick={null} value={loading ? "Loading" : "Update"} />
      </ExtendedForm>
    </Container>
  );
};

export default EditAccountPresenter;

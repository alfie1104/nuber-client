import React from "react";
import styled from "../../typed-component";
import Form from "src/Components/Form";
import Input from "src/Components/Input";
import { MutationFn } from "react-apollo";
import Helmet from "react-helmet";
import Header from "src/Components/Header";
import Button from "src/Components/Button";
import { updateProfile, updateProfileVariables } from "../../types/api";

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
  onInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: MutationFn<updateProfile, updateProfileVariables>;
  loading: boolean;
}

const EditAccountPresenter: React.FC<IProps> = ({
  firstName,
  lastName,
  email,
  profilePhoto,
  onInputChange,
  onSubmit,
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
          name={"firstName"}
        />
        <ExtendedInput
          onChange={onInputChange}
          type={"text"}
          value={lastName}
          placeholder={"Last name"}
          name={"lastName"}
        />
        <ExtendedInput
          onChange={onInputChange}
          type={"email"}
          value={email}
          placeholder={"Email name"}
          name={"email"}
        />
        <Button onClick={null} value={loading ? "Loading" : "Update"} />
      </ExtendedForm>
    </Container>
  );
};

export default EditAccountPresenter;

import React from "react";
import Helmet from "react-helmet";
import styled from "src/typed-component";
import Input from "src/Components/Input";
import Header from "src/Components/Header";
import Button from "src/Components/Button";

const Container = styled.div``;

const Form = styled.form`
  padding: 0px 40px;
`;

const ExtendedInput = styled(Input)`
  margin-bottom: 20px;
`;

interface IProps {
  key: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const VerifyPhonePresenter: React.FC<IProps> = ({ onChange, key }) => (
  <Container>
    <Helmet>
      <title>Verify Phone | Number</title>
    </Helmet>
    <Header backTo={"/phone-login"} title={"Verify Phone Number"} />
    <Form>
      <ExtendedInput
        value={key}
        placeholder={"Enter Verification Code"}
        onChange={onChange}
        name={"key"}
      />
      <Button value={"Submit"} onClick={null} />
    </Form>
  </Container>
);

export default VerifyPhonePresenter;

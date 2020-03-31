import React from "react";
import styled from "../../typed-component";

const Container = styled.input`
  position: absolute;
  background-color: white;
  border-radius: 5px;
  -webkit-appearance: none;
  z-index: 2;
  width: 80%;
  border: 0;
  font-size: 16px;
  padding: 15px 10px;
  box-shadow: 0 18px 35px rgba(50, 50, 93, 0.1), 0 8px 15px rgba(0, 0, 0, 0.07);
  margin: auto;
  top: 10px;
  left: 0;
  right: 0;
  height: auto;
`;

interface IProps {
  value: string;
  onBlur: () => void;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  name: string;
}

const AddressBar: React.FC<IProps> = ({ value, onBlur, onChange, name }) => {
  return (
    <Container
      value={value}
      onBlur={onBlur}
      onChange={onChange}
      name={name}
      placeholder={"Type address"}
    />
  );
};

export default AddressBar;

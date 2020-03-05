import React from "react";

interface IProps {
  onSubmit: any;
}

const Form: React.FC<IProps> = ({ onSubmit }) => (
  <Form
    onSubmit={e => {
      e.preventDefault();
      onSubmit();
    }}
  />
);

export default Form;

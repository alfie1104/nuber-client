import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

const Container = styled.div`
  transform: scale(0.8);
`;

interface IProps {
  backTo: string;
  className?: string;
}

/* 
    typescript에서는 한 컴포넌트를 extend 하기 위해 className이 필수임 
    나중에 styled-component에서 BackArrow를 확장한 컴포넌트를 만들기 위해 BackArrow의 prop에 className을 추가하였음
*/

const BackArrow: React.FC<IProps> = ({ backTo, className }) => (
  <Container className={className}>
    <Link to={backTo}>
      <svg
        width="24"
        height="24"
        xmlns="http://www.w3.org/2000/svg"
        fillRule="evenodd"
        clipRule="evenodd"
      >
        <path d="M20 .755l-14.374 11.245 14.374 11.219-.619.781-15.381-12 15.391-12 .609.755z" />
      </svg>
    </Link>
  </Container>
);

export default BackArrow;

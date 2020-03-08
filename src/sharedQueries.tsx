import { gql } from "apollo-boost";
export const LOG_USER_IN = gql`
  mutation logUserIn($token: String!) {
    logUserIn(token: $token) @client
  }
`;

/*
  @client를 적음으로써 API사용이 아닌, 
  client쪽 명령(이 프로그램에서는 apollo.ts에 작성한 명령)
  사용을 알릴 수 있음
*/

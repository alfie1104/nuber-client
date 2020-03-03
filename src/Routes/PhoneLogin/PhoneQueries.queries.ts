import { gql } from "apollo-boost";

export const PHONE_SIGN_IN = gql`
    muation startPhoneVeirification($phoneNumber: String!){
        StartPhoneVerification(phoneNumber : $phoneNumber){
            ok
            error
        }
    }
`;

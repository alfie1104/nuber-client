import React from "react";
import Helmet from "react-helmet";
import styled from "../../typed-component";
import Sidebar from "react-sidebar";
import Menu from "../../Components/Menu";
import AddressBar from "src/Components/AddressBar";
import Button from "src/Components/Button";
import {
  userProfile,
  getRides,
  acceptRideVariables,
  acceptRide,
} from "src/types/api";
import { MutationFn } from "react-apollo";
import { requestRide, requestRideVariables } from "../../types/api";
import RidePopUp from "src/Components/RidePopUp";

const Container = styled.div``;

const MenuButton = styled.button`
  apperance: none;
  padding: 10px;
  position: absolute;
  top: 10px;
  left: 10px;
  text-align: center;
  font-weight: 800;
  border: 0;
  cursor: pointer;
  font-size: 20px;
  transform: rotate(90deg);
  z-index: 2;
  background-color: transparent;
`;

const ExtendedButton = styled(Button)`
  position: absolute;
  bottom: 50px;
  left: 0;
  right: 0;
  margin: auto;
  z-index: 10;
  height: auto;
  width: 80%;
`;

const RequestButton = styled(ExtendedButton)`
  bottom: 250px;
`;

const Map = styled.div`
  position: absolute;
  height: 100%;
  width: 100%;
`;

interface IProps {
  isMenuOpen: boolean;
  toggleMenu: () => void;
  loading: boolean;
  mapRef: any;
  toAddress: string;
  onAddressSubmit: () => void;
  onInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  price?: string;
  data?: userProfile;
  requestRideFn?: MutationFn<requestRide, requestRideVariables>;
  nearbyRide?: getRides;
  acceptRideFn: MutationFn<acceptRide, acceptRideVariables>;
}
const HomePresenter: React.FC<IProps> = ({
  isMenuOpen,
  toggleMenu,
  loading,
  mapRef,
  toAddress,
  onAddressSubmit,
  onInputChange,
  price,
  data: { GetMyProfile: { user = null } = {} } = {},
  requestRideFn,
  nearbyRide: { GetNearbyRide: { ride = null } = {} } = {},
  acceptRideFn,
}) => (
  <Container>
    <Helmet>
      <title>Home | Nuber</title>
    </Helmet>
    <Sidebar
      sidebar={<Menu />}
      open={isMenuOpen}
      onSetOpen={toggleMenu}
      styles={{ sidebar: { width: "80%", background: "white", zIndex: "10" } }}
    >
      {!loading && <MenuButton onClick={() => toggleMenu()}>|||</MenuButton>}
      {user && !user.isDriving && (
        <>
          <AddressBar
            name="toAddress"
            onChange={onInputChange}
            value={toAddress}
            onBlur={() => {
              return;
            }}
          />
          <ExtendedButton
            onClick={onAddressSubmit}
            disabled={toAddress === ""}
            value={price ? "Change address" : "Pick Address"}
          />
        </>
      )}
      {price && (
        <RequestButton
          onClick={requestRideFn}
          disabled={toAddress === ""}
          value={`Request Ride ($${price})`}
        />
      )}
      {ride && (
        <RidePopUp
          pickUpAddress={ride.pickUpAddress}
          dropOffAddress={ride.dropOffAddress}
          price={ride.price}
          distance={ride.distance}
          passengerName={ride.passenger.fullName!}
          passengerPhoto={ride.passenger.profilePhoto!}
          acceptRideFn={acceptRideFn}
        />
      )}
      <Map ref={mapRef} />
    </Sidebar>
  </Container>
);

export default HomePresenter;

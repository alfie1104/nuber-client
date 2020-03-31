import React from "react";
import Helmet from "react-helmet";
import styled from "../../typed-component";
import AddressBar from "src/Components/AddressBar";

const Map = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  z-index: 1;
`;

const Center = styled.div`
  position: absolute;
  width: 40px;
  height: 40px;
  z-index: 2;
  font-size: 30px;
  margin: auto;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`;

interface IProps {
  mapRef: any;
  onInputBlur: () => void;
  onInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  address: string;
}

class FindAddressPresenter extends React.Component<IProps> {
  public render() {
    const { mapRef, onInputBlur, onInputChange, address } = this.props;
    return (
      <div>
        <Helmet>
          <title>Find Address | Nuber</title>
        </Helmet>
        <AddressBar
          value={address}
          onBlur={onInputBlur}
          onChange={onInputChange}
          name={"address"}
        />
        <Center>
          <span role="img" aria-label="center pin">
            📍
          </span>
        </Center>
        <Map ref={mapRef} />
      </div>
    );
  }
}

export default FindAddressPresenter;

import React from "react";
import ReactDOM from "react-dom";
import { RouteComponentProps } from "react-router-dom";
import FindAddressPresenter from "./FindAddressPresenter";
import { reverseGeoCode, geoCode } from "src/mapHelpers";

interface IState {
  lat: number;
  lng: number;
  address: string;
}

interface IProps extends RouteComponentProps<any> {
  google: any;
}

class FindAddressContainer extends React.Component<IProps, IState> {
  public mapRef: any;
  public map: google.maps.Map | any;
  public state = {
    address: "",
    lat: 0,
    lng: 0
  };

  constructor(props) {
    super(props);
    this.mapRef = React.createRef();
  }

  public componentDidMount() {
    navigator.geolocation.getCurrentPosition(
      this.handleGeoSuccess,
      this.handleGeoError
    );
  }

  public handleGeoSuccess = (position: Position) => {
    const {
      coords: { latitude: lat, longitude: lng }
    } = position;

    this.setState({
      lat,
      lng
    });
    this.loadMap(lat, lng);
    this.reverseGeocodeAddress(lat, lng);
  };

  public handleGeoError = () => {
    console.log("No location");
  };

  public loadMap = (lat, lng) => {
    const { google } = this.props;
    const maps = google.maps;
    const mapNode = ReactDOM.findDOMNode(this.mapRef.current);
    const mapConfig: google.maps.MapOptions = {
      zoom: 11,
      center: {
        lat,
        lng
      },
      minZoom: 8,
      disableDefaultUI: true
    };
    this.map = new maps.Map(mapNode, mapConfig);
    this.map.addListener("dragend", this.handleDragEnd);
  };

  public handleDragEnd = async () => {
    const newCenter = this.map.getCenter();
    const lat = newCenter.lat();
    const lng = newCenter.lng();

    this.setState({ lat, lng });
    this.reverseGeocodeAddress(lat, lng);
  };

  public onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { name, value }
    } = event;

    this.setState({
      [name]: value
    } as any);
  };

  public onInputBlur = async () => {
    const { address } = this.state;
    const result = await geoCode(address);
    if (result !== false) {
      const { lat, lng, formatted_address } = result;
      this.setState({
        lat,
        lng,
        address: formatted_address
      });

      this.map.panTo({ lat, lng });
    }
  };

  public reverseGeocodeAddress = async (lat: number, lng: number) => {
    const reversedAddress = await reverseGeoCode(lat, lng);
    if (reversedAddress !== false) {
      this.setState({ address: reversedAddress });
    }
  };

  public onPickPlace = () => {
    const { address, lat, lng } = this.state;
    const { history } = this.props;
    history.push({
      pathname: "/add-place",
      state: {
        lat,
        lng,
        address
      }
    });
    console.log(address, lat, lng);
  };

  public render() {
    const { address } = this.state;

    return (
      <FindAddressPresenter
        mapRef={this.mapRef}
        onInputBlur={this.onInputBlur}
        onInputChange={this.onInputChange}
        address={address}
        onPickPlace={this.onPickPlace}
      />
    );
  }
}

export default FindAddressContainer;

import React from "react";
import ReactDOM from "react-dom";
import HomePresenter from "./HomePresenter";
import { RouteComponentProps } from "react-router-dom";
import { Query } from "react-apollo";
import { userProfile } from "src/types/api";
import { USER_PROFILE } from "src/sharedQueries";
import { geoCode } from "src/mapHelpers";
import { toast } from "react-toastify";

interface IState {
  isMenuOpen: boolean;
  lat: number;
  lng: number;
  toAddress: string;
  toLat: number;
  toLng: number;
  distance?: string;
  duration?: string;
  price?: number;
}

interface IProps extends RouteComponentProps<any> {
  google: any;
}

class ProfileQuery extends Query<userProfile> {}

class HomeContainer extends React.Component<IProps, IState> {
  public mapRef: any;
  public map: google.maps.Map | any;
  public userMarker: google.maps.Marker | any;
  public toMarker: google.maps.Marker | any;
  public directions: google.maps.DirectionsRenderer | any;

  public state = {
    isMenuOpen: false,
    lat: 0,
    lng: 0,
    toAddress: "",
    toLat: 0,
    toLng: 0
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

  public handleGeoSuccess: PositionCallback = (position: Position) => {
    const {
      coords: { latitude: lat, longitude: lng }
    } = position;

    this.setState({
      lat,
      lng
    });
    this.loadMap(lat, lng);
  };

  public handleGeoError: PositionErrorCallback = () => {
    console.log("No location");
  };

  public loadMap = (lat, lng) => {
    const { google } = this.props;
    const maps = google.maps;
    const mapNode = ReactDOM.findDOMNode(this.mapRef.current);
    const mapConfig: google.maps.MapOptions = {
      zoom: 13,
      center: {
        lat,
        lng
      },
      disableDefaultUI: true
    };
    this.map = new maps.Map(mapNode, mapConfig);
    const userMarkerOptions: google.maps.MarkerOptions = {
      position: {
        lat,
        lng
      },
      icon: {
        path: maps.SymbolPath.CIRCLE,
        scale: 7
      }
    };
    this.userMarker = new maps.Marker(userMarkerOptions);
    this.userMarker.setMap(this.map);
    const watchOptions: PositionOptions = {
      enableHighAccuracy: true
    };
    navigator.geolocation.watchPosition(
      this.handleGeoWatchSuccess,
      this.handleGeoWatchError,
      watchOptions
    );
  };

  public handleGeoWatchSuccess = (position: Position) => {
    const {
      coords: { latitude: lat, longitude: lng }
    } = position;
    this.userMarker.setPosition({ lat, lng });
    this.map.panTo({ lat, lng });
  };
  public handleGeoWatchError = () => {
    console.log("Error watching you");
  };

  public onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { name, value }
    } = event;
    this.setState({
      [name]: value
    } as any);
  };

  public onAddressSubmit = async () => {
    const { toAddress } = this.state;
    const { google } = this.props;
    const maps = google.maps;
    const result = await geoCode(toAddress);
    if (result !== false) {
      const { lat, lng, formatted_address } = result;

      if (this.toMarker) {
        this.toMarker.setMap(null);
      }

      const toMarkerOptions: google.maps.MarkerOptions = {
        position: {
          lat,
          lng
        }
      };
      this.toMarker = new maps.Marker(toMarkerOptions);
      this.toMarker.setMap(this.map);
      const bounds = new maps.LatLngBounds();
      bounds.extend({ lat: this.state.lat, lng: this.state.lng });
      bounds.extend({ lat, lng });
      this.map.fitBounds(bounds);

      this.setState(
        {
          toLat: lat,
          toLng: lng,
          toAddress: formatted_address
        },
        this.createPath
      );
    }
  };

  public createPath = () => {
    const { toLat, toLng, lat, lng } = this.state;
    if (this.directions) {
      this.directions.setMap(null);
    }
    const renderOptions: google.maps.DirectionsRendererOptions = {
      suppressMarkers: true,
      polylineOptions: {
        strokeColor: "#000"
      }
    };

    this.directions = new google.maps.DirectionsRenderer(renderOptions);
    const directionsService: google.maps.DirectionsService = new google.maps.DirectionsService();
    const to = new google.maps.LatLng(toLat, toLng);
    const from = new google.maps.LatLng(lat, lng);
    const directionsOptions: google.maps.DirectionsRequest = {
      destination: to,
      origin: from,
      travelMode: google.maps.TravelMode.DRIVING
    };

    directionsService.route(directionsOptions, (result, status) => {
      if (status === google.maps.DirectionsStatus.OK) {
        const { routes } = result;
        const {
          distance: { text: distance },
          duration: { text: duration }
        } = routes[0].legs[0];

        this.setState({
          distance,
          duration
        });

        this.directions.setDirections(result);
        this.directions.setMap(this.map);
      } else {
        toast.error("There is no route there, you have to swim");
      }
    });

    // const { google } = this.props;
    // const maps = google.maps;
  };

  render() {
    const { isMenuOpen, toAddress } = this.state;

    return (
      <ProfileQuery query={USER_PROFILE}>
        {({ loading }) => (
          <HomePresenter
            loading={loading}
            isMenuOpen={isMenuOpen}
            toggleMenu={this.toggleMenu}
            mapRef={this.mapRef}
            toAddress={toAddress}
            onInputChange={this.onInputChange}
            onAddressSubmit={this.onAddressSubmit}
          />
        )}
      </ProfileQuery>
    );
  }

  public toggleMenu = () => {
    this.setState(state => {
      return {
        isMenuOpen: !state.isMenuOpen
      };
    });
  };
}

export default HomeContainer;

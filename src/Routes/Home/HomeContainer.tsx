import React from "react";
import ReactDOM from "react-dom";
import HomePresenter from "./HomePresenter";
import { RouteComponentProps } from "react-router-dom";
import { Query, graphql, MutationFn } from "react-apollo";
import { userProfile, getDrivers } from "src/types/api";
import { USER_PROFILE } from "src/sharedQueries";
import { geoCode } from "src/mapHelpers";
import { toast } from "react-toastify";
import { REPORT_LOCATION, GET_NEARBY_DRIVERS } from "./HomeQueries";
import { reportMovement, reportMovementVariables } from "../../types/api";

interface IState {
  isMenuOpen: boolean;
  lat: number;
  lng: number;
  toAddress: string;
  toLat: number;
  toLng: number;
  distance: string;
  duration?: string;
  price?: string;
}

interface IProps extends RouteComponentProps<any> {
  google: any;
  reportLocation: MutationFn;
}

class ProfileQuery extends Query<userProfile> {}
class NearbyQueries extends Query<getDrivers> {}

class HomeContainer extends React.Component<IProps, IState> {
  public mapRef: any;
  public map: google.maps.Map | any;
  public userMarker: google.maps.Marker | any;
  public toMarker: google.maps.Marker | any;
  public directions: google.maps.DirectionsRenderer | any;
  public drivers: google.maps.Marker[];

  public state = {
    isMenuOpen: false,
    lat: 0,
    lng: 0,
    toAddress: "한국타이어 테크노돔",
    toLat: 0,
    toLng: 0,
    distance: "",
    duration: undefined,
    price: undefined,
  };

  constructor(props) {
    super(props);
    this.mapRef = React.createRef();
    this.drivers = [];
  }

  public componentDidMount() {
    navigator.geolocation.getCurrentPosition(
      this.handleGeoSuccess,
      this.handleGeoError
    );
  }

  public handleGeoSuccess: PositionCallback = (position: Position) => {
    const {
      coords: { latitude: lat, longitude: lng },
    } = position;

    this.setState({
      lat,
      lng,
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
    if (!mapNode) {
      this.loadMap(lat, lng);
      return;
    }
    const mapConfig: google.maps.MapOptions = {
      zoom: 13,
      center: {
        lat,
        lng,
      },
      disableDefaultUI: true,
    };
    this.map = new maps.Map(mapNode, mapConfig);
    const userMarkerOptions: google.maps.MarkerOptions = {
      position: {
        lat,
        lng,
      },
      icon: {
        path: maps.SymbolPath.CIRCLE,
        scale: 7,
      },
    };
    this.userMarker = new maps.Marker(userMarkerOptions);
    this.userMarker.setMap(this.map);
    const watchOptions: PositionOptions = {
      enableHighAccuracy: true,
    };
    navigator.geolocation.watchPosition(
      this.handleGeoWatchSuccess,
      this.handleGeoWatchError,
      watchOptions
    );
  };

  public handleGeoWatchSuccess = (position: Position) => {
    const { reportLocation } = this.props;
    const {
      coords: { latitude: lat, longitude: lng },
    } = position;
    this.userMarker.setPosition({ lat, lng });
    this.map.panTo({ lat, lng });
    reportLocation({
      variables: {
        lat,
        lng,
      },
    });
  };

  public handleGeoWatchError = () => {
    console.log("Error watching you");
  };

  public onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { name, value },
    } = event;
    this.setState({
      [name]: value,
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
          lng,
        },
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
          toAddress: formatted_address,
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
        strokeColor: "#000",
      },
    };

    this.directions = new google.maps.DirectionsRenderer(renderOptions);
    const directionsService: google.maps.DirectionsService = new google.maps.DirectionsService();
    const to = new google.maps.LatLng(toLat, toLng);
    const from = new google.maps.LatLng(lat, lng);
    const directionsOptions: google.maps.DirectionsRequest = {
      destination: to,
      origin: from,
      travelMode: google.maps.TravelMode.DRIVING,
    };

    directionsService.route(directionsOptions, this.handleRouteRequest);
  };

  public handleRouteRequest = (
    result: google.maps.DirectionsResult,
    status: google.maps.DirectionsStatus
  ) => {
    if (status === google.maps.DirectionsStatus.OK) {
      const { routes } = result;
      const {
        distance: { text: distance },
        duration: { text: duration },
      } = routes[0].legs[0];

      this.directions.setDirections(result);
      this.directions.setMap(this.map);
      this.setState(
        {
          distance,
          duration,
        },
        this.setPrice
      );
    } else {
      toast.error("There is no route there, you have to swim");
    }
  };

  public setPrice = () => {
    const { distance } = this.state;
    if (distance) {
      this.setState({
        price: Number(parseFloat(distance.replace(",", "")) * 3).toFixed(2),
      });
    }
  };

  public handleNearbyDrivers = (data: {} | getDrivers) => {
    if ("GetNearbyDrivers" in data) {
      const {
        GetNearbyDrivers: { drivers, ok },
      } = data;
      if (ok && drivers) {
        for (const driver of drivers) {
          console.log(driver);
          if (driver && driver.lastLat && driver.lastLng) {
            const markerOptions: google.maps.MarkerOptions = {
              position: {
                lat: driver.lastLat,
                lng: driver.lastLng,
              },
              icon: {
                path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
                scale: 5,
              },
            };

            const newMarker: google.maps.Marker = new google.maps.Marker(
              markerOptions
            );
            newMarker.set("ID", driver.id);
            newMarker.setMap(this.map);
          }
        }
      }
    }

    return null;
  };
  render() {
    const { isMenuOpen, toAddress, price } = this.state;

    return (
      <ProfileQuery query={USER_PROFILE}>
        {({ data, loading }) => (
          <NearbyQueries
            query={GET_NEARBY_DRIVERS}
            skip={
              (data &&
                data.GetMyProfile &&
                data.GetMyProfile.user &&
                data.GetMyProfile.user.isDriving) ||
              false
            }
            onCompleted={this.handleNearbyDrivers}
          >
            {() => (
              <HomePresenter
                loading={loading}
                isMenuOpen={isMenuOpen}
                toggleMenu={this.toggleMenu}
                mapRef={this.mapRef}
                toAddress={toAddress}
                onInputChange={this.onInputChange}
                price={price}
                onAddressSubmit={this.onAddressSubmit}
                data={data}
              />
            )}
          </NearbyQueries>
        )}
      </ProfileQuery>
    );
  }

  public toggleMenu = () => {
    this.setState((state) => {
      return {
        isMenuOpen: !state.isMenuOpen,
      };
    });
  };
}

export default graphql<any, reportMovement, reportMovementVariables>(
  REPORT_LOCATION,
  { name: "reportLocation" }
)(HomeContainer);

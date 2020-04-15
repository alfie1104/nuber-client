import React from "react";
import ReactDOM from "react-dom";
import HomePresenter from "./HomePresenter";
import { RouteComponentProps } from "react-router-dom";
import { Query, graphql, MutationFn, Mutation } from "react-apollo";
import {
  userProfile,
  getDrivers,
  getRides,
  acceptRide,
  acceptRideVariables,
} from "src/types/api";
import { USER_PROFILE } from "src/sharedQueries";
import { geoCode, reverseGeoCode } from "src/mapHelpers";
import { toast } from "react-toastify";
import {
  REPORT_LOCATION,
  GET_NEARBY_DRIVERS,
  REQUEST_RIDE,
  GET_NEARBY_RIDE,
  ACCEPT_RIDE,
  SUBSCRIBE_NEARBY_RIDES,
} from "./HomeQueries";
import {
  reportMovement,
  reportMovementVariables,
  requestRide,
  requestRideVariables,
} from "../../types/api";
import { SubscribeToMoreOptions } from "apollo-client";

interface IState {
  isMenuOpen: boolean;
  lat: number;
  lng: number;
  fromAddress: string;
  toAddress: string;
  toLat: number;
  toLng: number;
  distance: string;
  duration?: string;
  price?: string;
  isDriving: boolean;
}

interface IProps extends RouteComponentProps<any> {
  google: any;
  reportLocation: MutationFn;
}

class ProfileQuery extends Query<userProfile> {}
class NearbyQueries extends Query<getDrivers> {}
class RequestRideMutation extends Mutation<requestRide, requestRideVariables> {}
class GetNearbyRides extends Query<getRides> {}
class AcceptRide extends Mutation<acceptRide, acceptRideVariables> {}

class HomeContainer extends React.Component<IProps, IState> {
  public mapRef: any;
  public map: google.maps.Map | any;
  public userMarker: google.maps.Marker | any;
  public toMarker: google.maps.Marker | any;
  public directions: google.maps.DirectionsRenderer | any;
  public drivers: google.maps.Marker[];

  public state = {
    isDriving: false,
    isMenuOpen: false,
    lat: 0,
    lng: 0,
    fromAddress: "",
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
    this.getFromAddress(lat, lng);
    this.loadMap(lat, lng);
  };

  public getFromAddress = async (lat: number, lng: number) => {
    const address = await reverseGeoCode(lat, lng);

    if (address) {
      this.setState({
        fromAddress: address,
      });
    }
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
          if (driver && driver.lastLat && driver.lastLng) {
            const existingDriver:
              | google.maps.Marker
              | undefined = this.drivers.find(
              (driverMarker: google.maps.Marker) => {
                const markerID = driverMarker.get("ID");
                return markerID === driver.id;
              }
            );

            if (existingDriver) {
              existingDriver.setPosition({
                lat: driver.lastLat,
                lng: driver.lastLng,
              });
              existingDriver.setMap(this.map);
            } else {
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
              this.drivers.push(newMarker);
            }
          }
        }
      }
    }

    return null;
  };

  public handleRideRequest = (data: requestRide) => {
    const { history } = this.props;
    const { RequestRide } = data;

    if (RequestRide.ok) {
      toast.success("Drive requested, finding a driver");
      history.push(`/ride/${RequestRide.ride!.id}`);
    } else {
      toast.error(RequestRide.error);
    }
  };

  public handleProfileQuery = (data: userProfile) => {
    const { GetMyProfile } = data;
    if (GetMyProfile.user) {
      const {
        user: { isDriving },
      } = GetMyProfile;
      if (isDriving) {
        this.setState({
          isDriving,
        });
      }
    }
  };

  render() {
    const {
      isMenuOpen,
      price,
      distance,
      fromAddress,
      toAddress,
      lat,
      lng,
      toLat,
      toLng,
      duration,
      isDriving,
    } = this.state;

    return (
      <ProfileQuery query={USER_PROFILE} onCompleted={this.handleProfileQuery}>
        {({ data, loading }) => (
          <NearbyQueries
            query={GET_NEARBY_DRIVERS}
            skip={isDriving}
            pollInterval={5000}
            onCompleted={this.handleNearbyDrivers}
          >
            {() => (
              <RequestRideMutation
                mutation={REQUEST_RIDE}
                onCompleted={this.handleRideRequest}
                variables={{
                  pickUpAddress: fromAddress,
                  pickUpLat: lat,
                  pickUpLng: lng,
                  dropOffAddress: toAddress,
                  dropOffLat: toLat,
                  dropOffLng: toLng,
                  price: price || 0,
                  distance,
                  duration: duration || "",
                }}
              >
                {(requestRideFn) => (
                  <GetNearbyRides query={GET_NEARBY_RIDE} skip={!isDriving}>
                    {({ subscribeToMore, data: nearbyRide }) => {
                      const rideSubscriptionOptions: SubscribeToMoreOptions = {
                        document: SUBSCRIBE_NEARBY_RIDES,
                        updateQuery: (prev, { subscriptionData }) => {
                          if (!subscriptionData.data) {
                            return prev;
                          }
                          const newObject = Object.assign({}, prev, {
                            GetNearbyRide: {
                              ...prev.GetNearbyRide,
                              ride:
                                subscriptionData.data.NearbyRideSubscription,
                            },
                          });
                          return newObject;
                        },
                      };
                      if (isDriving) {
                        subscribeToMore(rideSubscriptionOptions);
                      }
                      return (
                        <AcceptRide mutation={ACCEPT_RIDE}>
                          {(acceptRideFn) => (
                            <HomePresenter
                              loading={loading}
                              isMenuOpen={isMenuOpen}
                              toggleMenu={this.toggleMenu}
                              mapRef={this.mapRef}
                              toAddress={toAddress}
                              onInputChange={this.onInputChange}
                              price={price}
                              data={data}
                              onAddressSubmit={this.onAddressSubmit}
                              requestRideFn={requestRideFn}
                              nearbyRide={nearbyRide}
                              acceptRideFn={acceptRideFn}
                            />
                          )}
                        </AcceptRide>
                      );
                    }}
                  </GetNearbyRides>
                )}
              </RequestRideMutation>
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

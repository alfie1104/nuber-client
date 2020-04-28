import { InMemoryCache } from "apollo-cache-inmemory";
import { ApolloClient } from "apollo-client";
import { ApolloLink, concat, Operation, split } from "apollo-link";
import { onError } from "apollo-link-error";
import { HttpLink } from "apollo-link-http";
import { withClientState } from "apollo-link-state";
import { WebSocketLink } from "apollo-link-ws";
import { getMainDefinition } from "apollo-utilities";
import { toast } from "react-toastify";

const isDev = process.env.NODE_ENV === "development";
const getToken = () => {
  const token = localStorage.getItem("jwt");
  if (token) {
    return token;
  } else {
    return "";
  }
};

const cache = new InMemoryCache();

// Apollo에서 API로 보내는 모든 request를 중간에서 가로채는 기능을 함.
const authMiddleware = new ApolloLink((operation: Operation, forward: any) => {
  operation.setContext({
    headers: {
      "X-JWT": getToken(),
    },
  });

  // request를 가로챈 후 작업을 끝내면, 다음 middleware로 진행시킴(API에 도달할 때 까지)
  return forward(operation);
});

const httpLink = new HttpLink({
  uri: isDev
    ? "http://localhost:4000/graphql"
    : "https://nuber-server-1.herokuapp.com/graphql",
});

const wsLink = new WebSocketLink({
  options: {
    connectionParams: {
      "X-JWT": getToken(),
    },
    reconnect: true,
  },
  uri: isDev
    ? "ws://localhost:4000/subscription"
    : "ws://nuber-server-1.herokuapp.com/subscription",
});

// apollo가 스스로 subscription인지 아니면 그냥 http요청인지 판단할 수 없기때문에 다음 함수를 통해 알려줌
// spilit(operation, left, right) : operation이 true이면, left를 실행하고 false면 right를 실행함
// back-end의 withFilter와 비슷함
const combinedLinks = split(
  ({ query }) => {
    const { kind, operation }: any = getMainDefinition(query);
    return kind === "OperationDefinition" && operation === "subscription";
  },
  wsLink,
  httpLink
);

// Error발생시에 대한 처리 함수
const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.map(({ message, locations, path }) => {
      toast.error(`Unexpected error : ${message}`);
    });
  }

  if (networkError) {
    toast.error(`Network error : ${networkError}`);
  }
});

const localStateLink = withClientState({
  cache,
  defaults: {
    auth: {
      __typename: "Auth",
      isLoggedIn: Boolean(getToken()),
    },
  },
  resolvers: {
    Mutation: {
      logUserIn: (_, { token }, { cache: appCache }) => {
        localStorage.setItem("jwt", token);
        appCache.writeData({
          data: {
            auth: {
              __typename: "Auth",
              isLoggedIn: true,
            },
          },
        });
        return null;
      },
      logUserOut: (_, __, { cache: appCache }) => {
        localStorage.removeItem("jwt");
        appCache.writeData({
          data: {
            auth: {
              __typename: "Auth",
              isLoggedIn: false,
            },
          },
        });
        return null;
      },
    },
  },
});

const client = new ApolloClient({
  cache,
  link: ApolloLink.from([
    errorLink,
    localStateLink,
    concat(authMiddleware, combinedLinks),
  ]),
});

// link는 apolloClient가 resolver와 어떻게 상호작용하는지에 대한 것

export default client;

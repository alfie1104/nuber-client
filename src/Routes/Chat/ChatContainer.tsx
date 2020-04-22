import React from "react";
import { RouteComponentProps } from "react-router-dom";
import ChatPresenter from "./ChatPresenter";
import {
  getChat,
  getChatVariables,
  userProfile,
  sendMessage,
  sendMessageVariables,
} from "../../types/api";
import { Query, Mutation, MutationFn } from "react-apollo";
import { GET_CHAT, SEND_MESSAGE } from "./ChatQuries";
import { USER_PROFILE } from "src/sharedQueries";

interface IProps extends RouteComponentProps<any> {}
interface IState {
  message: "";
}

class ProfileQuery extends Query<userProfile> {}
class ChatQuery extends Query<getChat, getChatVariables> {}
class SendMessageMutation extends Mutation<sendMessage, sendMessageVariables> {}

class ChatContainer extends React.Component<IProps, IState> {
  public sendMessageFn: MutationFn;

  constructor(props: IProps) {
    super(props);
    if (!props.match.params.chatId) {
      props.history.push("/");
    }
    this.state = {
      message: "",
    };
  }

  public onInputChange: React.ChangeEventHandler<HTMLInputElement> = (
    event
  ) => {
    const {
      target: { name, value },
    } = event;

    this.setState({
      [name]: value,
    } as any);
  };

  public onSubmit = () => {
    const { message } = this.state;
    const {
      match: {
        params: { chatId },
      },
    } = this.props;

    if (message !== "") {
      this.setState({
        message: "",
      });
      this.sendMessageFn({
        variables: {
          text: message,
          chatId,
        },
      });
    }
    return;
  };

  public render() {
    const {
      match: {
        params: { chatId },
      },
    } = this.props;
    const { message } = this.state;

    return (
      <ProfileQuery query={USER_PROFILE}>
        {({ data: userData }) => (
          <ChatQuery query={GET_CHAT} variables={{ chatId }}>
            {({ data, loading }) => (
              <SendMessageMutation mutation={SEND_MESSAGE}>
                {(sendMessageFn) => {
                  this.sendMessageFn = sendMessageFn;

                  return (
                    <ChatPresenter
                      data={data}
                      loading={loading}
                      userData={userData}
                      messageText={message}
                      onInputChange={this.onInputChange}
                      onSubmit={this.onSubmit}
                    />
                  );
                }}
              </SendMessageMutation>
            )}
          </ChatQuery>
        )}
      </ProfileQuery>
    );
  }
}

export default ChatContainer;

import React from "react";
import Header from "../../Components/Header";
import styled from "../../typed-component";
import { getChat, userProfile } from "src/types/api";
import Message from "src/Components/Message";
import Input from "src/Components/Input";
import Form from "src/Components/Form";

const Container = styled.div``;

const Chat = styled.div`
  height: 80vh;
  overflow: scroll;
  padding: 0 20px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const InputCont = styled.div`
  padding: 0 2px;
`;

interface IProps {
  data?: getChat;
  userData?: userProfile;
  loading: boolean;
  messageText: string;
  onSubmit: () => void;
  onInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const ChatPresenter: React.FC<IProps> = ({
  loading,
  data: { GetChat: { chat = null } = {} } = {},
  userData: { GetMyProfile: { user = null } = {} } = {},
  messageText,
  onSubmit,
  onInputChange,
}) => (
  <Container>
    <Header title={"Chat"} />
    {!loading && chat && user && (
      <React.Fragment>
        <Chat>
          {chat.messages &&
            chat.messages.map((message) => {
              if (message) {
                return (
                  <Message
                    key={message.id}
                    text={message.text}
                    mine={user.id === message.userId}
                  />
                );
              }
              return null;
            })}
        </Chat>
        <InputCont>
          <Form submitFn={onSubmit}>
            <Input
              value={messageText}
              placeholder={"Type your message"}
              onChange={onInputChange}
              name={"message"}
            />
          </Form>
        </InputCont>
      </React.Fragment>
    )}
  </Container>
);

export default ChatPresenter;

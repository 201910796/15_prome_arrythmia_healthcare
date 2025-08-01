import React from 'react';
import styled from 'styled-components/native';

const ChatWrapper = styled.View`
    flex-direction: ${props => props.isQuestion ? 'row' : 'row-reverse'};
    width: 80%;
    align-self: center;
    flex: 1;
    margin: 5%;
`;

const ChatUser = styled.View`
    border-radius: 900px;
    width: 15%;
    aspect-ratio: 1;
    background-color: ${props => props.isQuestion ? 'red' : 'blue'};
    justify-content: center;
    margin-right: ${props => props.isQuestion ? '5%' : '0%'};
    margin-left: ${props => props.isQuestion ? '0%' : '5%'};
`;

const ChatUserName = styled.Text`
    font-size: 16px;
    font-weight: bold;
    text-align: center;
    color: white;
`;

const ChatComment = styled.View`
    width: 80%;
    justify-content: center;
    background-color: white;
`;

const ChatText = styled.Text`
    font-size: 12px;
    text-align: center;
`;

function Chat({ isQuestion }) {
    return (
        <ChatWrapper isQuestion={isQuestion}>
            <ChatUser isQuestion={isQuestion}>
                <ChatUserName>{isQuestion ? '나' : 'AI'}</ChatUserName>
            </ChatUser>
            <ChatComment>
                <ChatText isQuestion={isQuestion}>
                    {isQuestion ? '나 건강해?' : '아니'}
                </ChatText>
            </ChatComment>
        </ChatWrapper>
    );
}

export default Chat;

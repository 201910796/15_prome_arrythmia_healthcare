import React from 'react';
import styled from 'styled-components/native';
import Back from './Back';

const TopWrapper = styled.View`
    width: 100%;
    height: 10%;
    background-color: red;
    justify-content: center;
`;

const TopText = styled.Text`
    font-size: 14px;
    text-align: center;
`;

function Top({ navigation, text }) {
    return (
        <TopWrapper>
            <Back navigation={navigation} />
            <TopText>{text}</TopText>
        </TopWrapper>
    );
}

export default Top;

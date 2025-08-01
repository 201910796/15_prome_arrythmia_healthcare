import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import styled from 'styled-components/native';
import Video from 'react-native-video';

const Container = styled.View`
    flex: 1;
    background-color: #000;
`;

const StartScreen = ({ onFinish }) => {
    const [videoEnded, setVideoEnded] = useState(false);

    const handleVideoEnd = () => {
        setVideoEnded(true);
        setTimeout(() => {
            onFinish();
        }, 500);
    };

    return (
        <Container>
            <Video
                source={require('../../../assets/prome_start.mp4')}
                style={StyleSheet.absoluteFillObject}
                resizeMode="cover"
                onEnd={handleVideoEnd}
                repeat={false}
                paused={false}
                volume={1.0}
                muted={false}
            />
        </Container>
    );
};

export default StartScreen;

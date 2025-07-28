import { View, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import getCallScreenStyles from './CallScreenStyles';

const CallScreen = () => {

    const { width, height } = useWindowDimensions();
    const callStyles = getCallScreenStyles(width, height);

    return (
        <SafeAreaView>
            <View />
        </SafeAreaView>
    );
};

export default CallScreen;

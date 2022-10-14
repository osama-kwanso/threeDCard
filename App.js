import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  runOnJS
} from 'react-native-reanimated';
import { BackgroundGradient } from './components/BackgroundGradient';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const HEIGHT = 256;
const WIDTH = SCREEN_WIDTH * 0.9;

const CARD_HEIGHT = HEIGHT - 5;
const CARD_WIDTH = WIDTH - 5;

function App() {
  const rotateX = useSharedValue(0);
  const rotateY = useSharedValue(0);

  // const handleAnimationEnd = (finished) => { }
  // const handleAnimationEndWrappedInRunOnJS = runOnJS(handleAnimationEnd);

  const gesture = Gesture.Pan()
    .onBegin(event => {
      rotateX.value = withTiming(
        interpolate(event.y, [0, CARD_HEIGHT], [1, -1], Extrapolate.CLAMP),
      );
      rotateY.value = withTiming(
        interpolate(event.x, [0, CARD_WIDTH], [-1, 1], Extrapolate.CLAMP),
      );
    })
    .onUpdate(event => {
      rotateX.value = interpolate(
        event.y,
        [-10, CARD_HEIGHT],
        [50, -50],
        Extrapolate.CLAMP,
      );
      rotateY.value = interpolate(
        event.x,
        [-10, CARD_WIDTH],
        [-50, 50],
        Extrapolate.CLAMP,
      );
    })
    .onFinalize(() => {
      rotateX.value = withTiming(0);
      rotateY.value = withTiming(0);
      // rotateX.value = withTiming(0, {}, (finished) => runOnJS(handleAnimationEnd)(finished));
      // rotateY.value = withTiming(0, {}, (finished) => runOnJS(handleAnimationEnd)(finished));

    });

  const rStyle = useAnimatedStyle(() => {
    const rotateXvalue = `${rotateX.value}deg`;
    const rotateYvalue = `${rotateY.value}deg`;

    return {
      transform: [
        {
          perspective: -300,
        },
        { rotateX: rotateXvalue },
        { rotateY: rotateYvalue },
      ],
    };
  }, []);

  return (
    <View style={styles.container}>
      {/* <View style={{ width: WIDTH, height: HEIGHT, backgroundColor: "red" }} /> */}
      <GestureDetector gesture={gesture}>
        <Animated.View
          style={[
            {
              height: CARD_HEIGHT,
              width: CARD_WIDTH,
              backgroundColor: 'black',
              // position: 'absolute',
              borderRadius: 20,
              zIndex: 300,
              borderWidth: 10,

            },
            rStyle,
          ]}>

          <View
            style={styles.buttonGrad}></View>

        </Animated.View>
      </GestureDetector>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  buttonGrad: {
    height: CARD_HEIGHT + 5,
    width: CARD_WIDTH + 5,
    borderRadius: 20,
    zIndex: 300,
    borderWidth: 10,
    // position: 'absolute',
    bottom: 5,
    backgroundColor: "red",
    borderColor: "red"
  },

});

export default () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <App />
    </GestureHandlerRootView>
  );
};
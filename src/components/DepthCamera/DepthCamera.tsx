import {
  View,
  Dimensions,
  PlatformColor,
  useColorScheme,
  Alert,
  AppState,
  Pressable,
  ViewStyle,
} from 'react-native';

import { DistanceRect } from './DistanceRect';
import { DepthCameraView } from './DepthCameraView';
import { useEffect } from 'react';
import { useState } from 'react';
import { PermissionManager } from '@/utils';

const ratio = 192 / 256;
const width = Dimensions.get('window').width;

interface DeepCameraProps {
  distanceRectVisible: boolean;
}

export function DeepCamera(props: DeepCameraProps) {
  const isDark = useColorScheme() === 'dark';
  const [supports, setSupports] = useState(false);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') {
        checkSupports();
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

  function checkSupports() {
    if (supports) {
      return;
    }

    DepthCameraView.supports().then(async (value) => {
      if (!value) {
        Alert.alert('无法在此设备运行', '请更换支持激光雷达扫描仪的设备后尝试');
      } else {
        await PermissionManager.checkPermissions(['ios.permission.CAMERA']);
        setSupports(value);
      }
    });
  }

  return (
    <Pressable
      style={[
        $cameraContainer,
        {
          backgroundColor: PlatformColor(isDark ? 'secondarySystemBackground' : 'systemBackground'),
        },
      ]}
      onPress={checkSupports}
    >
      <View
        style={{
          width,
          height: width / ratio,
          backgroundColor: '#000',
        }}
      >
        {supports && (
          <DepthCameraView
            style={{
              flex: 1,
              backgroundColor: '#F00',
            }}
            onMinDistance={(e) => {
              console.log(e);
            }}
            minDistance={44.9}
            distanceRectWidth={199}
          />
        )}

        {props.distanceRectVisible && <DistanceRect />}
      </View>
    </Pressable>
  );
}

const $cameraContainer: ViewStyle = {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
};

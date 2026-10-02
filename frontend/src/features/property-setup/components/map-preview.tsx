import { Ionicons } from "@expo/vector-icons";
import { useRef } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import MapView, { Marker, type Region } from "react-native-maps";

import { colors } from "@/theme";

type Props = {
  latitude: number;
  longitude: number;
};

const DELTA = { latitudeDelta: 0.008, longitudeDelta: 0.008 };

export function MapPreview({ latitude, longitude }: Props) {
  const mapRef = useRef<MapView>(null);
  const region: Region = { latitude, longitude, ...DELTA };

  const recenter = () => {
    mapRef.current?.animateToRegion(region, 300);
  };

  return (
    <View style={styles.map}>
      <MapView
        ref={mapRef}
        style={StyleSheet.absoluteFill}
        initialRegion={region}
        showsUserLocation
        showsMyLocationButton={false}
        showsCompass={false}
        toolbarEnabled={false}
      >
        {/* Custom marker keeps the same pin used in the fake preview, instead of the platform default */}
        <Marker
          coordinate={{ latitude, longitude }}
          anchor={{ x: 0.5, y: 1 }}
          tracksViewChanges={false}
        >
          <Ionicons name="location" size={34} color={colors.primary} />
        </Marker>
      </MapView>

      <Pressable
        style={styles.locationButton}
        onPress={recenter}
        accessibilityRole="button"
      >
        <Ionicons name="locate-outline" size={22} color={colors.primary} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  map: {
    height: 224,
    overflow: "hidden",
    borderRadius: 14,
    backgroundColor: "#E8E6DF",
  },
  locationButton: {
    position: "absolute",
    right: 12,
    bottom: 12,
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.background,
  },
});

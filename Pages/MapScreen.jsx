import React, { useState } from "react";
import MapView, { Marker, Circle } from "react-native-maps";
import { StyleSheet, View, Button } from "react-native";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { Container } from "../styles/appStyles";

const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = 0.0421;

const MapScreen = ({ navigation, route }) => {
  const { mock_coordinate } = route.params;

  console.log("mock_coordinate >>>>", mock_coordinate);

  const [region, setRegion] = useState(null);


  const toggleMapVisibility = () => {
    navigation.pop();
  };

  return (
    <Container>
      <View style={styles.mapContainer}>
        <GooglePlacesAutocomplete
          placeholder="Search"
          fetchDetails={true}
          GooglePlacesSearchQuery={{
            rankby: "distance",
          }}
          onPress={(data, details = null) => {
            console.log(data, details);
            setRegion({
              latitude: details.geometry.location.lat,
              longitude: details.geometry.location.lng,
              latitudeDelta: LATITUDE_DELTA,
              longitudeDelta: LONGITUDE_DELTA,
            });
          }}
          query={{
            key: "AIzaSyAF-S718yqO4RPrIWaW5VS2RCkoPD-1xzg",
            language: "en",
            components: "country:uk",
            types: "establishment",
            radius: 30000,
            location: `${region?.latitude}, ${region?.longitude}`,
          }}
          styles={{
            container: { flex: 0, zIndex: 1, margin: 10 },
            listView: { backgroundColor: "white" },
          }}
        />

        <MapView
          style={styles.map}
          initialRegion={{
            latitude: mock_coordinate.latitude,
            longitude: mock_coordinate.longitude,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
          }}
          region={region}
          provider="google"
        >
          <Marker
            coordinate={{
              latitude:  mock_coordinate.latitude,
              longitude:  mock_coordinate.longitude,
            }}
            title="I'm here!"
          />
          {region ? (
            <Marker
              coordinate={region}
              draggable={true}
              title="Destination"
            />
          ) : null}
          <Circle center={mock_coordinate} radius={1000} />
        </MapView>
      </View>

      <View style={styles.buttonContainer}>
        <Button title={"BACK"} color={"#fff"} onPress={toggleMapVisibility} />
      </View>
    </Container>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
  },
  mapContainer: {
    flex: 1,
    zIndex: 0, // 将地图置于下方
  },
  map: {
    flex: 1,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 10,
    backgroundColor: "transparent",
  },
});

export default MapScreen;
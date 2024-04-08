import React, { useState, useRef, useEffect } from "react";
import {
  Text,
  StyleSheet,
  View,
  Modal,
  TouchableOpacity,
  Image,
  Dimensions,
  Pressable,
} from "react-native";
import {
  ListView,
  ListViewHidden,
  TodoDate,
  TodoText,
  HiddenButton,
  SwipedTodoText,
  colors,
} from "../styles/appStyles";
import { SwipeListView } from "react-native-swipe-list-view";
import { Feather } from "@expo/vector-icons";
import { Camera, CameraType } from "expo-camera";
import Toast from "react-native-root-toast";
// Async storage
import AsyncStorage from "@react-native-async-storage/async-storage";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

const ListItems = ({ todos, setTodos, handleTriggerEdit, navigation }) => {
  const [swipedRow, setswipedRow] = useState(null);
  const [isCameraVisible, setCameraVisible] = useState(false);
  // 图片集
  const [capturedImages, setCapturedImages] = useState({});
  // 单图
  const [capturedImage, setCapturedImage] = useState(null);
  const [visible, setVisible] = useState(false);
  const cameraRef = useRef(null);
  const curItemKey = useRef("");
  const [type, setType] = useState(CameraType.back);

  useEffect(() => {
    AsyncStorage.getItem("storedTodosImgs")
      .then((data) => {
        if (data !== null) {
          console.log("storedTodosImgs >>>>", data);
          setCapturedImages(JSON.parse(data));
        }
      })
      .catch((error) => console.log(error));
  }, []);

  useEffect(() => {
    if (!todos || todos.length <= 0) {
      setCapturedImages({});
    }
  }, [todos]);

  const handleDeleteTodo = (rowMap, rowKey) => {
    const newTodos = [...todos];
    const todoIndex = todos.findIndex((todo) => todo.key === rowKey);
    newTodos.splice(todoIndex, 1);
    setCapturedImages((imgs) => {
      delete imgs[curItemKey.current];
      return imgs;
    });

    AsyncStorage.setItem("storedTodos", JSON.stringify(newTodos))
      .then(() => {
        Toast.show("delete todo success!", {
          duration: Toast.durations.SHORT,
        });
        setTodos(newTodos);
      })
      .catch((error) => console.log(error));
  };

  const handleCameraToggle = (key) => {
    curItemKey.current = key;
    setCameraVisible(!isCameraVisible);
  };

  // take picture
  const handleTakePicture = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync();
      console.log("curItemKey.current >>>>>", curItemKey.current);
      console.log("photo >>>>>", photo);

      setCapturedImage(photo.uri);
    }
  };

  const handleSavePicture = () => {
    setCapturedImages((imgs) => {
      const nextImgs = { ...imgs, [curItemKey.current]: capturedImage };
      console.log("JSON.stringify(nextImgs) >>>>", nextImgs);
      AsyncStorage.setItem("storedTodosImgs", JSON.stringify(nextImgs));
      return nextImgs;
    });
    setCameraVisible(false);
    setCapturedImage(null);
    Toast.show("save picture success!", {
      duration: Toast.durations.SHORT,
    });
  };

  const handleAgainCamera = () => {
    setCapturedImage(null);
  };

  // cancel camera
  const handleCloseCamera = () => {
    setCameraVisible(false);
    setCapturedImage(null);
  };
  
  // View picture
  const handleImgToggle = (key) => {
    curItemKey.current = key;
    console.log("key >>>>>", key);
    console.log("capturedImage >>>>>", capturedImages);
    if (!capturedImages[key]) {
      Toast.show("No image was obtained!", {
        duration: Toast.durations.SHORT,
      });
      return;
    }
    setVisible(!visible);
  };

  const onCloseImgModal = () => {
    setVisible(false);
  };

  const toggleCameraType = () => {
    setType((current) =>
      current === CameraType.back ? CameraType.front : CameraType.back
    );
  };

  const renderBottomTools = () => {
    if (capturedImage) {
      return (
        <>
          <Pressable style={styles.button} onPress={handleSavePicture}>
            <Text style={styles.text}>{"SAVE"}</Text>
          </Pressable>
          <Pressable style={styles.button} onPress={handleAgainCamera}>
            <Text style={styles.text}>{"TAKE AGAIN"}</Text>
          </Pressable>
        </>
      );
    }
    return (
      <>
        <Pressable style={styles.button} onPress={handleTakePicture}>
          <Text style={styles.text}>{"TAKE PICTURE"}</Text>
        </Pressable>
        <Pressable style={styles.button} onPress={handleCloseCamera}>
          <Text style={styles.text}>{"CLOSE"}</Text>
        </Pressable>
      </>
    );
  };

  return (
    <>
      {todos.length == 0 && (
        <TodoText>Congratulation! There is no todos here.</TodoText>
      )}
      {todos.length != 0 && (
        <SwipeListView
          data={todos}
          renderItem={(data) => {
            const RowText =
              data.item.key == swipedRow ? SwipedTodoText : TodoText;
            return (
              <ListView
                underlayColor={colors.primary}
                onPress={() => {
                  handleTriggerEdit(data.item);
                }}
              >
                <>
                  <RowText>{data.item.title}</RowText>
                  <TodoDate>{data.item.date}</TodoDate>
                </>
              </ListView>
            );
          }}
          renderHiddenItem={(data, rowMap) => {
            return (
              <ListViewHidden>
                <HiddenButton
                  onPress={() => handleCameraToggle(data.item?.key)}
                >
                  <Feather name="camera" size={25} color={colors.secondary} />
                </HiddenButton>

                <HiddenButton
                  onPress={() => {
                    handleImgToggle(data.item?.key);
                    rowMap[data.item.key].closeRow();
                  }}
                >
                  <Feather name="image" size={25} color={colors.secondary} />
                </HiddenButton>

                <HiddenButton
                  onPress={() => {
                    console.log("data.item.coordinate >>>", data.item);
                    if (!data.item.coordinate) {
                      Toast.show("Invalid coordinate!", {
                        duration: Toast.durations.SHORT,
                      });
                      return;
                    }
                    navigation.push("Map", {
                      mock_coordinate: data.item.coordinate,
                    });
                  }}
                >
                  <Feather name="map-pin" size={25} color={colors.secondary} />
                </HiddenButton>

                <HiddenButton
                  onPress={() => handleDeleteTodo(rowMap, data.item.key)}
                >
                  <Feather name="trash-2" size={25} color={colors.secondary} />
                </HiddenButton>
              </ListViewHidden>
            );
          }}
          rightOpenValue={-200}
          previewRowKey={"1"}
          previewOpenValue={80}
          previewOpenDelay={3000}
          disableRightSwipe={true}
          showsVerticalScrollIndicator={false}
          style={{
            flex: 1,
            paddingBottom: 30,
            marginBottom: 40,
          }}
          onRowOpen={(rowKey) => {
            setswipedRow(rowKey);
          }}
          onRowClose={() => {
            setswipedRow(null);
          }}
        />
      )}
      <Modal visible={isCameraVisible} animationType="slide">
        <View style={styles.cameraContainer}>
          <Pressable style={styles.button_flip} onPress={toggleCameraType}>
            <Feather name="repeat" size={20} color={colors.secondary} />
          </Pressable>
          {capturedImage ? (
            <Image source={{ uri: capturedImage }} style={styles.camera} />
          ) : (
            <Camera style={styles.camera} ref={cameraRef} type={type} />
          )}

          <View style={styles.buttonContainer}>{renderBottomTools()}</View>
        </View>
      </Modal>
      <Modal
        animationType="fade"
        transparent={true}
        visible={visible}
        onRequestClose={onCloseImgModal}
      >
        <TouchableOpacity
          style={styles.containerImg}
          activeOpacity={1}
          onPress={onCloseImgModal}
        >
          <TouchableOpacity activeOpacity={1} onPress={onCloseImgModal}>
            <Image
              source={{ uri: capturedImages[curItemKey.current] }}
              style={styles.image}
            />
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  cameraContainer: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: colors.primary,
    padding: 20,
  },
  containerImg: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // 半透明黑色背景
  },
  image: {
    width: screenWidth - 100,
    height: (screenHeight * (screenWidth - 100)) / screenWidth,
    resizeMode: "contain",
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: "white",
    width: 150,
  },
  button_flip: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: "white",
    position: "absolute",
    top: 64,
    left: 20,
    // width: 80,
    borderRadius: 50,
    height: 50,
    width: 50,
    zIndex: 1,
  },
  text: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "bold",
    letterSpacing: 0.25,
    color: colors.primary,
  },
});

export default ListItems;

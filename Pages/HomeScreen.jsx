import React, { useEffect, useState, useRef } from "react";
import { Text, StyleSheet, Button, View, Modal, Linking } from "react-native";
import { Camera, CameraType } from "expo-camera";
import { Container } from "../styles/appStyles";
// Components
import Header from "../Components/Header.js";
import ListItems from "../Components/ListItems.js";
import AddItems from "../Components/AddItems.js";

// Async storage
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-root-toast";

const HomeScreen = ({ navigation }) => {
  // initial Todos
  const initialTodos = [];

  const [todos, setTodos] = useState(initialTodos);
  const [modalVisible, setModalVisible] = useState(false);
  const [addTodoValue, setAddTodoValue] = useState();

  const [permission, requestPermission] = Camera.useCameraPermissions();


  useEffect(() => {
    AsyncStorage.getItem("storedTodos")
      .then((data) => {
        if (data !== null) {
          console.log('newTodos >>>>', data)
          setTodos(JSON.parse(data));
        }
      })
      .catch((error) => console.log(error));
  }, []);

  useEffect(() => {
    requestPermission();
  }, []);

  const handleClearTodos = () => {
    AsyncStorage.setItem("storedTodos", JSON.stringify([]))
      .then(() => {
        setTodos([]);
        Toast.show("cleared!", {
          duration: Toast.durations.SHORT,
        });
      })
      .catch((error) => console.log(error));
  };

  

  //Add function
  const handleAddTodo = (todo) => {
    const newTodos = [...todos, todo];

    console.log('newTodos >>>>', newTodos)

    AsyncStorage.setItem("storedTodos", JSON.stringify(newTodos))
      .then(() => {
        setTodos(newTodos);
        setModalVisible(false);
      })
      .catch((error) => console.log(error));
  };

  //Edit function
  const [todoEdit, setTodoEdit] = useState(null);
  const handleTriggerEdit = (item) => {
    setTodoEdit(item);
    setModalVisible(true);
    setAddTodoValue(item.title);
  };
  const handleEditTodo = (todoEdit) => {
    const newTodos = [...todos];
    const todoIndex = todos.findIndex((todo) => todo.key === todoEdit.key);
    newTodos.splice(todoIndex, 1, todoEdit);

    AsyncStorage.setItem("storedTodos", JSON.stringify(newTodos))
      .then(() => {
        setTodos(newTodos);
        setModalVisible(false);
        setTodoEdit(null);
      })
      .catch((error) => console.log(error));
  };

  const openAppSettings = async () => {
    // 打开应用设置界面
    await Linking.openSettings();
  };


  if (!permission || permission.status !== "granted") {
    return (
      <View style={styles.container}>
        <Text>No camera permission granted!</Text>
        <Button onPress={() => openAppSettings()} title="Request Permission"/>
      </View>
    );
  }

  return (
    <Container>
      <Header handleClearTodos={handleClearTodos} />
      <ListItems
        todos={todos}
        setTodos={setTodos}
        handleTriggerEdit={handleTriggerEdit}
        navigation={navigation}
      />
      <AddItems
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        addTodoValue={addTodoValue}
        setAddTodoValue={setAddTodoValue}
        todoEdit={todoEdit}
        setTodoEdit={setTodoEdit}
        handleAddTodo={handleAddTodo}
        handleEditTodo={handleEditTodo}
        todos={todos}
      />
     
    </Container>
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
    padding: 20,
  },
  containerImg: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // 半透明黑色背景
  },
  image: {
    width: '80%',
    height: '80%',
    resizeMode: 'contain', // 图片等比例缩放到容器内
  },
});

export default HomeScreen;

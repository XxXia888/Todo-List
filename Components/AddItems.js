import React, { useState } from "react";
import { Modal, Text, ActivityIndicator } from "react-native";

// styled-components
import {
  ModalButton,
  ModalContainer,
  ModalView,
  ModalAction,
  ModalActionGroup,
  ModalIcon,
  StyledInput,
  HeaderTitle,
  colors,
} from "../styles/appStyles";
import { Entypo, AntDesign } from "@expo/vector-icons";
import * as Location from "expo-location";

const AddItems = ({
  modalVisible,
  setModalVisible,
  addTodoValue,
  setAddTodoValue,
  todoEdit,
  setTodoEdit,
  handleAddTodo,
  handleEditTodo,
  todos,
}) => {
  const [errorMsg, setErrorMsg] = useState(null);
  const [loading, setLoading] = useState(null);

  const handleCloseModal = () => {
    setModalVisible(false);
    setAddTodoValue("");
    setTodoEdit(null);
    setErrorMsg(null);
  };

  const handleSubmit = async () => {
    if (!addTodoValue) {
      setErrorMsg("Missing valid value");
      return;
    }
    setLoading(true);
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }
      setErrorMsg(null);
      let { coords } = await Location.getCurrentPositionAsync({});
      const { longitude, latitude } = coords || {};
      if (!todoEdit) {
        handleAddTodo({
          title: addTodoValue,
          date: new Date().toUTCString(),
          key: `${
            (todos[todos.length - 1] &&
              parseInt(todos[todos.length - 1].key) + 1) ||
            1
          }`,
          coordinate: { longitude, latitude },
        });
      } else {
        handleEditTodo({
          title: addTodoValue,
          date: todoEdit.date,
          key: todoEdit.key,
          coordinate: { longitude, latitude },
        });
      }
      setAddTodoValue("");
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };
  
  return (
    <>
      <ModalButton
        onPress={() => {
          setModalVisible(true);
        }}
      >
        <Entypo name="plus" size={30} color={colors.secondary} />
      </ModalButton>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={handleCloseModal}
      >
        <ModalContainer>
          <ModalView>
            <ModalIcon>
              <HeaderTitle>Todos.</HeaderTitle>
              <Entypo name="edit" size={30} color={colors.tertiary} />
            </ModalIcon>

            <StyledInput
              placeholder="Add a todo"
              placeholderTextColor={colors.alternative}
              selectionColor={colors.secondary}
              autoFocus={true}
              onChangeText={(text) => setAddTodoValue(text)}
              value={addTodoValue}
              onSubmitEditing={handleSubmit}
            />
            <Text style={{ marginTop: 10, color: "red" }}>
              {errorMsg || ""}
            </Text>
            <ModalActionGroup>
              <ModalAction
                disabled={loading}
                color={colors.tertiary}
                onPress={handleSubmit}
              >
                {loading ? (
                  <ActivityIndicator size="small" color={colors.secondary} />
                ) : (
                  <AntDesign
                    name={"check"}
                    size={28}
                    color={colors.secondary}
                  />
                )}
              </ModalAction>
              <ModalAction color={colors.primary} onPress={handleCloseModal}>
                <AntDesign name="close" size={28} color={colors.tertiary} />
              </ModalAction>
            </ModalActionGroup>
          </ModalView>
        </ModalContainer>
      </Modal>
    </>
  );
};

export default AddItems;

import React from "react";
import { Entypo } from "@expo/vector-icons";

// styled-components
import { HeaderView, HeaderTitle, HeaderButton, colors, TodoText } from "./../styles/appStyles";

const Header = ({handleClearTodos}) => {
    return (
        <HeaderView>
            <HeaderTitle>
                Todo.
            </HeaderTitle>

            <HeaderButton
                onPress={handleClearTodos}
            >
                <Entypo name="trash" size={25} color={colors.tertiary} />
            </HeaderButton>
        </HeaderView>
    );
}

export default Header;
// Author: Roshan Swain <swainroshan001@gmail.com>
// This file declares and handles the theme for the application.

import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { lightTheme, darkTheme } from "../styles/theme";


// Theme can be of two types now.
// TODO(v0.5): Provide support for system detected theme.
type Theme = 'light' | 'dark';

interface ThemeContextType {
    theme: Theme;
    toggleTheme: () => void;
};

// The context here will store the theme and apply toggle based on that.
// `creatContext` provides with `producer` and `consumer`. Producer is used
// to propogate data and functions (context value) to all the components within
// a tree which it wraps. That is, it is used to propogate the values.
// Consumer is used to consume that context value in the current component.
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);


// This is a functional component that wraps the app and provides the theme
// context.
export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // `useTheme` is a custom hook.
    const [theme, setTheme] = useState<Theme>('dark');

    const loadTheme = async () => {
        try {

            // AsyncStorage is an asynchronous key value datastructure.
            // REFER: https://www.npmjs.com/package/@react-native-async-storage
            // /async-storage
            const savedTheme = await AsyncStorage.getItem('theme');
            if (savedTheme) {
                setTheme(savedTheme as Theme);
            }
        } catch (error) {
            console.error('ERROR: loading theme due to: ', error);
        }
    };

    useEffect(() => {
        loadTheme();
    }, []);

    const toggleTheme = async () => {
        // Flip the theme for now since it has only 2 states.
        const new_theme = theme === 'light' ? 'dark' : 'light';

        setTheme(new_theme);
        try {
            await AsyncStorage.setItem('theme', new_theme);
        } catch (error) {
            console.error('ERROR: saving theme due to : ', error);
        }
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }} >
            {children}
        </ThemeContext.Provider>
    );
};

// This is a custom hook that wraps the `ThemeContext` to provide easy access
// to the theme context.
export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }

    return {
        ...context,
        colors: context.theme === 'dark' ? darkTheme : lightTheme,
    };
};








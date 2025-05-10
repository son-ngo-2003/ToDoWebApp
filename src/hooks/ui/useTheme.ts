import { useMantineColorScheme } from "@mantine/core";
import { ThemeContext } from "@src/context/themeContext"
import { Theme } from "@src/types/theme"
import { useContext } from "react"

const useTheme = () => {
    const { theme, setTheme } = useContext(ThemeContext);
    const { setColorScheme } = useMantineColorScheme();

    if (!theme) {
        throw new Error("useTheme must be used within a ThemeProvider")
    }

    const changeTheme = (newTheme: Theme.DARK | Theme.LIGHT ) => {
        setTheme?.(newTheme);
        localStorage.setItem('theme', newTheme);
        setTimeout(() => {
            setColorScheme(newTheme === Theme.DARK ? 'dark' : 'light'); 
        }, 200); // setTimeout to avoid flickering
    }

    const toggleTheme = () => {
        const newTheme = theme === Theme.LIGHT ? Theme.DARK : Theme.LIGHT;
        changeTheme(newTheme);
    }

    return {
        theme,
        setTheme: changeTheme,
        toggleTheme,
    }
}

export default useTheme
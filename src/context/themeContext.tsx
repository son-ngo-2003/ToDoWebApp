import { useMantineColorScheme } from "@mantine/core";
import { Theme } from "@src/types/theme";
import { createContext, useEffect, useState } from "react";

type ThemeContextType = {
    theme: Theme;
    setTheme: undefined | ((theme: Theme) => void);
}

export const ThemeContext = createContext<ThemeContextType>({
    theme: Theme.LIGHT,
    setTheme: undefined,
});

export const ThemeProvider = ({children} : {children: React.ReactNode}) => {
    const { setColorScheme } = useMantineColorScheme();
    const [theme, setTheme] = useState<Theme>(Theme.LIGHT);

    useEffect(() => {
        const initTheme = localStorage.getItem('theme') as Theme || Theme.LIGHT;
        setTheme(initTheme);
        setTimeout(() => {
            setColorScheme(initTheme === Theme.DARK ? 'dark' : 'light'); 
        }, 200); // setTimeout to avoid flickering
    }, []);

    return (
        <ThemeContext.Provider value={{ theme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    )
}
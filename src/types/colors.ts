export enum Color {
    RED = 'red',
    ORANGE = 'orange',
    YELLOW = 'yellow',   
    TEAL = 'teal',
    BLUE = 'blue',
    PURPLE = 'purple',
    PINK = 'pink',
}

export const colorList = Object.values(Color);

export const getRandomColor = () => {
    const colors = Object.values(Color);
    const randomIndex = Math.floor(Math.random() * colors.length);
    return colors[randomIndex];
}
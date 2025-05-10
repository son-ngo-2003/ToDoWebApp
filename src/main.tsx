import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import { MantineProvider } from '@mantine/core';
import App from './App.tsx'
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { ThemeProvider } from './context/themeContext.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <DndProvider backend={HTML5Backend}>
      <MantineProvider>
        <ThemeProvider>
          <App/>
        </ThemeProvider>
      </MantineProvider>
    </DndProvider>
  </StrictMode>,
)

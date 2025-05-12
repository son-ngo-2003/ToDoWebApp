## Implement projects
### 1. Install dependencies
  
```
npm install
```

### 2. Start the development server
```
npm run dev
```
This will start the Vite development server, typically at http://localhost:5173

## Tools Used

1. **Visual Studio Code**: I used VS Code as my primary IDE for development
2. **React + TypeScript**: I built the application using React with TypeScript to ensure type safety across the codebase.
3. **Vite**: I chose Vite as my build tool because of its fast server and optimized builds for react web.
4. **Dexie.js**: I chose IndexedDB (over localStorage) because it has larger storage, accepts all type of data, implemente async, and we can query data. But its syntax is really complicated so I use Dexie.js library to ease the implement.
5. **React Router**: For handling navigation between different pages (home page and label pages).
6. **React DnD**: Implemented drag and drop functionality for task reordering and assigning labels.
7. **Mantine UI**: Used for some UI components like Modal and DatePicker to save development time.
8. **CSS Modules**: For component-scoped styling to avoid class name collisions.
9. **PostCSS**: For features like CSS variables, custom media queries, and nesting to improve CSS organization.
10. **Git**: For version control throughout the development process.


## What I Learned

### Technical Concepts

1. **Client-Side Database with IndexedDB**: 
   - Explore that IndexedDB as a powerful client-side storage solution and implement it with Dexie.js library

2. **Advanced React Patterns**:
   - Custom hooks for data fetching and manipulation (`useTaskData`, `useLabelData`) (but I think this way is still not too optimal, because every time useTaskData is called, functions like getData and variables (like lastPrority) are still redefined -> I think it would be better if we would use it in Context next time)

3. **Event propagation mechanisms**:

4. **React Router Implementation**:
   - Data Mode approach with React Router (I always did in Declarative Mode before)

5. **CSS Architecture with PostCSS**:
   - Using PostCSS plugins for enhanced CSS capabilities (nesting, variables, etc.)
   - Implemented a theme system with CSS variables for dark/light mode
   - Implemente responsive design system with custom media queries

6. **Drag and Drop Implementation**:
   - Implement drag and drop functionality using React-DnD library

7. **Feature-Based Project Structure**:
   - Organize code by feature/domain rather than by technical role
   - Separate between UI components and business logic

8. **Component Design**:
   - Using pre-built components from libraries (like Mantine UI's DatePicker, Modal, Menu) to improve development efficiency, and reduce implement time.

## Summary my Development Process
- First, I looked up design ideas online and tried to imagine how they could fit into my own app. This gave me a rough vision of the overall layout and user experience.

- Then, I implemented the base CSS styles I needed. I reused patterns from previous projects and adapted them for this one.

- After that, I focused on building the key components first—like TaskTile, Dropdown, and TaskForm—so that the app’s core functionality could start working early on.

- Then, I did the data logic. I read documentation, learned how to use Dexie.js, and implemented hooks and methods to manage state and storage. I also built a simple HomePage to test these features in action.

- From there, I continued planning the next features to add. I kept repeating the same process: figure out what’s needed, build the components, and hook them up with the data layer—step by step.
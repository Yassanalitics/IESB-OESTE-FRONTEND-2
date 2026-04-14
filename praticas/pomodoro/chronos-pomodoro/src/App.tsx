import { Home } from './pages/Home';
import { useState } from 'react';
import type { TaskStateModel } from './models/TaskStateModel';
import { TaskContextProvider } from './contexts/TaskContext';

import './styles/theme.css';
import './styles/global.css';

const initialState = {} as TaskStateModel;

export function App() {
  
  const [state, setState] = useState(initialState);

  return (
  
    <TaskContextProvider>
      <Home />
    </TaskContextProvider>
  );
}
//CSS
import './css/App.scss'

//Components
import { Home } from './pages/Home';
import { NewRoom } from './pages/NewRoom'

// Services
import { createContext, useState } from 'react';
import { BrowserRouter, Route } from 'react-router-dom'
import './services/firebase'

export const AppContext = createContext({} as any)

function App() {

  const [ value, setValue ] = useState('App')

  return (
    <BrowserRouter>
      <AppContext.Provider value={ {value, setValue} } >
        <Route component={Home} path='/' exact />
        <Route component={NewRoom} path='/rooms/new' />
      </AppContext.Provider>
    </BrowserRouter>
  );
}

export default App;

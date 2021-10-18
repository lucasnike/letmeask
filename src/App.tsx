//CSS
import './css/App.scss'

//Components
import { Home } from './pages/Home';
import { NewRoom } from './pages/NewRoom'
import { Room } from './pages/Room'
import { AdminRoom } from './pages/AdminRoom';

// Services
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import './services/firebase'

// Contexts
import { AuthContextProvider } from './contexts/AuthContext'


function App() {

  return (
    <BrowserRouter>
      <AuthContextProvider>
        <Switch>
          <Route component={Home} path='/' exact />
          <Route component={NewRoom} path='/rooms/new' />
          <Route component={Room} path='/rooms/:id' />
          <Route component={AdminRoom} path='/admin/rooms/:id' />
        </Switch>
      </AuthContextProvider>
    </BrowserRouter>
  );
}

export default App;

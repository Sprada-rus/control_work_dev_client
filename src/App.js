import 'materialize-css';
import {BrowserRouter as Router} from "react-router-dom";
import {useNavRoutes, useRoutes} from "./hooks/Routes";
import {AuthContext} from "./context/AuthContext";
import {useAuth} from "./hooks/auth.hook";


function App() {
  const {authData, login, logout} = useAuth();
  const {token, type} = authData;
  const isAuth = !!token && !!type;
  const routes = useRoutes(isAuth, type);
  const nav = useNavRoutes(isAuth, type);
  return (
    <AuthContext.Provider value={{
      token, login, logout, isAuthenticated: isAuth, type
    }}>
      <Router>
        <div>
          {nav}
        </div>
        <div>
          {routes}
        </div>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;

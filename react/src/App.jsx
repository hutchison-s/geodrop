import { Route, Routes } from "react-router-dom";
import Layout from "./pages/Layout";
import Protected from "./router/Protected";
import MapComponent from "./pages/MapComponent";
import Feed from "./pages/Feed";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound"
import { UserProvider } from "./contexts/UserContext";
import './styles/global.css'
import Favorites from "./pages/Favorites";
import NewDrop from "./pages/NewDrop";
import GeoLocationProvider from "./contexts/GeoLocationContext";
import AwaitLocation from "./router/AwaitLocation";
import { LightContextProvider } from "./contexts/LightContext";
import { DropContextProvider } from "./contexts/DropContext";
import About from "./pages/About";

function App() {
    
    return (
        
      <UserProvider>                
          <LightContextProvider>
              <GeoLocationProvider>
                  <DropContextProvider>
                      <Routes>
                        <Route path="/about" element={<About />}/>
                            <Route path="/" element={<Protected/>}>
                                <Route element={<Layout/>}>
                                <Route element={<AwaitLocation />}>
                                    <Route index element={<Feed />}/>
                                        <Route path="explore" element={<MapComponent />}/>
                                    <Route path="drop" element={<NewDrop />}/>
                                    
                                </Route>
                                <Route path="favorites" element={<Favorites />}/>
                                <Route path="profile">
                                    <Route index element={<NotFound />}/>
                                    <Route path="me" element={<Profile isMine/>}/>
                                    <Route path=":id" element={<Profile />}/>
                                </Route>
                                
                                <Route path="*" element={<NotFound />} />
                                </Route>
                            </Route>
                      </Routes>
                  </DropContextProvider>
              </GeoLocationProvider>
          </LightContextProvider>        
      </UserProvider>
          
        
    )
}

export default App;
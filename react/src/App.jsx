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
import NewPost from "./pages/NewPost";
import GeoLocationProvider from "./contexts/GeoLocationContext";
import AwaitLocation from "./router/AwaitLocation";
import { LightContextProvider } from "./contexts/LightContext";
import { DropContextProvider } from "./contexts/DropContext";
import FullScreenContent from "./pages/FullScreenContent";

function App() {
    
    return (
        
      <UserProvider>                
          <LightContextProvider>
              <GeoLocationProvider>
                  <DropContextProvider>
                      <Protected>
                          <Routes>
                              <Route path="/" element={<Layout/>}>
                                  <Route index element={<Feed />}/>
                                      <Route path="explore" element={
                                        <AwaitLocation>
                                            <MapComponent />
                                        </AwaitLocation>
                                        }/>
                                  <Route path="drop" element={<NewPost />}/>
                                  <Route path="profile">
                                      <Route index element={<NotFound />}/>
                                      <Route path="me" element={<Profile isMine/>}/>
                                      <Route path=":id" element={<Profile />}/>
                                  </Route>
                                  <Route path="favorites" element={<Favorites />}/>
                                  <Route path="content/:id" element={<FullScreenContent/>} />
                                  <Route path="*" element={<NotFound />} />
                              </Route>
                          </Routes>
                      </Protected>
                  </DropContextProvider>
              </GeoLocationProvider>
          </LightContextProvider>        
      </UserProvider>
          
        
    )
}

export default App;
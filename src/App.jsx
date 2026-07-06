import { Routes, Route } from "react-router-dom";
import {routes} from "./routes/index";
import HeaderComponent from "./components/HeaderComponent/HeaderComponent";
function App() {
  return (
    <>
      <HeaderComponent />
      <Routes>
        {routes.map((route, index) => (
          <Route
            key={index}
            path={route.path}
            element={<route.page />}
          />
        ))}
      </Routes>
    </>
  )
}

export default App

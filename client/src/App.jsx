import "./App.module.scss";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Modal from "./components/modal/Modal";
import AuthenticatedRoute from "./routes/AuthenticatedRoute";
import UnAuthentictedHome from "./pages/UnAuthentictedHome";

function App() {
  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            // <AuthenticatedRoute fallback={<UnAuthentictedHome />}>
            <Home />
            // </AuthenticatedRoute>
          }
        ></Route>
      </Routes>
      <Modal />
    </>
  );
}
export default App;

import "./App.module.scss";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Modal from "./components/modal/Modal";
import AuthenticatedRoute from "./routes/AuthenticatedRoute";
import UnAuthentictedHome from "./pages/UnAuthentictedHome";
import Write from "./pages/Write";
import Overlay from "./components/overlay/Overlay";
import Post from "./pages/Post";
import { ToastContainer } from "react-toastify";

function App() {
  return (
    <>
      <ToastContainer
        position="top-right"
        theme="colored"
        autoClose={5000}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        style={{ fontWeight: 500 }}
      />
      <Routes>
        <Route path="/post/:id" element={<Post />} />
        <Route
          path="/"
          element={
            <AuthenticatedRoute fallback={<UnAuthentictedHome />}>
              <Home />
            </AuthenticatedRoute>
          }
        />
        <Route
          path="/new-story"
          element={
            <AuthenticatedRoute fallback={<UnAuthentictedHome />}>
              <Write />
            </AuthenticatedRoute>
          }
        />
      </Routes>
      <Modal />
      <Overlay />
    </>
  );
}
export default App;

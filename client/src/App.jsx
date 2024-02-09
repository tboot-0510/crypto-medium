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
import "react-toastify/dist/ReactToastify.css";
import Panel from "./components/panel/Panel";
import Topics from "./pages/topics/Topics";
import Plans from "./pages/plans/Plans";
import AuthRedirect from "./pages/AuthRedirect";

function App() {
  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        style={{ zIndex: 100001 }}
        pauseOnFocusLoss
        theme="light"
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
        <Route
          path="/get-started/topics"
          element={
            <AuthenticatedRoute>
              <Topics />
            </AuthenticatedRoute>
          }
        />
        <Route
          path="/get-started/plans"
          element={
            // <AuthenticatedRoute>
            <Plans />
            // </AuthenticatedRoute>
          }
        />
        <Route path="/oauth/redirect" element={<AuthRedirect />} />
      </Routes>
      <Modal />
      <Panel />
      <Overlay />
    </>
  );
}
export default App;

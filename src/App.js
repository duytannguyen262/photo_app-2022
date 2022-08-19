import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import NotFound from "./pages/NotFound";
import Header from "./shared/components/Header";
import HomePage from "./pages/HomePage";
import LoginPage from "./features/user/pages/auth/Login";
import RegisterPage from "./features/user/pages/auth/Register";
import ProtectedRoutes from "./ProtectedRoutes";
import UploadPage from "./features/photo/pages/UploadPage";
import LibraryPage from "./features/photo/pages/LibraryPage";
import SinglePhotoPage from "./features/photo/pages/SinglePhotoPage";
import AlbumPage from "./features/photo/pages/AlbumPage";

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signin" element={<LoginPage />} />
        <Route path="/signup" element={<RegisterPage />} />
        <Route element={<ProtectedRoutes />}>
          <Route path="/library" element={<LibraryPage />} />
          <Route path="/upload" element={<UploadPage />} />
          <Route path="/albums/:albumId/photos" element={<AlbumPage />} />
          <Route path="/albums/:albumId/upload" element={<UploadPage />} />
          <Route path="/photos/:photoId" element={<SinglePhotoPage />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
      <ToastContainer></ToastContainer>
    </>
  );
}

export default App;

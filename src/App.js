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
import EditPhotoPage from "./features/photo/pages/EditPhotoPage";
import TempAlbumPage from "./features/photo/pages/TempAlbumPage";
import TempPhotoPage from "./features/photo/pages/TempPhotoPage";
import UploadMultiplePage from "./features/photo/pages/UploadMultiplePage";

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
          <Route path="/uploadMultiple" element={<UploadMultiplePage />} />
          <Route path="/albums/:albumId/photos" element={<AlbumPage />} />
          <Route
            path="/albums/:albumId/uploadMultiple"
            element={<UploadMultiplePage />}
          />
          <Route path="/photos/:photoId/edit" element={<EditPhotoPage />} />
        </Route>
        <Route path="/photos/:photoId" element={<SinglePhotoPage />} />
        <Route path="/albums/temp/:token" element={<TempAlbumPage />} />
        <Route path="/photos/temp/:token" element={<TempPhotoPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <ToastContainer></ToastContainer>
    </>
  );
}

export default App;

import React, { useEffect, useRef, useState } from "react";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";

import "./PreviewFile.scss";
import { useSelector } from "react-redux";

const PreviewFile = ({ previewFile, setFieldValue, setData, data }) => {
  const user = useSelector((state) => state.auth.user);
  const imgRef = useRef();
  const [previewUrl, setPreviewUrl] = useState("");
  const fileInfoIndex = data.filesInfos.findIndex(
    (fileInfo) => fileInfo.name === previewFile.name
  );
  useEffect(() => {
    if (!previewFile) {
      setPreviewUrl(null);
      return;
    }
    const fileReader = new FileReader();
    fileReader.onloadend = () => {
      setPreviewUrl(fileReader.result);
    };
    fileReader.readAsDataURL(previewFile);
  }, [previewFile]);

  const removeFileHandler = () => {
    const newFiles = [...data.files].filter(
      (file) => file.name !== previewFile.name
    );
    const newFilesInfos = data.filesInfos.filter(
      (fileInfo) => fileInfo.name !== previewFile.name
    );
    setData({ ...data, files: newFiles, filesInfos: newFilesInfos });
    setFieldValue("files", newFiles);
  };

  const fileNameChangeHandler = (e) => {
    const filesInfos = data.filesInfos;
    console.log(imgRef.current);
    filesInfos[fileInfoIndex] = {
      ...data.filesInfos[fileInfoIndex],
      newName: e.target.value,
      authorId: user.userId,
      authorName: user.name,
      resolution: `${imgRef.current.naturalWidth}x${imgRef.current.naturalHeight}`,
    };

    setData({
      ...data,
      filesInfos,
    });
  };

  return (
    <>
      <div className="preview-container">
        <div className="preview-img">
          <img ref={imgRef} src={previewUrl} alt="PreviewFile" />
        </div>

        <input
          type="text"
          onChange={fileNameChangeHandler}
          placeholder="Enter your photo name"
          required
          value={data.filesInfos[fileInfoIndex].newName}
        />

        <HighlightOffIcon
          sx={{ fontSize: "2rem", cursor: "pointer" }}
          onClick={removeFileHandler}
        />
      </div>
    </>
  );
};

export default PreviewFile;

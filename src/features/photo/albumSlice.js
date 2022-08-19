import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  _id: null,
  name: null,
  author: null,
};

export const albumSlice = createSlice({
  name: "album",
  initialState,
  reducers: {
    addCurrentAlbum: (state, action) => {
      const { _id, name, author } = action.payload;
      state._id = _id;
      state.name = name;
      state.author = author;
    },
  },
});

export const { addCurrentAlbum } = albumSlice.actions;
export default albumSlice.reducer;

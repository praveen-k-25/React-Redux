import { createSlice } from "@reduxjs/toolkit";

interface initialStateType {
  posts: Array<{ id: string; title: string; content: string }>;
  status: string;
  error: null | string;
}

const initialState: initialStateType = {
  posts: [],
  status: "idle",
  error: null,
};

const postSlice = createSlice({
  name: "post",
  initialState,
  reducers: {
    addPost: {
      reducer(state: any, action: any) {
        state.posts.unshift(action.payload);
      },
      prepare(title: string, content: string) {
        return {
          payload: {
            id: Date.now().toString(),
            title,
            content,
          },
        };
      },
    },
    updatePost: (state, action) => {},
    deletePost: (state, action) => {
      state.posts = state.posts.filter(
        (post) => post?.id !== action.payload.id
      );
    },
  },
});

export default postSlice.reducer;
export const { addPost, updatePost, deletePost } = postSlice.actions;

export const selectAllPost = (state: any) => state.post.posts;

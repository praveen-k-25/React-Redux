import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
} from "@reduxjs/toolkit";
import axios from "axios";

interface initialStateType {
  posts: Array<{ id: string; title: string; content: string }>;
  status: string;
  error: null | string;
}

const POSTUrl = "https://jsonplaceholder.typicode.com/posts";

export const fetchPosts = createAsyncThunk("post/fetchPosts", async () => {
  const response = await axios.get(POSTUrl);
  return response.data;
});

const postAdapter = createEntityAdapter({
  selectId: (post: any) => post.id,
  sortComparer: (a: any, b: any) => a.title.localeCompare(b.title),
});

const initialState: initialStateType = {
  posts: [],
  status: "idle",
  error: null,
};

/* const initialState = postAdapter.getInitialState({
  posts: [],
  status: "idle",
  error: null,
}); */

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
        (post) => post?.id !== action.payload.id,
      );

      /* state.posts = state.entities[action.payload.id] */
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchPosts.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.status = "succeeded";
        const loadedPosts = action.payload.map((post: any) => ({
          id: post.id.toString(),
          title: post.title,
          content: post.body,
        }));
        state.posts = loadedPosts;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Something went wrong";
      });
  },
});

export default postSlice.reducer;
export const { addPost, updatePost, deletePost } = postSlice.actions;

export const selectAllPost = (state: any) => state.post.posts;
export const getPostsStatus = (state: any) => state.post.status;
export const getPostsError = (state: any) => state.post.error;

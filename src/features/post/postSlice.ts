import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
} from "@reduxjs/toolkit";
import axios from "axios";

interface Post {
  id: number;
  title: string;
  body: string;
}

interface initialStateType {
  ids: string[];
  entities: Record<string, Post>;
  status: string;
  error: string | null;
}

const POSTUrl = "https://jsonplaceholder.typicode.com/posts";

/* createAsyncThunk<
  Returned,      // ✅ success payload type
  ThunkArg,      // ✅ argument type when dispatching
  ThunkConfig    // ✅ extra config (error, state, dispatch)
>() */

export const fetchPosts = createAsyncThunk<
  any[],
  void,
  { rejectValue: string }
>("post/fetchPosts", async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get(POSTUrl);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});

const postAdapter = createEntityAdapter({
  selectId: (post: any) => post.id,
  sortComparer: (a: any, b: any) => a.title.localeCompare(b.title),
});

/* const initialState: initialStateType = {
  posts: [],
  status: "idle",
  error: null,
}; */

const initialState: initialStateType = postAdapter.getInitialState({
  status: "idle",
  error: null,
});

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
    updatePost: (state, action) => {
      postAdapter.updateOne(state, action.payload);
    },
    deletePost: (state, action) => {
      /* state.posts = state.posts.filter(
        (post) => post?.id !== action.payload.id,
      ); */
      postAdapter.removeOne(state, action.payload.id);

      /* state.posts = state.entities[action.payload.id] */
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchPosts.pending, (state, _) => {
        state.status = "loading";
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.status = "succeeded";
        const loadedPosts = action.payload.map((post: any) => ({
          id: post.id.toString(),
          title: post.title,
          content: post.body,
        }));
        /* state.posts = loadedPosts; */
        postAdapter.setAll(state, loadedPosts);
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Something went wrong";
      });
  },
});

export default postSlice.reducer;
export const { addPost, updatePost, deletePost } = postSlice.actions;

export const {
  selectAll: selectAllPost,
  selectById: selectPostById,
  selectIds: selectPostIds,
} = postAdapter.getSelectors((state: any) => state.post);

/* export const selectAllPost = (state: any) => state.post.posts; */
export const getPostsStatus = (state: any) => state.post.status;
export const getPostsError = (state: any) => state.post.error;

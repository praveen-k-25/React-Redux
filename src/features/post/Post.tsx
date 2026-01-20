import React, { useEffect, useState } from "react";
import {
  addPost,
  fetchPosts,
  getPostsError,
  getPostsStatus,
  selectAllPost,
} from "./postSlice";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch } from "../../app/store";

const Post = () => {
  const postList = useSelector(selectAllPost);
  const postStatus = useSelector(getPostsStatus);
  const postError = useSelector(getPostsError);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchPosts());
  }, [dispatch]);

  useEffect(() => {
    console.log("Post Status Changed: ", postStatus);
  }, [postStatus]);

  const [postTitle, setPostTitle] = useState("");
  const [postDescription, setPostDescription] = useState("");

  const PostComponent = postList.map((post: any) => (
    <article
      key={post.id}
      className="p-4 border border-gray-300 rounded-md flex flex-col gap-3 justify-start items-center"
    >
      <h3 className="text-xl">{post.title}</h3>
      <p className="text-md">{post.content.substring(0, 100)}</p>
    </article>
  ));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !postTitle ||
      !postDescription ||
      postTitle === "" ||
      postDescription === ""
    )
      return;
    dispatch(addPost(postTitle, postDescription));

    setPostTitle("");
    setPostDescription("");
  };

  return (
    <div className="flex flex-col gap-5 p-3 relative">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col sm:flex-row gap-4 w-full justify-start sticky top-0 bg-white p-2 shadow-md rounded-lg"
      >
        <fieldset className="">
          <legend className="">Title</legend>
          <input
            type="text"
            value={postTitle}
            onChange={(e) => setPostTitle(e.target.value)}
            className="outline-0 border border-gray-300 rounded-md p-2 px-3 text-sm shadow-sm "
          />
        </fieldset>
        <fieldset className="flex-1">
          <legend className="">Description</legend>
          <input
            type="text"
            value={postDescription}
            onChange={(e) => setPostDescription(e.target.value)}
            className="outline-0 border border-gray-300 rounded-md p-2 px-3 text-sm shadow-sm w-full"
          />
        </fieldset>
        <fieldset className="flex justify-start items-end">
          <button className="px-8 py-2 bg-red-600 text-white rounded-md">
            Submit
          </button>
        </fieldset>
      </form>
      {postStatus === "loading" ? (
        <p>Loading...</p>
      ) : postStatus === "failed" ? (
        <p>Error: {postError}</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 p-3 jus">
          {PostComponent}
        </div>
      )}
    </div>
  );
};

export default Post;

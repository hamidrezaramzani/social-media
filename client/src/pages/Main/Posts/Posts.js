import React, { useEffect, useState } from "react";
import { useGetUserId } from "../../../hooks/useGetUserId";
import PostItem from "./PostItem";
import httpClient from "../../../api/client";
import PostLoading from "../../../components/SkeletonLoading/PostLoading";
const Posts = () => {
  const { id } = useGetUserId();
  const [posts, setPosts] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await httpClient.get(`posts/following-posts/${id}`);
        setPosts(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  const renderPosts = () => {
    if (posts === null)
      return (
        <PostLoading />
      );

    if (posts.length === 0) {
      return <div className="w-full h-96 flex justify-center items-center">
        <p className="text-sm text-violet-600 font-main">Please follow somebody for see posts</p>
      </div>;
    }

    return posts.map((item) => <PostItem {...item} key={item._id} />);
  };
  return <div className="w-full h-auto py-4 flex gap-5 flex-col">
    <div className="w-full mt-3">
      <h3 className="font-main text-lg">Posts</h3>
    </div>
    {renderPosts()}</div>;
};

export default Posts

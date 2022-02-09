import React, { useEffect, useState } from "react";
import Loading from "../../../components/Loading/Loading";
import { useGetUserId } from "../../../hooks/useGetUserId";
import PostItem from "./PostItem";
import httpClient from "../../../api/client";
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
        <div className="w-full h-60 flex justify-center items-center">
          <Loading />
        </div>
      );

    return posts.map((item) => <PostItem {...item} key={item._id} />);
  };
  return <div className="w-full h-auto p-4 flex gap-5 flex-col">{renderPosts()}</div>;
};

export default Posts;

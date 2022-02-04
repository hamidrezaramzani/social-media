import React, { useState } from "react";
import { IoIosHeart, IoIosHeartEmpty } from "react-icons/io";
import { BiCommentDetail } from "react-icons/bi";
import { AiOutlineSave } from "react-icons/ai";
import { useGetUserId } from '../../../hooks/useGetUserId'
import httpClient from "../../../api/client";
const PostOperations = ({ likes, user, id }) => {
  const { id: uid } = useGetUserId();
  const isLiked = likes.find(like => like.user === uid)
  const [state, setState] = useState({ isLiked: isLiked != undefined, count: likes.length });

  const handleClickLike = async () => {
    try {
      const { data } = await httpClient.post("posts/like", { uid, id, isLiked: state.isLiked });
      setState(data)
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <div className="w-full flex py-2 justify-between">
      <div className="flex gap-3">
        <button className="post-operation-button flex items-center gap-1" onClick={handleClickLike}>
          {state.isLiked ? <IoIosHeart /> : <IoIosHeartEmpty />}
          <span className="text-sm">{state.count}</span>
        </button>

        <button className="post-operation-button">
          <BiCommentDetail />
        </button>
      </div>

      <div>
        <button className="post-operation-button">
          <AiOutlineSave />
        </button>
      </div>
    </div>
  );
};

export default PostOperations;

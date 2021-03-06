import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import httpClient from "../../../api/client";
import UserItemLoading from "../../../components/SkeletonLoading/UserItemLoading";
import { useShowUserProfile } from '../../../hooks/useShowUserProfile'
const ChatHeader = ({ id }) => {
    const [user, setUser] = useState(null);
    const profile = useShowUserProfile(user ? user.profile : "");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data: { profile, fullname, username } } = await httpClient.get(`users/user/${id}`);
                setUser({ profile, fullname, username });
            } catch (error) {
                console.log(error);
            }
        }

        fetchData();
    }, [id]);
    return id && user ? (
        <div className="w-full flex items-center justify-between h-16 bg-gray-100 absolute top-0 z-30">
            <Link to={`/@${user.username}`}>
                <div className="px-5 flex gap-1 items-center">
                    <img
                        src={profile}
                        className="w-10 h-10 rounded-md object-cover"
                    />
                    <h3 className="text-sm text-gray-700 pt-2 font-main">
                        {user.fullname}
                    </h3>
                </div>
            </Link>
        </div>
    ) : (
        <div className="w-full bg-gray-100"> 
            <UserItemLoading />
        </div>
    );
};

export default ChatHeader;

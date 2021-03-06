import React, { useEffect, useState, useContext } from 'react';
import { useLocation } from 'react-router';
import httpClient from "../../../api/client";
import { useGetUserId } from '../../../hooks/useGetUserId'
import UserItem from "../../Main/LeftSideBar/UserItem";
import UserItemLoading from '../../../components/SkeletonLoading/UserItemLoading';
import { ChatContext } from '../../../context/providers/ChatProvider';
import { setChats } from '../../../context/actions/ChatActions';
const UsersList = () => {
    const location = useLocation();
    const { id } = useGetUserId();
    const { chats, dispatch } = useContext(ChatContext);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data: chats } = await httpClient.get(
                    `chat/list/${id}`
                );
                dispatch(setChats(chats));
            } catch (error) {
                console.log(error);
            }
        };

        fetchData();
    }, [location]);

    const renderUsers = () => {

        if (chats === null)
            return <UserItemLoading count={5} />

        if (chats.length === 0) {
            return <p className='w-full p-5 text-center'>you did'nt chat with anybody</p>
        }
        return chats.sort((a, b) => { return (a.updatedAt > b.updatedAt) ? -1 : 1 }).map(item => {
            let user;
            if (item.sender._id === id)
                user = item.receiver;
            else
                user = item.sender;

            return <UserItem key={item._id}  {...user} messages={item.messages} message={item.lastMessage} />

        });
    }
    return <div className="w-1/6  bg-gray-200 rounded  shadow-md">
        <form>

            <div className='p-3'>
                <input type="text" placeholder='Search Users' className='w-full h-10 rounded border border-purple-700 bg-transparent outline-none px-3 text-gray-700' />
            </div>
        </form>
        {renderUsers()}
    </div>
};

export default UsersList;

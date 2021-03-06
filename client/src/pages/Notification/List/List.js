import React, { useEffect, useState } from 'react';
import LeftSideBar from '../../Main/LeftSideBar/LeftSideBar';
import RightSideBar from '../../Main/RightSide/RightSide';
import httpClient from '../../../api/client';
import { useGetUserId } from '../../../hooks/useGetUserId';
import Notifications from './Notifications';

const List = () => {
    const { id } = useGetUserId();
    const [readNotifications, setReadNotifications] = useState([]);
    const [unReadNotifications, setUnReadNotifications] = useState([]);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data: { reads, unReads } } = await httpClient.get(`notifications/list/${id}`)
                await httpClient.get(`notifications/seen/${id}`)
                setReadNotifications(reads)
                setUnReadNotifications(unReads)
            } catch (error) {
                console.log(error);
            }
        }

        fetchData();
    }, [])
    const [show, setShow] = useState(false);
    return <div className='flex'>        
     <LeftSideBar />
        <div className='w-full h-auto flex justify-center '>
            <div className='w-4/6 p-3'>
                <div className='w-full pt-10'>
                    <div className="inline-flex rounded-md shadow-sm" role="group">
                        <button type="button" onClick={() => { setShow(false) }} className="py-2 px-4 text-sm font-medium  bg-violet-600 hover:bg-violet-700 text-white font-main rounded-l-lg ">
                            Un Read Notifications
                        </button>
                        <button type="button" onClick={() => { setShow(true) }} className="py-2 px-4 text-sm font-medium  bg-violet-600 hover:bg-violet-700 text-white font-main">
                            Read Notifications
                        </button>
                    </div>
                </div>


                <div className='w-full py-5'>
                    {show === false ? <Notifications title="Un Reads Notifications" list={unReadNotifications} /> : <Notifications title="Read Notifications"  list={readNotifications} />}
                </div>
            </div>
        </div>
        <RightSideBar />
    </div>;
};

export default List;

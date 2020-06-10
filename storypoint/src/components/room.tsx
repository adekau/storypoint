import React from 'react';
import { useParams } from 'react-router-dom';
import { useRecoilValue } from 'recoil';

import { roomState } from '../atoms/room';

export default function Room() {
    const { roomId } = useParams();
    const room = useRecoilValue(roomState);
    
    return (
        <h2>Welcome to room {room?.roomName}</h2>
    );
}
import { useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';

import { StoryPointEvent } from '../../../shared/types/story-point-event';
import { roomState } from '../atoms/room';
import { selectedUserCardsState } from '../atoms/selected-vote-cards';
import { useGlobalToast } from './global-toast.hook';

export function useMessageHandler() {
    const history = useHistory();
    const toast = useGlobalToast();
    const setRoom = useSetRecoilState(roomState);
    const setSelectedCards = useSetRecoilState(selectedUserCardsState);

    return useCallback(
        (message: StoryPointEvent) => {
            console.log(message)
            switch (message.event) {
                case 'roomCreate':
                    history.push(`/${message.room.id}`);
                    setRoom(message.room);
                    break;
                case 'userJoin':
                    setRoom(message.room);
                    break;
                case 'userLeave':
                    setRoom(message.room);
                    break;
                case 'left':
                    setRoom(null);
                    break;
                case 'kicked':
                    toast.addToast({
                        title: 'You were kicked',
                        text: `A user kicked you from room ${message.room.roomName}.`,
                        iconType: 'exit',
                        color: 'warning'
                    });
                    setRoom(null);
                    setSelectedCards([]);
                    history.push('/');
                    break;
                case 'no-permissions':
                    toast.addToast({
                        title: 'Insufficient Permissions',
                        text: `You do not have permission to perform action "${message.action}".`,
                        iconType: 'lock',
                        color: 'danger'
                    });
                    break;
                default:
                    return;
            }
        },
        [
            history,
            toast,
            setRoom,
            setSelectedCards
        ]
    );
}
import { useHistory } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';

import { roomState } from '../atoms/room';
import { StoryPointEvent } from '../../../shared/types/story-point-event';

export function useMessageHandler() {
    const history = useHistory();
    const setRoom = useSetRecoilState(roomState);

    return function (message: StoryPointEvent) {
        console.log(message)
        switch (message.event) {
            case 'roomCreate':
                history.push(`/${message.roomId}`);
                setRoom({
                    id: message.roomId,
                    users: message.users,
                    roomName: message.roomName,
                });
                break;
            case 'userJoin':
                setRoom(message.room);
                break;
            default:
                return;
        }
    };
}
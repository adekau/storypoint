import { StoryPointEvent } from '../types/story-point-event';
import { useHistory } from 'react-router-dom';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { roomState } from '../atoms/room';

export function useMessageHandler() {
    const history = useHistory();
    const setRoom = useSetRecoilState(roomState);

    return function (message: StoryPointEvent) {
        switch (message.event) {
            case 'roomCreate':
                history.push(`/${message.roomId}`);
                setRoom({
                    roomId: message.roomId,
                    users: message.users,
                    roomName: message.roomName,
                });
                break;
            default:
                return;
        }
    };
}
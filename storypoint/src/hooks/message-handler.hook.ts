import { StoryPointEvent } from '../types/story-point-event';
import { useHistory } from 'react-router-dom';

export function useMessageHandler() {
    const history = useHistory();

    return function (message: StoryPointEvent) {
        switch (message.event) {
            case 'roomCreate':
                history.push(`/${message.roomId}`);
                break;
            default:
                return;
        }
    };
}
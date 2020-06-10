export type StoryPointEvent = {
    event: 'roomCreate';
    roomId: string;
    users: any[];
    roomName: string;
};
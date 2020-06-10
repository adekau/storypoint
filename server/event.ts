async function emitEvent(roomId: string) {
    const users = roomsMap.get(roomId) || [];

    for (const user of users) {
        const event = {
            event: 'userJoin',
            users: translateUsers(users)
        }

        try {
            await user.websocket.send(JSON.stringify(event));
        } catch (e) {
            Logger.warn(`User ${user.userId} can not be reached.`);
            await removeUser(user.userId);
            break;
        }
    }
}
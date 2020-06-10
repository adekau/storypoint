function translateUsers(users: Array<IUser>): Array<IUserDetail> {
    return users.map(user => ({
        userId: user.userId,
        roomId: user.roomId,
        name: user.name
    }));
}
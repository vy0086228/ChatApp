export const selectUser = (state) => state.auth?.user;

export const selectUserId = (state) => state.auth?.user?._id;

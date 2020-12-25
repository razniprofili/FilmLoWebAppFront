import {UserModel} from './user.model';

export class FriendRequestModel {
    constructor(
        public userSenderId: number,
        public userSender: UserModel,
        public userRecipientId: number,
        public userRecipient: UserModel,
        public friendshipDate: string,
        public statusCodeID: string
    ) {}
}

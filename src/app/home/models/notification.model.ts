import {UserGet} from '../../auth/user-get.model';

export class NotificationModel {
    constructor(
        public id: number,
        public sendingDate: Date,
        public text: string,
        public userSenderId: number,
        public userSender: UserGet,
        public userRecipientId: number,
        public userRecipient: UserGet
    ) {}

}

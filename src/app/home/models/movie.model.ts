import {UserGet} from '../../auth/user-get.model';

export class Movie {
    constructor(
        public id: string,
        public actors: string,
        public year: any,
        public name: string,
        public director: string,
        public duration: any,
        public genre: string,
        public country: string,
        public rate: any,
        public comment: string,
        public dateTimeWatched: string,
        public poster: string,
        public user: UserGet
      //  public userId: string
    ) {}

}


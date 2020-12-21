export class SavedMovieModel {
  constructor(

      public id: string,
      public name: string,
      public poster: string,
      public dateTimeSaved: Date,
      public userId: any)

  {}
}

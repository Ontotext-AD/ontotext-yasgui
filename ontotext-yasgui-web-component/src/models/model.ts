export class SaveQueryData {
  constructor(public queryName: string,
              public query: string,
              public isPublic: boolean,
              public owner?: string,
              public messages?: string[]) {
  }
}

export class SavedQueriesData {
  constructor(public savedQueriesList: SaveQueryData[]) {
  }
}

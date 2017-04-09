export class ColonyInfo {
  public static instance: ColonyInfo;

  public static getInstance(create: boolean = false): ColonyInfo {
    if (!ColonyInfo.instance || create) {
      ColonyInfo.instance = new ColonyInfo();
    }
    return ColonyInfo.instance;
  }

  private spawn: Spawn;

  private constructor() {
    this.spawn = Game.spawns[Object.keys(Game.spawns)[0]];
  }

  public getSpawn() {
    return this.spawn;
  }

  public getRooms() {
    return _.values<Room>(Game.rooms);
  }
}

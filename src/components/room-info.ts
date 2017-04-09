export class RoomInfo {
  private creeps: Creep[] = [];
  private sources: Source[] = [];
  private flags: Flag[] = [];
  private creepsRolesCount: {[role: string]: number} = {};
  private spawn: Spawn;
  private structures: Structure[];
  private constructionSites: ConstructionSite[];

  constructor(private room: Room) {
    this.creeps = this.room.find<Creep>(FIND_MY_CREEPS);
    this.sources = this.room.find<Source>(FIND_SOURCES);
    this.spawn = this.room.find<Spawn>(FIND_MY_SPAWNS)[0];
    this.flags = this.room.find<Flag>(FIND_FLAGS);
    this.structures = this.room.find<Structure>(FIND_MY_STRUCTURES);
    this.constructionSites = this.room.find<ConstructionSite>(FIND_CONSTRUCTION_SITES);

    this.creepsRolesCount = _.countBy<Creep>(this.creeps, function (creep) {
      return creep.memory.role;
    });
  }

  public getSources(): Source[] {
    return this.sources;
  }

  public getSpawn() {
    return this.spawn;
  }

  public getCreeps() {
    return this.creeps;
  }

  public getConstructionSites() {
    return this.constructionSites;
  }

  public getStorages() {
    return _.filter(this.structures, (structure: Structure) => {
      return structure.structureType === STRUCTURE_SPAWN
        || structure.structureType === STRUCTURE_EXTENSION
        || structure.structureType === STRUCTURE_STORAGE
    });
  }

  public getRoadConstuctionSites(): ConstructionSite[] {
    return this.room.find<ConstructionSite>(FIND_MY_CONSTRUCTION_SITES);
  }

  public getControllerLevel(): number {
    return this.room.controller ? this.room.controller.level : 0;
  }
}
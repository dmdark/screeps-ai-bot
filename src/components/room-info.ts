import {CreepRole} from "./creeps/role";
import Harvester from "./creeps/roles/harvester";

export class RoomInfo {
  private creeps: Creep[] = [];
  private sources: Source[] = [];
  private flags: Flag[] = [];
  private creepsRolesCount: {[role: string]: number} = {};
  private spawn: Spawn;
  private harvestersPerSource: {[sourceId: string]: number} = {};

  constructor(private room: Room) {
    this.creeps = this.room.find<Creep>(FIND_MY_CREEPS);
    this.sources = this.room.find<Source>(FIND_SOURCES);
    this.spawn = this.room.find<Spawn>(FIND_MY_SPAWNS)[0];
    this.flags = this.room.find<Flag>(FIND_FLAGS);

    this.creepsRolesCount = _.countBy<Creep>(this.creeps, function (creep) {
      return creep.memory.role;
    });

    this.calcHarvestersPerSource();
  }

  public getCountCreepsWithRole(role: CreepRole) {
    return this.creepsRolesCount[role] ? this.creepsRolesCount[role] : 0;
  }

  public getSources() {
    const sources = [];
    for (const source of this.sources) {
      if (!this.isPositionIgnored(source.pos)) {
        sources.push(source);
      }
    }
    return sources;
  }

  public getSpawn() {
    return this.spawn;
  }

  public getCreeps() {
    return this.creeps;
  }

  public getHarvestersCountForSource(sourceId: string) {
    return this.harvestersPerSource[sourceId] ? this.harvestersPerSource[sourceId] : 0;
  }

  public getControllerLevel(): number {
    return this.room.controller ? this.room.controller.level : 0;
  }

  private calcHarvestersPerSource() {
    this.harvestersPerSource = {};

    _.each(this.creeps, (creep: Creep) => {
      if (creep.memory.role === Harvester.ROLE) {
        if (creep.memory.bindToSourceId) {
          if (!this.harvestersPerSource[creep.memory.bindToSourceId]) {
            this.harvestersPerSource[creep.memory.bindToSourceId] = 0;
          }
          this.harvestersPerSource[creep.memory.bindToSourceId]++;
        }
      }
    });
  }

  private isPositionIgnored(pos: RoomPosition): boolean {
    for (const flag of this.flags) {
      if (flag.color === COLOR_RED && pos.isEqualTo(flag)) {
        return true;
      }
    }
    return false;
  }
}
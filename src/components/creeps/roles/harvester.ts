import * as Config from "../../../config/config";

export default class Harvester {
  public static ROLE = "harvester";

  public constructor(private creep: Creep) {
    const spawn = creep.room.find<Spawn>(FIND_MY_SPAWNS)[0];

    if (this.isNeedRenew()) {
      if (spawn.renewCreep(creep) === ERR_NOT_IN_RANGE) {
        creep.moveTo(spawn.pos);
        return;
      }
    }

    if (!creep.memory['bindToSourceId']) {
      console.log("Source not found");
      return;
    }

    const source = Game.getObjectById<Source>(creep.memory['bindToSourceId']);
    if (!source) {
      console.log("Source not found");
      return;
    }

    if (_.sum(creep.carry) === creep.carryCapacity) {
      if (creep.transfer(spawn, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
        creep.moveTo(spawn.pos);
      }
    } else {
      if (creep.harvest(source) === ERR_NOT_IN_RANGE) {
        creep.moveTo(source.pos);
      }
    }
  }

  private isNeedRenew() {
    return (this.creep.ticksToLive < Config.DEFAULT_MIN_LIFE_BEFORE_NEEDS_REFILL);
  }
}

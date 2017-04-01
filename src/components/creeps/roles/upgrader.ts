import * as Config from "../../../config/config";

export default class Upgrader {
  public static ROLE = "upgrader";

  public constructor(private creep: Creep) {
    const spawn = creep.room.find<Spawn>(FIND_MY_SPAWNS)[0];

    if (this.isNeedRenew()) {
      if (spawn.renewCreep(creep) === ERR_NOT_IN_RANGE) {
        creep.moveTo(spawn.pos);
        return;
      }
    }

    if (!creep.memory["bindToSourceId"]) {
      console.log("Source not found");
      return;
    }

    const source = Game.getObjectById<Source>(creep.memory["bindToSourceId"]);
    if (!source) {
      console.log("Source not found");
      return;
    }


    const targets = creep.room.find<ConstructionSite>(FIND_CONSTRUCTION_SITES);
    if (targets.length) {
      if (!creep.memory.building && creep.carry.energy === creep.carryCapacity) {
        creep.memory.building = true;
        creep.say('Building!');
      }

      if (creep.memory.building && creep.carry.energy === 0) {
        creep.memory.building = false;
      }

      if (creep.memory.building) {
        if (creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
          creep.moveTo(targets[0].pos, {visualizePathStyle: {stroke: '#ffffff'}});
        }
      }
      return;
    }

    if (creep.memory.upgrading && creep.carry.energy === 0) {
      creep.memory.upgrading = false;
      creep.say("Harvesting");
    }
    if (!creep.memory.upgrading && creep.carry.energy === creep.carryCapacity) {
      creep.memory.upgrading = true;
      creep.say("Upgrading");
    }

    if (creep.memory.upgrading) {
      if (creep.room.controller && creep.upgradeController(creep.room.controller) === ERR_NOT_IN_RANGE) {
        creep.moveTo(creep.room.controller.pos, {visualizePathStyle: {stroke: "#ffffff"}});
      }
    } else {
      if (creep.harvest(source) === ERR_NOT_IN_RANGE) {
        creep.moveTo(source, {visualizePathStyle: {stroke: "#ffaa00"}});
      }
    }
  }

  private isNeedRenew() {
    return (this.creep.ticksToLive < Config.DEFAULT_MIN_LIFE_BEFORE_NEEDS_REFILL);
  }
}

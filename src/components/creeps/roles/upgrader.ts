import * as Config from "../../../config/config";

export default class Upgrader {
  public static ROLE = "upgrader";

  private spawn: Spawn;

  public constructor(private creep: Creep) {
    this.spawn = creep.room.find<Spawn>(FIND_MY_SPAWNS)[0];

    if (this.isNeedRenew()) {
      if (this.spawn.renewCreep(creep) === ERR_NOT_IN_RANGE) {
        creep.moveTo(this.spawn.pos);
        return;
      }
    }

    if (!this.building()) {
      this.upgradingController();
    }
  }

  private building() {
    const creep = this.creep;
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
        return true;
      }
    }
    return false;
  }

  private upgradingController() {
    const creep = this.creep;
    if (!creep.room.controller) {
      return;
    }
    const isControllerNeedsUpgrade = (creep.room.controller.level < 2 || creep.room.controller.ticksToDowngrade < 1000);

    if (creep.memory.upgrading && creep.carry.energy === 0) {
      creep.memory.upgrading = false;
    }
    if (isControllerNeedsUpgrade && !creep.memory.upgrading && creep.carry.energy === creep.carryCapacity) {
      creep.memory.upgrading = true;
      creep.say("Upgrading");
    }

    if (creep.memory.upgrading) {
      if (creep.upgradeController(creep.room.controller) === ERR_NOT_IN_RANGE) {
        creep.moveTo(creep.room.controller.pos, {visualizePathStyle: {stroke: "#ffffff"}});
      }
    } else {
      const withdrawResult = creep.withdraw(this.spawn, RESOURCE_ENERGY);
      if (withdrawResult === ERR_NOT_IN_RANGE) {
        creep.moveTo(this.spawn, {visualizePathStyle: {stroke: "#ffaa00"}});
      }
      if (withdrawResult === ERR_NOT_ENOUGH_RESOURCES) {
        creep.say("Waiting...");
      }
    }
  }

  private isNeedRenew() {
    return (this.creep.ticksToLive < Config.DEFAULT_MIN_LIFE_BEFORE_NEEDS_REFILL);
  }
}

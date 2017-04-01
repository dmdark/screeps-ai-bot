import Harvester from "./roles/harvester";
import Upgrader from "./roles/upgrader";

export default class CreepManager {
  private creeps: Creep[] = [];

  public constructor(private room: Room) {
    this.loadCreeps();
  }

  public run() {
    _.each(this.creeps, (creep: Creep) => {
      if (creep.memory.role === Harvester.ROLE) {
        new Harvester(creep);
      }
      if (creep.memory.role === "upgrader") {
        new Upgrader(creep);
      }
    });
  }

  private loadCreeps() {
    this.creeps = this.room.find<Creep>(FIND_MY_CREEPS);
  }
}

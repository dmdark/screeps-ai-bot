import Harvester from "./roles/harvester";
import Upgrader from "./roles/upgrader";
import SpawnManager from "./spawnManager";
import {SpawnPriorities} from "./spawnManager";

export default class UpgradeManager {
  private creeps: Creep[] = [];
  private spawn: Spawn;

  public constructor(private room: Room) {
    this.creeps = this.room.find<Creep>(FIND_MY_CREEPS);
    this.spawn = room.find<Spawn>(FIND_MY_SPAWNS)[0];

    const counts = _.countBy<Creep>(this.creeps, function (creep) {
      return creep.memory.role;
    });
    const harvestersCount = counts[Harvester.ROLE] ? counts[Harvester.ROLE] : 0;
    const upgradersCount = counts[Upgrader.ROLE] ? counts[Upgrader.ROLE] : 0;

    const needUpgraders = Math.floor(harvestersCount / 3);

    if (needUpgraders > upgradersCount) {
      const source = this.spawn.pos.findClosestByPath<Source>(FIND_SOURCES);
      if (source) {
        SpawnManager.getInstance().addTask({
          type: "needUpgrader",
          spawnId: this.spawn.id,
          sourceId: source.id,
          priority: SpawnPriorities.NEED_UPGRADER
        });
      }
    }
  }

  public run() {
  }
}

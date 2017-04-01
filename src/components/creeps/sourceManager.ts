import SpawnManager from "./spawnManager";
import {SpawnPriorities} from "./spawnManager";
import Harvester from "./roles/harvester";
export default class SourceManager {
  private sources: Source[];
  private spawn: Spawn;
  private creeps: Creep[];
  private tasks: any[] = [];

  public constructor(private room: Room) {
    this.sources = room.find<Source>(FIND_SOURCES_ACTIVE);
    this.spawn = room.find<Spawn>(FIND_MY_SPAWNS)[0];
    this.creeps = this.room.find<Creep>(FIND_MY_CREEPS);

    const harversterPerSourceId = this.getHarvestersBindCount();

    for (const source of this.sources) {
      const range = this.spawn.pos.findPathTo(source.pos, {ignoreCreeps: true, ignoreRoads: true}).length;

      const terrains = <LookAtResultWithPos[]>source.room.lookForAtArea(
        LOOK_TERRAIN,
        source.pos.y - 1, source.pos.x - 1,
        source.pos.y + 1, source.pos.x + 1,
        true
      );

      let workPoints = 0;
      for (const terrain of terrains) {
        if (terrain.terrain === "plain") {
          workPoints++;
        }
      }

      const harvestersNeeded: number = Math.round((range / 7) * workPoints);
      const usedNow = harversterPerSourceId[source.id] ? harversterPerSourceId[source.id] : 0;
      room.visual.text(`${usedNow} / ${harvestersNeeded}`, source.pos.x, source.pos.y - 1, <TextStyle>{
        color: 'white',
        size: 0.5
      });
      if (usedNow < harvestersNeeded) {
        for (let i = 0; i < harvestersNeeded - usedNow; i++) {
          this.tasks.push({
            priority: -range,
            sourceId: source.id,
            description: `Create worker to source ${source}`
          });
        }
      }
    }
  }

  public run() {
    this.tasks = _.sortBy<any, any>(this.tasks, (task: any) => {
      return task.priority;
    });

    while (this.tasks.length) {
      const task = this.tasks.shift();

      SpawnManager.getInstance().addTask({
        type: "needHarvester",
        sourceId: task.sourceId,
        spawnId: this.spawn.id,
        priority: SpawnPriorities.NEED_HARVESTER,
        priorityInner: task.priority
      });
    }
  }

  private getHarvestersBindCount(): {[index: string]: number} {
    const harversterPerSourceId: any = {};

    _.each(this.creeps, (creep: Creep) => {
      if (creep.memory.role === Harvester.ROLE) {
        if (creep.memory.bindToSourceId) {
          if (!harversterPerSourceId[creep.memory.bindToSourceId]) {
            harversterPerSourceId[creep.memory.bindToSourceId] = 0;
          }
          harversterPerSourceId[creep.memory.bindToSourceId]++;
        }
      }
    });
    return harversterPerSourceId;
  }
}
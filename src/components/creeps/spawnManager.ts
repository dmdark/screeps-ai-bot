import Harvester from "./roles/harvester";
import Upgrader from "./roles/upgrader";
import {log} from "../../lib/logger/log";

export interface Task {
  priority: number;
  priorityInner?: number;
}

export interface SpawnTask extends Task {
  type: 'needHarvester'|'needUpgrader';
  sourceId: string;
  spawnId: string;
}

export class SpawnPriorities {
  public static readonly NEED_HARVESTER = 10;
  public static readonly NEED_UPGRADER = 20;
}

export default class SpawnManager {
  private static _instance: SpawnManager = new SpawnManager();

  public static getInstance(): SpawnManager {
    return SpawnManager._instance;
  }

  private tasks: any[] = [];

  public init() {
    this.tasks = [];
  }

  public addTask(task: SpawnTask) {
    this.tasks.push(task);
  }

  public execute() {
    const task = this.getPriorityTask();
    if (!task) {
      console.error("Spawn dont have tasks");
      return;
    }
    console.log("Spawn Manager: ", task.type);

    if (task.type === 'needHarvester') {
      this.executeNeedHarvester(task);
    }
    if (task.type === 'needUpgrader') {
      this.executeNeedUpgrader(task);
    }
  }

  private executeNeedHarvester(task: SpawnTask) {
    const spawn = Game.getObjectById<Spawn>(task.spawnId);
    if (!spawn) {
      return;
    }

    const bodyParts = [WORK, CARRY, MOVE];
    const name = `harvester-${Game.time}`;
    if (spawn && spawn.canCreateCreep(bodyParts, name) === OK) {
      spawn.createCreep(bodyParts, name, {
        "role": Harvester.ROLE,
        "bindToSourceId": task.sourceId
      });
    }
  }

  private executeNeedUpgrader(task: SpawnTask) {
    const spawn = Game.getObjectById<Spawn>(task.spawnId);
    if (!spawn) {
      return;
    }
    const bodyParts = [WORK, CARRY, MOVE];
    const name = `upgrader-${Game.time}`;

    spawn.createCreep(bodyParts, name, {
      "role": Upgrader.ROLE,
      "bindToSourceId": task.sourceId
    });
  }

  private getPriorityTask(): SpawnTask|null {
    if (!this.tasks.length) {
      return null;
    }

    log.info(JSON.stringify(_.countBy(this.tasks, (task) => {
      return task.type;
    })));
    return _.sortBy<any, any>(this.tasks, (task: any) => {
      return task.priority * 100000 + (task.priorityInner ? task.priorityInner : 0);
    }).pop();
  }
}
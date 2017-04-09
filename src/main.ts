// PathFinder.use(true);

import {WorkerBasic} from "./creep/behaviors/worker-basic";
import {Blackthorn} from "./lib/blackthorn";
import {SpawnBasic} from "./spawn/behaviors/spawn-basic";
import {ColonyInfo} from "./components/colony-info";
import Commander from "./components/commander";
import {HarvestAdvisor} from "./components/advisor/harvest-advisor";
import {Upgrader} from "./creep/behaviors/upgrader";


export function loop() {
  Blackthorn.BehaviorTree.COUNT = 1;
  Blackthorn.BaseNode.COUNTS = {};
  Blackthorn.BaseNode.NODES = {};

  ColonyInfo.getInstance(true);
  HarvestAdvisor.getInstance(true).scanSources();
  Commander.getInstance(true).executePlayerCommands();

  const upgraderBehavior = Upgrader.getBehaviorTree();
  const workerBehavior = WorkerBasic.getBehaviorTree();
  for (const creepName of Object.keys(Game.creeps)) {
    const creep = Game.creeps[creepName];
    if (creep.memory.role === "upgrader") {
      upgraderBehavior.decide(creep);
    } else {
      workerBehavior.decide(creep);
    }
  }

  const spawnBehavior = SpawnBasic.getBehaviorTree();
  for (const spawnName of Object.keys(Game.spawns)) {
    const spawn = Game.spawns[spawnName];
    spawnBehavior.decide(spawn);
  }
}

function clearMemory(roomName: string, all = false) {
  // Clears any non-existing creep memory.
  for (let name in Memory.creeps) {
    let creep: any = Memory.creeps[name];

    if (creep.room === roomName) {
      if (!Game.creeps[name] || all) {
        delete Memory.creeps[name];
      }
    }
  }
}
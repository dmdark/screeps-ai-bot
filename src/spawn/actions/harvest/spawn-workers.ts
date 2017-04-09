import Ticker = Blackthorn.Ticker;
import Status = Blackthorn.Status;
import {Blackthorn} from "../../../lib/blackthorn";

export class SpawnWorkers extends Blackthorn.Action {
  private spawn: Spawn;

  open(ticker: Ticker): void {
  }

  enter(ticker: Ticker): void {
    this.spawn = <Spawn>ticker.subject;
  }

  tick(ticker: Ticker): Status {
    const spawn = this.spawn;

    if (spawn.spawning) {
      return Status.RUNNING;
    }

    const bodyParts = [WORK, CARRY, MOVE, MOVE];
    const name = `harvester-${Game.time}`;
    if (spawn.canCreateCreep(bodyParts, name) === OK) {
      spawn.createCreep(bodyParts, name, {
        "role": "harvester"
      });
      return Status.SUCCESS;
    }
    return Status.FAILURE;
  }

  exit(ticker: Ticker): void {
  }

  close(ticker: Ticker): void {
  }
}

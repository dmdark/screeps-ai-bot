import Ticker = Blackthorn.Ticker;
import Status = Blackthorn.Status;
import {Blackthorn} from "../../../lib/blackthorn";
import RoomBrain from "../../../components/room-brain";
/*
export class Build extends Blackthorn.Action {
  enter(ticker: Ticker): void {

  }

  tick(ticker: Ticker): Status {
    const creep = this.getCreep(ticker);
    const brain = RoomBrain.getInstanceForRoom(creep.room);
    const buildSite = brain.getBuildAdvisor().getBuildSite();
    if (!buildSite) {
      return Status.FAILURE;
    }

    const buildResult = creep.build(buildSite);

    if (buildResult == ERR_NOT_IN_RANGE) {
      console.log("build running not in range");
      creep.moveTo(buildSite.pos);
      return Status.RUNNING;
    }
    if (buildResult == OK) {
      console.log("build running ok");
      return Status.RUNNING;
    }
    console.log("build failure");
    return Status.FAILURE;
  }

  private getCreep(ticker: Ticker): Creep {
    return <Creep>ticker.subject;
  }
}
*/
import Ticker = Blackthorn.Ticker;
import Status = Blackthorn.Status;
import {Blackthorn} from "../../lib/blackthorn";
import RoomBrain from "../../components/room-brain";
/*
export class HasSomethingToBuild extends Blackthorn.Action {
  enter(ticker: Ticker): void {

  }

  tick(ticker: Ticker): Status {
    const creep = this.getCreep(ticker);
    const brain = RoomBrain.getInstanceForRoom(creep.room);
    const buildSite = brain.getBuildAdvisor().getBuildSite();
    if (!buildSite) {
      return Status.FAILURE;
    }
    return Status.SUCCESS;
  }

  private getCreep(ticker: Ticker): Creep {
    return <Creep>ticker.subject;
  }
}
*/
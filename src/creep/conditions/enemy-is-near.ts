import Ticker = Blackthorn.Ticker;
import Status = Blackthorn.Status;
import {Blackthorn} from "../../lib/blackthorn";

export class IsEnemyIsNear extends Blackthorn.Action {
  private creep: Creep;

  enter(ticker: Ticker): void {
    this.creep = <Creep>ticker.subject;
  }

  tick(ticker: Ticker): Status {
    if (this.creep.pos.findInRange(FIND_HOSTILE_CREEPS, 4).length > 0) {
      this.creep.say("Enemy! Run!");
      return Status.SUCCESS;
    }
    return Status.FAILURE;
  }
}

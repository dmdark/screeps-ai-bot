import Ticker = Blackthorn.Ticker;
import Status = Blackthorn.Status;
import {Blackthorn} from "../../../lib/blackthorn";
import {HarvestAdvisor} from "../../../components/advisor/harvest-advisor";

export class ReturnResource extends Blackthorn.Action {

  open(ticker: Ticker): void {
    const creep = this.getCreep(ticker);
    creep.say("ReturnResource");
  }

  enter(ticker: Ticker): void {
  }

  tick(ticker: Ticker): Status {
    const creep = this.getCreep(ticker);
    if (_.sum(creep.carry) === 0) {
      return Status.SUCCESS;
    }

    const structure = HarvestAdvisor.getInstance().getBestPlaceToStore(creep);
    if (creep.transfer(structure, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
      creep.moveTo(structure, {
        reusePath: 20
      });
    }
    return Status.RUNNING;
  }

  close(ticker: Ticker): void {
  }

  exit(ticker: Ticker): void {
  }

  private getCreep(ticker: Ticker): Creep {
    return <Creep>ticker.subject;
  }
}

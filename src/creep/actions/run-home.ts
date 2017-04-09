import Ticker = Blackthorn.Ticker;
import Status = Blackthorn.Status;
import {Blackthorn} from "../../lib/blackthorn";
import {HarvestAdvisor} from "../../components/advisor/harvest-advisor";
import {ColonyInfo} from "../../components/colony-info";

export class RunHome extends Blackthorn.Action {
  open(ticker: Ticker): void {
    delete (this.getCreep(ticker).memory[HarvestAdvisor.CREEP_SOURCE_MEMORY_ID]);
  }

  tick(ticker: Ticker): Status {
    const creep = this.getCreep(ticker);
    const spawn = ColonyInfo.getInstance().getSpawn();
    if (creep.pos.isNearTo(spawn)) {
      return Status.SUCCESS;
    }

    creep.moveTo(spawn);
    return Status.RUNNING;
  }

  private getCreep(ticker: Ticker): Creep {
    return <Creep>ticker.subject;
  }
}

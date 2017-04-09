import Ticker = Blackthorn.Ticker;
import Status = Blackthorn.Status;
import {Blackthorn} from "../../../lib/blackthorn";

export class UpgradeController extends Blackthorn.Action {
  private creep: Creep;

  open(ticker: Ticker): void {
  }

  enter(ticker: Ticker): void {
    this.creep = <Creep>ticker.subject;
  }

  tick(ticker: Ticker): Status {
    const creep = this.creep;
    if (_.sum(creep.carry) === 0) {
      return Status.SUCCESS;
    }

    const controller = this.creep.room.controller;
    if (!controller) {
      return Status.FAILURE;
    }
    if (creep.upgradeController(controller) === ERR_NOT_IN_RANGE) {
      creep.moveTo(controller);
    }
    return Status.RUNNING;
  }

  close(ticker: Ticker): void {
  }

  exit(ticker: Ticker): void {
  }
}

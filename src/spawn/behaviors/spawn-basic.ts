import Ticker = Blackthorn.Ticker;
import Status = Blackthorn.Status;
import {Blackthorn} from "../../lib/blackthorn";
import {SpawnWorkers} from "../actions/harvest/spawn-workers";

export class SpawnBasic {
  public static getBehaviorTree() {
    const behavior = new Blackthorn.Selector(
      new SpawnWorkers()
    );

    return new Blackthorn.BehaviorTree(behavior);
  }
}



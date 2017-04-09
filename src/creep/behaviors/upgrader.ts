import Ticker = Blackthorn.Ticker;
import Status = Blackthorn.Status;
import {Blackthorn} from "../../lib/blackthorn";
import {TakeResource} from "../actions/building/take-resource";
import {UpgradeController} from "../actions/building/upgrade-controller";
import BehaviorTree = Blackthorn.BehaviorTree;

export class Upgrader {
  public static getBehaviorTree() {
    const behavior = new Blackthorn.Selector(
      new Blackthorn.MemSelector(
        new Blackthorn.MemSequence(
          new TakeResource(),
          new UpgradeController(),
        ),
      ),
    );
    return new Blackthorn.BehaviorTree(behavior);
  }
}



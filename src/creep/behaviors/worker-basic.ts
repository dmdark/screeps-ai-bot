import Ticker = Blackthorn.Ticker;
import Status = Blackthorn.Status;
import {GatherResource} from "../actions/harvest/gather-resource";
import {ReturnResource} from "../actions/harvest/return-resource";
import {Blackthorn} from "../../lib/blackthorn";
import BehaviorTree = Blackthorn.BehaviorTree;
import {RunHome} from "../actions/run-home";
import {IsEnemyIsNear} from "../conditions/enemy-is-near";
import {ScountAnotherRoom} from "../actions/scout-another-room";

export class WorkerBasic {
  public static getBehaviorTree() {
    const behavior = new Blackthorn.Selector(
      new Blackthorn.MemSequence(
        new IsEnemyIsNear(),
        new RunHome(),
      ),
      new Blackthorn.MemSelector(
        /*new Blackthorn.MemSequence(
         new GatherResource(),
         new Blackthorn.MemSelector(
         new Blackthorn.Sequence(
         new HasSomethingToBuild(),
         new Build()
         ),
         new ReturnResource(),
         )
         ),*/

        new Blackthorn.MemSequence(
          new GatherResource(),
          new ReturnResource(),
        ),

        /*new Blackthorn.MemSequence(
         new TakeResource(),
         new UpgradeController(),
         ),*/
        new ScountAnotherRoom()
      ),
    );
    return new Blackthorn.BehaviorTree(behavior);
  }
}



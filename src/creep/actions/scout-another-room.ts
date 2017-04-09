import Ticker = Blackthorn.Ticker;
import Status = Blackthorn.Status;
import {Blackthorn} from "../../lib/blackthorn";

export class ScountAnotherRoom extends Blackthorn.Action {
  public static readonly GOTO = "gotoRoom";
  public static readonly COME_FROM = "comeFromRoom";

  open(ticker: Ticker): void {
    const creep = this.getCreep(ticker);
    let exits = _.values(Game.map.describeExits(creep.room.name));
    if (creep.memory[ScountAnotherRoom.COME_FROM] && exits.length > 1) {
      exits = _.filter(exits, (roomName) => {
        return roomName !== creep.memory[ScountAnotherRoom.COME_FROM];
      });
    }

    const gotoRoom = _.sample<string>(exits, 1).pop();
    creep.memory[ScountAnotherRoom.GOTO] = gotoRoom;
  }

  tick(ticker: Ticker): Status {
    const creep = this.getCreep(ticker);
    creep.say("Scouting");

    const gotoRoomName = creep.memory[ScountAnotherRoom.GOTO];
    if (!gotoRoomName) {
      return Status.FAILURE;
    }

    if (gotoRoomName === creep.room.name) {
      creep.memory[ScountAnotherRoom.COME_FROM] = creep.room.name;
      return Status.SUCCESS;
    }
    const exitDir = Game.map.findExit(creep.room, gotoRoomName);
    const exit = creep.pos.findClosestByRange<RoomPosition>(exitDir);
    creep.moveTo(exit);
    return Status.RUNNING;
  }

  private getCreep(ticker: Ticker): Creep {
    return <Creep>ticker.subject;
  }
}

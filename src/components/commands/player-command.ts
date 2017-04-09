import RoomBrain from "../room-brain";

export abstract class PlayerCommand {
  abstract getId();

  abstract execute(flag: Flag);
}
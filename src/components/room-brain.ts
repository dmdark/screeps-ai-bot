import {RoomInfo} from "./room-info";

export default class RoomBrain {
  public static instances: {[roomName: string]: RoomBrain} = {};

  public static getInstanceForRoom(room: Room, create: boolean = false): RoomBrain {
    if (!RoomBrain.instances[room.name] || create) {
      RoomBrain.instances[room.name] = new RoomBrain(room);
    }
    return RoomBrain.instances[room.name];
  }

  public info: RoomInfo;

  private constructor(private room: Room) {
    this.info = new RoomInfo(room);
  }
}

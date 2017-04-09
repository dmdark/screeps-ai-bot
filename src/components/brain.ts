import RoomBrain from "./room-brain";

export default class Brain {
  public static instance: Brain;

  private roomBrains: RoomBrain[] = [];

  public static getInstance(create: boolean = false): Brain {
    if (!Brain.instance || create) {
      Brain.instance = new Brain();
    }
    return Brain.instance;
  }

  private constructor() {
    /*for (const roomName of Object.keys(Game.rooms)) {
      this.roomBrains.push(RoomBrain.getInstanceForRoom(Game.rooms[roomName], true));
    }*/
  }
}
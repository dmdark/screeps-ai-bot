export default class RoomDrawer {
  constructor(private room: Room) {
  }

  public drawHarvestersInfoInSource(source: Source, harvestersNeeded: number, harvestersNow: number) {
    this.room.visual.text(`${harvestersNow} / ${harvestersNeeded}`, source.pos.x, source.pos.y - 1, <TextStyle>{
      color: 'white',
      size: 0.5
    });
  }
}
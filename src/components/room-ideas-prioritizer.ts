import {RoomInfo} from "./room-info";
import ControllerNeedsUpgrade from "./ideas/ControllerNeedsUpgrade";
import SourceNeedsHarvesting from "./ideas/SourceNeedsHarvesting";

export default class RoomIdeasPrioritizer {
  private priorityMap = {};

  constructor(private info: RoomInfo) {
    this.priorityMap[SourceNeedsHarvesting.name] = 100;
    this.priorityMap[ControllerNeedsUpgrade.name] = 10;
  }
}
export default class SourceNeedsHarvesting {
  constructor(public info: {
    sourceId: string;
    priority: number
  }) {
  }
}
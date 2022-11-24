import { LogId } from "@contracts";

export const constructLogId = (id: string, searchPath: string): LogId => `${id}_${searchPath}`;
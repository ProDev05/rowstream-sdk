import { Session, APIUser } from "../models";
import { PM5Stat, StatType } from "./pm5-sdk";
export interface PendingQueues {
    sessionCloseQueue: {
        sessionId: string;
        session: Session;
    }[];
    statCreateQueue: {
        sessionId: string;
        stats: PM5Stat[];
        statType: StatType;
    }[];
}
/**
 * Wrapper to ensure sessions and stats are synchronized with the server.
 */
export declare class SessionStorage {
    private token;
    private user;
    private onStorageChange;
    private storage;
    private pendingQueues;
    constructor(token: string, user: APIUser, onStorageChange: (docCount: number) => void, storage: any);
    init(): Promise<void>;
    getDocCount(): number;
    private writeQueues;
    /**
     *  Synchronize the In-Memory queues with the RowStream Server (and clear the queues)
     *  Currently, we only have two command queues.  Create State, and Close Session.
     */
    synchronize(): Promise<void>;
    closeSession(session: Session, id: string): Promise<void>;
    uploadStats(sessionId: string, stats: PM5Stat[], statType: StatType): Promise<void>;
}

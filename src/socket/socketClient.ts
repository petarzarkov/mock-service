import { IAppLogger, logging } from "casino-logger";
import { io, Socket } from "socket.io-client";
import { v4 } from "uuid";
import { SOCKER_SERVER_URL, SOCKET_PATH } from "@constants";

export class SocketClient {
    url: string;
    socket: Socket;
    /**
   * Socket emit timeout of socket iowrapper
   * @default 1500
   */
    socketEmitTimeout = 1500;
    log: IAppLogger;

    constructor(url: string) {
        this.log = logging.createLogger("@socket/client");
        this.url = url || SOCKER_SERVER_URL;
        this.socket = io(this.url, {
            transports: ["websocket"],
            path: SOCKET_PATH,
            reconnectionDelay: 500,
            reconnectionDelayMax: 2500
        });

        this.socket.on("connect", () => {
            const requestId = v4();
            const socketData = {
                socketId: this.socket?.id,
                socketInfo: {
                    socketURL: this.url,
                    socketPathURL: SOCKET_PATH,
                    hostname: this.socket?.io.opts.hostname,
                    port: this.socket?.io.opts.port,
                    transports: this.socket?.io.opts.transports,
                    reconnectionActive: this.socket?.active
                }
            };
            this.log.info(`Socket client connected ${this.url}`, { requestId, data: socketData, event: "socket_connected" });
        });

        this.socket.on("disconnect", (reason: string) => {
            this.log.info(`Socket client disconnect ${this.url}`, { reason, event: "socket_connected" });
        });

        this.socket.on("connect_error", (err: Error) => {
            this.log.error(`Socket client connection error ${this.url}`, { err });
        });
    }

    public emit<Request, Response>({ event, request, timeout }:
    { event: string; request: Request; timeout?: number }): Promise<Response | Error> {
        return new Promise((resolve) => {
            this.socket?.timeout(timeout || this.socketEmitTimeout).emit(event, request, (err: Error, data: Response) => {
                if (err) {
                    return resolve(err);
                }

                if (data) {
                    return resolve(data);
                }

            });
        });

    }
}
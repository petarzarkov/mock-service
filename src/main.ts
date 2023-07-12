import { startServer } from "@server";
import { HotLogger } from "@toplo/api";

const log = HotLogger.createLogger("endpoint");

const main = async () => {
    await startServer(log);
};

main().catch((err: Error) => {
    log.error("Exception raised while starting Mock Service.", { err });
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    setTimeout(() => main(), 2000);
});

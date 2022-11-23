if (process.env.NEW_RELIC_APP_NAME && process.env.NEW_RELIC_LICENSE_KEY) {
    require("newrelic");
}
import { logging } from "casino-logger";
import { registerTerminateProcessListener, registerUnhandledErrorsListener, Consul } from "casino-lib";
import { startServer } from "@server";

const log = logging.createLogger("endpoint");

const main = async () => {
    void registerTerminateProcessListener();
    void registerUnhandledErrorsListener({});

    await Consul.register();
    await startServer(log);
};

main().catch((err: Error) => {
    log.error("Exception raised while starting Mock Service.", { err });
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    setTimeout(() => main(), 2000);
});

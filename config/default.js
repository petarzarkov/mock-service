module.exports = {
    team: "TechOps",
    internetFacing: true,
    servicePort: 5055,
    serverPort: 5055, // consul needs this for discovery
    defaultModels: ["build/models/*.model.*"],
    db: {
        "casdb_bet": {
            host: "localhost",
            username: "casinoadmin",
            password: "casinoadmin",
            port: "5432",
            models: ["build/models/*.model.*"],
            vaultRoleID: "dbs/creds/casdb_config_role",
            loggingEnabled: false,
        }
    },
    fabio: {
        enabled: true,
        url: "http://localhost:9999",
        healthUrl: "http://localhost:9998/health",
    },
    vault: {
        enabled: false,
        server: "http://10.31.0.218:8200"
    },
    log: {
        appType: "casino-mock-service",
        appName: "mock-service",
        level: "INFO",
        color: true,
        filters: [{
            key: "eventName",
            values: [
                "/fabio/health",
                "/service/healthcheck",
                "/service/upcheck",
                "/_healthcheck",
                "/_upcheck",
            ]
        }],
        sbtechLoggerConfig: {
            "enabled": false,
            "endpoint": "https://log.sbtech.com/logs/serilog",
            "batchSize": 1000,
            "flushIntervalSec": 3
        }
    },
    datadog: {
        host: "10.31.1.80",
        port: 8129,
        appType: "hub",
        active: false,
    },
    consul: {
        enabled: true,
        serviceName: "casino-mock-service",
        agentIp: "127.0.0.1",
        healthCheckInterval: "15s",
        agentPort: 8500,
        refreshInterval: 2000,
        reconnectAttempts: 10,
    },
};

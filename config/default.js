module.exports = {
    servicePort: 5055,
    fabio: {
        enabled: true,
        url: "http://localhost:9999",
        healthUrl: "http://localhost:9998/health",
    },
    log: {
        appType: "mock-service",
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
        }]
    },
    consul: {
        enabled: true,
        serviceName: "mock-service",
        agentIp: "127.0.0.1",
        healthCheckInterval: "15s",
        agentPort: 8500,
        refreshInterval: 2000,
        reconnectAttempts: 10,
    },
};

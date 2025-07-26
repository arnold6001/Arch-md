const fs = require("fs");
const pkg = require("../../package.json");
const getLatestGitHubVersion = require("../getversion");

let onConnectionUpdate;

module.exports = function handleConnectionUpdate(ednut, startBotz) {
  if (onConnectionUpdate) ednut.ev.off("connection.update", onConnectionUpdate);

  onConnectionUpdate = async (update) => {
    const { connection, lastDisconnect } = update;

    global.db = global.db || {};
    global.db.reconnect = global.db.reconnect || 0; // for controlling connection message only

    // 🟡 Connecting
    if (connection === "connecting") {
      log("INFO", "[*] Connecting to WhatsApp...");
      log("INFO", `[0] Arch Version: v${pkg.version}`);
    }

    // ✅ Connected
    if (connection === "open") {
      const userId = ednut.user.id.split(":")[0];
      log("INFO", `[0] Connected to: ${userId}`);

      if (global.db.reconnect === 0) {
        const latest = await getLatestGitHubVersion();
        const versionNote = latest
          ? latest !== pkg.version
            ? `│ ⚠️ New version: v${latest}`
            : `│ ✅ Up to date`
          : `│ ⚠️ Version check failed`;

        const msg = [
          "╭─[ Arch Md Connected ]",
          `│ ID: ${userId}`,
          `│ Prefix: ${global.prefix}`,
          `│ Version: v${pkg.version}|${versionNote}`,
          "│ Session: Active",
          "╰─────────────────────",
          "",
          "Bot not responding?",
          `• Visit: ${global.scan}`,
          "• Replace session ID in env",
          "• Restart from host ✅"
        ].join("\n");

        await ednut.sendMessage(userId + "@s.whatsapp.net", { text: msg });
      }

      // 🧹 Prevent message re-send on reconnect
      global.db.reconnect = 1;

      // 🔌 Load plugins
      if (!global.db.loadedPlugins) {
        try {
          log("INFO", "[0] Installing plugins...");
          const files = fs.readdirSync('./plugins/ednut').filter(f => f.endsWith('.js'));
          for (const file of files) {
            try {
              require(`../../plugins/ednut/${file}`);
            } catch (err) {
              log("ERROR", `[x] Failed to load plugin ${file}: ${err.message}`);
            }
          }
          global.db.loadedPlugins = true;
          log("INFO", "[0] Plugins installed.");
        } catch (err) {
          log("ERROR", `[x] Plugin setup failed: ${err.message}`);
        }
      }
    }

    // ❌ Disconnected
    if (connection === "close") {
      const code = lastDisconnect?.error?.output?.statusCode || "unknown";

      if (code === 401) {
        log("ERROR", "[x] Logged out: Invalid session (401). Exiting...");
        return process.exit(1);
      }

      const wait = Math.min(4000, 1000); // short wait before retry
      log("WARN", `[!] Disconnected (${code}), retrying in ${wait / 1000}s...`);
      setTimeout(() => startBotz(), wait);
    }
  };

  ednut.ev.on("connection.update", onConnectionUpdate);
};

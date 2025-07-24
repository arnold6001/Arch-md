(function () {
  const _0x3c0d = [
    "catch",
    "readMessages",
    "message",
    "key",
    "id",
    "delete",
    "remoteJid",
    "fromMe",
    "smsg",
    "../myfunc",
    "messages.upsert",
    "composing",
    "autorecording",
    "recording",
    "available",
    "sendPresenceUpdate",
    "STATUS",
    "settings",
    "readsw",
    "push",
    "unavailable",
    "ev",
    "removeAllListeners",
    "add",
    "length",
    "store",
    "user",
    "handler",
    "require",
    "stack",
    "log",
    "true",
    "message",
    "global",
    "status@broadcast"
  ];

  const _0x4874 = function (_0x41e0f1) {
    return _0x3c0d[_0x41e0f1];
  };

  const handledMessages = new Set();
  const { [_0x4874(8)]: smsg } = require(_0x4874(9));

  module.exports = function (ednut, store) {
    ednut[_0x4874(22)][_0x4874(23)](_0x4874(10));
    ednut[_0x4874(22)].on(_0x4874(10), async (chatUpdate) => {
      try {
        const mek = chatUpdate["messages"]?.[0];
        if (!mek?.[_0x4874(2)]) return;

        const msgId = mek[_0x4874(3)]?.[_0x4874(4)];
        if (handledMessages.has(msgId)) return;
        handledMessages[_0x4874(24)](msgId);
        setTimeout(() => handledMessages[_0x4874(5)](msgId), 15000);

        mek[_0x4874(2)] =
          mek[_0x4874(2)]?.ephemeralMessage?.[_0x4874(2)] || mek[_0x4874(2)];

        const jid = mek[_0x4874(3)][_0x4874(6)];
        const fromBot = mek[_0x4874(3)][_0x4874(7)];
        const m = smsg(ednut, mek, store);

        if (jid === _0x4874(39)) {
          const statusEnabled =
            process.env[_0x4874(16)] === _0x4874(33) ||
            global.db?.[_0x4874(17)]?.[_0x4874(18)] === true;
          if (statusEnabled) {
            await ednut[_0x4874(1)]([mek[_0x4874(3)]])[_0x4874(0)](() => {});
          }
          return;
        }

        if (
          process.env["READ"] === _0x4874(33) ||
          global.db?.[_0x4874(17)]?.autoread === true
        ) {
          ednut[_0x4874(1)]([mek[_0x4874(3)]])[_0x4874(0)](() => {});
        }

        require("../../handler")(
          ednut,
          m,
          chatUpdate,
          mek,
          store
        );

        if (!fromBot) {
          if (global.db?.[_0x4874(17)]?.autotyping === true) {
            ednut[_0x4874(15)](_0x4874(11), jid)[_0x4874(0)](() => {});
          }
          if (global.db?.[_0x4874(17)]?.[_0x4874(12)] === true) {
            ednut[_0x4874(15)](_0x4874(13), jid)[_0x4874(0)](() => {});
          }
          const online =
            process.env["ONLINE"] === _0x4874(33) ||
            global.db?.[_0x4874(17)]?.[_0x4874(14)] === true;
          ednut[_0x4874(15)](online ? _0x4874(19) : _0x4874(21), jid)[
            _0x4874(0)
          ](() => {});
        }
      } catch (err) {
        if (!ednut?.[_0x4874(26)]?.id) return;
        log("ERROR", "Message Handler: " + (err[_0x4874(28)] || err.message));
      }
    });
  };
})();

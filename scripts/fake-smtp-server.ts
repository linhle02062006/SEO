/**
 * SMTP server giả lập để kiểm tra luồng gửi email của form liên hệ
 * mà không cần tài khoản Gmail thật.
 *
 * Chạy: npx tsx scripts/fake-smtp-server.ts [port]
 * Nhận email ở thư mục .tmp-smtp/
 */
import net from "node:net";
import fs from "node:fs";
import path from "node:path";

const PORT = Number(process.argv[2] || 2525);
const OUT_DIR = path.join(process.cwd(), ".tmp-smtp");
fs.mkdirSync(OUT_DIR, { recursive: true });

let counter = 0;

const server = net.createServer((socket) => {
  let buffer = "";
  let inData = false;
  let dataLines: string[] = [];
  let current = "";
  let message = "";
  let session = 0;

  socket.write("220 fake-smtp.local ESMTP ready\r\n");

  socket.on("data", (chunk) => {
    buffer += chunk.toString("utf8");

    while (true) {
      if (inData) {
        const idx = buffer.indexOf("\r\n");
        if (idx === -1) break;
        const line = buffer.slice(0, idx);
        buffer = buffer.slice(idx + 2);
        if (line === ".") {
          inData = false;
          const file = path.join(OUT_DIR, `mail-${Date.now()}-${++counter}.eml`);
          fs.writeFileSync(file, message, "utf8");
          console.log(`📨 Nhận email -> ${file}`);
          message = "";
          socket.write("250 OK: queued\r\n");
        } else {
          dataLines.push(line);
          message += line + "\n";
        }
        continue;
      }

      const idx = buffer.indexOf("\r\n");
      if (idx === -1) break;
      const line = buffer.slice(0, idx);
      buffer = buffer.slice(idx + 2);
      current = line;

      const upper = line.toUpperCase();
      if (upper.startsWith("EHLO") || upper.startsWith("HELO")) {
        socket.write("250-fake-smtp.local\r\n250 AUTH PLAIN LOGIN\r\n");
      } else if (upper.startsWith("AUTH")) {
        socket.write("235 2.7.0 Authentication successful\r\n");
      } else if (upper.startsWith("MAIL FROM")) {
        socket.write("250 OK\r\n");
      } else if (upper.startsWith("RCPT TO")) {
        socket.write("250 OK\r\n");
      } else if (upper.startsWith("DATA")) {
        inData = true;
        message = "";
        socket.write("354 End data with <CR><LF>.<CR><LF>\r\n");
      } else if (upper.startsWith("QUIT")) {
        socket.write("221 Bye\r\n");
        socket.end();
        return;
      } else if (upper.startsWith("RSET") || upper.startsWith("NOOP")) {
        socket.write("250 OK\r\n");
      } else {
        socket.write("250 OK\r\n");
      }
    }
  });

  socket.on("error", () => {});
});

server.listen(PORT, "127.0.0.1", () => {
  console.log(`📧 Fake SMTP server đang chạy tại 127.0.0.1:${PORT}`);
  console.log(`   Thư mục nhận email: ${OUT_DIR}`);
});

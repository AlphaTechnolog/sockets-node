const { Socket } = require("net");
const readline = require("readline").createInterface({
  input: process.stdin,
  output: process.stdout,
});

const END = "END";

const error = (message) => {
  console.error(message);
  process.exit(1);
};

const connect = (host, port) => {
  const socket = new Socket();
  console.log(`Connecting using: "${host}:${port}"`);

  socket.connect({ host, port });

  socket.on("connect", () => {
    console.log("Connected");
    socket.setEncoding("utf-8");

    readline.question("Choose your username: ", (username) => {
      socket.write(username);
      console.log(`Type any message to send it, type: "${END}" to end`);
    });

    readline.on("line", (message) => {
      if (message !== END) {
        socket.write(message);
      } else {
        socket.end();
      }
    });
  });

  socket.on("data", (data) => {
    console.log(data);
  });

  socket.on("close", () => {
    console.log("Closed connection");
    process.exit(0);
  });

  socket.on("error", (err) => error(err.message));
};

const main = () => {
  if (process.argv.length !== 4) {
    error(`Usage: node ${__filename} host port`);
  }

  let [, , host, port] = process.argv;

  if (isNaN(port)) {
    error(`Invalid port: "${port}"`);
  }
  port = Number(port);

  connect(host, port);
};

if (module === require.main) {
  main();
}

import net from "net";
import pool from "../config/db.js";
import { parseGT06 } from "../services/gt06Parser.js";

const PORT = process.env.TCP_PORT || 7000;

const server = net.createServer(socket => {
  const remote = `${socket.remoteAddress}:${socket.remotePort}`;
  console.log("Tracker connected", remote);

  socket.on("data", async (data) => {
    try {
      // Dados brutos
      const hex = data.toString("hex");
      const ascii = data.toString("utf8");
      console.log(`[TCP] data from ${remote} | hex: ${hex}`);
      console.log(`[TCP] ascii: ${ascii}`);

      // Tentativa de parse (heurística / best-effort)
      const parsed = parseGT06(data);
      console.log("[TCP] parsed:", parsed);

      if (parsed.imei) {
        // procurar veículo pelo IMEI
        const r = await pool.query("SELECT id FROM veiculos WHERE imei = $1", [parsed.imei]);
        if (r.rows.length) {
          const veiculoId = r.rows[0].id;
          // se tiver lat/lng, salvar posição
          if (parsed.lat && parsed.lng) {
            await pool.query(
              "INSERT INTO posicoes (veiculo_id, latitude, longitude, velocidade) VALUES ($1, $2, $3, $4)",
              [veiculoId, parsed.lat, parsed.lng, parsed.speed || null]
            );
            console.log(`[TCP] posição salva para veiculo_id=${veiculoId}`);
          } else {
            console.log("[TCP] IMEI encontrado, mas sem posição no pacote.");
          }
        } else {
          console.log(`[TCP] IMEI não encontrado no banco: ${parsed.imei}`);
        }
      } else {
        console.log("[TCP] IMEI não detectado no pacote.");
      }

      // ACK simples (placeholder). Muitos rastreadores GT06 esperam ack binário específico.
      // Se o rastreador exigir um ACK específico, substitua aqui com o ACK correto (hex).
      socket.write(Buffer.from("##", "utf8"));
    } catch (err) {
      console.error("[TCP] Erro ao processar dados:", err);
    }
  });

  socket.on("close", () => {
    console.log("Tracker disconnected", remote);
  });

  socket.on("error", (err) => {
    console.error("Socket error", err);
  });
});

server.on("error", (err) => {
  console.error("TCP Server error", err);
});

server.listen(PORT, () => {
  console.log(`TCP Server listening on port ${PORT}`);
});

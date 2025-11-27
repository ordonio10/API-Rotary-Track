// parser "best-effort" para dados recebidos do rastreador
// Não é um decodificador GT06 completo — tenta extrair IMEI e coordenadas em texto ASCII.
// Se você tiver pacotes reais em hex, envie para eu ajustar o parser binário.

export function parseGT06(buffer) {
  const hex = buffer.toString("hex");
  const ascii = buffer.toString("utf8");

  // 1) tentar IMEI (15 ou 16 dígitos)
  let imei = null;
  const imeiMatch = ascii.match(/\b(\d{15,16})\b/);
  if (imeiMatch) imei = imeiMatch[1];

  // 2) tentar coordenadas como floats no texto (ex: -23.5500, -46.6333)
  let lat = null;
  let lng = null;
  const coordMatches = ascii.match(/-?\d{1,3}\.\d{4,}/g);
  if (coordMatches && coordMatches.length >= 2) {
    lat = parseFloat(coordMatches[0]);
    lng = parseFloat(coordMatches[1]);
  } else {
    // tentar separadores por vírgula
    const commaMatch = ascii.match(/(-?\d{1,3}\.\d{4,}),\s*(-?\d{1,3}\.\d{4,})/);
    if (commaMatch) {
      lat = parseFloat(commaMatch[1]);
      lng = parseFloat(commaMatch[2]);
    }
  }

  // 3) tentar velocidade
  let speed = null;
  const speedMatch = ascii.match(/speed[:=]\s*([0-9]{1,3})/i);
  if (speedMatch) speed = Number(speedMatch[1]);

  return {
    imei,
    lat,
    lng,
    speed,
    raw: ascii,
    hex
  };
}

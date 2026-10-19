export const FAVORITES_STORAGE_KEY = "weathernow:favorites";
export const THEME_STORAGE_KEY = "weathernow:theme";
export const LAST_CITY_STORAGE_KEY = "weathernow:lastCity";

export const PRESET_CITIES = [
  {
    id: "tashkent-uz",
    name: "Ташкент",
    queryName: "Tashkent",
    country: "Узбекистан",
    countryCode: "UZ",
    latitude: 41.2646,
    longitude: 69.2163,
    timezone: "Asia/Tashkent",
    aliases: ["tashkent", "ташкент", "toshkent", "тошкент"],
    fallback: {
      temp: 24,
      feelsLike: 22,
      min: 13,
      max: 25,
      humidity: 28,
      windSpeed: 9,
      precipProb: 5,
      code: 0,
      isDay: 1,
      daily: [
        { offset: 1, code: 1, min: 13, max: 25, precip: 5, wind: 10 },
        { offset: 2, code: 2, min: 14, max: 23, precip: 15, wind: 12 },
        { offset: 3, code: 61, min: 11, max: 19, precip: 65, wind: 18 },
        { offset: 4, code: 1, min: 10, max: 21, precip: 10, wind: 11 },
        { offset: 5, code: 0, min: 12, max: 24, precip: 0, wind: 8 },
      ],
    },
  },
  {
    id: "london-gb",
    name: "Лондон",
    queryName: "London",
    country: "Великобритания",
    countryCode: "GB",
    latitude: 51.5085,
    longitude: -0.1257,
    timezone: "Europe/London",
    aliases: ["london", "лондон"],
    fallback: {
      temp: 14,
      feelsLike: 12,
      min: 9,
      max: 16,
      humidity: 76,
      windSpeed: 19,
      precipProb: 60,
      code: 61,
      isDay: 1,
      daily: [
        { offset: 1, code: 61, min: 9, max: 15, precip: 70, wind: 21 },
        { offset: 2, code: 3, min: 8, max: 14, precip: 35, wind: 16 },
        { offset: 3, code: 2, min: 7, max: 15, precip: 20, wind: 13 },
        { offset: 4, code: 80, min: 10, max: 16, precip: 55, wind: 22 },
        { offset: 5, code: 1, min: 8, max: 17, precip: 15, wind: 12 },
      ],
    },
  },
  {
    id: "tokyo-jp",
    name: "Токио",
    queryName: "Tokyo",
    country: "Япония",
    countryCode: "JP",
    latitude: 35.6895,
    longitude: 139.6917,
    timezone: "Asia/Tokyo",
    aliases: ["tokyo", "токио"],
    fallback: {
      temp: 20,
      feelsLike: 19,
      min: 15,
      max: 22,
      humidity: 58,
      windSpeed: 14,
      precipProb: 20,
      code: 2,
      isDay: 0,
      daily: [
        { offset: 1, code: 1, min: 15, max: 23, precip: 10, wind: 13 },
        { offset: 2, code: 0, min: 16, max: 24, precip: 5, wind: 11 },
        { offset: 3, code: 3, min: 15, max: 21, precip: 30, wind: 15 },
        { offset: 4, code: 63, min: 14, max: 19, precip: 80, wind: 24 },
        { offset: 5, code: 1, min: 13, max: 22, precip: 10, wind: 12 },
      ],
    },
  },
  {
    id: "samarkand-uz",
    name: "Самарканд",
    queryName: "Samarkand",
    country: "Узбекистан",
    countryCode: "UZ",
    latitude: 39.6542,
    longitude: 66.9597,
    timezone: "Asia/Samarkand",
    aliases: ["samarkand", "самарканд", "samarqand"],
    fallback: {
      temp: 23,
      feelsLike: 21,
      min: 11,
      max: 24,
      humidity: 31,
      windSpeed: 11,
      precipProb: 5,
      code: 0,
      isDay: 1,
      daily: [
        { offset: 1, code: 0, min: 11, max: 24, precip: 0, wind: 10 },
        { offset: 2, code: 1, min: 12, max: 23, precip: 10, wind: 12 },
        { offset: 3, code: 2, min: 10, max: 20, precip: 25, wind: 15 },
        { offset: 4, code: 0, min: 9, max: 22, precip: 5, wind: 9 },
        { offset: 5, code: 0, min: 11, max: 25, precip: 0, wind: 8 },
      ],
    },
  },
  {
    id: "new-york-us",
    name: "Нью-Йорк",
    queryName: "New York",
    country: "США",
    countryCode: "US",
    latitude: 40.7143,
    longitude: -74.006,
    timezone: "America/New_York",
    aliases: ["new york", "нью-йорк", "нью йорк", "nyc"],
    fallback: {
      temp: 17,
      feelsLike: 16,
      min: 11,
      max: 19,
      humidity: 54,
      windSpeed: 17,
      precipProb: 15,
      code: 1,
      isDay: 1,
      daily: [
        { offset: 1, code: 2, min: 11, max: 19, precip: 20, wind: 16 },
        { offset: 2, code: 61, min: 12, max: 17, precip: 65, wind: 23 },
        { offset: 3, code: 0, min: 9, max: 18, precip: 5, wind: 14 },
        { offset: 4, code: 0, min: 10, max: 20, precip: 0, wind: 11 },
        { offset: 5, code: 2, min: 12, max: 21, precip: 20, wind: 15 },
      ],
    },
  },
  {
    id: "dubai-ae",
    name: "Дубай",
    queryName: "Dubai",
    country: "ОАЭ",
    countryCode: "AE",
    latitude: 25.0772,
    longitude: 55.3093,
    timezone: "Asia/Dubai",
    aliases: ["dubai", "дубай"],
    fallback: {
      temp: 33,
      feelsLike: 35,
      min: 26,
      max: 35,
      humidity: 44,
      windSpeed: 15,
      precipProb: 0,
      code: 0,
      isDay: 1,
      daily: [
        { offset: 1, code: 0, min: 26, max: 35, precip: 0, wind: 14 },
        { offset: 2, code: 0, min: 25, max: 34, precip: 0, wind: 16 },
        { offset: 3, code: 1, min: 25, max: 34, precip: 0, wind: 13 },
        { offset: 4, code: 0, min: 24, max: 33, precip: 0, wind: 12 },
        { offset: 5, code: 0, min: 25, max: 34, precip: 0, wind: 15 },
      ],
    },
  },
  {
    id: "paris-fr",
    name: "Париж",
    queryName: "Paris",
    country: "Франция",
    countryCode: "FR",
    latitude: 48.8534,
    longitude: 2.3488,
    timezone: "Europe/Paris",
    aliases: ["paris", "париж"],
    fallback: {
      temp: 16,
      feelsLike: 15,
      min: 10,
      max: 18,
      humidity: 68,
      windSpeed: 14,
      precipProb: 30,
      code: 2,
      isDay: 1,
      daily: [
        { offset: 1, code: 2, min: 10, max: 18, precip: 25, wind: 13 },
        { offset: 2, code: 61, min: 9, max: 15, precip: 60, wind: 19 },
        { offset: 3, code: 1, min: 8, max: 17, precip: 15, wind: 11 },
        { offset: 4, code: 0, min: 9, max: 19, precip: 5, wind: 10 },
        { offset: 5, code: 2, min: 10, max: 18, precip: 20, wind: 12 },
      ],
    },
  },
  {
    id: "seoul-kr",
    name: "Сеул",
    queryName: "Seoul",
    country: "Южная Корея",
    countryCode: "KR",
    latitude: 37.566,
    longitude: 126.9784,
    timezone: "Asia/Seoul",
    aliases: ["seoul", "сеул"],
    fallback: {
      temp: 18,
      feelsLike: 17,
      min: 11,
      max: 20,
      humidity: 52,
      windSpeed: 10,
      precipProb: 10,
      code: 1,
      isDay: 0,
      daily: [
        { offset: 1, code: 0, min: 11, max: 21, precip: 5, wind: 9 },
        { offset: 2, code: 1, min: 12, max: 20, precip: 10, wind: 11 },
        { offset: 3, code: 2, min: 10, max: 18, precip: 25, wind: 14 },
        { offset: 4, code: 0, min: 9, max: 19, precip: 5, wind: 10 },
        { offset: 5, code: 1, min: 10, max: 20, precip: 10, wind: 9 },
      ],
    },
  },
];

export const DEFAULT_FAVORITES = [
  {
    id: "tashkent-uz",
    name: "Ташкент",
    queryName: "Tashkent",
    country: "Узбекистан",
    countryCode: "UZ",
    latitude: 41.2646,
    longitude: 69.2163,
    timezone: "Asia/Tashkent",
  },
  {
    id: "london-gb",
    name: "Лондон",
    queryName: "London",
    country: "Великобритания",
    countryCode: "GB",
    latitude: 51.5085,
    longitude: -0.1257,
    timezone: "Europe/London",
  },
  {
    id: "tokyo-jp",
    name: "Токио",
    queryName: "Tokyo",
    country: "Япония",
    countryCode: "JP",
    latitude: 35.6895,
    longitude: 139.6917,
    timezone: "Asia/Tokyo",
  },
];

const WMO_DESCRIPTIONS = {
  0: { label: "Ясно", kind: "clear", summary: "Безоблачное небо и хорошая видимость" },
  1: { label: "Малооблачно", kind: "partly-cloudy", summary: "Преимущественно солнечно, лёгкие облака" },
  2: { label: "Переменная облачность", kind: "partly-cloudy", summary: "Облака с прояснениями без сильных осадков" },
  3: { label: "Пасмурно", kind: "cloudy", summary: "Плотная облачность в течение дня" },
  45: { label: "Туман", kind: "fog", summary: "Дымка и сниженная горизонтальная видимость" },
  48: { label: "Изморозь", kind: "fog", summary: "Холодный туман с оседанием влаги" },
  51: { label: "Лёгкая морось", kind: "drizzle", summary: "Слабая морось, возможен влажный асфальт" },
  53: { label: "Морось", kind: "drizzle", summary: "Умеренная морось, лучше взять зонт" },
  55: { label: "Плотная морось", kind: "drizzle", summary: "Продолжительные мелкие осадки" },
  56: { label: "Ледяная морось", kind: "sleet", summary: "Охлаждённые капли при низкой температуре" },
  57: { label: "Сильная ледяная морось", kind: "sleet", summary: "Скользкое покрытие и холодный ветер" },
  61: { label: "Небольшой дождь", kind: "rain", summary: "Кратковременный слабый дождь" },
  63: { label: "Умеренный дождь", kind: "rain", summary: "Дождь средней интенсивности" },
  65: { label: "Сильный дождь", kind: "heavy-rain", summary: "Интенсивные осадки и порывистый ветер" },
  66: { label: "Ледяной дождь", kind: "sleet", summary: "Холодный дождь при околонулевой температуре" },
  67: { label: "Сильный ледяной дождь", kind: "sleet", summary: "Неблагоприятные осадки, гололедица" },
  71: { label: "Небольшой снег", kind: "snow", summary: "Слабый снегопад без сильной метели" },
  73: { label: "Снегопад", kind: "snow", summary: "Устойчивый снег и прохладная погода" },
  75: { label: "Сильный снег", kind: "snow", summary: "Густой снегопад и снежный покров" },
  77: { label: "Снежная крупа", kind: "snow", summary: "Мелкие снежные зёрна при холодном воздухе" },
  80: { label: "Ливневый дождь", kind: "rain", summary: "Короткие тёплые или прохладные ливни" },
  81: { label: "Сильный ливень", kind: "heavy-rain", summary: "Ливневые осадки с высокой влажностью" },
  82: { label: "Тропический ливень", kind: "heavy-rain", summary: "Очень сильные ливневые осадки" },
  85: { label: "Снежные заряды", kind: "snow", summary: "Кратковременный снег с прояснениями" },
  86: { label: "Сильная метель", kind: "snow", summary: "Пуржистый снег и сильные порывы" },
  95: { label: "Гроза", kind: "storm", summary: "Грозовая активность и порывистый ветер" },
  96: { label: "Гроза с градом", kind: "storm", summary: "Шквалистый ветер, гроза и мелкий град" },
  99: { label: "Сильная гроза с градом", kind: "storm", summary: "Интенсивная гроза, рекомендуется укрытие" },
};

export function describeWeatherCode(code = 0, isDay = 1) {
  const entry = WMO_DESCRIPTIONS[code] || WMO_DESCRIPTIONS[0];
  if (entry.kind === "clear" && !isDay) {
    return {
      ...entry,
      label: "Ясная ночь",
      kind: "clear-night",
    };
  }
  if (entry.kind === "partly-cloudy" && !isDay) {
    return {
      ...entry,
      kind: "partly-cloudy-night",
    };
  }
  return entry;
}

export function findPresetCity(query) {
  if (!query) return null;
  const normalized = query.trim().toLowerCase();
  if (!normalized) return null;
  return (
    PRESET_CITIES.find(
      (city) =>
        city.id === normalized ||
        city.name.toLowerCase() === normalized ||
        city.queryName.toLowerCase() === normalized ||
        city.aliases.some((alias) => alias === normalized),
    ) ||
    PRESET_CITIES.find(
      (city) =>
        city.name.toLowerCase().startsWith(normalized) ||
        city.queryName.toLowerCase().startsWith(normalized) ||
        city.aliases.some((alias) => alias.startsWith(normalized)),
    ) ||
    null
  );
}

function futureDateISO(daysAhead) {
  const date = new Date();
  date.setDate(date.getDate() + daysAhead);
  return date.toISOString().slice(0, 10);
}

export function buildFallbackWeather(city) {
  const preset =
    PRESET_CITIES.find((item) => item.id === city.id) ||
    findPresetCity(city.queryName || city.name) ||
    PRESET_CITIES[0];

  const fb = preset.fallback;
  const condition = describeWeatherCode(fb.code, fb.isDay);

  return {
    city: {
      id: city.id || preset.id,
      name: city.name || preset.name,
      queryName: city.queryName || preset.queryName || city.name,
      country: city.country || preset.country,
      countryCode: city.countryCode || preset.countryCode,
      latitude: city.latitude ?? preset.latitude,
      longitude: city.longitude ?? preset.longitude,
      timezone: city.timezone || preset.timezone,
    },
    current: {
      temperature: fb.temp,
      feelsLike: fb.feelsLike,
      minTemp: fb.min,
      maxTemp: fb.max,
      humidity: fb.humidity,
      windSpeed: fb.windSpeed,
      precipitationProbability: fb.precipProb,
      weatherCode: fb.code,
      isDay: fb.isDay,
      description: condition.label,
      summary: condition.summary,
      iconKind: condition.kind,
      updatedAt: new Date().toISOString(),
    },
    forecast: fb.daily.map((day) => {
      const dayCondition = describeWeatherCode(day.code, 1);
      return {
        date: futureDateISO(day.offset),
        weatherCode: day.code,
        description: dayCondition.label,
        iconKind: dayCondition.kind,
        minTemp: day.min,
        maxTemp: day.max,
        precipitationProbability: day.precip,
        windSpeedMax: day.wind,
      };
    }),
    source: "fallback",
  };
}

export async function searchCities(query) {
  const trimmed = query.trim();
  if (!trimmed) return PRESET_CITIES.slice(0, 6);

  const localMatches = PRESET_CITIES.filter((city) => {
    const q = trimmed.toLowerCase();
    return (
      city.name.toLowerCase().includes(q) ||
      city.queryName.toLowerCase().includes(q) ||
      city.country.toLowerCase().includes(q) ||
      city.aliases.some((alias) => alias.includes(q))
    );
  });

  try {
    const url = new URL("https://geocoding-api.open-meteo.com/v1/search");
    url.searchParams.set("name", trimmed);
    url.searchParams.set("count", "6");
    url.searchParams.set("language", "ru");
    url.searchParams.set("format", "json");

    const response = await fetch(url.toString());
    if (!response.ok) return localMatches;
    const data = await response.json();
    const remote = (data.results || []).map((item) => {
      const code = (item.country_code || "").toUpperCase();
      const id = `${item.name.toLowerCase().replace(/\s+/g, "-")}-${code.toLowerCase()}-${item.id}`;
      const presetMatch = PRESET_CITIES.find(
        (preset) =>
          preset.countryCode === code &&
          Math.abs(preset.latitude - item.latitude) < 0.35 &&
          Math.abs(preset.longitude - item.longitude) < 0.35,
      );
      return {
        id: presetMatch ? presetMatch.id : id,
        name: presetMatch ? presetMatch.name : item.name,
        queryName: presetMatch ? presetMatch.queryName : item.name,
        country: item.country || presetMatch?.country || code,
        countryCode: code,
        admin1: item.admin1 || "",
        latitude: item.latitude,
        longitude: item.longitude,
        timezone: item.timezone || "auto",
      };
    });

    const seen = new Set();
    return [...localMatches, ...remote].filter((item) => {
      const key = `${item.name.toLowerCase()}-${item.countryCode}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    }).slice(0, 6);
  } catch {
    return localMatches;
  }
}

export async function fetchWeatherForCity(cityInput) {
  let target = cityInput;

  if (typeof cityInput === "string") {
    const preset = findPresetCity(cityInput);
    if (preset) {
      target = preset;
    } else {
      const found = await searchCities(cityInput);
      if (found.length === 0) {
        const error = new Error(`Город «${cityInput.trim()}» не найден. Попробуйте Tashkent, London или Tokyo.`);
        error.code = "CITY_NOT_FOUND";
        throw error;
      }
      target = found[0];
    }
  }

  try {
    const url = new URL("https://api.open-meteo.com/v1/forecast");
    url.searchParams.set("latitude", String(target.latitude));
    url.searchParams.set("longitude", String(target.longitude));
    url.searchParams.set(
      "current",
      [
        "temperature_2m",
        "apparent_temperature",
        "relative_humidity_2m",
        "precipitation_probability",
        "wind_speed_10m",
        "weather_code",
        "is_day",
      ].join(","),
    );
    url.searchParams.set(
      "daily",
      [
        "weather_code",
        "temperature_2m_max",
        "temperature_2m_min",
        "precipitation_probability_max",
        "wind_speed_10m_max",
      ].join(","),
    );
    url.searchParams.set("timezone", target.timezone || "auto");
    url.searchParams.set("forecast_days", "6");

    const response = await fetch(url.toString());
    if (!response.ok) {
      throw new Error("Сервис погоды временно недоступен");
    }

    const data = await response.json();
    const current = data.current || {};
    const daily = data.daily || {};
    const times = daily.time || [];
    const maxList = daily.temperature_2m_max || [];
    const minList = daily.temperature_2m_min || [];
    const codeList = daily.weather_code || [];
    const precipList = daily.precipitation_probability_max || [];
    const windMaxList = daily.wind_speed_10m_max || [];

    const todayMax =
      typeof maxList[0] === "number" ? Math.round(maxList[0]) : Math.round(current.temperature_2m ?? 0);
    const todayMin =
      typeof minList[0] === "number" ? Math.round(minList[0]) : Math.round(current.temperature_2m ?? 0);

    const precipNow =
      typeof current.precipitation_probability === "number"
        ? Math.round(current.precipitation_probability)
        : typeof precipList[0] === "number"
          ? Math.round(precipList[0])
          : null;

    const code = typeof current.weather_code === "number" ? current.weather_code : 0;
    const isDay = typeof current.is_day === "number" ? current.is_day : 1;
    const condition = describeWeatherCode(code, isDay);

    const startIndex = times.length >= 6 ? 1 : 0;
    const forecast = times.slice(startIndex, startIndex + 5).map((dateStr, idx) => {
      const i = startIndex + idx;
      const dayCode = typeof codeList[i] === "number" ? codeList[i] : 0;
      const dayCondition = describeWeatherCode(dayCode, 1);
      return {
        date: dateStr,
        weatherCode: dayCode,
        description: dayCondition.label,
        iconKind: dayCondition.kind,
        minTemp: typeof minList[i] === "number" ? Math.round(minList[i]) : todayMin,
        maxTemp: typeof maxList[i] === "number" ? Math.round(maxList[i]) : todayMax,
        precipitationProbability:
          typeof precipList[i] === "number" ? Math.round(precipList[i]) : null,
        windSpeedMax:
          typeof windMaxList[i] === "number" ? Math.round(windMaxList[i]) : null,
      };
    });

    return {
      city: {
        id: target.id,
        name: target.name,
        queryName: target.queryName || target.name,
        country: target.country || "",
        countryCode: target.countryCode || "",
        latitude: target.latitude,
        longitude: target.longitude,
        timezone: data.timezone || target.timezone || "auto",
      },
      current: {
        temperature: Math.round(current.temperature_2m ?? 0),
        feelsLike: Math.round(current.apparent_temperature ?? current.temperature_2m ?? 0),
        minTemp: todayMin,
        maxTemp: todayMax,
        humidity:
          typeof current.relative_humidity_2m === "number"
            ? Math.round(current.relative_humidity_2m)
            : null,
        windSpeed:
          typeof current.wind_speed_10m === "number"
            ? Math.round(current.wind_speed_10m * 10) / 10
            : null,
        precipitationProbability: precipNow,
        weatherCode: code,
        isDay,
        description: condition.label,
        summary: condition.summary,
        iconKind: condition.kind,
        updatedAt: current.time || new Date().toISOString(),
      },
      forecast,
      source: "live",
    };
  } catch (error) {
    if (error.code === "CITY_NOT_FOUND") throw error;
    return buildFallbackWeather(target);
  }
}

export function formatForecastDay(dateString, index) {
  const date = new Date(`${dateString}T12:00:00`);
  if (Number.isNaN(date.getTime())) {
    return { weekday: `День ${index + 1}`, shortDate: dateString };
  }
  const weekday = new Intl.DateTimeFormat("ru-RU", { weekday: "short" })
    .format(date)
    .replace(".", "");
  const shortDate = new Intl.DateTimeFormat("ru-RU", {
    day: "numeric",
    month: "short",
  })
    .format(date)
    .replace(".", "");
  return {
    weekday: index === 0 ? "Завтра" : weekday.charAt(0).toUpperCase() + weekday.slice(1),
    shortDate,
  };
}

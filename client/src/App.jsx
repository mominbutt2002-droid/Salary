import { useEffect, useRef, useState } from "react";
import { WeatherGlyph } from "./components/WeatherGlyph";
import {
  DEFAULT_FAVORITES,
  FAVORITES_STORAGE_KEY,
  LAST_CITY_STORAGE_KEY,
  PRESET_CITIES,
  THEME_STORAGE_KEY,
  buildFallbackWeather,
  fetchWeatherForCity,
  formatForecastDay,
  searchCities,
} from "./services/weather";

function loadStoredFavorites() {
  try {
    const raw = localStorage.getItem(FAVORITES_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(DEFAULT_FAVORITES));
      return DEFAULT_FAVORITES;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed;
  } catch {
    // ignore storage errors
  }
  return DEFAULT_FAVORITES;
}

function loadInitialCity() {
  try {
    const raw = localStorage.getItem(LAST_CITY_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.name && typeof parsed.latitude === "number") {
        return parsed;
      }
    }
  } catch {
    // ignore storage errors
  }
  return PRESET_CITIES[0];
}

function loadInitialTheme() {
  try {
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    if (saved === "dark" || saved === "light") return saved;
  } catch {
    // ignore storage errors
  }
  if (typeof window !== "undefined" && window.matchMedia?.("(prefers-color-scheme: dark)").matches) {
    return "dark";
  }
  return "light";
}

function humidityLabel(value) {
  if (typeof value !== "number") return "Данные недоступны";
  if (value < 35) return "Сухой воздух";
  if (value <= 65) return "Комфортная влажность";
  return "Высокая влажность";
}

function windLabel(value) {
  if (typeof value !== "number") return "Данные недоступны";
  if (value < 10) return "Лёгкий ветер";
  if (value < 22) return "Умеренный ветер";
  return "Порывистый ветер";
}

function precipLabel(value) {
  if (typeof value !== "number") return "Данные недоступны";
  if (value < 20) return "Осадки маловероятны";
  if (value < 55) return "Возможен кратковременный дождь";
  return "Высокая вероятность осадков";
}

export default function App() {
  const [theme, setTheme] = useState(loadInitialTheme);
  const [favorites, setFavorites] = useState(loadStoredFavorites);
  const [selectedCity, setSelectedCity] = useState(loadInitialCity);
  const [weather, setWeather] = useState(() => buildFallbackWeather(loadInitialCity()));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchBoxRef = useRef(null);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {
      // ignore storage errors
    }
  }, [theme]);

  useEffect(() => {
    try {
      localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
    } catch {
      // ignore storage errors
    }
  }, [favorites]);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError("");
      try {
        const result = await fetchWeatherForCity(selectedCity);
        if (cancelled) return;
        setWeather(result);
        try {
          localStorage.setItem(LAST_CITY_STORAGE_KEY, JSON.stringify(result.city));
        } catch {
          // ignore storage errors
        }
      } catch (err) {
        if (cancelled) return;
        setError(err.message || "Не удалось загрузить погоду");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [selectedCity]);

  useEffect(() => {
    let active = true;
    const trimmed = query.trim();
    if (!trimmed) return undefined;
    const timer = setTimeout(async () => {
      const results = await searchCities(trimmed);
      if (active) setSuggestions(results);
    }, 140);
    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [query]);

  useEffect(() => {
    function handleOutsideClick(event) {
      if (searchBoxRef.current && !searchBoxRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  async function handleSearchSubmit(event) {
    event.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;
    setShowSuggestions(false);
    setLoading(true);
    setError("");
    try {
      const result = await fetchWeatherForCity(trimmed);
      setSelectedCity(result.city);
      setWeather(result);
      setQuery("");
      try {
        localStorage.setItem(LAST_CITY_STORAGE_KEY, JSON.stringify(result.city));
      } catch {
        // ignore storage errors
      }
    } catch (err) {
      setError(err.message || "Город не найден");
    } finally {
      setLoading(false);
    }
  }

  function handleSelectCity(city) {
    setError("");
    setShowSuggestions(false);
    setQuery("");
    setSelectedCity(city);
  }

  const currentCity = weather.city;
  const isFavorite = favorites.some(
    (fav) =>
      fav.id === currentCity.id ||
      fav.name.toLowerCase() === currentCity.name.toLowerCase(),
  );

  function toggleFavorite(city = currentCity) {
    setFavorites((prev) => {
      const exists = prev.some(
        (item) =>
          item.id === city.id || item.name.toLowerCase() === city.name.toLowerCase(),
      );
      if (exists) {
        return prev.filter(
          (item) =>
            item.id !== city.id && item.name.toLowerCase() !== city.name.toLowerCase(),
        );
      }
      return [
        {
          id: city.id,
          name: city.name,
          queryName: city.queryName || city.name,
          country: city.country,
          countryCode: city.countryCode,
          latitude: city.latitude,
          longitude: city.longitude,
          timezone: city.timezone,
        },
        ...prev,
      ];
    });
  }

  function removeFavorite(cityId) {
    setFavorites((prev) => prev.filter((item) => item.id !== cityId));
  }

  const { current, forecast } = weather;

  return (
    <div className="wn-shell">
      <header className="wn-topbar">
        <div className="wn-brand">
          <div className="wn-logo" aria-hidden="true">
            <WeatherGlyph kind="partly-cloudy" size={30} />
          </div>
          <div>
            <h1 className="wn-brand-title">WeatherNow</h1>
            <p className="wn-brand-subtitle">Точная погода и прогноз на 5 дней</p>
          </div>
        </div>

        <div className="wn-controls">
          <button
            type="button"
            className="wn-theme-toggle"
            onClick={() => setTheme((prev) => (prev === "light" ? "dark" : "light"))}
            aria-label="Переключить тему"
          >
            {theme === "light" ? (
              <>
                <span aria-hidden="true">☾</span>
                <span>Тёмная тема</span>
              </>
            ) : (
              <>
                <span aria-hidden="true">☀</span>
                <span>Светлая тема</span>
              </>
            )}
          </button>
        </div>
      </header>

      <section className="wn-search-bar" ref={searchBoxRef} aria-label="Поиск города">
        <form className="wn-search-form" onSubmit={handleSearchSubmit}>
          <div className="wn-search-input-wrap">
            <svg
              className="wn-search-icon"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="7" />
              <line x1="20" y1="20" x2="16.2" y2="16.2" />
            </svg>
            <input
              type="text"
              className="wn-search-input"
              placeholder="Введите город: Tashkent, London, Tokyo..."
              value={query}
              onFocus={() => setShowSuggestions(true)}
              onChange={(e) => {
                setQuery(e.target.value);
                setShowSuggestions(true);
              }}
              aria-label="Название города"
            />
            {query && (
              <button
                type="button"
                className="wn-clear-btn"
                onClick={() => {
                  setQuery("");
                  setSuggestions([]);
                }}
                aria-label="Очистить поиск"
              >
                ✕
              </button>
            )}
          </div>
          <button type="submit" className="wn-search-submit" disabled={loading}>
            {loading ? "Загрузка..." : "Найти"}
          </button>
        </form>

        <div className="wn-quick-row">
          <span className="wn-quick-label">Быстрый выбор:</span>
          {PRESET_CITIES.slice(0, 6).map((city) => {
            const active =
              currentCity.id === city.id ||
              currentCity.name.toLowerCase() === city.name.toLowerCase();
            return (
              <button
                key={city.id}
                type="button"
                className={`wn-chip ${active ? "wn-chip-active" : ""}`}
                onClick={() => handleSelectCity(city)}
              >
                <span>{city.queryName}</span>
                <span style={{ opacity: 0.7 }}>({city.name})</span>
              </button>
            );
          })}
        </div>

        {showSuggestions && query.trim() && suggestions.length > 0 && (
          <div className="wn-suggestions" role="listbox" aria-label="Подсказки городов">
            {suggestions.map((item) => (
              <button
                key={item.id}
                type="button"
                className="wn-suggestion-item"
                onClick={() => handleSelectCity(item)}
              >
                <span className="wn-suggestion-name">
                  {item.name}
                  {item.queryName && item.queryName !== item.name ? ` (${item.queryName})` : ""}
                </span>
                <span className="wn-suggestion-meta">
                  {[item.admin1, item.country].filter(Boolean).join(", ")}
                </span>
              </button>
            ))}
          </div>
        )}
      </section>

      {error && (
        <div className="wn-error-banner" role="alert">
          <span>{error}</span>
          <button
            type="button"
            className="wn-chip"
            onClick={() => setError("")}
          >
            Закрыть
          </button>
        </div>
      )}

      <section className="wn-favorites-section" aria-label="Избранные города">
        <div className="wn-section-header">
          <h2 className="wn-section-title">
            <span aria-hidden="true">★</span>
            <span>Избранные города</span>
          </h2>
          <span className="wn-brand-subtitle">
            Сохраняются в localStorage ({favorites.length})
          </span>
        </div>

        {favorites.length === 0 ? (
          <p className="wn-empty-favs">
            Список пуст. Нажмите «В избранное» на карточке города, чтобы сохранить его.
          </p>
        ) : (
          <div className="wn-favorites-list">
            {favorites.map((fav) => {
              const isCurrent =
                fav.id === currentCity.id ||
                fav.name.toLowerCase() === currentCity.name.toLowerCase();
              return (
                <div
                  key={fav.id}
                  className={`wn-fav-pill ${isCurrent ? "wn-fav-pill-active" : ""}`}
                >
                  <button
                    type="button"
                    className="wn-fav-select"
                    onClick={() => handleSelectCity(fav)}
                  >
                    <span>{fav.name}</span>
                    {fav.countryCode && (
                      <span className="wn-fav-country">{fav.countryCode}</span>
                    )}
                  </button>
                  <button
                    type="button"
                    className="wn-fav-remove"
                    onClick={() => removeFavorite(fav.id)}
                    aria-label={`Удалить ${fav.name} из избранного`}
                    title="Удалить из избранного"
                  >
                    ✕
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </section>

      <div className="wn-main-grid">
        <section className="wn-hero-card" aria-label="Текущая погода">
          <div className="wn-hero-top">
            <div>
              <div className="wn-city-badge">
                <span>Текущая погода</span>
                {currentCity.countryCode && <span>• {currentCity.countryCode}</span>}
              </div>
              <h2 className="wn-city-name">{currentCity.name}</h2>
              <p className="wn-city-sub">
                {currentCity.country}
                {currentCity.queryName && currentCity.queryName !== currentCity.name
                  ? ` · ${currentCity.queryName}`
                  : ""}
              </p>
            </div>

            <button
              type="button"
              className={`wn-fav-btn ${isFavorite ? "wn-fav-btn-saved" : ""}`}
              onClick={() => toggleFavorite(currentCity)}
            >
              <span aria-hidden="true">{isFavorite ? "★" : "☆"}</span>
              <span>{isFavorite ? "В избранном" : "В избранное"}</span>
            </button>
          </div>

          <div className="wn-hero-middle">
            <div className="wn-temp-block">
              <span className="wn-temp-value">
                {current.temperature > 0 ? `+${current.temperature}` : current.temperature}°C
              </span>
              <div className="wn-condition-block">
                <span className="wn-condition-title">{current.description}</span>
                <span className="wn-condition-summary">{current.summary}</span>
              </div>
            </div>
            <WeatherGlyph kind={current.iconKind} size={84} />
          </div>

          <div className="wn-hero-footer">
            <div className="wn-stat-pills">
              <span className="wn-stat-pill">
                Ощущается как:{" "}
                {current.feelsLike > 0 ? `+${current.feelsLike}` : current.feelsLike}°C
              </span>
              <span className="wn-stat-pill">
                Мин: {current.minTemp > 0 ? `+${current.minTemp}` : current.minTemp}°C
              </span>
              <span className="wn-stat-pill">
                Макс: {current.maxTemp > 0 ? `+${current.maxTemp}` : current.maxTemp}°C
              </span>
            </div>
          </div>
        </section>

        <section className="wn-metrics-panel" aria-label="Погодные показатели">
          <div className="wn-section-header" style={{ marginBottom: 4 }}>
            <h2 className="wn-section-title">Погодные показатели</h2>
            <span className="wn-brand-subtitle">Сейчас</span>
          </div>

          <div className="wn-metrics-grid">
            <div className="wn-metric-card">
              <div className="wn-metric-left">
                <div className="wn-metric-icon" aria-hidden="true">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1">
                    <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
                  </svg>
                </div>
                <div>
                  <p className="wn-metric-label">Влажность воздуха</p>
                  <p className="wn-metric-desc">{humidityLabel(current.humidity)}</p>
                </div>
              </div>
              <span className="wn-metric-value">
                {typeof current.humidity === "number" ? `${current.humidity}%` : "Н/Д"}
              </span>
            </div>

            <div className="wn-metric-card">
              <div className="wn-metric-left">
                <div className="wn-metric-icon" aria-hidden="true">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round">
                    <path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2" />
                  </svg>
                </div>
                <div>
                  <p className="wn-metric-label">Скорость ветра</p>
                  <p className="wn-metric-desc">{windLabel(current.windSpeed)}</p>
                </div>
              </div>
              <span className="wn-metric-value">
                {typeof current.windSpeed === "number" ? `${current.windSpeed} км/ч` : "Н/Д"}
              </span>
            </div>

            <div className="wn-metric-card">
              <div className="wn-metric-left">
                <div className="wn-metric-icon" aria-hidden="true">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round">
                    <path d="M20 16.2A4.5 4.5 0 0 0 17.5 8h-1.8A7 7 0 1 0 4 14.9" />
                    <path d="M8 19v2m4-4v4m4-2v2" />
                  </svg>
                </div>
                <div>
                  <p className="wn-metric-label">Вероятность осадков</p>
                  <p className="wn-metric-desc">{precipLabel(current.precipitationProbability)}</p>
                </div>
              </div>
              <span className="wn-metric-value">
                {typeof current.precipitationProbability === "number"
                  ? `${current.precipitationProbability}%`
                  : "Н/Д"}
              </span>
            </div>
          </div>
        </section>
      </div>

      <section className="wn-forecast-section" aria-label="Прогноз на 5 дней">
        <div className="wn-section-header">
          <h2 className="wn-section-title">Прогноз на 5 дней</h2>
          <span className="wn-brand-subtitle">Дневная и ночная температура</span>
        </div>

        <div className="wn-forecast-grid">
          {forecast.slice(0, 5).map((day, index) => {
            const { weekday, shortDate } = formatForecastDay(day.date, index);
            return (
              <article key={day.date} className="wn-day-card">
                <div className="wn-day-top">
                  <span className="wn-day-name">{weekday}</span>
                  <span className="wn-day-date">{shortDate}</span>
                </div>

                <WeatherGlyph kind={day.iconKind} size={52} />

                <div className="wn-day-desc">{day.description}</div>

                {typeof day.precipitationProbability === "number" && (
                  <span className="wn-day-precip">
                    Осадки {day.precipitationProbability}%
                  </span>
                )}

                <div className="wn-day-temps">
                  <span className="wn-day-max" title="Максимальная температура">
                    {day.maxTemp > 0 ? `+${day.maxTemp}` : day.maxTemp}°
                  </span>
                  <span className="wn-day-min" title="Минимальная температура">
                    {day.minTemp > 0 ? `+${day.minTemp}` : day.minTemp}°
                  </span>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}

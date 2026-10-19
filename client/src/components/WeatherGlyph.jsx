export function WeatherGlyph({ kind = "clear", size = 48, className = "" }) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 64 64",
    fill: "none",
    className,
    "aria-hidden": "true",
  };

  switch (kind) {
    case "clear-night":
      return (
        <svg {...common}>
          <path
            d="M41.5 14.5C34.2 16.1 28.8 22.6 28.8 30.4C28.8 39.4 36.1 46.7 45.1 46.7C47.7 46.7 50.1 46.1 52.2 45C48.9 50.4 42.9 54 36 54C25.5 54 17 45.5 17 35C17 25.3 24.3 17.3 33.7 16.1C36.3 15.8 39 15 41.5 14.5Z"
            fill="var(--icon-moon)"
          />
          <circle cx="48" cy="19" r="2" fill="var(--icon-sun)" />
          <circle cx="53" cy="27" r="1.5" fill="var(--icon-sun)" />
        </svg>
      );

    case "partly-cloudy":
      return (
        <svg {...common}>
          <circle cx="24" cy="24" r="10" fill="var(--icon-sun)" />
          <g stroke="var(--icon-sun)" strokeWidth="2.5" strokeLinecap="round">
            <line x1="24" y1="8" x2="24" y2="11" />
            <line x1="11" y1="13" x2="13.5" y2="15.5" />
            <line x1="8" y1="24" x2="11" y2="24" />
            <line x1="35" y1="13" x2="32.5" y2="15.5" />
          </g>
          <path
            d="M22 48H46C51.5 48 56 43.7 56 38.4C56 33.4 52.1 29.3 47.2 28.9C45.4 22.1 39.2 17.2 31.8 17.2C23 17.2 15.8 24.3 15.8 33.1C11.9 33.9 9 37.3 9 41.5C9 45.1 11.9 48 15.5 48H22Z"
            fill="var(--icon-cloud)"
          />
        </svg>
      );

    case "partly-cloudy-night":
      return (
        <svg {...common}>
          <path
            d="M29 12C24 13.4 20.5 18 20.5 23.4C20.5 29.9 25.8 35.2 32.3 35.2C34.2 35.2 36 34.7 37.5 33.9C35 37.8 30.6 40.4 25.6 40.4C17.9 40.4 11.7 34.2 11.7 26.5C11.7 19.5 16.9 13.7 23.7 12.7C25.5 12.4 27.3 12.2 29 12Z"
            fill="var(--icon-moon)"
          />
          <path
            d="M23 49H46C51.2 49 55.5 44.9 55.5 39.8C55.5 35 51.8 31.1 47.1 30.7C45.4 24.4 39.6 19.8 32.7 19.8C24.4 19.8 17.7 26.5 17.7 34.8C14 35.5 11.2 38.8 11.2 42.7C11.2 46.2 14 49 17.5 49H23Z"
            fill="var(--icon-cloud)"
          />
        </svg>
      );

    case "cloudy":
      return (
        <svg {...common}>
          <path
            d="M25 38H48C52.4 38 56 34.5 56 30.2C56 26.1 52.8 22.8 48.8 22.4C47.3 16.8 42.2 12.8 36.1 12.8C28.9 12.8 23 18.6 23 25.8C19.8 26.4 17.5 29.2 17.5 32.6C17.5 35.6 19.9 38 22.9 38H25Z"
            fill="var(--icon-cloud-back)"
          />
          <path
            d="M19 48H43C48.5 48 53 43.7 53 38.4C53 33.4 49.1 29.3 44.2 28.9C42.4 22.1 36.2 17.2 28.8 17.2C20 17.2 12.8 24.3 12.8 33.1C8.9 33.9 6 37.3 6 41.5C6 45.1 8.9 48 12.5 48H19Z"
            fill="var(--icon-cloud)"
          />
        </svg>
      );

    case "fog":
      return (
        <svg {...common}>
          <path
            d="M20 38H44C49 38 53 34.1 53 29.2C53 24.6 49.5 20.9 45 20.5C43.3 14.5 37.8 10.2 31.2 10.2C23.3 10.2 16.9 16.6 16.9 24.5C13.4 25.2 10.8 28.3 10.8 32C10.8 35.3 13.5 38 16.8 38H20Z"
            fill="var(--icon-cloud)"
          />
          <g stroke="var(--icon-rain)" strokeWidth="3" strokeLinecap="round">
            <line x1="14" y1="45" x2="50" y2="45" />
            <line x1="18" y1="52" x2="46" y2="52" />
          </g>
        </svg>
      );

    case "drizzle":
    case "rain":
      return (
        <svg {...common}>
          <path
            d="M20 40H45C50.2 40 54.5 35.9 54.5 30.8C54.5 26 50.8 22.1 46.1 21.7C44.4 15.4 38.6 10.8 31.7 10.8C23.4 10.8 16.7 17.5 16.7 25.8C13 26.5 10.2 29.8 10.2 33.7C10.2 37.2 13 40 16.5 40H20Z"
            fill="var(--icon-cloud)"
          />
          <g stroke="var(--icon-rain)" strokeWidth="2.8" strokeLinecap="round">
            <line x1="22" y1="45" x2="19" y2="54" />
            <line x1="32" y1="45" x2="29" y2="54" />
            <line x1="42" y1="45" x2="39" y2="54" />
          </g>
        </svg>
      );

    case "heavy-rain":
    case "sleet":
      return (
        <svg {...common}>
          <path
            d="M20 39H45C50.2 39 54.5 34.9 54.5 29.8C54.5 25 50.8 21.1 46.1 20.7C44.4 14.4 38.6 9.8 31.7 9.8C23.4 9.8 16.7 16.5 16.7 24.8C13 25.5 10.2 28.8 10.2 32.7C10.2 36.2 13 39 16.5 39H20Z"
            fill="var(--icon-cloud-back)"
          />
          <g stroke="var(--icon-rain)" strokeWidth="3" strokeLinecap="round">
            <line x1="20" y1="43" x2="16" y2="55" />
            <line x1="29" y1="43" x2="25" y2="55" />
            <line x1="38" y1="43" x2="34" y2="55" />
            <line x1="47" y1="43" x2="43" y2="55" />
          </g>
        </svg>
      );

    case "snow":
      return (
        <svg {...common}>
          <path
            d="M20 40H45C50.2 40 54.5 35.9 54.5 30.8C54.5 26 50.8 22.1 46.1 21.7C44.4 15.4 38.6 10.8 31.7 10.8C23.4 10.8 16.7 17.5 16.7 25.8C13 26.5 10.2 29.8 10.2 33.7C10.2 37.2 13 40 16.5 40H20Z"
            fill="var(--icon-cloud)"
          />
          <g fill="var(--icon-rain)">
            <circle cx="22" cy="48" r="2.5" />
            <circle cx="32" cy="52" r="2.5" />
            <circle cx="42" cy="48" r="2.5" />
          </g>
        </svg>
      );

    case "storm":
      return (
        <svg {...common}>
          <path
            d="M20 39H45C50.2 39 54.5 34.9 54.5 29.8C54.5 25 50.8 21.1 46.1 20.7C44.4 14.4 38.6 9.8 31.7 9.8C23.4 9.8 16.7 16.5 16.7 24.8C13 25.5 10.2 28.8 10.2 32.7C10.2 36.2 13 39 16.5 39H20Z"
            fill="var(--icon-cloud-back)"
          />
          <path
            d="M33 40L26 50H33L30 58L41 47H34L33 40Z"
            fill="var(--icon-sun)"
          />
        </svg>
      );

    case "clear":
    default:
      return (
        <svg {...common}>
          <circle cx="32" cy="32" r="13" fill="var(--icon-sun)" />
          <g stroke="var(--icon-sun)" strokeWidth="3" strokeLinecap="round">
            <line x1="32" y1="9" x2="32" y2="14" />
            <line x1="32" y1="50" x2="32" y2="55" />
            <line x1="9" y1="32" x2="14" y2="32" />
            <line x1="50" y1="32" x2="55" y2="32" />
            <line x1="15.8" y1="15.8" x2="19.4" y2="19.4" />
            <line x1="44.6" y1="44.6" x2="48.2" y2="48.2" />
            <line x1="48.2" y1="15.8" x2="44.6" y2="19.4" />
            <line x1="19.4" y1="44.6" x2="15.8" y2="48.2" />
          </g>
        </svg>
      );
  }
}

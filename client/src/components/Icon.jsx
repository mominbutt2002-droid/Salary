const paths = {
  home: "M4 11.5 12 4l8 7.5V20a1 1 0 0 1-1 1h-5v-5H10v5H5a1 1 0 0 1-1-1v-8.5Z",
  pay: "M6 7h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2Zm0 4h12",
  transfer: "M7 7h11M15 4l3 3-3 3M17 17H6M9 14l-3 3 3 3",
  cards: "M3 8.5A2.5 2.5 0 0 1 5.5 6h13A2.5 2.5 0 0 1 21 8.5v7a2.5 2.5 0 0 1-2.5 2.5h-13A2.5 2.5 0 0 1 3 15.5v-7ZM3 10h18",
  qr: "M4 4h6v6H4V4Zm10 0h6v6h-6V4ZM4 14h6v6H4v-6Zm10 3h2v-3h4v2h-2v2h-2v2h-2v-3Zm2 3h2v2h-2v-2Z",
  sun: "M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8ZM12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M19.1 4.9l-1.4 1.4M6.3 17.7l-1.4 1.4",
  moon: "M16 13.5A6.5 6.5 0 0 1 9.2 4 7 7 0 1 0 16 13.5Z",
  eye: "M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Zm10 3a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z",
  eyeOff: "M3 4l18 16M9.9 6.3A10 10 0 0 1 12 6c6.5 0 10 6 10 6a17 17 0 0 1-3.2 3.8M6.1 8.2C3.7 9.8 2 12 2 12s3.5 6 10 6c1.1 0 2.1-.2 3-.5",
  bell: "M6 16V11a6 6 0 1 1 12 0v5l1.5 2h-15L6 16Zm4 2a2 2 0 0 0 4 0",
  plus: "M12 5v14M5 12h14",
  back: "M15 5 8 12l7 7",
  search: "M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14ZM20 20l-3.5-3.5",
  check: "M5 12.5 9.2 17 19 7",
  close: "M7 7l10 10M17 7 7 17",
  freeze: "M12 3v18M6 6.5l12 11M18 6.5l-12 11M4 12h16",
  phone: "M8 3h8a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Zm3 15h2",
  wifi: "M5 10.5a10 10 0 0 1 14 0M7.5 13a6.5 6.5 0 0 1 9 0M12 18h.01",
  bolt: "M13 2 5 14h6l-1 8 8-12h-6l1-8Z",
  gov: "M4 10h16M6 10V20M10 10V20M14 10V20M18 10V20M3 20h18M12 3 3 10h18L12 3Z",
  bus: "M6 4h12a2 2 0 0 1 2 2v9H4V6a2 2 0 0 1 2-2Zm-2 11h16v3a1 1 0 0 1-1 1h-1M6 19H5a1 1 0 0 1-1-1v-3M7 19v2M17 19v2M7 15h.01M17 15h.01",
  tv: "M4 6h16v10H4V6Zm5 14h6M12 16v4",
  edu: "M3 9 12 5l9 4-9 4-9-4Zm4 3.2V16c1.6 1.2 3.2 1.8 5 1.8s3.4-.6 5-1.8v-3.8",
  bag: "M6 8h12l-1 12H7L6 8Zm3 0V7a3 3 0 0 1 6 0v1",
  food: "M6 4v7a3 3 0 0 0 3 3v6M9 4v6M14 14V4c2.5 2 4 4.2 4 7v3h-4Zm0 0v6",
  income: "M12 19V5M6 11l6-6 6 6",
  user: "M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Zm-7 8a7 7 0 0 1 14 0",
  trash: "M5 7h14M9 7V5h6v2M8 7l1 13h6l1-13",
  star: "M12 3.5 14.2 9h5.6l-4.5 3.4 1.7 5.6L12 14.8 7 18l1.7-5.6L4.2 9h5.6L12 3.5Z",
};

export default function Icon({ name, size = 22 }) {
  const d = paths[name] || paths.pay;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d={d} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

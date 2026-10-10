import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Icon from "../components/Icon";
import { categories, categoryById, services } from "../data/catalog";
import styles from "./Payments.module.css";

const icons = {
  mobile: "phone",
  internet: "wifi",
  utilities: "bolt",
  gov: "gov",
  transport: "bus",
  tv: "tv",
  education: "edu",
};

export default function Payments() {
  const [params, setParams] = useSearchParams();
  const active = params.get("cat") || "";
  const [query, setQuery] = useState("");
  const category = categoryById(active);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return services.filter((service) =>
      [service.name, ...(service.keywords || [])].join(" ").toLowerCase().includes(q),
    );
  }, [query]);

  const visible = category ? services.filter((service) => service.category === category.id) : [];

  return (
    <div className="page">
      <div>
        <h1>Оплатить</h1>
        <p className="lead">Связь, коммуналка, налоги и транспорт — без комиссии, как в привычных платёжных приложениях.</p>
      </div>
      <label className={styles.search}>
        <Icon name="search" size={18} />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Найти услугу: Beeline, свет, ATTO"
          aria-label="Поиск услуги"
        />
      </label>

      {query.trim() ? (
        <section className={styles.list}>
          {results.length === 0 ? <p className="muted">Ничего не нашлось. Попробуйте «газ» или «Ucell».</p> : null}
          {results.map((service) => (
            <ServiceRow key={service.id} service={service} />
          ))}
        </section>
      ) : category ? (
        <section>
          <button type="button" className={styles.back} onClick={() => setParams({})}>
            <Icon name="back" size={18} /> Все категории
          </button>
          <h2 className={styles.sub}>{category.title}</h2>
          <div className={styles.list}>
            {visible.map((service) => (
              <ServiceRow key={service.id} service={service} />
            ))}
          </div>
        </section>
      ) : (
        <div className={styles.grid}>
          {categories.map((item) => (
            <button key={item.id} type="button" className={styles.cat} onClick={() => setParams({ cat: item.id })}>
              <span><Icon name={icons[item.id]} /></span>
              <strong>{item.title}</strong>
              <small>{item.hint}</small>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function ServiceRow({ service }) {
  return (
    <Link to={`/pay/${service.id}`} className={styles.row}>
      <span className={styles.rowIcon}><Icon name={icons[service.category] || "pay"} size={18} /></span>
      <span>
        <strong>{service.name}</strong>
        <small>{categoryById(service.category)?.title}</small>
      </span>
      <Icon name="back" size={16} />
    </Link>
  );
}

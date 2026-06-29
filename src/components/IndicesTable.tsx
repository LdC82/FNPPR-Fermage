import { INDICES_FERMAGE } from "../data/indices";
import { formaterNombre, formaterPourcentage } from "../lib/format";

export function IndicesTable() {
  return (
    <section className="card" aria-labelledby="titre-indices">
      <h2 id="titre-indices">Indice national des fermages</h2>
      <p className="intro">
        Base 100 en 2009. Depuis 2010, l'indice est national et unique :
        composé à 60 % de l'évolution du revenu brut d'entreprise agricole à
        l'hectare (sur les cinq années précédentes) et à 40 % de l'évolution du
        niveau général des prix de l'année précédente. Il est constaté chaque
        année par arrêté ministériel.
      </p>

      <div className="tableau-scroll">
        <table>
          <thead>
            <tr>
              <th>Année</th>
              <th>Indice (base 100 en 2009)</th>
              <th>Variation annuelle</th>
            </tr>
          </thead>
          <tbody>
            {[...INDICES_FERMAGE].reverse().map((i) => (
              <tr key={i.annee}>
                <td>{i.annee}</td>
                <td>{formaterNombre(i.valeur)}</td>
                <td
                  className={
                    i.variation == null
                      ? undefined
                      : i.variation >= 0
                        ? "pos"
                        : "neg"
                  }
                >
                  {i.variation == null ? "—" : formaterPourcentage(i.variation)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

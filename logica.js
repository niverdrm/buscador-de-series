const d = document,
  $shows = d.getElementById("shows"),
  $template = d.getElementById("show-template").content,
  $fragmento = d.createDocumentFragment();

d.addEventListener("keypress", async (e) => {
  if (e.target.matches("#search")) {
    if (e.key === "Enter") {
      try {
        $shows.innerHTML = ` <div class= "loader"> <i class="fas fa-spinner fa-pulse"></i> </div>`;
        let valor = e.target.value.toLowerCase(),
          api = `https://api.tvmaze.com/search/shows?q=${valor}
        `,
          res = await fetch(api),
          json = await res.json();

        if (!res.ok) throw { status: res.status, statusText: res.statusText };

        if (json.length === 0) {
          $shows.innerHTML = `<div class="no_existe"> <p> No existen resultados para esa busqueda <br> <mark> ${valor}</mark> </p> </div>`;
        } else {
          json.forEach((item) => {
            $template.querySelector("h3").textContent = item.show.name;
            $template.querySelector("div").innerHTML = item.show.summary
              ? item.show.summary
              : "Sin descripción";
            $template.querySelector("img").src = item.show.image.medium
              ? item.show.image.medium
              : "http://static.tvmaze.com/images/no-img/no-img-portrait-text.png";

            $template.querySelector("img").alt = item.show.name;
            $template.querySelector("a").href = item.show.url
              ? item.show.url
              : "#";
            $template.querySelector("a").target = item.show.url
              ? "_bank"
              : "_self";
            $template.querySelector("a").textContent = item.show.url
              ? "Ver mas"
              : "";

            let $clone = d.importNode($template, true);
            $fragmento.appendChild($clone);
          });
          $shows.innerHTML = "";
          $shows.appendChild($fragmento);
        }
      } catch (err) {
        let mensaje = err.statusText || "Ocurrio un error";
        $shows.innerHTML = `<p> Error ${err.status}: ${mensaje}</p>`;
      }
    }
  }
});

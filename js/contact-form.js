const d = document;
function contactForm() {
  const $form = d.querySelector(".contact-form"),
    $inputs = d.querySelectorAll(".contact-form [required]");

  $inputs.forEach((input) => {
    const $span = d.createElement("span");
    $span.id = input.name;
    $span.textContent = input.title;
    $span.classList.add("contact-form-error", "none");
    input.insertAdjacentElement("afterend", $span);
  });

  d.addEventListener("keyup", (e) => {
    if (e.target.matches(".contact-form [required]")) {
      let $pattern = e.target.pattern || e.target.dataset.pattern;
      if ($pattern && e.target.value !== "") {
        let regex = new RegExp($pattern);
        return !regex.exec(e.target.value)
          ? d.getElementById(e.target.name).classList.add("is-active")
          : d.getElementById(e.target.name).classList.remove("is-active");
      }

      if (!$pattern) {
        return e.target.value === ""
          ? d.getElementById(e.target.name).classList.add("is-active")
          : d.getElementById(e.target.name).classList.remove("is-active");
      }
    }
  });

  d.addEventListener("submit", (e) => {
    e.preventDefault();
    const $loader = d.querySelector(".contact-form-loader"),
      $response = d.querySelector(".contact-form-response");
    $loader.classList.remove("none");

    fetch("https://formsubmit.co/ajax/cristiantm12@gmail.com", {
      method: "POST",
      body: new FormData(e.target),
    })
      .then((res) => (res.ok ? res.json() : Promise.reject(res)))
      .then((json) => {
        //console.log(json);
        $loader.classList.add("none");
        $response.classList.remove("none");
        $response.innerHTML = `<p>${json.message}</p>`;
        $form.reset();
      })
      .catch((err) => {
        //console.log(err);
        let message =
          err.statusText ||
          "Ocurrió un error al enviar, intenta enviar nuevamente";
        $response.innerHTML = `<p>Error ${err.status}: ${message}</p>`;
      })
      .finally(() => {
        setTimeout(() => {
          $response.classList.add("none");
          $response.innerHTML = "";
        }, 3000);
      });
  });
}

d.addEventListener("DOMContentLoaded", contactForm);

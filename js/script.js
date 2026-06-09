// ===== CARGAR PERFIL DESDE localStorage =====
const usuario = localStorage.getItem("usuario") || "usuario";
const nombre = localStorage.getItem("nombre") || "Usuario";

document.getElementById("profile-username").textContent = usuario;
document.getElementById("profile-name").textContent = nombre;
document.getElementById("profile-bio").textContent = `Desarrollador Web 🌐 | HTML5 · CSS3 · JavaScript`;
document.getElementById("profile-link").textContent = `github.com/${usuario}`;
document.getElementById("profile-link").href = `https://github.com/${usuario}`;
document.getElementById("profile-avatar").src = `https://i.pravatar.cc/150?u=${usuario}`;
document.title = `Perfil Instagram - ${nombre}`;


// ===== TABS =====
const tabs = document.querySelectorAll(".tab");
const grid = document.getElementById("publicaciones");

// Contenido simulado por tab
const contenidoTabs = {
  publicaciones: [
    { seed: "p1", likes: 120, comentarios: 14 },
    { seed: "p2", likes: 98,  comentarios: 7  },
    { seed: "p3", likes: 204, comentarios: 31 },
    { seed: "p4", likes: 57,  comentarios: 5  },
    { seed: "p5", likes: 310, comentarios: 22 },
    { seed: "p6", likes: 88,  comentarios: 9  },
  ],
  guardados: [
    { seed: "g1", likes: 45,  comentarios: 3  },
    { seed: "g2", likes: 190, comentarios: 17 },
    { seed: "g3", likes: 73,  comentarios: 6  },
  ],
  etiquetados: [
    { seed: "e1", likes: 61,  comentarios: 4  },
    { seed: "e2", likes: 133, comentarios: 11 },
    { seed: "e3", likes: 29,  comentarios: 2  },
    { seed: "e4", likes: 88,  comentarios: 8  },
  ],
};

function renderGrid(posts) {
  grid.innerHTML = "";
  posts.forEach(post => {
    const div = document.createElement("div");
    div.classList.add("post");
    div.innerHTML = `
      <img src="https://picsum.photos/seed/${post.seed}/300" alt="Post ${post.seed}" loading="lazy" />
      <div class="post-overlay">
        <span>❤️ ${post.likes}</span>
        <span>💬 ${post.comentarios}</span>
      </div>
    `;
    grid.appendChild(div);
  });
}

tabs.forEach(tab => {
  tab.addEventListener("click", () => {
    tabs.forEach(t => t.classList.remove("activo"));
    tab.classList.add("activo");

    const tabId = tab.dataset.tab;
    renderGrid(contenidoTabs[tabId]);
  });
});


// ===== BOTÓN SEGUIR (toggle) =====
const btnSeguir = document.querySelector(".btn-seguir");

btnSeguir.addEventListener("click", () => {
  const siguiendo = btnSeguir.textContent === "Siguiendo";

  if (siguiendo) {
    btnSeguir.textContent = "Seguir";
    btnSeguir.style.background = "#0095f6";
    btnSeguir.style.borderColor = "#0095f6";
    btnSeguir.style.color = "#fff";
    actualizarSeguidores(-1);
  } else {
    btnSeguir.textContent = "Siguiendo";
    btnSeguir.style.background = "#efefef";
    btnSeguir.style.borderColor = "#dbdbdb";
    btnSeguir.style.color = "#262626";
    actualizarSeguidores(+1);
  }
});

function actualizarSeguidores(cambio) {
  const stats = document.querySelectorAll(".stat");
  stats.forEach(stat => {
    const label = stat.querySelector(".stat-label");
    if (label.textContent === "seguidores") {
      const num = stat.querySelector(".stat-num");
      const valor = parseInt(num.textContent.replace(",", ""));
      const nuevo = valor + cambio;
      num.textContent = nuevo.toLocaleString("es-CL");
    }
  });
}


// ===== BOTÓN MENSAJE (abrir chat) =====
const btnMensaje = document.querySelector(".btn-mensaje");
if (btnMensaje) {
  btnMensaje.addEventListener("click", () => {
    window.location.href = "mensajes.html";
  });
}


// ===== HISTORIAS: resaltar al hacer click =====
const historias = document.querySelectorAll(".historia-item");

historias.forEach(historia => {
  historia.addEventListener("click", () => {
    const circulo = historia.querySelector(".historia-circulo");
    const yaActiva = circulo.style.borderColor === "rgb(193, 53, 132)";

    document.querySelectorAll(".historia-circulo").forEach(c => {
      c.style.borderColor = "";
    });

    if (!yaActiva) {
      circulo.style.borderColor = "#c13584";
    }
  });
});
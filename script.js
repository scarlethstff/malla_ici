// 1. Cargar JSON
async function loadData() {
  const res = await fetch('data.json');
  return res.json();
}

// 2. Obtener semestres desde nombres
function semestreFromSubject(sub) {
  const mapping = {
    "Álgebra 1":1,"Física 1":1,"Cálculo 1":1,"Química General 1":1,"Desarrollo de Habilidades de Gestión":1,
    "Álgebra 2":2,"Física 2":2,"Cálculo 2":2,"Química General 2":2,"Introducción a la Innovación en Ingeniería":2,
    "Cálculo 3":3,"Ecuaciones Diferenciales":3,"Programación":3,"Estadística":3,"Liderazgo y Trabajo en Equipo":3,
    "Inferencia Estadística y Muestreo":4,"Cálculo Numérico":4,"Mecánica":4,"Termodinámica":4,"Modelación de Sistemas":4,
    "Mecánica de Fluidos":5,"Máquinas Eléctricas":5,"Microeconomía":5,"Análisis Estadístico Multivariado":5,"Optimización 1":5,
    "Transferencia de Calor":6,"Administración":6,"Macroeconomía":6,"Simulación":6,"Optimización 2":6,
    "Procesos Industriales":7,"Marketing":7,"Contabilidad General y de Costos":7,"Gestión Estratégica y Control de Gestión":7,
    "Planificación y Control de Producción":8,"Ingeniería Económica":8,"Finanzas":8,"Gestión y Control de la Calidad":8,"Tecnologías de la Información":8,
    "Diseño de Sistemas de Producción":9,"Evaluación de Proyectos":9,"Gestión de Personas y Comportamiento Organizacional":9,
    "Dirección y Control de Proyectos":10,"Taller de Emprendimiento":10,"Logística":10,
    "Memoria de Título / Práctica Profesional":11
  };
  return mapping[sub] || 10;
}

// 3. Render
(async () => {
  const data = await loadData();
  const approved = new Set(JSON.parse(localStorage.getItem('approved') || '[]'));
  const mallaDiv = document.getElementById('malla');
  const semestres = {};

  for (let sub in data) {
    const sem = semestreFromSubject(sub);
    if (!semestres[sem]) semestres[sem] = [];
    semestres[sem].push(sub);
  }

  Object.keys(semestres).sort((a,b)=>a-b).forEach(sem => {
    const divS = document.createElement('div');
    divS.className = 'semestre';
    divS.innerHTML = `<h2>Semestre ${sem}</h2>`;
    semestres[sem].forEach(sub => {
      const subDiv = document.createElement('div');
      subDiv.textContent = sub;
      subDiv.id = 'sub_'+sub;
      const prereqs = data[sub].prereqs;
      const isApproved = approved.has(sub),
            canUnlock = prereqs.every(r=>approved.has(r));

      subDiv.className = isApproved ? 'subject approved'
        : canUnlock ? 'subject unlocked'
        : 'subject locked';

      if (!isApproved && canUnlock) {
        subDiv.addEventListener('click', ()=>toggleApprove(sub));
      }
      divS.appendChild(subDiv);
    });
    mallaDiv.appendChild(divS);
  });

  function toggleApprove(sub) {
    approved.add(sub);
    localStorage.setItem('approved', JSON.stringify([...approved]));
    location.reload();
  }
})();

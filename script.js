// Объект для сохранения данных для каждого упражнения
const savedData = {
  squats: {},
  deadlift: {},
  bench: {}
};

// Данные тренировок: 11 недель, 2 дня в неделю (пример)
const trainingData = [
  { week: 1, days: [{ percent: 60 }, { percent: 50 }] },
  { week: 2, days: [{ percent: 70 }, { percent: 50 }] },
  { week: 3, days: [{ percent: 75 }, { percent: 60 }] },
  { week: 4, days: [{ percent: 80 }, { percent: 60 }] },
  { week: 5, days: [{ percent: 85 }, { percent: 70 }] },
  { week: 6, days: [{ percent: 90 }, { percent: 70 }] },
  { week: 7, days: [{ percent: 95 }, { percent: 70 }] },
  { week: 8, days: [{ percent: 95 }, { percent: 70 }] },
  { week: 9, days: [{ percent: 100 }, { percent: 80 }] },
  { week: 10, days: [{ percent: 90 }, { percent: 70 }] },
  { week: 11, days: [{ percent: 105 }, { percent: 70 }] }
];

document.addEventListener("DOMContentLoaded", () => {
  generateTable();
  document.getElementById("updateBtn").addEventListener("click", updateValues);
  document.getElementById("exercise").addEventListener("change", () => {
    saveCurrentTableData();
    generateTable();
  });
});

function generateTable() {
  const exercise = document.getElementById("exercise").value;
  const tableBody = document.getElementById("trainingTable");
  tableBody.innerHTML = "";

  trainingData.forEach(({ week, days }) => {
    days.forEach((day, index) => {
      const key = `${week}-${index + 1}`;
      const rowData = savedData[exercise][key] || {
        percent: day.percent,
        sets1: 3, reps1: 5,
        sets2: 2, reps2: 6,
        sets3: 1, reps3: 8
      };

      const row = document.createElement("tr");
      row.setAttribute("data-key", key);
      row.innerHTML = `
        <td>${week}</td>
        <td>День ${index + 1}</td>
        <td><input type="number" class="percent small-input" value="${rowData.percent}" min="0" max="200"></td>
        <td>
          <div>
            <input type="number" class="sets1 small-input" value="${rowData.sets1}" min="1" max="99"> x 
            <input type="number" class="reps1 small-input" value="${rowData.reps1}" min="1" max="99">
          </div>
          <div>
            <input type="number" class="sets2 small-input" value="${rowData.sets2}" min="1" max="99"> x 
            <input type="number" class="reps2 small-input" value="${rowData.reps2}" min="1" max="99">
          </div>
          <div>
            <input type="number" class="sets3 small-input" value="${rowData.sets3}" min="1" max="99"> x 
            <input type="number" class="reps3 small-input" value="${rowData.reps3}" min="1" max="99">
          </div>
        </td>
        <td class="weight">0</td>
        <td class="tonnage">0</td>
      `;
      tableBody.appendChild(row);
    });
  });

  document.querySelectorAll("#trainingTable .small-input")
    .forEach(input => input.addEventListener("input", updateValues));
  updateValues();
}

function updateValues() {
  const exercise = document.getElementById("exercise").value;
  const pmSquats = parseFloat(document.getElementById("pm_squats").value);
  const pmDeadlift = parseFloat(document.getElementById("pm_deadlift").value);
  const pmBench = parseFloat(document.getElementById("pm_bench").value);

  document.querySelectorAll("#trainingTable tr").forEach(row => {
    const percent = parseFloat(row.querySelector(".percent").value) || 0;
    const sets1 = parseInt(row.querySelector(".sets1").value) || 0;
    const reps1 = parseInt(row.querySelector(".reps1").value) || 0;
    const sets2 = parseInt(row.querySelector(".sets2").value) || 0;
    const reps2 = parseInt(row.querySelector(".reps2").value) || 0;
    const sets3 = parseInt(row.querySelector(".sets3").value) || 0;
    const reps3 = parseInt(row.querySelector(".reps3").value) || 0;

    let weight = 0;
    if (exercise === "squats") weight = pmSquats * percent / 100;
    else if (exercise === "deadlift") weight = pmDeadlift * percent / 100;
    else if (exercise === "bench") weight = pmBench * percent / 100;

    const totalReps = (sets1 * reps1) + (sets2 * reps2) + (sets3 * reps3);
    const tonnage = weight * totalReps;

    row.querySelector(".weight").textContent = weight.toFixed(1);
    row.querySelector(".tonnage").textContent = tonnage.toFixed(1);

    const key = row.getAttribute("data-key");
    savedData[exercise][key] = {
      percent,
      sets1, reps1,
      sets2, reps2,
      sets3, reps3
    };
  });
}

function saveCurrentTableData() {
  // Данные сохраняются в updateValues()
}

generateTable();
function downloadCSV(csv, filename) {
  const csvFile = new Blob([csv], { type: "text/csv" });
  const downloadLink = document.createElement("a");
  downloadLink.download = filename;
  downloadLink.href = window.URL.createObjectURL(csvFile);
  downloadLink.style.display = "none";
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
}

function exportTableToCSV(filename) {
  let csv = [];
  const rows = document.querySelectorAll("table tr");
  
  rows.forEach(row => {
    const cols = row.querySelectorAll("td, th");
    const rowData = [];
    cols.forEach(col => {
      // Обернем содержимое в кавычки, чтобы избежать проблем с запятыми
      rowData.push('"' + col.innerText + '"');
    });
    csv.push(rowData.join(","));
  });
  
  downloadCSV(csv.join("\n"), filename);
}

document.getElementById("downloadBtn").addEventListener("click", () => {
  exportTableToCSV("training_table.csv");
});
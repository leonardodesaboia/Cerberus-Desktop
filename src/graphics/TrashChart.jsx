// import React from "react";
// import { Doughnut } from "react-chartjs-2";
// import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
// import useLixoData from "../hooks/useTrashData";

// ChartJS.register(ArcElement, Tooltip, Legend);

// const TrashChart = () => {
//   const { dados, loading, error } = useLixoData();

//   // if (loading) return <p>Carregando dados...</p>;
//   // if (error) return <p>Erro: {error}</p>;

//   // if (!dados) return <p>Nenhum dado disponível</p>;

//   // Pegando as chaves (Plástico e Metal) e os valores (quantidade descartada)
//   const labels = Object.keys(dados); 
//   const values = Object.values(dados); 

//   const chartData = {
//     labels,
//     datasets: [
//       {
//         label: "Lixo descartado",
//         data: values,
//         backgroundColor: ["rgba(255, 99, 132, 0.6)", "rgba(54, 162, 235, 0.6)"],
//         borderColor: ["rgba(255, 99, 132, 1)", "rgba(54, 162, 235, 1)"],
//         borderWidth: 2,
//       },
//     ],
//   };

//   const options = {
//     responsive: true,
//     plugins: {
//       legend: {
//         position: "top",
//       },
//       tooltip: {
//         callbacks: {
//           label: (tooltipItem) => `${tooltipItem.raw} kg`,
//         },
//       },
//     },
//   };

//   return (
//     <div style={{ width: "400px", margin: "auto" }}>
//       <h2>Distribuição do Lixo</h2>
//       <Doughnut data={chartData} options={options} />
//     </div>
//   );
// };

// export default TrashChart;

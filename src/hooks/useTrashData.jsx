// import { useEffect, useState } from "react";
// import { getUserData } from "../services/edit";

// const useLixoData = () => {
//   const [dados, setDados] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         // const userData = await getUserData();

//         // if (!userData.paperDiscarted || !userData.metalDiscarted) {
//         //   throw new Error("Dados de lixo não encontrados.");
//         // }

//         // Pegando apenas plástico e metal
//         const { plástico = 0} = userData.paperDiscarted; 
//         const {  metal = 0 } = userData.metalDiscarted;
        

//         setDados({ plástico, metal });
//       } catch (error) {
//         setError(error.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, []);
//   return { dados, loading, error };
// };

// export default useLixoData;

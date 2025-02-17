import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import "./charts.css";
import {getUserData} from '../services/edit'
import { useEffect, useState } from 'react';

const COLORS = { Plástico: "#FFBB28", Metal: "#FF8042" };

const TrashChart = () => {
  const [data, setData] = useState([])
  const [total, setTotal] = useState(0);

  useEffect(()=>{
    const fetchData = async ()=>{
      try{
        const userData = await getUserData() //chaamar a func q busca os dados
        
        //filtrar os dados especificos
        const filterData =[
          {name: "Plástico", amount: userData.plasticDiscarted || 0},
          {name: "Metal", amount: userData.metalDiscarted || 0}

        ]
       
        const totalAmount = userData.plasticDiscarted + userData.metalDiscarted; //calculo do lixo descart
        //const totalAmount = formattedData.reduce((sum, item) => sum + item.value, 0); //calculo do lixo descart
        
        setData(filterData)
        setTotal(totalAmount)
      }catch(error){
        console.error("Erro ao obter dados do usuário", error)
      }
    }
    fetchData()
  },[])


  return (
    <section className="waste-stats-section">
      <h2 className="section-title">Suas estatísticas:</h2>
      <div className="chart-container">
        <ResponsiveContainer width="50%" height={300}>
          <PieChart>
            <Pie
              data={data}
              dataKey="amount"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label
            >
              {data.map((entry) => (
                <Cell key={entry.name} fill={COLORS[entry.name]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>

        {/* Legenda  */}
        
        <div className="legend-container">
          {data.map((entry) => (
            <div key={entry.name} className="legend-item">
              <span
                className="legend-color"
                style={{ backgroundColor: COLORS[entry.name] }}
              ></span>
              {entry.name}: {entry.amount} Descartados
            </div>
          ))}
          <div className="legend-item total">
            <strong>Total:</strong> {total} Descartados
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrashChart;
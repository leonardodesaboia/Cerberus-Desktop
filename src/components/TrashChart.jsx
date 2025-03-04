import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import "../styles/charts.css";
import { getUserData } from '../services/api';
import { useEffect, useState } from 'react';

const COLORS = { 
  Plástico: "#174204", 
  Metal: "#86C26D" 
};

// calculo do lixo
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
      <text 
          x={x} 
          y={y} 
          fill="white" 
          textAnchor="middle" 
          dominantBaseline="central"
          style={{ fontSize: '12px', fontWeight: 'bold' }}
      >
          {`${(percent * 100).toFixed(1)}%`}
      </text>
  );
};

const TrashChart = () => {
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
      const fetchData = async () => {
          try {
              const userData = await getUserData();
              const totalAmount = userData.plasticDiscarded + userData.metalDiscarded;
              
              const filterData = [
                  { 
                      name: "Plástico", 
                      amount: userData.plasticDiscarded || 0,
                      percentage: totalAmount > 0 ? (userData.plasticDiscarded / totalAmount) * 100 : 0
                  },
                  { 
                      name: "Metal", 
                      amount: userData.metalDiscarded || 0,
                      percentage: totalAmount > 0 ? (userData.metalDiscarded / totalAmount) * 100 : 0
                  }
              ];
              
              setData(filterData);
              setTotal(totalAmount);
          } catch (error) {
              console.error("Erro ao obter dados do usuário", error);
          }
      };
      
      fetchData();
  }, []);

  return (
      <section className="waste-stats-section">
          <h2 className="section-title">Suas estatísticas:</h2>
          <div className="chart-container">
              {total > 0 ? (
                  <>
                      <ResponsiveContainer width="50%" height={300}>
                          <PieChart>
                              <Pie 
                                  data={data} 
                                  dataKey="amount" 
                                  nameKey="name" 
                                  cx="50%" 
                                  cy="50%" 
                                  outerRadius={100}
                                  labelLine={false}
                                  label={renderCustomizedLabel}
                              >
                                  {data.map((entry) => (
                                      <Cell 
                                          key={entry.name} 
                                          fill={COLORS[entry.name]} 
                                      />
                                  ))}
                              </Pie>
                              <Tooltip formatter={(value) => [`${value} Descartados`, '']} />
                          </PieChart>
                      </ResponsiveContainer>

                      <div className="legend-container">
                          {data.map((entry) => {
                              const percentage = total > 0 
                                  ? ((entry.amount / total) * 100).toFixed(1) 
                                  : '0';
                              
                              return (
                                  <div key={entry.name} className="legend-item">
                                      <span
                                          className="legend-color"
                                          style={{ backgroundColor: COLORS[entry.name] }}
                                      ></span>
                                      {entry.name}: {entry.amount} Descartados ({percentage}%)
                                  </div>
                              );
                          })}
                          <div className="legend-item total">
                              <strong>Total:</strong> {total} Descartados
                          </div>
                      </div>
                  </>
              ) : (
                  <p className="no-data-message">Nenhum material foi descartado ainda.</p>
              )}
          </div>
      </section>
  );
};

export default TrashChart;

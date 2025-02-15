import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import "./charts.css";

const data = [
  { name: 'Plastic', amount: 45 },
  { name: 'Metal', amount: 30 },
  { name: 'Paper', amount: 25 },
  { name: 'Glass', amount: 15 },
  { name: 'Organic', amount: 35 },
];

const TrashChart = () => {
  return (
    <section className="waste-stats-section">
      <h2 className="section-title">Waste Collection Statistics</h2>
      <div className="chart-container">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="amount" fill="#86C26D" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
};

export default TrashChart;
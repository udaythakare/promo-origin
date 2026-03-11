'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

import { useLanguage } from '@/context/LanguageContext';

const ClaimsChart = ({ data }) => {

  const { t } = useLanguage();

  return (

    <div className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_rgba(0,0,0,1)]">

      <h2 className="text-xl font-black mb-4">
        {t?.analytics?.claimsChart ?? "Claims Over Time"}
      </h2>

      <ResponsiveContainer width="100%" height={300}>

        <LineChart data={data}>

          <XAxis dataKey="date" />

          <YAxis />

          <Tooltip
            contentStyle={{
              border: '3px solid black',
              background: 'white',
              fontWeight: 'bold'
            }}
          />

          <Line
            type="monotone"
            dataKey="claims"
            stroke="#df6824"
            strokeWidth={3}
          />

        </LineChart>

      </ResponsiveContainer>

    </div>

  );
};

export default ClaimsChart;
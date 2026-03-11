'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

import { useLanguage } from '@/context/LanguageContext';

const CouponPerformanceChart = ({ data }) => {

  const { t } = useLanguage();

  return (

    <div className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_rgba(0,0,0,1)]">

      <h2 className="text-xl font-black mb-4">
        {t?.analytics?.performanceChart ?? "Coupon Performance"}
      </h2>

      <ResponsiveContainer width="100%" height={300}>

        <BarChart data={data}>

          <XAxis
            dataKey="name"
            tick={{ fontWeight: "bold" }}
          />

          <YAxis
            tick={{ fontWeight: "bold" }}
          />

          <Tooltip
            contentStyle={{
              border: "3px solid black",
              background: "white",
              fontWeight: "bold"
            }}
          />

          <Bar
            dataKey="claims"
            name={t?.analytics?.claims ?? "Claims"}
            fill="#df6824"
          />

          <Bar
            dataKey="redeemed"
            name={t?.analytics?.redeemed ?? "Redeemed"}
            fill="#000000"
          />

        </BarChart>

      </ResponsiveContainer>

    </div>

  );
};

export default CouponPerformanceChart;
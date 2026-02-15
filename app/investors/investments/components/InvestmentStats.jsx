"use client";

import { Wallet, Layers, Activity } from "lucide-react";

export default function InvestmentStats({ stats }) {
  const totalInvested = Number(stats?.totalInvested ?? 0);
  const totalInvestments = Number(stats?.totalInvestments ?? 0);
  const activeInvestments = Number(stats?.activeInvestments ?? 0);

  const formatCurrency = (value) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value);

  const cards = [
    {
      title: "Total Invested",
      value: formatCurrency(totalInvested),
      icon: Wallet,
      bg: "bg-green-50",
      iconColor: "text-green-600",
    },
    {
      title: "Total Investments",
      value: totalInvestments,
      icon: Layers,
      bg: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      title: "Active Investments",
      value: activeInvestments,
      icon: Activity,
      bg: "bg-emerald-50",
      iconColor: "text-emerald-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {cards.map((card, index) => {
        const Icon = card.icon;

        return (
          <div
            key={index}
            className="bg-white border rounded-2xl shadow-sm p-6 hover:shadow-md transition-all duration-300"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">
                  {card.title}
                </p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {card.value}
                </p>
              </div>

              <div
                className={`p-3 rounded-xl ${card.bg}`}
              >
                <Icon
                  size={22}
                  className={card.iconColor}
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

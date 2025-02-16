import React, { useState, useEffect, useRef } from "react";
import { TbInfoHexagonFilled } from "react-icons/tb";
import { Bar, Pie, Scatter } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";
import data from "../assets/data.json";
import moment from "moment";
import InsightsModal from "./InsightsModal";
import { chartInsights } from "../assets/chartInsights";

const Dashboard = () => {
  const [selectedInsight, setSelectedInsight] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [chartData, setChartData] = useState({
    highestSoldItems: null,
    rateVsQuantity: null,
    ordersPerDeliveryPerson: null,
    orderPreferences: null,
    orderProcessingTime: null,
    orderDistributionByMiles: null,
  });
  const [orderProcessingTimes, setOrderProcessingTimes] = useState([]);
  const [orderDistribution, setOrderDistribution] = useState({});
  const highestSoldItemsRef = useRef(null);
  const orderProcessingTimeRef = useRef(null);
  const ordersPerDeliveryPersonRef = useRef(null);
  const orderPreferencesRef = useRef(null);

  const openModal = (insight) => {
    setSelectedInsight(insight);
    setIsModalOpen(true);
  };

  useEffect(() => {
    const newChartData = { ...chartData };

    // 1. Highest Sold Items
    const itemCounts = {};
    data.forEach((order) => {
      order.Items.forEach((item) => {
        itemCounts[item.Item_Name] =
          (itemCounts[item.Item_Name] || 0) + item.Quantity;
      });
    });
    const sortedItems = Object.entries(itemCounts).sort(
      ([, a], [, b]) => b - a
    );

    newChartData.highestSoldItems = {
      labels: sortedItems.slice(0, 10).map(([item]) => item), // Take only top 10 labels
      datasets: [
        {
          label: "Items Sold",
          data: sortedItems.slice(0, 10).map(([, count]) => count), // Take only top 10 counts
          backgroundColor: "rgba(138, 43, 226, 0.5)", // Purple theme (adjust if needed)
          borderColor: "rgba(138, 43, 226, 1)",
          borderWidth: 1,
        },
      ],
    };

    // 2. Rate vs. Quantity
    const itemSummary = {};

    data.forEach((order) => {
      order.Items.forEach((item) => {
        if (itemSummary[item.Item_Name]) {
          itemSummary[item.Item_Name].quantity += item.Quantity;
        } else {
          itemSummary[item.Item_Name] = {
            name: item.Item_Name,
            price: item.Item_Price,
            quantity: item.Quantity,
          };
        }
      });
    });

    const consolidatedItems = Object.values(itemSummary);

    const sortedItem = consolidatedItems.sort(
      (a, b) => a.quantity - b.quantity
    );

    const top5MostOrdered = sortedItem.slice(-5).reverse();
    const bottom5LeastOrdered = sortedItem.slice(0, 5);

    const selectedItems = [...top5MostOrdered, ...bottom5LeastOrdered];

    for (let i = selectedItems.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [selectedItems[i], selectedItems[j]] = [
        selectedItems[j],
        selectedItems[i],
      ];
    }

    const rateQuantityData = selectedItems.map((item) => ({
      x: item.quantity,
      y: item.price,
      label: item.name,
    }));

    newChartData.rateVsQuantity = {
      datasets: [
        {
          label: "Quantity vs Price",
          data: rateQuantityData,
          backgroundColor: "rgba(255, 99, 132, 0.5)",
          borderColor: "rgba(255, 99, 132, 1)",
          borderWidth: 1,
          pointRadius: 5,
        },
      ],
    };

    // 3. Order Processing Time
    const processingTimes = data.map((order, index) => {
      const orderedTime = moment(order.Ordered_Time);
      const deliveredTime = order.Delivered_Time
        ? moment(order.Delivered_Time)
        : moment();
      const timeDiff = deliveredTime.diff(orderedTime, "minutes");

      return {
        orderId: order.Order_ID,
        orderNumber: index + 1,
        time: timeDiff,
      };
    });

    setOrderProcessingTimes(processingTimes);

    newChartData.orderProcessingTime = {
      datasets: [
        {
          label: "Order Processing Time (Minutes)",
          data: processingTimes.map((order) => ({
            x: order.orderNumber,
            y: order.time,
          })),
          backgroundColor: "rgba(75, 192, 192, 0.5)",
          borderColor: "rgba(75, 192, 192, 1)",
          borderWidth: 1,
          pointRadius: 5,
        },
      ],
    };

    // 4. Orders per Delivery Person
    const deliveryPersonCounts = {};
    data.forEach((order) => {
      const deliveryPerson = order.Delivery_Person;
      const deliveryStatus = order.Delivery_Status;
      if (deliveryPerson && deliveryStatus != "In Transit") {
        deliveryPersonCounts[deliveryPerson] =
          (deliveryPersonCounts[deliveryPerson] || 0) + 1;
      }
    });
    newChartData.ordersPerDeliveryPerson = {
      labels: Object.keys(deliveryPersonCounts),
      datasets: [
        {
          data: Object.values(deliveryPersonCounts),
          backgroundColor: [
            "#FF6384",
            "#36A2EB",
            "#FFCE56",
            "#4BC0C0",
            "#9966CC",
            "#FF9F40",
          ],
        },
      ],
    };

    // 5. Order Preferences
    const preferences = {};
    data.forEach((order) => {
      preferences[order.Order_Type] = (preferences[order.Order_Type] || 0) + 1;
    });
    newChartData.orderPreferences = {
      labels: Object.keys(preferences),
      datasets: [
        {
          data: Object.values(preferences),
          backgroundColor: ["#FF6384", "#36A2EB"],
        },
      ],
    };

    // 6. Order Distribution
    const orderDistributionByMiles = {};

    data.forEach((order) => {
      const miles = order.Miles;
      if (miles !== undefined && miles !== null) {
        orderDistributionByMiles[miles] =
          (orderDistributionByMiles[miles] || 0) + 1;
      } else {
        console.warn(
          `Order ${order.Order_ID} is missing or has invalid 'Miles' data.`
        );
      }
    });

    newChartData.orderDistribution = {
      labels: Object.keys(orderDistributionByMiles),
      datasets: [
        {
          label: "Number of Orders",
          data: Object.values(orderDistributionByMiles),
          backgroundColor: "rgba(54, 162, 235, 0.5)",
          borderColor: "rgba(54, 162, 235, 1)",
          borderWidth: 1,
        },
      ],
    };
    setOrderDistribution(orderDistributionByMiles);
    setChartData(newChartData);

    return () => {
      if (orderProcessingTimeRef.current) {
        orderProcessingTimeRef.current.destroy();
      }
    };
  }, []);

  const highestSoldItemsOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function (value, index, ticks) {
            const desiredValues = [2, 4, 6];

            if (desiredValues.includes(value)) {
              return value;
            }
            return "";
          },
        },
      },
    },
  };

  const rateVsQuantityOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        type: "linear",
        title: {
          display: true,
          text: "Quantity",
          font: { size: 14, weight: "bold" },
        },
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
        grid: {
          display: true,
          color: "rgba(200, 200, 200, 0.3)",
        },
      },
      y: {
        title: {
          display: true,
          text: "Price ($)",
          font: { size: 14, weight: "bold" },
        },
        beginAtZero: true,
        grid: {
          display: true,
          color: "rgba(200, 200, 200, 0.3)",
        },
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: (context) => {
            const dataset = context.chart.data.datasets[0].data;
            const itemData = dataset[context.dataIndex];

            if (!itemData) {
              console.warn(
                "Tooltip Error: Undefined data at index",
                context.dataIndex
              );
              return "Data unavailable";
            }

            return `${itemData.label}: Quantity ${context.raw.x}, Price $${context.raw.y}`;
          },
        },
      },
      legend: {
        display: true,
        position: "top",
        labels: {
          font: { size: 12, weight: "bold" },
          padding: 10,
        },
      },
    },
  };

  const orderDistributionData = {
    labels: Object.keys(orderDistribution),
    datasets: [
      {
        label: "Number of Orders",
        data: Object.values(orderDistribution),
        backgroundColor: "rgba(54, 162, 235, 0.5)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
    ],
  };

  const orderDistributionOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        title: {
          display: true,
          text: "Miles",
        },
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Number of Orders",
        },
      },
    },
  };

  const orderProcessingTimeData = {
    datasets: [
      {
        label: "Order Processing Time (Minutes)",
        data: orderProcessingTimes.map((order) => ({
          x: order.orderNumber,
          y: order.time,
        })),
        backgroundColor: "rgba(75, 192, 192, 0.5)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
        pointRadius: 5,
      },
    ],
  };

  const orderProcessingTimeOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        type: "linear",
        title: {
          display: true,
          text: "Order Number",
        },
        ticks: {
          stepSize: 1,
        },
      },
      y: {
        title: {
          display: true,
          text: "Processing Time (Minutes)",
        },
        beginAtZero: true,
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem) =>
            `Order #${tooltipItem.raw.x}: ${tooltipItem.raw.y} mins`,
        },
      },
    },
  };

  return (
    <div className="container mx-auto p-4 w-full h-screen">
      <h1 className="text-2xl font-bold mb-4">Restaurant Statistics</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {chartInsights.map((item) => (
          <div key={item.key} className="bg-white rounded shadow p-4">
            <div className="flex justify-between">
              <h2 className="text-lg font-semibold">{item.title}</h2>
              <TbInfoHexagonFilled
                className="cursor-pointer text-gray-500"
                onClick={() => openModal(item)}
              />
            </div>
            {chartData[item.key] ? (
              item.key === "orderDistribution" ? (
                Object.keys(orderDistribution).length > 0 ? (
                  <Bar data={chartData[item.key]} height={300} />
                ) : (
                  <p>No order distribution data available.</p>
                )
              ) : item.key === "highestSoldItems" ? (
                <Bar data={chartData[item.key]} height={300} />
              ) : item.key === "rateVsQuantity" ||
                item.key === "orderProcessingTime" ? (
                <div
                  className="bg-white rounded shadow p-4"
                  style={{ width: "100%", height: "400px" }}
                >
                  <Scatter
                    key={
                      item.key === "rateVsQuantity"
                        ? "rateVsQuantityChart"
                        : "orderProcessingTimeChart"
                    }
                    data={
                      item.key === "rateVsQuantity"
                        ? chartData.rateVsQuantity
                        : orderProcessingTimeData
                    }
                    options={
                      item.key === "rateVsQuantity"
                        ? rateVsQuantityOptions
                        : orderProcessingTimeOptions
                    }
                    height={300}
                  />
                </div>
              ) : (
                <Pie data={chartData[item.key]} height={300} />
              )
            ) : (
              <p>No data available.</p>
            )}
          </div>
        ))}
      </div>

      {/* Insights Modal */}
      <InsightsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        insight={selectedInsight}
      />
    </div>
  );
};

export default Dashboard;

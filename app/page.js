"use client";
import { currencyFormatter } from "@/lib/utils";
import { useState } from "react";

import ExpenseCategoryItem from "@/components/ExpenseCategoryItem";
import AddIncomeModal from "@/components/modals/AddIncomeModal";

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

const DUMMY_DATA = [
    {
        id: 1,
        title: "Entertainment",
        color: "#36A2EB",
        total: 500,
    },
    {
        id: 2,
        title: "Food",
        color: "#009",
        total: 200,
    },
    {
        id: 3,
        title: "Fuel",
        color: "#FF6384",
        total: 1200,
    },
    {
        id: 4,
        title: "Movies",
        color: "#FFCE56",
        total: 800,
    },
    {
        id: 5,
        title: "Holiday",
        color: "#150",
        total: 2000,
    },
];

export default function Home() {
    const [showAddIncomeModal, setShowAddIncomeModal] = useState(false);
    return (
        <>
            {/* Add Income Modal */}
            <AddIncomeModal
                show={showAddIncomeModal}
                onClose={setShowAddIncomeModal}
            />

            <main className="container max-w-2xl px-6 mx-auto">
                <section className="py-3">
                    <small className="text-blue-400 text-lg">My Balance</small>
                    <h2 className="text-4xl font-bold">
                        {currencyFormatter(100000)}
                    </h2>
                </section>

                <section className="flex items-center gap-2 py-3">
                    <button className="btn btn-primary" onClick={() => {}}>
                        + Expenses
                    </button>
                    <button
                        className="btn btn-primary-outline"
                        onClick={() => {
                            window.scrollTo({
                                top: 0,
                                behavior: "smooth",
                            });
                            setShowAddIncomeModal(true);
                        }}
                    >
                        + Income
                    </button>
                </section>

                {/* Expenses */}
                <section className="py-6">
                    <h3 className="text-3xl font-semibold">My Expenses</h3>
                    <div className="flex flex-col gap-4 mt-6">
                        {DUMMY_DATA.map((expense) => {
                            return (
                                <ExpenseCategoryItem
                                    key={expense.id}
                                    color={expense.color}
                                    title={expense.title}
                                    total={expense.total}
                                />
                            );
                        })}
                    </div>
                </section>

                {/* Chart Section */}
                <section className="py-6">
                    <h3 className="text-2xl">Stats</h3>
                    <div className="w-1/2 mx-auto">
                        <Doughnut
                            data={{
                                labels: DUMMY_DATA.map(
                                    (expense) => expense.title,
                                ),
                                datasets: [
                                    {
                                        label: "Expenses",
                                        data: DUMMY_DATA.map(
                                            (expense) => expense.total,
                                        ),
                                        backgroundColor: DUMMY_DATA.map(
                                            (expense) => expense.color,
                                        ),
                                        borderColor: ["#dddd"],
                                        borderWidth: 3,
                                    },
                                ],
                            }}
                            options={{
                                plugins: {
                                    datalabels: {
                                        formatter: (value, context) => {
                                            const total =
                                                context.dataset.data.reduce(
                                                    (acc, val) => acc + val,
                                                    0,
                                                );
                                            const percentage = (
                                                (value / total) *
                                                100
                                            ).toFixed(2);
                                            return `${percentage}%`;
                                        },
                                        color: "#fff",
                                        font: {
                                            weight: "bold",
                                        },
                                    },
                                },
                            }}
                        />
                    </div>
                </section>
            </main>
        </>
    );
}

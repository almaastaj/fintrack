"use client";
import { currencyFormatter } from "@/lib/utils";
import { useState, useContext, useEffect } from "react";
import { financeContext } from "@/lib/store/finance-context";
import { authContext } from "@/lib/store/auth-context";

import ExpenseCategoryItem from "@/components/ExpenseCategoryItem";
import AddIncomeModal from "@/components/modals/AddIncomeModal";
import AddExpensesModal from "@/components/modals/AddExpensesModal";
import SignIn from "@/components/SignIn";

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

export default function Home() {
    const [showAddIncomeModal, setShowAddIncomeModal] = useState(false);
    const [showAddExpenseModal, setShowAddExpenseModal] = useState(false);
    const [balance, setBalance] = useState(0);

    const { expenses, income } = useContext(financeContext);
    const { user } = useContext(authContext);

    useEffect(() => {
        const newBalance =
            income.reduce((total, i) => {
                return total + i.amount;
            }, 0) -
            expenses.reduce((total, e) => {
                return total + e.total;
            }, 0);

        setBalance(newBalance);
    }, [expenses, income]);

    if (!user) {
        return <SignIn />;
    }

    return (
        <>
            {/* Add Income Modal */}
            <AddIncomeModal
                show={showAddIncomeModal}
                onClose={setShowAddIncomeModal}
            />

            {/* Add Expenses Modal */}
            <AddExpensesModal
                show={showAddExpenseModal}
                onClose={setShowAddExpenseModal}
            />

            <main className="container max-w-2xl px-6 mx-auto">
                <section className="py-3">
                    <small className="text-blue-400 text-lg">My Balance</small>
                    <h2 className="text-4xl font-bold">
                        {currencyFormatter(balance)}
                    </h2>
                </section>

                <section className="flex items-center gap-2 py-3">
                    <button
                        onClick={() => {
                            window.scrollTo({
                                top: 0,
                                behavior: "smooth",
                            });
                            setShowAddExpenseModal(true);
                        }}
                        className="btn btn-primary"
                    >
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
                        {expenses.map((expense) => {
                            return (
                                <ExpenseCategoryItem
                                    key={expense.id}
                                    expense={expense}
                                />
                            );
                        })}
                    </div>
                </section>

                {/* Chart Section */}
                <section className="py-4">
                    <a id="stats" />
                    <h3 className="text-2xl">Stats: Expense Breakdown</h3>
                    <div className="w-2/3 mx-auto">
                        <Doughnut
                            data={{
                                labels: expenses.map(
                                    (expense) => expense.title,
                                ),
                                datasets: [
                                    {
                                        label: "Expenses",
                                        data: expenses.map(
                                            (expense) => expense.total,
                                        ),
                                        backgroundColor: expenses.map(
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

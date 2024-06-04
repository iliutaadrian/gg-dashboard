"use client";
import { ComboList } from "@/types";
import { Chart } from "chart.js";
import { useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { AreaChart, Book } from "lucide-react";

interface Props {
  builds: { buildsNumber: string[]; buildsFailed: string[] };
}
export const Analytics = ({ builds }: Props) => {
  useEffect(() => {
    var config = {
      type: "line",
      data: {
        labels: builds.buildsNumber,
        datasets: [
          {
            label: "Failed Tests",
            backgroundColor: "#ea580c",
            borderColor: "#ea580c",
            data: builds.buildsFailed,
            fill: false,
          },
        ],
      },
      options: {
        maintainAspectRatio: false,
        responsive: true,
        title: {
          display: false,
          text: "Sales Charts",
          fontColor: "white",
        },
        legend: {
          labels: {
            fontColor: "white",
          },
          align: "end",
          position: "bottom",
        },
        tooltips: {
          mode: "index",
          intersect: false,
        },
        hover: {
          mode: "nearest",
          intersect: true,
        },
        scales: {
          xAxes: [
            {
              ticks: {
                fontColor: "rgba(255,255,255,.7)",
              },
              display: true,
              scaleLabel: {
                display: false,
                labelString: "Month",
                fontColor: "white",
              },
              gridLines: {
                display: false,
                borderDash: [2],
                borderDashOffset: [2],
                color: "rgba(33, 37, 41, 0.3)",
                zeroLineColor: "rgba(0, 0, 0, 0)",
                zeroLineBorderDash: [2],
                zeroLineBorderDashOffset: [2],
              },
            },
          ],
          yAxes: [
            {
              ticks: {
                fontColor: "rgba(255,255,255,.7)",
              },
              display: true,
              scaleLabel: {
                display: false,
                labelString: "Value",
                fontColor: "white",
              },
              gridLines: {
                borderDash: [3],
                borderDashOffset: [3],
                drawBorder: false,
                color: "rgba(255, 255, 255, 0.15)",
                zeroLineColor: "rgba(33, 37, 41, 0)",
                zeroLineBorderDash: [2],
                zeroLineBorderDashOffset: [2],
              },
            },
          ],
        },
      },
    };
    var ctx = document.getElementById("line-chart").getContext("2d");
    window.myLine = new Chart(ctx, config);
  }, []);
  return (
    <Card className="shadow-neon border-muted-foreground bg-primary/5 pb-2">
      <CardHeader>
        <CardTitle>
          <div className="flex items-center gap-5">
            <div className="w-10 h-10 rounded-full border-2 border-primary flex justify-center items-center">
              <p>
                <AreaChart />
              </p>
            </div>
            Analytics
          </div>
        </CardTitle>
        <CardDescription>
          Analytics with builds number and failed tests
        </CardDescription>
      </CardHeader>
      <CardContent>
        <canvas id="line-chart"></canvas>
      </CardContent>
    </Card>
  );
};

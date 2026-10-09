import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { describe, it, expect } from "vitest";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactElement } from "react";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { SeedProvider } from "@/components/shared/SeedSelect";

import { Overview } from "@/pages/Overview";
import { Plant } from "@/pages/Plant";
import { Calibration } from "@/pages/Calibration";
import { Adaptive } from "@/pages/Adaptive";
import { Policies } from "@/pages/Policies";
import { Pareto } from "@/pages/Pareto";
import { Algorithm } from "@/pages/Algorithm";
import { Report } from "@/pages/Report";
import { Methods } from "@/pages/Methods";
import { Demo } from "@/pages/Demo";
import { Settings } from "@/pages/Settings";

const queryClient = new QueryClient();

function renderWithProviders(ui: ReactElement) {
  return render(
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ThemeProvider>
          <SeedProvider>{ui}</SeedProvider>
        </ThemeProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

describe("Smoke tests for all pages", () => {
  it("Overview renders", () => {
    renderWithProviders(<Overview />);
    expect(screen.getByText("Control Room")).toBeInTheDocument();
  });

  it("Plant renders", () => {
    renderWithProviders(<Plant />);
    expect(screen.getByText("Plant & Validation")).toBeInTheDocument();
  });

  it("Calibration renders", () => {
    renderWithProviders(<Calibration />);
    expect(screen.getByText("Calibration Lab")).toBeInTheDocument();
  });

  it("Adaptive renders", () => {
    renderWithProviders(<Adaptive />);
    expect(screen.getByText("Adaptive Design")).toBeInTheDocument();
  });

  it("Policies renders", () => {
    renderWithProviders(<Policies />);
    expect(screen.getByText("Policy Simulator")).toBeInTheDocument();
  });

  it("Pareto renders", () => {
    renderWithProviders(<Pareto />);
    expect(screen.getByText("Pareto Explorer")).toBeInTheDocument();
  });

  it("Algorithm renders", () => {
    renderWithProviders(<Algorithm />);
    expect(screen.getByText("Algorithm Impact")).toBeInTheDocument();
  });

  it("Report renders", () => {
    renderWithProviders(<Report />);
    expect(screen.getByText("Report & Memo Hub")).toBeInTheDocument();
  });

  it("Methods renders", () => {
    renderWithProviders(<Methods />);
    expect(screen.getByText("Methods, Assumptions & Limitations")).toBeInTheDocument();
  });

  it("Demo renders", () => {
    renderWithProviders(<Demo />);
        expect(screen.getByText("1. Hook")).toBeInTheDocument();
  });

  it("Settings renders", () => {
    renderWithProviders(<Settings />);
    expect(screen.getByText("Settings")).toBeInTheDocument();
  });
});
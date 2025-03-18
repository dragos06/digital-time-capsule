import { render, screen, fireEvent } from "@testing-library/react";
import Home from "@/pages";
import "@testing-library/jest-dom";

describe("Filter Functionality", () => {
  it("should filter only locked or unlocked time capsules when filter button is clicked", () => {
    render(<Home />);

    expect(screen.getByText("High School Memories")).toBeInTheDocument();
    expect(screen.getByText("Bucket List Goals")).toBeInTheDocument();
    expect(screen.getByText("Some title")).toBeInTheDocument();
    expect(screen.getByText("College Graduation")).toBeInTheDocument();

    const filterButton = screen.getByRole("button", {name: /filterButton/i});

    fireEvent.click(filterButton);

    expect(screen.queryByText("High School Memories")).toBeInTheDocument();
    expect(screen.queryByText("College Graduation")).toBeInTheDocument();
    expect(screen.queryByText("Bucket List Goals")).not.toBeInTheDocument();
    expect(screen.queryByText("Some title")).not.toBeInTheDocument();

    fireEvent.click(filterButton);

    expect(screen.queryByText("High School Memories")).not.toBeInTheDocument();
    expect(screen.queryByText("College Graduation")).not.toBeInTheDocument();
    expect(screen.queryByText("Bucket List Goals")).toBeInTheDocument();
    expect(screen.queryByText("Some title")).toBeInTheDocument();
  });
});
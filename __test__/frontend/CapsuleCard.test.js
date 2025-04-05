import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import CapsuleCard from "@/components/Capsule/CapsuleCard";

describe("CapsuleCard Component", () => {
  const mockOnDelete = jest.fn();
  const capsule = {
    id: 1,
    title: "My Capsule",
    date: "2024-01-01",
    status: "Unlocked"
  };

  it("should call onDelete when the delete button is clicked", () => {
    render(<CapsuleCard capsule={capsule} onDelete={mockOnDelete} />);

    const deleteButton = screen.getByText("✖");
    fireEvent.click(deleteButton);

    expect(mockOnDelete).toHaveBeenCalledWith(capsule.id);
  });

  it("should open the modal when the view button is clicked", () => {
    render(<CapsuleCard capsule={capsule} onDelete={mockOnDelete} />);

    const viewButton = screen.getByText("View");
    fireEvent.click(viewButton);

    const modal = screen.getByTestId("view-capsule-modal");
    expect(modal).toBeInTheDocument();
  });

  it("should close the modal when close button is clicked", () => {
    render(<CapsuleCard capsule={capsule} onDelete={mockOnDelete} />);

    const viewButton = screen.getByText("View");
    fireEvent.click(viewButton);

    const closeButton = screen.getByText("Close");
    fireEvent.click(closeButton);

    const modal = screen.queryByTestId("view-capsule-modal");
    expect(modal).not.toBeInTheDocument();
  });

  it("should display the correct capsule details", () => {
    render(<CapsuleCard capsule={capsule} onDelete={mockOnDelete} />);

    expect(screen.getByText("My Capsule")).toBeInTheDocument();

    const dateText = screen.getByText(/Open Date:/);
    expect(dateText).toBeInTheDocument();
    expect(screen.getByText("2024-01-01")).toBeInTheDocument();
    
    expect(screen.getByText("Status:")).toBeInTheDocument();
    expect(screen.getByText("Unlocked")).toBeInTheDocument();
  });
});

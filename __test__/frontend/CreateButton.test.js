import { render, screen, fireEvent } from "@testing-library/react";
import CreateButton from "@/components/UI/CreateButton";
import "@testing-library/jest-dom"

jest.mock("@/components/Capsule/CreateCapsuleModal", () => ({ isOpen, onClose, onAdd }) => {
  return isOpen ? (
    <div data-testid="modal">
      <button onClick={onClose} data-testid="close-button">Close</button>
      <button onClick={() => onAdd("Test Capsule", "2025-01-01", "Hello")} data-testid="add-button">Add</button>
    </div>
  ) : null;
});

describe("CreateButton Component", () => {
  it("should show the modal when the button is clicked", () => {
    render(<CreateButton onAdd={jest.fn()} />);
    
    const createButton = screen.getByText("+ Create New Capsule");
    expect(createButton).toBeInTheDocument();

    fireEvent.click(createButton);

    expect(screen.getByTestId("modal")).toBeInTheDocument();
  });

  it("should close the modal when the close button is clicked", () => {
    render(<CreateButton onAdd={jest.fn()} />);

    fireEvent.click(screen.getByText("+ Create New Capsule"));
    fireEvent.click(screen.getByTestId("close-button"));

    expect(screen.queryByTestId("modal")).not.toBeInTheDocument();
  });

  it("should call onAdd and close modal when add button is clicked", () => {
    const mockOnAdd = jest.fn();
    render(<CreateButton onAdd={mockOnAdd} />);

    fireEvent.click(screen.getByText("+ Create New Capsule"));
    fireEvent.click(screen.getByTestId("add-button"));

    expect(mockOnAdd).toHaveBeenCalledWith("Test Capsule", "2025-01-01", "Hello");
    expect(screen.queryByTestId("modal")).not.toBeInTheDocument();
  });
});

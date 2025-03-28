import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import CreateCapsuleModal from "@/components/Capsule/CreateCapsuleModal";
import "@testing-library/jest-dom"

describe("CreateCapsuleModal Component", () => {
  let onAdd, onClose;

  beforeEach(() => {
    onAdd = jest.fn();
    onClose = jest.fn();
  });

  it("should display an error if fields are empty on submit", async () => {
    render(<CreateCapsuleModal isOpen={true} onAdd={onAdd} onClose={onClose} />);

    fireEvent.click(screen.getByText(/Save/));

    await waitFor(() => {
      expect(screen.getByText(/All fields are required!/)).toBeInTheDocument();
    });

    expect(onAdd).not.toHaveBeenCalled();
  });

  it("should call onAdd with correct values when form is valid", async () => {
    render(<CreateCapsuleModal isOpen={true} onAdd={onAdd} onClose={onClose} />);

    fireEvent.change(screen.getByLabelText(/Capsule Title:/), {
      target: { value: "Test Capsule" },
    });
    fireEvent.change(screen.getByLabelText(/Description:/), {
      target: { value: "Test description" },
    });
    fireEvent.change(screen.getByLabelText(/Date:/), {
      target: { value: "2026-12-31" },
    });

    fireEvent.click(screen.getByText(/Save/));

    await waitFor(() => {
      expect(onAdd).toHaveBeenCalledWith(
        "Test Capsule", 
        "2026-12-31", 
        "Test description"
      );
    });

    expect(onClose).toHaveBeenCalled();
  });

  it("should not render when isOpen is false", () => {
    render(<CreateCapsuleModal isOpen={false} onAdd={onAdd} onClose={onClose} />);
    
    expect(screen.queryByText(/Create Capsule/)).toBeNull();
  });
});

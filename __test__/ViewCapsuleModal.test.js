import { render, screen, fireEvent } from "@testing-library/react";
import ViewCapsuleModal from "@/components/Capsule/ViewCapsuleModal";
import "@testing-library/jest-dom";

describe("ViewCapsuleModal Component", () => {
  let onDelete, onClose;
  const capsule = {
    id: 1,
    title: "Test Capsule",
    description: "This is a test description.",
    date: "2024-12-31",
    status: "Unlocked",
  };

  beforeEach(() => {
    onDelete = jest.fn();
    onClose = jest.fn();
    console.log = jest.fn();
  });

  it("should render modal with correct information", () => {
    render(
      <ViewCapsuleModal
        isOpen={true}
        onClose={onClose}
        capsule={capsule}
        onDelete={onDelete}
      />
    );

    expect(screen.getByText(/Test Capsule/)).toBeInTheDocument();
    expect(screen.getByText(/This is a test description/)).toBeInTheDocument();
    expect(screen.getByText(/2024-12-31/)).toBeInTheDocument();
  });

  it("should call onDelete when delete button is clicked", () => {
    render(
      <ViewCapsuleModal
        isOpen={true}
        onClose={onClose}
        capsule={capsule}
        onDelete={onDelete}
      />
    );

    fireEvent.click(screen.getByText(/Delete/));

    expect(onDelete).toHaveBeenCalledWith(capsule.id);
    expect(onClose).toHaveBeenCalled();
  });

  it("should call onClose when close button is clicked", () => {
    render(
      <ViewCapsuleModal
        isOpen={true}
        onClose={onClose}
        capsule={capsule}
        onDelete={onDelete}
      />
    );

    fireEvent.click(screen.getByText(/Close/));

    expect(onClose).toHaveBeenCalled();
  });

  it("should not render when isOpen is false", () => {
    render(
      <ViewCapsuleModal
        isOpen={false}
        onClose={onClose}
        capsule={capsule}
        onDelete={onDelete}
      />
    );

    expect(screen.queryByText(/View Capsule/)).toBeNull();
  });

  it("should not render when capsule status is not 'Unlocked'", () => {
    const lockedCapsule = { ...capsule, status: "Locked" };
    render(
      <ViewCapsuleModal
        isOpen={true}
        onClose={onClose}
        capsule={lockedCapsule}
        onDelete={onDelete}
      />
    );

    expect(screen.queryByText(/View Capsule/)).toBeNull();
  });

  it("should call handleDownload and log the correct message when download button is clicked", () => {
    render(
      <ViewCapsuleModal
        isOpen={true}
        onClose={onClose}
        capsule={capsule}
        onDelete={onDelete}
      />
    );

    fireEvent.click(screen.getByText(/Download Memories/));

    expect(console.log).toHaveBeenCalledWith(
      `Downloading memories for capsule: ${capsule.title}`
    );
  });
});

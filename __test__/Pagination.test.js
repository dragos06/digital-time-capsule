import { render, screen, fireEvent } from "@testing-library/react";
import Pagination from "@/components/UI/Pagination";
import "@testing-library/jest-dom";

describe("Pagination Component", () => {
  let setCurrentPage;

  beforeEach(() => {
    setCurrentPage = jest.fn();
  });

  it("should render the pagination component with buttons", () => {
    render(<Pagination currentPage={1} totalPages={3} setCurrentPage={1} />);

    const prevButton = screen.getByText("<--Previous");
    expect(prevButton).toBeInTheDocument();

    const nextButton = screen.getByText("Next-->");
    expect(nextButton).toBeInTheDocument();

    const pageCounter = screen.getByText("Page 1/3");
    expect(pageCounter).toBeInTheDocument();
  });

  it("should call setCurrentPage with the correct values when buttons are clicked", () => {
    render(<Pagination currentPage={1} totalPages={5} setCurrentPage={setCurrentPage} />);

    const prevButton = screen.getByText("<--Previous");
    const nextButton = screen.getByText("Next-->");

    expect(screen.getByText(/Page 1\/5/)).toBeInTheDocument();
    fireEvent.click(nextButton);
    expect(setCurrentPage).toHaveBeenCalledWith(2);
  });
});

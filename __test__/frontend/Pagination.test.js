import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import Pagination from "@/components/UI/Pagination";

describe("Pagination Component", () => {
  it("should render pagination buttons and page counter", () => {
    render(<Pagination currentPage={1} totalPages={5} setCurrentPage={jest.fn()} />);
    
    const prevButton = screen.getByText("<--Previous");
    expect(prevButton).toBeInTheDocument();
    expect(prevButton).toBeDisabled();

    const pageCounter = screen.getByText("Page 1/5");
    expect(pageCounter).toBeInTheDocument();

    const nextButton = screen.getByText("Next-->");
    expect(nextButton).toBeInTheDocument();
    expect(nextButton).not.toBeDisabled();
  });

  it("should disable the previous button on the first page", () => {
    render(<Pagination currentPage={1} totalPages={5} setCurrentPage={jest.fn()} />);

    const prevButton = screen.getByText("<--Previous");
    expect(prevButton).toBeDisabled();
  });

  it("should disable the next button on the last page", () => {
    render(<Pagination currentPage={5} totalPages={5} setCurrentPage={jest.fn()} />);

    const nextButton = screen.getByText("Next-->");
    expect(nextButton).toBeDisabled();
  });

  it("should call setCurrentPage with the correct page when previous button is clicked", () => {
    const setCurrentPageMock = jest.fn();
    render(<Pagination currentPage={2} totalPages={5} setCurrentPage={setCurrentPageMock} />);

    const prevButton = screen.getByText("<--Previous");
    fireEvent.click(prevButton);

    expect(setCurrentPageMock).toHaveBeenCalledWith(1);
  });

  it("should call setCurrentPage with the correct page when next button is clicked", () => {
    const setCurrentPageMock = jest.fn();
    render(<Pagination currentPage={2} totalPages={5} setCurrentPage={setCurrentPageMock} />);

    const nextButton = screen.getByText("Next-->");
    fireEvent.click(nextButton);

    expect(setCurrentPageMock).toHaveBeenCalledWith(3);
  });

  it("should not call setCurrentPage when previous button is clicked on the first page", () => {
    const setCurrentPageMock = jest.fn();
    render(<Pagination currentPage={1} totalPages={5} setCurrentPage={setCurrentPageMock} />);

    const prevButton = screen.getByText("<--Previous");
    fireEvent.click(prevButton);

    expect(setCurrentPageMock).not.toHaveBeenCalled();
  });

  it("should not call setCurrentPage when next button is clicked on the last page", () => {
    const setCurrentPageMock = jest.fn();
    render(<Pagination currentPage={5} totalPages={5} setCurrentPage={setCurrentPageMock} />);

    const nextButton = screen.getByText("Next-->");
    fireEvent.click(nextButton);

    expect(setCurrentPageMock).not.toHaveBeenCalled();
  });
});

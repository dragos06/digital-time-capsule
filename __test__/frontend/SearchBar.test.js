import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import SearchBar from "@/components/UI/SearchBar";

describe("SearchBar Component", () => {
  it("should call onSearch when typing in the search input", () => {
    const onSearchMock = jest.fn();
    render(<SearchBar onSearch={onSearchMock} onSort={jest.fn()} sortOrder="asc" onFilter={jest.fn()} filterCase="All" onItemsPerPageChange={jest.fn()} />);

    const searchInput = screen.getByPlaceholderText("Search capsules...");
    
    fireEvent.change(searchInput, { target: { value: "New Capsule" } });

    expect(onSearchMock).toHaveBeenCalledWith("New Capsule");
  });

  it("should call onSort when the sort button is clicked", () => {
    const onSortMock = jest.fn();
    render(<SearchBar onSearch={jest.fn()} onSort={onSortMock} sortOrder="asc" onFilter={jest.fn()} filterCase="All" onItemsPerPageChange={jest.fn()} />);

    const sortButton = screen.getByText("Sort ▲");

    fireEvent.click(sortButton);

    expect(onSortMock).toHaveBeenCalled();
  });

  it("should call onFilter when the filter button is clicked", () => {
    const onFilterMock = jest.fn();
    render(<SearchBar onSearch={jest.fn()} onSort={jest.fn()} sortOrder="asc" onFilter={onFilterMock} filterCase="All" onItemsPerPageChange={jest.fn()} />);

    const filterButton = screen.getByLabelText("filterButton");

    fireEvent.click(filterButton);

    expect(onFilterMock).toHaveBeenCalled();
  });

  it("should call onItemsPerPageChange with the correct value when an option is selected", () => {
    const onItemsPerPageChangeMock = jest.fn();
    render(<SearchBar onSearch={jest.fn()} onSort={jest.fn()} sortOrder="asc" onFilter={jest.fn()} filterCase="All" onItemsPerPageChange={onItemsPerPageChangeMock} />);

    const itemsPerPageSelect = screen.getByRole("combobox");

    fireEvent.change(itemsPerPageSelect, { target: { value: "15" } });

    expect(onItemsPerPageChangeMock).toHaveBeenCalledWith(15);
  });

  it("should show the correct sort order button text", () => {
    const { rerender } = render(<SearchBar onSearch={jest.fn()} onSort={jest.fn()} sortOrder="asc" onFilter={jest.fn()} filterCase="All" onItemsPerPageChange={jest.fn()} />);

    const sortButton = screen.getByText("Sort ▲");
    expect(sortButton).toBeInTheDocument();

    rerender(<SearchBar onSearch={jest.fn()} onSort={jest.fn()} sortOrder="desc" onFilter={jest.fn()} filterCase="All" onItemsPerPageChange={jest.fn()} />);
    
    const updatedSortButton = screen.getByText("Sort ▼");
    expect(updatedSortButton).toBeInTheDocument();
  });
});

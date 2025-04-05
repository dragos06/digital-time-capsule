import { handleSort } from "@/utils/handleSort";

describe('handleSort', () => {
  it('should sort the time capsules in ascending order', () => {
    const setTimeCapsules = jest.fn();
    const timeCapsules = [
      { date: '2023-03-01' },
      { date: '2021-05-20' },
      { date: '2022-08-15' }
    ];

    handleSort(timeCapsules, setTimeCapsules, 'asc');
    
    expect(setTimeCapsules).toHaveBeenCalledWith(expect.any(Function));

    const setTimeCapsulesFunction = setTimeCapsules.mock.calls[0][0];
    const sortedArray = setTimeCapsulesFunction(timeCapsules);

    expect(sortedArray).toEqual([
      { date: '2021-05-20' },
      { date: '2022-08-15' },
      { date: '2023-03-01' }
    ]);
  });

  it('should sort the time capsules in descending order', () => {
    const setTimeCapsules = jest.fn();
    const timeCapsules = [
      { date: '2023-03-01' },
      { date: '2021-05-20' },
      { date: '2022-08-15' }
    ];

    handleSort(timeCapsules, setTimeCapsules, 'desc');
    
    expect(setTimeCapsules).toHaveBeenCalledWith(expect.any(Function));

    const setTimeCapsulesFunction = setTimeCapsules.mock.calls[0][0];
    const sortedArray = setTimeCapsulesFunction(timeCapsules);

    expect(sortedArray).toEqual([
      { date: '2023-03-01' },
      { date: '2022-08-15' },
      { date: '2021-05-20' }
    ]);
  });
});

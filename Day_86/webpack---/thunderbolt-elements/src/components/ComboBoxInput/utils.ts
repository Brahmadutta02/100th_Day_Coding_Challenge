import { ComboBoxInputOption } from '@wix/thunderbolt-components';

export const isOptionWithSelectedText = (
  options: Array<ComboBoxInputOption>,
  optionValue: string,
) => {
  const selectedText = options.find(
    option => option.value === optionValue,
  )?.selectedText;

  return selectedText !== null && selectedText !== undefined;
};

export const noop = () => {};

export const calculateElemWidth = (elem: HTMLElement) =>
  elem.getBoundingClientRect().width;

export const filterOptionsByQuery = (
  filterQuery: string,
  options: Array<ComboBoxInputOption>,
) => {
  return options
    .filter(option =>
      option.text.toLowerCase().includes(filterQuery.toLowerCase()),
    )
    .sort((prev, next) => {
      if (prev.text.toLowerCase().startsWith(filterQuery.toLowerCase())) {
        return -1;
      }
      if (next.text.toLowerCase().startsWith(filterQuery.toLowerCase())) {
        return 1;
      }
      return 0;
    });
};

export const optionsMapper = (options: Array<ComboBoxInputOption>) => {
  return options.map((option: ComboBoxInputOption) => ({
    label: option.text,
    value: option.value,
  }));
};

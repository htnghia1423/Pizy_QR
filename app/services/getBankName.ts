import bankOptions from "app/constants/bankOptions";

export const getBankLabel = (value: string) => {
  const bank = bankOptions.find((option) => option.value === value);
  return bank ? bank.label : value;
};

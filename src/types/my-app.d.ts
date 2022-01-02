import { Period } from '@/utils/helpers';

export declare type MyAppState = {
  currentPeriod: Period;
  setCurrentPeriod: React.Dispatch<React.SetStateAction<Period>>;
};

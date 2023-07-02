export type StatesConfig<T extends string | symbol> = {
  initialState: T;
  states: Record<T, { from: T[] }>;
};

export type StateMachineErrorObjectType = {
  message: string;
  value?: string;
  from?: string;
  to?: string;
};

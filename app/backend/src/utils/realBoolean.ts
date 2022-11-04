const realBoolean = (fakeBool: string) => {
  if (fakeBool === 'true' || fakeBool === 'false') return fakeBool === 'true';
  return undefined;
};

export default realBoolean;

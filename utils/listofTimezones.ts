import TimeZones from "../assets/data/timezones.json";

const generateListOfTimezones = () => {
  const listOfTimezones = [];

  for (const item in TimeZones) {
    listOfTimezones.push({
      // @ts-ignore
      label: TimeZones[item],
      value: item,
    });
  }

  return listOfTimezones;
};

export { generateListOfTimezones };

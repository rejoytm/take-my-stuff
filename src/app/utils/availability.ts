import { Availability } from '@interfaces/availability';

export const days = [
  { value: 'sunday', label: 'Sunday' },
  { value: 'monday', label: 'Monday' },
  { value: 'tuesday', label: 'Tuesday' },
  { value: 'wednesday', label: 'Wednesday' },
  { value: 'thursday', label: 'Thursday' },
  { value: 'friday', label: 'Friday' },
  { value: 'saturday', label: 'Saturday' },
];

export const hours = [
  { value: '00:00', label: '12 AM' },
  { value: '01:00', label: '1 AM' },
  { value: '02:00', label: '2 AM' },
  { value: '03:00', label: '3 AM' },
  { value: '04:00', label: '4 AM' },
  { value: '05:00', label: '5 AM' },
  { value: '06:00', label: '6 AM' },
  { value: '07:00', label: '7 AM' },
  { value: '08:00', label: '8 AM' },
  { value: '09:00', label: '9 AM' },
  { value: '10:00', label: '10 AM' },
  { value: '11:00', label: '11 AM' },
  { value: '12:00', label: '12 PM' },
  { value: '13:00', label: '1 PM' },
  { value: '14:00', label: '2 PM' },
  { value: '15:00', label: '3 PM' },
  { value: '16:00', label: '4 PM' },
  { value: '17:00', label: '5 PM' },
  { value: '18:00', label: '6 PM' },
  { value: '19:00', label: '7 PM' },
  { value: '20:00', label: '8 PM' },
  { value: '21:00', label: '9 PM' },
  { value: '22:00', label: '10 PM' },
  { value: '23:00', label: '11 PM' },
];

export function formatAvailabilityForDay(
  availability: Availability,
  day: string,
): string | undefined {
  const selectedValues = availability[day] || [];

  if (!selectedValues.length) return;

  const sortedValues = selectedValues.sort(
    (a, b) =>
      hours.findIndex((hour) => hour.value === a) -
      hours.findIndex((hour) => hour.value === b),
  );

  const selectedLabels = sortedValues.map((value) => {
    const hour = hours.find((hour) => hour.value === value);
    return hour ? hour.label : value;
  });

  // Initialize an array to store the ranges of selected hours
  // and variables to track the start and end of a range
  const selectedRanges: string[] = [];
  let rangeStart = selectedLabels[0];
  let rangeEnd = selectedLabels[0];

  // Iterate through the selected labels to find continuous ranges
  for (let i = 1; i < selectedLabels.length; i++) {
    const currentHour = selectedLabels[i];
    const currentHourIndex = hours.findIndex(
      (hour) => hour.label === currentHour,
    );

    const prevHour = selectedLabels[i - 1];
    const prevHourIndex = hours.findIndex((hour) => hour.label === prevHour);

    // Check if the current hour is adjacent to the previous hour
    if (currentHourIndex - prevHourIndex === 1) {
      // Update the range end
      rangeEnd = currentHour;
    } else {
      // Add the range to the selectedRanges array
      selectedRanges.push(
        rangeStart === prevHour ? rangeStart : `${rangeStart} - ${rangeEnd}`,
      );

      // Start a new range
      rangeStart = currentHour;
      rangeEnd = currentHour;
    }

    // Check if we've reached the last label
    if (i === selectedLabels.length - 1) {
      // Add the range to the selectedRanges array
      selectedRanges.push(
        rangeStart === rangeEnd ? rangeStart : `${rangeStart} - ${rangeEnd}`,
      );
    }
  }

  // Join the selectedRanges array with commas to create the final selected text
  return selectedRanges.join(', ');
}

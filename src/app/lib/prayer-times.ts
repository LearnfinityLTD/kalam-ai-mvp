interface PrayerTimes {
  fajr: string;
  sunrise: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
}

export async function getPrayerTimes(
  city: string = "Dubai"
): Promise<PrayerTimes> {
  try {
    const response = await fetch(
      `http://api.aladhan.com/v1/timingsByCity?city=${city}&country=UAE&method=8`
    );
    const data = await response.json();
    return data.data.timings;
  } catch (error) {
    console.error("Error fetching prayer times:", error);
    // Return default times if API fails
    return {
      fajr: "05:30",
      sunrise: "06:45",
      dhuhr: "12:15",
      asr: "15:45",
      maghrib: "18:30",
      isha: "20:00",
    };
  }
}

export function isWithinPrayerTime(prayerTimes: PrayerTimes): boolean {
  const now = new Date();
  const currentTime = now.getHours() * 60 + now.getMinutes();

  // Check if current time is within 15 minutes of any prayer
  const prayers = Object.values(prayerTimes);
  for (const prayer of prayers) {
    const [hours, minutes] = prayer.split(":").map(Number);
    const prayerTime = hours * 60 + minutes;
    if (Math.abs(currentTime - prayerTime) <= 15) {
      return true;
    }
  }
  return false;
}

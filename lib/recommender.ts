type User = {
  id: number;
  name: string;
  interests: string[];
  preferredTime: string;
};

type Event = {
  id: number;
  title: string;
  category: string;
  time: string;
  location: string;
  attendance: number;
};

type RecommendedEvent = Event & {
  score: number;
};

export function recommendEvents(user: User, events: Event[]): RecommendedEvent[] {
  const scoredEvents = events.map((event) => {
    let score = 0;

    if (user.interests.includes(event.category)) {
      score += 2;
    }

    if (user.preferredTime === event.time) {
      score += 1;
    }

    if (event.attendance >= 40) {
      score += 1;
    }

    return { ...event, score };
  });

  return scoredEvents.sort((a, b) => b.score - a.score).slice(0, 5);
}
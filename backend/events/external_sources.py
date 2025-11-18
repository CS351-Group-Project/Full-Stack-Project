# events/external_sources.py
from datetime import date

def get_external_events(culture=None, location=None, target_date=None):
    """
    Simulated external events from other websites.
    In a real app you would call Eventbrite/Ticketmaster/etc.
    """

    all_external = [
        {
            "title": "Global K-Pop Night",
            "description": "Live K-Pop performances from various groups.",
            "culture": "Korean",
            "location": "Chicago, IL",
            "place": "Riverfront Arena",
            "start_date": date(2025, 11, 21),
            "end_date": date(2025, 11, 21),
            "attendees": 500,
            "external_url": "https://example.com/kpop-night",
        },
        {
            "title": "World Street Food Festival",
            "description": "Food trucks and stalls from many cultures.",
            "culture": "Global",
            "location": "Chicago, IL",
            "place": "Central Park Plaza",
            "start_date": date(2025, 11, 25),
            "end_date": date(2025, 11, 25),
            "attendees": 800,
            "external_url": "https://example.com/street-food-fest",
        },
        {
            "title": "Latin Dance Fiesta",
            "description": "Salsa, Bachata and more.",
            "culture": "Latin American",
            "location": "Chicago, IL",
            "place": "Downtown Dance Hall",
            "start_date": date(2025, 11, 19),
            "end_date": date(2025, 11, 19),
            "attendees": 300,
            "external_url": "https://example.com/latin-dance",
        },
    ]

    events = all_external

    if culture:
        cl = culture.lower()
        events = [
            e for e in events
            if cl in e["culture"].lower()
        ]

    if location:
        loc = location.lower()
        events = [
            e for e in events
            if loc in e["location"].lower()
        ]

    if target_date:
        events = [
            e for e in events
            if e["start_date"] <= target_date <= e["end_date"]
        ]

    return events

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
        {
            "title": "Bollywood Movie Marathon",
            "description": "Back-to-back screenings of classic and new Bollywood hits.",
            "culture": "Indian",
            "location": "New York, NY",
            "place": "Midtown Cinema",
            "start_date": date(2025, 11, 23),
            "end_date": date(2025, 11, 23),
            "attendees": 200,
            "external_url": "https://example.com/bollywood-marathon",
        },
        {
            "title": "Diwali Lights Celebration",
            "description": "Fireworks, sweets, and cultural performances.",
            "culture": "Indian",
            "location": "New York, NY",
            "place": "Hudson Riverside Park",
            "start_date": date(2025, 11, 26),
            "end_date": date(2025, 11, 26),
            "attendees": 600,
            "external_url": "https://example.com/diwali-lights",
        },
        {
            "title": "Afrobeats Block Party",
            "description": "Outdoor DJ and live Afrobeats performances.",
            "culture": "African",
            "location": "Los Angeles, CA",
            "place": "Sunset Boulevard Stage",
            "start_date": date(2025, 12, 2),
            "end_date": date(2025, 12, 2),
            "attendees": 450,
            "external_url": "https://example.com/afrobeats-block-party",
        },
        {
            "title": "Nigerian Food & Fashion Expo",
            "description": "Showcase of Nigerian cuisine and designers.",
            "culture": "African",
            "location": "Los Angeles, CA",
            "place": "Expo Hall LA",
            "start_date": date(2025, 12, 5),
            "end_date": date(2025, 12, 5),
            "attendees": 700,
            "external_url": "https://example.com/nigeria-expo",
        },
        {
            "title": "Japanese Tea Ceremony Workshop",
            "description": "Hands-on session exploring the art of tea.",
            "culture": "Japanese",
            "location": "Seattle, WA",
            "place": "Zen Garden Center",
            "start_date": date(2025, 11, 28),
            "end_date": date(2025, 11, 28),
            "attendees": 80,
            "external_url": "https://example.com/japanese-tea",
        },
        {
            "title": "Anime & Cosplay Convention",
            "description": "Cosplay contests, panels, and artist alley.",
            "culture": "Japanese",
            "location": "Seattle, WA",
            "place": "Harbor Convention Center",
            "start_date": date(2025, 12, 7),
            "end_date": date(2025, 12, 8),
            "attendees": 1200,
            "external_url": "https://example.com/anime-con",
        },
        {
            "title": "Korean Street Food Market",
            "description": "Tteokbokki, hotteok, and more.",
            "culture": "Korean",
            "location": "Chicago, IL",
            "place": "Old Town Square",
            "start_date": date(2025, 12, 3),
            "end_date": date(2025, 12, 3),
            "attendees": 350,
            "external_url": "https://example.com/korean-street-food",
        },
        {
            "title": "Seoul Night: K-Drama OST Concert",
            "description": "Live orchestra playing famous K-drama soundtracks.",
            "culture": "Korean",
            "location": "Toronto, CA",
            "place": "Lakeside Concert Hall",
            "start_date": date(2025, 12, 10),
            "end_date": date(2025, 12, 10),
            "attendees": 900,
            "external_url": "https://example.com/seoul-night",
        },
        {
            "title": "Flamenco & Tapas Evening",
            "description": "Authentic flamenco dancers with Spanish tapas.",
            "culture": "European",
            "location": "London, UK",
            "place": "Camden Arts Theatre",
            "start_date": date(2025, 11, 30),
            "end_date": date(2025, 11, 30),
            "attendees": 250,
            "external_url": "https://example.com/flamenco-evening",
        },
        {
            "title": "Oktoberfest Reloaded",
            "description": "German beers, pretzels, and live band.",
            "culture": "European",
            "location": "Berlin, DE",
            "place": "City Beer Garden",
            "start_date": date(2025, 12, 1),
            "end_date": date(2025, 12, 1),
            "attendees": 1100,
            "external_url": "https://example.com/oktoberfest-reloaded",
        },
        {
            "title": "Chinese New Year Preview Fair",
            "description": "Lion dance, calligraphy, and dumpling stalls.",
            "culture": "Chinese",
            "location": "San Francisco, CA",
            "place": "Chinatown Main Plaza",
            "start_date": date(2025, 12, 15),
            "end_date": date(2025, 12, 15),
            "attendees": 1500,
            "external_url": "https://example.com/cny-preview",
        },
        {
            "title": "Mandarin Language Meetup",
            "description": "Casual conversation practice with native speakers.",
            "culture": "Chinese",
            "location": "San Francisco, CA",
            "place": "Community Learning Center",
            "start_date": date(2025, 11, 22),
            "end_date": date(2025, 11, 22),
            "attendees": 60,
            "external_url": "https://example.com/mandarin-meetup",
        },
        {
            "title": "Middle Eastern Spice & Story Night",
            "description": "Cooking demos with storytelling from the region.",
            "culture": "Middle Eastern",
            "location": "Chicago, IL",
            "place": "Cultural House Chicago",
            "start_date": date(2025, 12, 4),
            "end_date": date(2025, 12, 4),
            "attendees": 220,
            "external_url": "https://example.com/middle-east-night",
        },
        {
            "title": "Arabic Calligraphy Workshop",
            "description": "Learn basics of Arabic calligraphy.",
            "culture": "Middle Eastern",
            "location": "Chicago, IL",
            "place": "Downtown Art Studio",
            "start_date": date(2025, 11, 24),
            "end_date": date(2025, 11, 24),
            "attendees": 40,
            "external_url": "https://example.com/arabic-calligraphy",
        },
        {
            "title": "Brazilian Samba Parade",
            "description": "Costumes, drums, and street dancing.",
            "culture": "Latin American",
            "location": "Miami, FL",
            "place": "Ocean Drive",
            "start_date": date(2025, 12, 6),
            "end_date": date(2025, 12, 6),
            "attendees": 2000,
            "external_url": "https://example.com/samba-parade",
        },
        {
            "title": "Day of the Dead Art Exhibit",
            "description": "Altars and artwork honoring Día de los Muertos.",
            "culture": "Latin American",
            "location": "Mexico City, MX",
            "place": "Historic Art Museum",
            "start_date": date(2025, 11, 18),
            "end_date": date(2025, 11, 30),
            "attendees": 5000,
            "external_url": "https://example.com/day-of-the-dead-art",
        },
        {
            "title": "Caribbean Steel Drum Night",
            "description": "Island music and food under the stars.",
            "culture": "Caribbean",
            "location": "Miami, FL",
            "place": "Bayfront Amphitheater",
            "start_date": date(2025, 11, 27),
            "end_date": date(2025, 11, 27),
            "attendees": 650,
            "external_url": "https://example.com/steel-drum-night",
        },
        {
            "title": "Caribbean Rum & Rhythm Festival",
            "description": "Rum tasting with reggae and soca performances.",
            "culture": "Caribbean",
            "location": "New York, NY",
            "place": "Harborfront Pavilion",
            "start_date": date(2025, 12, 12),
            "end_date": date(2025, 12, 12),
            "attendees": 900,
            "external_url": "https://example.com/rum-rhythm-fest",
        },
        {
            "title": "Global Culture Open Mic",
            "description": "Poetry, music, and storytelling from many backgrounds.",
            "culture": "Global",
            "location": "Toronto, CA",
            "place": "Open Arts Cafe",
            "start_date": date(2025, 11, 29),
            "end_date": date(2025, 11, 29),
            "attendees": 120,
            "external_url": "https://example.com/global-open-mic",
        },
        {
            "title": "International Student Meetup",
            "description": "Networking and cultural exchange for students.",
            "culture": "Global",
            "location": "London, UK",
            "place": "University Community Center",
            "start_date": date(2025, 12, 9),
            "end_date": date(2025, 12, 9),
            "attendees": 300,
            "external_url": "https://example.com/student-meetup",
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

// 100 curated destinations for H.E.R.I explorers.
// Images are fetched live from Unsplash's public source endpoint per query.

export type Destination = {
  id: string;
  name: string;
  country: string;
  region: "Africa" | "Europe" | "Asia" | "Americas" | "Oceania" | "Middle East";
  lat: number;
  lng: number;
  tagline: string;
  blurb: string;
  bestTime: string;
  currency: string;
  language: string;
  vibes: string[];
  imageQuery: string; // used to fetch images
};

const D = (
  id: string,
  name: string,
  country: string,
  region: Destination["region"],
  lat: number,
  lng: number,
  tagline: string,
  blurb: string,
  bestTime: string,
  currency: string,
  language: string,
  vibes: string[],
  imageQuery?: string,
): Destination => ({
  id,
  name,
  country,
  region,
  lat,
  lng,
  tagline,
  blurb,
  bestTime,
  currency,
  language,
  vibes,
  imageQuery: imageQuery ?? `${name} ${country}`,
});

export const destinations: Destination[] = [
  // AFRICA (30)
  D("nairobi", "Nairobi", "Kenya", "Africa", -1.2921, 36.8219, "The green city in the sun.", "A high-altitude capital where safari lodges border a national park inside the city limits. Coffee culture, tech hubs and matatu art make it electric after dark.", "Jun–Oct, Jan–Feb", "KES", "Swahili, English", ["urban", "wildlife", "coffee"]),
  D("zanzibar", "Zanzibar", "Tanzania", "Africa", -6.1659, 39.2026, "Spice-scented island time.", "Stone Town's Omani doors give way to turquoise reefs, dhow boats and endless white sand. Sunset means rooftop mint tea.", "Jun–Oct", "TZS", "Swahili", ["beach", "history", "island"], "Zanzibar Stone Town beach"),
  D("capetown", "Cape Town", "South Africa", "Africa", -33.9249, 18.4241, "Where two oceans meet a mountain.", "Table Mountain looms over vineyards, Cape Malay kitchens and penguin beaches. Take the cableway up at golden hour.", "Nov–Mar", "ZAR", "English, Afrikaans, Xhosa", ["mountain", "wine", "coast"]),
  D("marrakech", "Marrakech", "Morocco", "Africa", 31.6295, -7.9811, "A pink city of riads and souks.", "Djemaa el-Fna hums with snake charmers and orange-juice carts. Escape to a cool tiled riad and mint tea.", "Mar–May, Sep–Nov", "MAD", "Arabic, French", ["culture", "markets", "desert"]),
  D("cairo", "Cairo", "Egypt", "Africa", 30.0444, 31.2357, "Millennia stacked on the Nile.", "Pyramids at dawn, koshari at noon, felucca sails at dusk. The Grand Egyptian Museum finally does the pharaohs justice.", "Oct–Apr", "EGP", "Arabic", ["history", "river", "museums"]),
  D("lagos", "Lagos", "Nigeria", "Africa", 6.5244, 3.3792, "Afrobeats capital, always moving.", "Nollywood, jollof debates and Lekki art walks. Landmark Beach on Sunday is a masterclass in urban energy.", "Nov–Mar", "NGN", "English, Yoruba", ["music", "food", "urban"]),
  D("addis", "Addis Ababa", "Ethiopia", "Africa", 9.0300, 38.7400, "Coffee's true home.", "Buna ceremonies, injera platters, jazz clubs and the highest capital in Africa. Merkato is the largest open-air market on the continent.", "Oct–May", "ETB", "Amharic", ["coffee", "culture", "highland"]),
  D("kigali", "Kigali", "Rwanda", "Africa", -1.9536, 30.0605, "Africa's cleanest capital.", "Hills of moto-taxis and craft coffee. A gateway to gorilla trekking in Volcanoes NP.", "Jun–Sep, Dec–Feb", "RWF", "Kinyarwanda, English", ["clean", "wildlife", "coffee"]),
  D("victoria-falls", "Victoria Falls", "Zambia/Zimbabwe", "Africa", -17.9243, 25.8572, "The smoke that thunders.", "Mosi-oa-Tunya cascades over a 1.7 km cliff. Bungee, raft or just watch the rainbows.", "May–Jul", "USD/ZMW", "English", ["waterfall", "adventure"]),
  D("serengeti", "Serengeti", "Tanzania", "Africa", -2.3333, 34.8333, "The great migration.", "Two million wildebeest thunder across the plains. Hot-air balloon at sunrise is the shot.", "Jun–Oct", "TZS", "Swahili", ["safari", "wildlife"]),
  D("masaimara", "Maasai Mara", "Kenya", "Africa", -1.5000, 35.1500, "Golden savanna, big cats.", "Lions napping in acacia shade and river crossings that make you gasp. Stay in a Maasai-owned camp.", "Jul–Oct", "KES", "Swahili", ["safari", "culture"]),
  D("mombasa", "Mombasa", "Kenya", "Africa", -4.0435, 39.6682, "Swahili coast, coral streets.", "Fort Jesus, biriyani lunches and dhow sunset cruises off Old Town.", "Jul–Sep, Dec–Feb", "KES", "Swahili", ["beach", "history"]),
  D("diani", "Diani Beach", "Kenya", "Africa", -4.2833, 39.5833, "Powder sand, colobus monkeys.", "Kite-surfers, coral reef snorkelling and pole-house beach bars.", "Jul–Sep, Jan–Feb", "KES", "Swahili", ["beach", "reef"]),
  D("kilimanjaro", "Mount Kilimanjaro", "Tanzania", "Africa", -3.0674, 37.3556, "The roof of Africa.", "Seven days from rainforest to glacier. Machame is the classic scenic route.", "Jan–Mar, Jun–Oct", "TZS", "Swahili", ["mountain", "trek"]),
  D("chefchaouen", "Chefchaouen", "Morocco", "Africa", 35.1688, -5.2636, "The blue pearl of the Rif.", "Every wall, alley and stair painted a hundred shades of indigo.", "Apr–Jun, Sep–Nov", "MAD", "Arabic, Berber", ["photo", "village"]),
  D("windhoek", "Windhoek", "Namibia", "Africa", -22.5609, 17.0658, "Gateway to the great dunes.", "German architecture meets desert silence. Fly-in to Sossusvlei from here.", "May–Oct", "NAD", "English, German", ["desert", "quiet"]),
  D("sossusvlei", "Sossusvlei", "Namibia", "Africa", -24.7333, 15.3, "The tallest dunes on Earth.", "Dune 45 at sunrise turns burnt orange. Deadvlei's black skeleton trees are unreal.", "May–Oct", "NAD", "English", ["desert", "photo"]),
  D("okavango", "Okavango Delta", "Botswana", "Africa", -19.2833, 22.7833, "A river that ends in the sand.", "Glide through reed channels in a mokoro. Big five without the crowds.", "May–Oct", "BWP", "English, Setswana", ["safari", "water"]),
  D("aksum", "Aksum", "Ethiopia", "Africa", 14.1211, 38.7194, "Kingdom of the ancient stelae.", "Rumoured resting place of the Ark of the Covenant. Towering obelisks, unchanged for 1700 years.", "Oct–Mar", "ETB", "Tigrinya, Amharic", ["ruins", "history"]),
  D("lalibela", "Lalibela", "Ethiopia", "Africa", 12.0316, 39.0473, "Churches carved from living rock.", "Eleven monolithic churches hewn straight into the earth. Pilgrim white robes at dawn service.", "Oct–Mar", "ETB", "Amharic", ["religion", "unesco"]),
  D("tunis", "Tunis", "Tunisia", "Africa", 36.8065, 10.1815, "Medina of tiled arcades.", "Sidi Bou Said's blue-and-white cliffside just a short train away.", "Mar–May, Sep–Nov", "TND", "Arabic, French", ["mediterranean", "history"]),
  D("dakar", "Dakar", "Senegal", "Africa", 14.7167, -17.4677, "Westernmost point of Africa.", "Mbalax music, Île de Gorée memory, colourful pirogues on the Atlantic.", "Nov–May", "XOF", "French, Wolof", ["music", "coast"]),
  D("accra", "Accra", "Ghana", "Africa", 5.6037, -0.1870, "Warm welcomes on the Gold Coast.", "Jamestown's fishing harbour, Osu's late-night jollof, Labadi Beach drum circles.", "Nov–Mar", "GHS", "English, Twi", ["beach", "music"]),
  D("timbuktu", "Timbuktu", "Mali", "Africa", 16.7735, -3.0074, "Sahara city of manuscripts.", "Djingareyber Mosque of sun-baked mud and centuries-old libraries at the edge of the sand.", "Nov–Feb", "XOF", "Arabic, French", ["desert", "history"]),
  D("madagascar", "Antananarivo", "Madagascar", "Africa", -18.8792, 47.5079, "Island of lemurs.", "Highland capital of pastel houses and zebu-cart traffic. Fly to Andasibe for lemur song.", "Apr–Nov", "MGA", "Malagasy, French", ["wildlife", "island"]),
  D("seychelles", "Mahé", "Seychelles", "Africa", -4.6796, 55.4920, "Granite boulders on turquoise.", "Anse Source d'Argent may be the most photographed beach on the planet.", "Apr–May, Oct–Nov", "SCR", "English, French, Creole", ["beach", "luxury"]),
  D("harare", "Harare", "Zimbabwe", "Africa", -17.8252, 31.0335, "Sunshine city on the highveld.", "Jacaranda-lined avenues, National Gallery sculptures, weekend braai culture.", "Apr–Oct", "USD/ZWG", "English, Shona", ["highland", "art"]),
  D("gaborone", "Gaborone", "Botswana", "Africa", -24.6282, 25.9231, "Diamond city with kalahari edges.", "Chill capital with game reserves inside city limits and craft-beer courtyards.", "May–Oct", "BWP", "English, Setswana", ["quiet", "safari"]),
  D("maputo", "Maputo", "Mozambique", "Africa", -25.9692, 32.5732, "Portuguese colonial, tropical soul.", "Prawn curries on Costa do Sol, Feira de Artesanato on Saturdays.", "May–Nov", "MZN", "Portuguese", ["beach", "food"]),
  D("djerba", "Djerba", "Tunisia", "Africa", 33.8076, 10.8451, "Island of a thousand mosques.", "Sand, ancient synagogues and Berber pottery villages.", "Apr–Jun, Sep–Oct", "TND", "Arabic", ["island", "history"]),

  // EUROPE (25)
  D("paris", "Paris", "France", "Europe", 48.8566, 2.3522, "The eternal romance.", "Baguettes at dawn, Musée d'Orsay after brunch, wine on a Seine bridge at sunset.", "Apr–Jun, Sep–Oct", "EUR", "French", ["romance", "art", "food"]),
  D("london", "London", "UK", "Europe", 51.5074, -0.1278, "Layer upon layer of history.", "Tube everywhere, Borough Market at noon, Tate Modern in the rain, Soho jazz after.", "May–Sep", "GBP", "English", ["culture", "music", "theatre"]),
  D("rome", "Rome", "Italy", "Europe", 41.9028, 12.4964, "The eternal city.", "Colosseum at golden hour, cacio e pepe in Trastevere, gelato as breakfast.", "Apr–Jun, Sep–Oct", "EUR", "Italian", ["history", "food", "art"]),
  D("barcelona", "Barcelona", "Spain", "Europe", 41.3874, 2.1686, "Gaudí's playground on the Med.", "Sagrada Família, Boqueria market pintxos, sunset from Bunkers del Carmel.", "May–Jun, Sep–Oct", "EUR", "Spanish, Catalan", ["beach", "architecture"]),
  D("amsterdam", "Amsterdam", "Netherlands", "Europe", 52.3676, 4.9041, "Canals, bikes, museums.", "Rijksmuseum morning, Jordaan cafe lunch, canal cruise at dusk.", "Apr–May, Sep", "EUR", "Dutch", ["cycling", "art"]),
  D("santorini", "Santorini", "Greece", "Europe", 36.3932, 25.4615, "White cubes on volcanic cliffs.", "Oia at sunset is a cliché that still delivers. Assyrtiko wine at 10am, no judgement.", "May–Jun, Sep–Oct", "EUR", "Greek", ["island", "romance"]),
  D("reykjavik", "Reykjavík", "Iceland", "Europe", 64.1466, -21.9426, "Fire, ice, aurora.", "Blue Lagoon, Golden Circle geysers, aurora hunts in winter.", "Sep–Mar (aurora), Jun–Aug (light)", "ISK", "Icelandic", ["nature", "geothermal"]),
  D("prague", "Prague", "Czechia", "Europe", 50.0755, 14.4378, "Fairytale of a hundred spires.", "Charles Bridge before the crowds, Old Town Square astronomical clock, pilsner everywhere.", "Apr–May, Sep–Oct", "CZK", "Czech", ["architecture", "beer"]),
  D("vienna", "Vienna", "Austria", "Europe", 48.2082, 16.3738, "Imperial waltz still spinning.", "Sachertorte, Klimt, opera house standing tickets. Naschmarkt on Saturday.", "Apr–May, Sep–Oct", "EUR", "German", ["classical", "coffee"]),
  D("lisbon", "Lisbon", "Portugal", "Europe", 38.7223, -9.1393, "Seven hills, one river, tram 28.", "Pastel de nata in Belém, fado in Alfama, sunsets from Miradouro da Senhora do Monte.", "Mar–May, Sep–Oct", "EUR", "Portuguese", ["coast", "music"]),
  D("edinburgh", "Edinburgh", "Scotland", "Europe", 55.9533, -3.1883, "Volcanic castle, cobbled closes.", "Arthur's Seat sunrise, Royal Mile whisky bars, Fringe Festival in August.", "May–Sep", "GBP", "English, Scots", ["history", "festival"]),
  D("stockholm", "Stockholm", "Sweden", "Europe", 59.3293, 18.0686, "City on fourteen islands.", "Gamla Stan lanes, ABBA Museum, midsummer archipelago swims.", "May–Sep", "SEK", "Swedish", ["design", "island"]),
  D("copenhagen", "Copenhagen", "Denmark", "Europe", 55.6761, 12.5683, "Bicycles, hygge, new nordic food.", "Nyhavn colour, Tivoli fairy-tale gardens, Noma if you plan a year ahead.", "May–Aug", "DKK", "Danish", ["design", "food"]),
  D("berlin", "Berlin", "Germany", "Europe", 52.5200, 13.4050, "Grit, art, techno.", "East Side Gallery mural walk, Berghain queues, Turkish breakfast in Kreuzberg.", "May–Sep", "EUR", "German", ["nightlife", "art"]),
  D("dubrovnik", "Dubrovnik", "Croatia", "Europe", 42.6507, 18.0944, "Walls above the Adriatic.", "Walk the city walls at dawn to beat cruise-ship crowds. Kayak to Lokrum island.", "May–Jun, Sep", "EUR", "Croatian", ["coast", "history"]),
  D("hallstatt", "Hallstatt", "Austria", "Europe", 47.5622, 13.6493, "Alpine postcard, real village.", "Salt mine tours, lake reflections, and pastry so good it hurts.", "May–Sep, Dec", "EUR", "German", ["alpine", "village"]),
  D("interlaken", "Interlaken", "Switzerland", "Europe", 46.6863, 7.8632, "Two lakes, three peaks.", "Paraglide over turquoise water. Take the cog train up Jungfraujoch, the top of Europe.", "Jun–Sep", "CHF", "German", ["alpine", "adventure"]),
  D("bruges", "Bruges", "Belgium", "Europe", 51.2093, 3.2247, "Chocolate-box canal city.", "Frites, waffles and 400 kinds of beer. Rent a bike to Damme.", "Apr–Jun, Sep–Oct", "EUR", "Dutch, French", ["romance", "beer"]),
  D("cinqueterre", "Cinque Terre", "Italy", "Europe", 44.1461, 9.6439, "Five pastel villages on cliffs.", "Hike between Monterosso and Vernazza with focaccia stops. Wine terraces above the sea.", "May–Jun, Sep", "EUR", "Italian", ["hike", "coast"]),
  D("porto", "Porto", "Portugal", "Europe", 41.1579, -8.6291, "Port wine at the source.", "Cross the Dom Luís bridge for Gaia's port lodges. Sunset in Ribeira with fado in the background.", "Mar–Oct", "EUR", "Portuguese", ["wine", "river"]),
  D("mykonos", "Mykonos", "Greece", "Europe", 37.4467, 25.3289, "White-and-blue party island.", "Little Venice's cocktail balconies, Paradise Beach parties, quiet chapels at dawn.", "May–Sep", "EUR", "Greek", ["beach", "party"]),
  D("granada", "Granada", "Spain", "Europe", 37.1773, -3.5986, "Moorish spell in Andalusia.", "The Alhambra's Nasrid Palaces at night are transcendent. Free tapas with every drink.", "Mar–May, Sep–Nov", "EUR", "Spanish", ["history", "tapas"]),
  D("budapest", "Budapest", "Hungary", "Europe", 47.4979, 19.0402, "Thermal baths, ruin bars.", "Széchenyi baths in falling snow, Fisherman's Bastion at blue hour, Szimpla for the night.", "Apr–May, Sep–Oct", "HUF", "Hungarian", ["thermal", "nightlife"]),
  D("santiago", "Santiago de Compostela", "Spain", "Europe", 42.8782, -8.5448, "The pilgrim's finish line.", "The Camino ends at the cathedral. Order pulpo and octopus feast at Casa Manolo.", "Apr–Oct", "EUR", "Spanish, Galician", ["pilgrimage", "food"]),
  D("valletta", "Valletta", "Malta", "Europe", 35.8989, 14.5146, "Golden limestone on the Med.", "Baroque cathedral, boat rides through the Blue Grotto, Sunday market at Marsaxlokk.", "Apr–Jun, Sep–Oct", "EUR", "Maltese, English", ["island", "history"]),

  // ASIA (20)
  D("tokyo", "Tokyo", "Japan", "Asia", 35.6762, 139.6503, "Neon, temples, perfection.", "Sushi at Toyosu at 6am, teamLab Planets at noon, Shibuya scramble at night.", "Mar–May (sakura), Oct–Nov", "JPY", "Japanese", ["urban", "food", "tech"]),
  D("kyoto", "Kyoto", "Japan", "Asia", 35.0116, 135.7681, "Old capital of a thousand shrines.", "Fushimi Inari's vermilion gates before sunrise. Machiya guesthouses and kaiseki dinners.", "Mar–May, Oct–Nov", "JPY", "Japanese", ["temples", "tradition"]),
  D("bangkok", "Bangkok", "Thailand", "Asia", 13.7563, 100.5018, "Street food after dark.", "Grand Palace at dawn, Chatuchak market on Saturday, rooftop bars until 2am.", "Nov–Feb", "THB", "Thai", ["food", "temples", "nightlife"]),
  D("bali", "Bali", "Indonesia", "Asia", -8.3405, 115.0920, "Island of the gods.", "Rice terraces of Tegallalang, sunrise on Mount Batur, sunset ceremonies at Tanah Lot.", "Apr–Oct", "IDR", "Indonesian, Balinese", ["beach", "spiritual"]),
  D("singapore", "Singapore", "Singapore", "Asia", 1.3521, 103.8198, "The city that works.", "Gardens by the Bay Supertrees, hawker centre chilli crab, Marina Bay laser show.", "Feb–Apr", "SGD", "English, Mandarin, Malay", ["clean", "food"]),
  D("seoul", "Seoul", "South Korea", "Asia", 37.5665, 126.9780, "Palaces, kimchi, K-pop.", "Gyeongbokgung hanbok photoshoot, Myeongdong shopping, Hongdae busking at midnight.", "Apr–May, Sep–Nov", "KRW", "Korean", ["urban", "food"]),
  D("hongkong", "Hong Kong", "China SAR", "Asia", 22.3193, 114.1694, "Neon jungle on a mountain.", "Star Ferry crossing, Victoria Peak tram, dim sum trolleys at Lin Heung.", "Oct–Dec", "HKD", "Cantonese, English", ["skyline", "food"]),
  D("angkor", "Siem Reap", "Cambodia", "Asia", 13.3671, 103.8448, "Angkor's stone forest.", "Sunrise over Angkor Wat, tuk-tuk to Ta Prohm, fish amok for dinner.", "Nov–Mar", "USD/KHR", "Khmer", ["ruins", "unesco"]),
  D("hanoi", "Hanoi", "Vietnam", "Asia", 21.0285, 105.8542, "Old Quarter, egg coffee.", "Motorbike waltz in the streets. Pho at dawn, bún chả with Obama's chair for lunch.", "Oct–Nov, Mar–Apr", "VND", "Vietnamese", ["food", "history"]),
  D("halongbay", "Ha Long Bay", "Vietnam", "Asia", 20.9101, 107.1839, "Limestone karsts in green water.", "Sleep on a junk boat. Kayak into hidden lagoons at dawn.", "Oct–Apr", "VND", "Vietnamese", ["cruise", "island"]),
  D("varanasi", "Varanasi", "India", "Asia", 25.3176, 82.9739, "Oldest living city, holiest ghats.", "Aarti ceremony at Dashashwamedh, sunrise boat on the Ganges, temple bells everywhere.", "Nov–Feb", "INR", "Hindi", ["spiritual", "river"]),
  D("agra", "Agra (Taj Mahal)", "India", "Asia", 27.1751, 78.0421, "Marble poem to lost love.", "Enter at sunrise, walk the reflecting pools, then Mughal breakfasts in the old city.", "Oct–Mar", "INR", "Hindi, Urdu", ["monument", "history"]),
  D("jaipur", "Jaipur", "India", "Asia", 26.9124, 75.7873, "Pink city of palaces.", "Hawa Mahal, Amber Fort elephant ride, block-printing workshops in Sanganer.", "Oct–Mar", "INR", "Hindi", ["palaces", "markets"]),
  D("kathmandu", "Kathmandu", "Nepal", "Asia", 27.7172, 85.3240, "Prayer flags, prayer wheels.", "Boudhanath stupa at dusk, Thamel gear shopping before the trail up to Everest.", "Sep–Nov, Mar–May", "NPR", "Nepali", ["himalayas", "culture"]),
  D("shanghai", "Shanghai", "China", "Asia", 31.2304, 121.4737, "Future skyline over old lanes.", "Bund promenade at night, Yu Garden tea, Xintiandi cocktails.", "Mar–May, Sep–Nov", "CNY", "Mandarin", ["skyline", "food"]),
  D("beijing", "Beijing", "China", "Asia", 39.9042, 116.4074, "Forbidden City, Great Wall.", "Hike Jinshanling section for wall solitude. Peking duck at Da Dong.", "Sep–Oct", "CNY", "Mandarin", ["history", "food"]),
  D("kuala-lumpur", "Kuala Lumpur", "Malaysia", "Asia", 3.1390, 101.6869, "Petronas Towers, satay smoke.", "Batu Caves rainbow steps, Jalan Alor food street, Petronas skybridge at dusk.", "May–Jul", "MYR", "Malay, English", ["food", "skyline"]),
  D("phuket", "Phuket", "Thailand", "Asia", 7.8804, 98.3923, "Andaman islands and jungle.", "Long-tail to Phi Phi, Big Buddha viewpoint, Old Town Sino-Portuguese lanes.", "Nov–Mar", "THB", "Thai", ["beach", "island"]),
  D("colombo", "Colombo", "Sri Lanka", "Asia", 6.9271, 79.8612, "Kottu roti and colonial breeze.", "Galle Face Green sunset kites, then a train ride to Kandy or the hill country.", "Dec–Mar", "LKR", "Sinhala, Tamil", ["coast", "train"]),
  D("male", "Malé", "Maldives", "Asia", 4.1755, 73.5093, "Gateway to overwater bungalows.", "Fly in for a seaplane transfer to a coral atoll. Whale sharks in Ari Atoll.", "Nov–Apr", "MVR", "Dhivehi, English", ["reef", "luxury"]),

  // MIDDLE EAST (7)
  D("dubai", "Dubai", "UAE", "Middle East", 25.2048, 55.2708, "Sky-high ambition on the desert.", "Burj Khalifa observation deck, dune bashing, Alserkal Avenue for the art scene.", "Nov–Mar", "AED", "Arabic, English", ["luxury", "skyline"]),
  D("petra", "Petra", "Jordan", "Middle East", 30.3285, 35.4444, "Rose city carved in stone.", "Walk the Siq at dawn to see the Treasury reveal itself. Hike to the Monastery.", "Mar–May, Sep–Nov", "JOD", "Arabic", ["ruins", "hike"]),
  D("jerusalem", "Jerusalem", "Israel", "Middle East", 31.7683, 35.2137, "Old city of three faiths.", "Walk the Via Dolorosa, put a note in the Western Wall, drink Arabic coffee in the Muslim Quarter.", "Mar–May, Sep–Nov", "ILS", "Hebrew, Arabic", ["religion", "history"]),
  D("istanbul", "Istanbul", "Türkiye", "Middle East", 41.0082, 28.9784, "Where two continents meet.", "Hagia Sophia at sunset, Grand Bazaar tea, Bosphorus ferry to the Asian side.", "Apr–May, Sep–Nov", "TRY", "Turkish", ["history", "food"]),
  D("cappadocia", "Cappadocia", "Türkiye", "Middle East", 38.6431, 34.8289, "Fairy chimneys, hot air balloons.", "Sunrise balloon flight over Göreme. Sleep in a cave hotel in Ürgüp.", "Apr–Jun, Sep–Nov", "TRY", "Turkish", ["photo", "surreal"]),
  D("muscat", "Muscat", "Oman", "Middle East", 23.5880, 58.3829, "Whitewashed calm on the Gulf.", "Grand Mosque, Mutrah souq, wadis a short drive out.", "Oct–Mar", "OMR", "Arabic", ["quiet", "coast"]),
  D("doha", "Doha", "Qatar", "Middle East", 25.276987, 51.520008, "Peninsula of modern museums.", "Museum of Islamic Art at golden hour, dhow ride, Souq Waqif falconry.", "Nov–Mar", "QAR", "Arabic", ["museums", "luxury"]),

  // AMERICAS (12)
  D("newyork", "New York City", "USA", "Americas", 40.7128, -74.0060, "The city that never sleeps.", "Bagel on the L, MoMA at noon, Broadway at 8, dive bar at 2am.", "Apr–Jun, Sep–Nov", "USD", "English", ["urban", "art", "food"]),
  D("sanfrancisco", "San Francisco", "USA", "Americas", 37.7749, -122.4194, "Golden Gate fog and hills.", "Alcatraz tour, dim sum in Chinatown, sunset at Baker Beach.", "Sep–Nov", "USD", "English", ["coast", "tech"]),
  D("newyork-brooklyn", "Miami", "USA", "Americas", 25.7617, -80.1918, "Art deco, mojitos, ocean drive.", "Wynwood murals, Cuban cafecito, sunset on South Beach.", "Nov–Apr", "USD", "English, Spanish", ["beach", "music"]),
  D("mexico-city", "Mexico City", "Mexico", "Americas", 19.4326, -99.1332, "Aztec heart, muralist soul.", "Frida's Casa Azul, Roma cantinas, tacos al pastor at El Huequito.", "Mar–May", "MXN", "Spanish", ["food", "art"]),
  D("cusco", "Cusco / Machu Picchu", "Peru", "Americas", -13.5319, -71.9675, "Andean crown of the Incas.", "Take the Inca Trail or the train. Machu Picchu at first light is unforgettable.", "May–Sep", "PEN", "Spanish, Quechua", ["ruins", "hike"]),
  D("riodejaneiro", "Rio de Janeiro", "Brazil", "Americas", -22.9068, -43.1729, "Christ, samba, sand.", "Sugarloaf cable car, Ipanema sunsets, Lapa street parties.", "Dec–Mar", "BRL", "Portuguese", ["beach", "music"]),
  D("patagonia", "Torres del Paine", "Chile", "Americas", -50.9423, -73.4068, "End-of-the-world granite spires.", "Hike the W trek. Guanaco herds, blue glaciers, sudden weather.", "Nov–Mar", "CLP", "Spanish", ["mountain", "trek"]),
  D("banff", "Banff", "Canada", "Americas", 51.1784, -115.5708, "Turquoise lakes, Rocky Mountains.", "Moraine Lake canoe, Lake Louise ice-walk in winter, hot springs on cold nights.", "Jun–Sep, Dec–Mar", "CAD", "English, French", ["mountain", "lakes"]),
  D("havana", "Havana", "Cuba", "Americas", 23.1136, -82.3666, "Time capsule of rumba.", "1950s cars along the Malecón, mojitos at La Bodeguita, cigars in Vinales.", "Nov–Apr", "CUP/USD", "Spanish", ["music", "vintage"]),
  D("cartagena", "Cartagena", "Colombia", "Americas", 10.3910, -75.4794, "Walled Caribbean colour.", "Yellow balconies, arepas de huevo, Rosario Islands boat day.", "Dec–Apr", "COP", "Spanish", ["beach", "colonial"]),
  D("galapagos", "Galápagos Islands", "Ecuador", "Americas", -0.9538, -90.9656, "Where Darwin's mind changed.", "Live-aboard cruise or Puerto Ayora base. Blue-footed boobies, marine iguanas, giant tortoises.", "Jun–Aug, Dec–May", "USD", "Spanish", ["wildlife", "island"]),
  D("nashville", "New Orleans", "USA", "Americas", 29.9511, -90.0715, "Jazz, gumbo, brass parades.", "French Quarter beignets, Frenchmen Street live music, swamp tour by day.", "Feb–May", "USD", "English, Creole", ["music", "food"]),

  // OCEANIA (6)
  D("sydney", "Sydney", "Australia", "Oceania", -33.8688, 151.2093, "Opera House on the harbour.", "Bondi to Coogee coastal walk, ferry to Manly, Blue Mountains day trip.", "Sep–Nov, Mar–May", "AUD", "English", ["coast", "urban"]),
  D("melbourne", "Melbourne", "Australia", "Oceania", -37.8136, 144.9631, "Coffee snob capital.", "Laneway street art, footy at the MCG, Great Ocean Road weekend.", "Sep–Nov, Mar–May", "AUD", "English", ["coffee", "art"]),
  D("greatbarrierreef", "Cairns / Great Barrier Reef", "Australia", "Oceania", -16.9186, 145.7781, "The largest living structure on Earth.", "Snorkel over coral gardens, Daintree rainforest just north.", "Jun–Oct", "AUD", "English", ["reef", "island"]),
  D("queenstown", "Queenstown", "New Zealand", "Oceania", -45.0312, 168.6626, "Adventure capital of the South.", "Bungee, jetboat, ski, gondola for the burger. Milford Sound day trip.", "Dec–Feb, Jun–Aug", "NZD", "English, Māori", ["adventure", "alpine"]),
  D("auckland", "Auckland", "New Zealand", "Oceania", -36.8485, 174.7633, "City of sails.", "Waiheke Island wine ferry, Sky Tower, hike Rangitoto volcano.", "Nov–Apr", "NZD", "English, Māori", ["coast", "wine"]),
  D("fiji", "Fiji", "Fiji", "Oceania", -17.7134, 178.0650, "Bula on the blue.", "Yasawa island hop, kava ceremony, coral reef straight off the beach.", "May–Oct", "FJD", "English, Fijian", ["island", "reef"]),
];

export function destinationById(id: string): Destination | undefined {
  return destinations.find((d) => d.id === id);
}

export function destinationImage(d: Destination, w = 1600, h = 900): string {
  const q = encodeURIComponent(d.imageQuery);
  return `https://source.unsplash.com/${w}x${h}/?${q}`;
}

export function destinationThumb(d: Destination): string {
  return destinationImage(d, 800, 600);
}
